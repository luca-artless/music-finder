# 🎧 Music Finder

One input, searches across Bandcamp, Discogs, SoundCloud, Spotify and YouTube —
results open together in a single named Chrome tab group.

**Live:** luca-artless.github.io/music-finder/

## Layout

| Path | What |
| --- | --- |
| `index.html` | The whole app. No build step, no dependencies. |
| `extension/` | Companion Chrome extension that groups the tabs. |

## Setup

The app works on its own — tabs just open separately. For tab grouping,
install the companion extension:

1. Clone this repo: `git clone https://github.com/luca-artless/music-finder.git`
2. Go to `chrome://extensions` and turn on **Developer mode**
3. Click **Load unpacked** and select the `extension/` folder
4. Copy the extension **ID** from the card
5. Paste it into `EXT_IDS` at the top of the script in `index.html`, then commit

Repeat steps 2–4 for each Chrome profile. Same folder path gives the same ID,
so `index.html` only needs the ID once.

The header of the app tells you the current state: *tab grouping active*,
*paused*, or *grouper not installed*.

## Deploy

Edit `index.html` here on GitHub, commit to `main`, wait ~45s for Pages,
then **hard-refresh** with `Cmd+Shift+R`.

## Notes

- Don't move or rename the local clone — the extension ID is derived from
  the folder path.
- The extension ID in `EXT_IDS` must match exactly. It's the only thing
  that can cause "grouper not installed".
- Chrome extension IDs are 32 characters, letters `a`–`p` only.
- URL params: `?q=` prefills the query, `?s=` picks a preset
  (`digging`/`streaming`/`all`), `?g=0|1` forces grouping off/on.

## Config

Platforms live in the `PLATFORMS` array, defaults in `PRESETS`.
Adding a platform means adding one object with a `url()` function.

Personal project. Full notes kept privately in Notion.
