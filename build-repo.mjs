// Réunit les repo.json de tous les dépôts listés dans plugins.txt en un seul repo.json :
// celui que Dalamud lit à l'adresse unique de ce dépôt.
//
//   node build-repo.mjs
//
// Variables facultatives :
//   GITHUB_TOKEN         jeton GitHub (plus de requêtes permises ; le workflow le fournit)
//   COMMIT_MESSAGE_FILE  fichier où écrire le message de commit quand repo.json change
//   GITHUB_STEP_SUMMARY  fourni par GitHub Actions : le résumé y est ajouté sous forme de tableau
//
// Au moindre problème (repo.json introuvable ou invalide, plugin en double, champ manquant),
// le script s'arrête sans toucher à repo.json : on ne publie jamais une liste à laquelle
// il manquerait un plugin.

import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';

const ici = new URL('.', import.meta.url);
const fichierListe = new URL('plugins.txt', ici);
const fichierRepo = new URL('repo.json', ici);

// Champs sans lesquels Dalamud ne peut pas proposer ou installer le plugin.
const CHAMPS_REQUIS = ['InternalName', 'Name', 'Author', 'AssemblyVersion', 'DalamudApiLevel', 'DownloadLinkInstall'];

const depots = readFileSync(fichierListe, 'utf8')
  .split(/\r?\n/)
  .map((ligne) => ligne.replace(/#.*/, '').trim())
  .filter(Boolean);

const erreurs = [];
const plugins = []; // { depot, manifeste }, dans l'ordre de plugins.txt
const origine = new Map(); // InternalName → dépôt qui le fournit

if (depots.length === 0) erreurs.push('plugins.txt ne contient aucun dépôt.');

for (const [i, depot] of depots.entries()) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(depot)) {
    erreurs.push(`${depot} : nom invalide (attendu : propriétaire/nom).`);
    continue;
  }
  if (depots.findIndex((d) => d.toLowerCase() === depot.toLowerCase()) < i) {
    erreurs.push(`${depot} : écrit deux fois dans plugins.txt.`);
    continue;
  }

  const texte = await telecharger(depot);
  if (texte === null) continue;

  let liste;
  try {
    liste = JSON.parse(texte.replace(/^﻿/, ''));
  } catch (e) {
    erreurs.push(`${depot} : repo.json n'est pas du JSON valide (${e.message}).`);
    continue;
  }
  if (!Array.isArray(liste) || liste.length === 0) {
    erreurs.push(`${depot} : repo.json doit être une liste d'au moins un plugin.`);
    continue;
  }

  for (const [i, manifeste] of liste.entries()) {
    if (typeof manifeste !== 'object' || manifeste === null || Array.isArray(manifeste)) {
      erreurs.push(`${depot} : l'élément n°${i + 1} de repo.json n'est pas un plugin.`);
      continue;
    }
    const nom = manifeste.InternalName || `plugin n°${i + 1}`;
    const manquants = CHAMPS_REQUIS.filter((champ) => manifeste[champ] === undefined || manifeste[champ] === null || manifeste[champ] === '');
    if (manquants.length > 0) {
      erreurs.push(`${depot} : ${nom} n'a pas de ${manquants.join(', ')}.`);
      continue;
    }
    const champ = nombreAbime(manifeste, '');
    if (champ) {
      erreurs.push(`${depot} : ${nom}, champ ${champ} : nombre trop grand pour être recopié sans le modifier.`);
      continue;
    }
    if (origine.has(manifeste.InternalName)) {
      erreurs.push(`${depot} : ${manifeste.InternalName} est déjà fourni par ${origine.get(manifeste.InternalName)}.`);
      continue;
    }
    origine.set(manifeste.InternalName, depot);
    plugins.push({ depot, manifeste });
  }
}

if (erreurs.length > 0) {
  console.error(`repo.json n'a pas été modifié : ${erreurs.length} problème(s).`);
  for (const erreur of erreurs) console.error(`  - ${erreur}`);
  resume(`### repo.json n'a pas été modifié\n\n${erreurs.map((e) => `- ${e}`).join('\n')}\n`);
  process.exit(1);
}

const nouveau = JSON.stringify(plugins.map((p) => p.manifeste), null, 2) + '\n';
const ancien = existsSync(fichierRepo) ? readFileSync(fichierRepo, 'utf8') : null;

console.log(`${plugins.length} plugins venant de ${depots.length} dépôts :`);
for (const { depot, manifeste } of plugins) {
  console.log(`  ${manifeste.InternalName.padEnd(18)} ${version(manifeste.AssemblyVersion).padEnd(8)} ${depot}`);
}

let tableau = `### ${plugins.length} plugins dans repo.json\n\n| Plugin | Version | Dépôt | Dernière mise à jour |\n|---|---|---|---|\n`;
for (const { depot, manifeste } of plugins) {
  tableau += `| ${manifeste.Name} | ${version(manifeste.AssemblyVersion)} | ${depot} | ${date(manifeste.LastUpdate)} |\n`;
}

if (nouveau === ancien) {
  console.log('repo.json est déjà à jour.');
  resume(`${tableau}\nAucun changement.\n`);
  process.exit(0);
}

const changements = comparer(ancien, plugins);
writeFileSync(fichierRepo, nouveau);
console.log('repo.json mis à jour :');
for (const ligne of changements.details) console.log(`  ${ligne}`);
resume(`${tableau}\nChangements :\n\n${changements.details.map((l) => `- ${l}`).join('\n')}\n`);

if (process.env.COMMIT_MESSAGE_FILE) {
  writeFileSync(process.env.COMMIT_MESSAGE_FILE, `${changements.titre}\n\n${changements.details.join('\n')}\n`);
}

// Lit repo.json sur la branche main du dépôt. Rend null (et note l'erreur) en cas d'échec.
// Les coupures réseau et les erreurs passagères de GitHub sont retentées deux fois.
async function telecharger(depot) {
  const entetes = {
    Accept: 'application/vnd.github.raw+json',
    'User-Agent': 'ArzhaelXIVPlugins',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) entetes.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const url = `https://api.github.com/repos/${depot}/contents/repo.json?ref=main`;

  let derniere = '';
  for (let essai = 1; essai <= 3; essai++) {
    try {
      const reponse = await fetch(url, { headers: entetes });
      if (reponse.ok) return await reponse.text();
      derniere = `HTTP ${reponse.status}`;
      if (reponse.status < 500 && reponse.status !== 429) break;
    } catch (e) {
      derniere = e.message;
    }
    if (essai < 3) await new Promise((fin) => setTimeout(fin, 5000 * essai));
  }
  erreurs.push(`${depot} : impossible de lire repo.json sur main (${derniere}).`);
  return null;
}

// Un entier au-delà de 2^53 n'est pas gardé exactement par JSON.parse : on refuse de le recopier.
function nombreAbime(valeur, chemin) {
  if (typeof valeur === 'number') {
    return !Number.isFinite(valeur) || (Number.isInteger(valeur) && !Number.isSafeInteger(valeur)) ? chemin || '(racine)' : null;
  }
  if (typeof valeur === 'object' && valeur !== null) {
    for (const [cle, sous] of Object.entries(valeur)) {
      const trouve = nombreAbime(sous, chemin ? `${chemin}.${cle}` : cle);
      if (trouve) return trouve;
    }
  }
  return null;
}

// Liste ce qui change par rapport à l'ancien repo.json, pour le message de commit et le résumé.
function comparer(texteAncien, plugins) {
  const avant = new Map();
  try {
    for (const m of JSON.parse(texteAncien ?? '[]')) avant.set(m.InternalName, m);
  } catch {
    // Ancien repo.json illisible : tout est considéré comme nouveau.
  }

  const courts = [];
  const details = [];
  for (const { manifeste: m } of plugins) {
    const precedent = avant.get(m.InternalName);
    if (!precedent) {
      courts.push(`${m.InternalName} ${version(m.AssemblyVersion)}`);
      details.push(`ajouté : ${m.InternalName} ${version(m.AssemblyVersion)}`);
    } else if (JSON.stringify(precedent) !== JSON.stringify(m)) {
      courts.push(`${m.InternalName} ${version(m.AssemblyVersion)}`);
      details.push(precedent.AssemblyVersion === m.AssemblyVersion
        ? `modifié : ${m.InternalName} ${version(m.AssemblyVersion)} (même version)`
        : `mis à jour : ${m.InternalName} ${version(precedent.AssemblyVersion)} → ${version(m.AssemblyVersion)}`);
    }
    avant.delete(m.InternalName);
  }
  for (const nom of avant.keys()) {
    courts.push(`${nom} retiré`);
    details.push(`retiré : ${nom}`);
  }

  if (details.length === 0) {
    return { titre: 'repo.json : ordre ou mise en forme', details: ['même contenu, ordre ou mise en forme différents'] };
  }
  const titre = courts.length <= 3 ? `repo.json : ${courts.join(', ')}` : `repo.json : ${courts.length} plugins`;
  return { titre, details };
}

// 1.3.0.0 → 1.3.0 : le numéro tel qu'il apparaît dans les tags et les releases.
function version(v) {
  return String(v).replace(/^(\d+\.\d+\.\d+)\.0$/, '$1');
}

function date(lastUpdate) {
  const secondes = Number(lastUpdate);
  return Number.isFinite(secondes) && secondes > 0 ? new Date(secondes * 1000).toISOString().slice(0, 10) : '?';
}

function resume(markdown) {
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
}
