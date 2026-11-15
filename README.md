# Arzhael's FFXIV plugins

🇫🇷 [Version française](README.fr.md)

One address for all my [Dalamud](https://github.com/goatcorp/Dalamud) plugins for Final Fantasy XIV. Add it once: every plugin below shows up in the plugin installer, and so will the ones I release later.

## Installation

1. In game, type `/xlsettings` and open the **Experimental** tab.
2. Under **Custom Plugin Repositories**, paste this URL, click **+**, tick the checkbox and save:
   ```
   https://raw.githubusercontent.com/Arzhaell/ArzhaelXIVPlugins/main/repo.json
   ```
3. Type `/xlplugins` and install the plugins you want.

Already added the address of one of my plugins? It keeps working, nothing to change. If you add this one as well, that plugin is listed twice in `/xlplugins`. To switch to this address: remove the old one, add this one, then uninstall and reinstall the plugin (your settings are kept). Dalamud only updates a plugin from the address it was installed from.

## Plugins

| | Plugin | |
|---|---|---|
| <img src="https://raw.githubusercontent.com/Arzhaell/AutoStanceXIV/main/AutoStanceXIV/images/icon.png" width="32" alt=""> | [AutoStanceXIV](https://github.com/Arzhaell/AutoStanceXIV) | Automatically turns your tank stance on or off. |
| <img src="https://raw.githubusercontent.com/Arzhaell/FlashColor/main/images/icon.png" width="32" alt=""> | [FlashColor](https://github.com/Arzhaell/FlashColor) | Contrast and color balance for the game's image, without clipping flames and bright effects. |
| <img src="https://raw.githubusercontent.com/Arzhaell/GposeFilterXIV/main/images/icon.png" width="32" alt=""> | [GposeFilterXIV](https://github.com/Arzhaell/GposeFilterXIV) | Keeps one of the game's GPose color filters on outside of GPose. |
| <img src="https://raw.githubusercontent.com/Arzhaell/LootFinderXIV/main/images/icon.png" width="32" alt=""> | [LootFinderXIV](https://github.com/Arzhaell/LootFinderXIV) | The loot sheet of every duty: rare rewards, tomestones and coffers. |
| <img src="https://raw.githubusercontent.com/Arzhaell/OffStreamXIV/main/images/icon.png" width="32" alt=""> | [OffStreamXIV](https://github.com/Arzhaell/OffStreamXIV) | Hide plugin windows from your stream (OBS and other capture software) while you keep seeing them. |
| <img src="https://raw.githubusercontent.com/Arzhaell/OutfitPackerXIV/main/images/icon.png" width="32" alt=""> | [OutfitPackerXIV](https://github.com/Arzhaell/OutfitPackerXIV) | Finds the outfits you can store in the Glamour Dresser and packs them for you to free up its slots. |
| <img src="https://raw.githubusercontent.com/Arzhaell/RefBoardXIV/main/images/icon.png" width="32" alt=""> | [RefBoardXIV](https://github.com/Arzhaell/RefBoardXIV) | A reference board inside the game: drop images, zoom, move them around. |
| <img src="https://raw.githubusercontent.com/Arzhaell/SimpleHUD/main/SimpleHUD/images/icon.png" width="32" alt=""> | [Simple HUD](https://github.com/Arzhaell/SimpleHUD) | Simple, pixel-precise tweaks to your HUD and flying text, right from the HUD layout editor. |

## Disclaimer

Like any third-party tool, using Dalamud and its plugins is against the FFXIV Terms of Service. Use it at your own risk.

## How it works

`repo.json` is built by the **Update repo.json** workflow from the `repo.json` (`main` branch) of every repository listed in [`plugins.txt`](plugins.txt). It runs every hour, whenever `plugins.txt` changes, or on demand with **Run workflow** in the **Actions** tab. A commit is made only when something changed.

If one of these files can't be read or is invalid, nothing is published and the run fails: the list already online stays as it is.

To add a plugin: add its repository to `plugins.txt` and to the table above. To build the list locally: `node build-repo.mjs`.
