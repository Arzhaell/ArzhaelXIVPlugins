# Les plugins FFXIV d'Arzhael

🇬🇧 [English version](README.md)

Une seule adresse pour tous mes plugins [Dalamud](https://github.com/goatcorp/Dalamud) pour Final Fantasy XIV. Ajoute-la une fois : tous les plugins ci-dessous apparaissent dans l'installateur de plugins, et ceux que je publierai plus tard aussi.

## Installation

1. En jeu, tape `/xlsettings` et ouvre l'onglet **Expérimental**.
2. Dans **Custom Plugin Repositories**, ajoute cette adresse, clique sur **+**, coche la case puis enregistre :
   ```
   https://raw.githubusercontent.com/Arzhaell/ArzhaelXIVPlugins/main/repo.json
   ```
3. Tape `/xlplugins` et installe les plugins que tu veux.

Tu as déjà ajouté l'adresse d'un de mes plugins ? Elle marche toujours, rien à changer. Si tu ajoutes aussi celle-ci, ce plugin apparaît deux fois dans `/xlplugins`. Pour passer à cette adresse : retire l'ancienne, ajoute celle-ci, puis désinstalle et réinstalle le plugin (tes réglages sont gardés). Dalamud ne met à jour un plugin que depuis l'adresse d'où il a été installé.

## Plugins

| | Plugin | |
|---|---|---|
| <img src="https://raw.githubusercontent.com/Arzhaell/AutoStanceXIV/main/AutoStanceXIV/images/icon.png" width="32" alt=""> | [AutoStanceXIV](https://github.com/Arzhaell/AutoStanceXIV) | Active ou retire automatiquement ta stance de tank. |
| <img src="https://raw.githubusercontent.com/Arzhaell/FlashColor/main/images/icon.png" width="32" alt=""> | [FlashColor](https://github.com/Arzhaell/FlashColor) | Contraste et balance des couleurs de l'image du jeu, sans écraser les flammes et les effets lumineux. |
| <img src="https://raw.githubusercontent.com/Arzhaell/GposeFilterXIV/main/images/icon.png" width="32" alt=""> | [GposeFilterXIV](https://github.com/Arzhaell/GposeFilterXIV) | Garde un des filtres de couleur de la GPose hors de la GPose. |
| <img src="https://raw.githubusercontent.com/Arzhaell/LootFinderXIV/main/images/icon.png" width="32" alt=""> | [LootFinderXIV](https://github.com/Arzhaell/LootFinderXIV) | La fiche du butin de chaque mission : récompenses rares, mémoquartz et coffres. |
| <img src="https://raw.githubusercontent.com/Arzhaell/OffStreamXIV/main/images/icon.png" width="32" alt=""> | [OffStreamXIV](https://github.com/Arzhaell/OffStreamXIV) | Cache les fenêtres de plugins à ton stream (OBS et autres logiciels de capture) tout en les gardant à ton écran. |
| <img src="https://raw.githubusercontent.com/Arzhaell/OutfitPackerXIV/main/images/icon.png" width="32" alt=""> | [OutfitPackerXIV](https://github.com/Arzhaell/OutfitPackerXIV) | Retrouve les tenues que tu peux ranger dans la coiffeuse mirage et les range pour toi, pour y libérer de la place. |
| <img src="https://raw.githubusercontent.com/Arzhaell/RefBoardXIV/main/images/icon.png" width="32" alt=""> | [RefBoardXIV](https://github.com/Arzhaell/RefBoardXIV) | Un tableau de références dans le jeu : dépose des images, zoome, déplace-les. |
| <img src="https://raw.githubusercontent.com/Arzhaell/SimpleHUD/main/SimpleHUD/images/icon.png" width="32" alt=""> | [Simple HUD](https://github.com/Arzhaell/SimpleHUD) | Des réglages simples et au pixel près de ton ATH et des textes défilants, directement depuis la configuration de l'ATH. |

## Avertissement

Comme tout outil tiers, l'utilisation de Dalamud et de ses plugins est contraire aux conditions d'utilisation de FFXIV. Tu l'utilises à tes risques.

## Fonctionnement

`repo.json` est construit par le workflow **Update repo.json** à partir du `repo.json` (branche `main`) de chaque dépôt listé dans [`plugins.txt`](plugins.txt). Il se lance toutes les heures, à chaque changement de `plugins.txt`, ou à la demande avec **Run workflow** dans l'onglet **Actions**. Un commit n'est fait que si quelque chose a changé.

Si un de ces fichiers est introuvable ou invalide, rien n'est publié et le passage échoue : la liste déjà en ligne reste telle quelle.

Pour ajouter un plugin : ajoute son dépôt dans `plugins.txt` et dans le tableau ci-dessus. Pour construire la liste en local : `node build-repo.mjs`.
