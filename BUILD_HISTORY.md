# YouTube Favorites Feed — Build History

This file tracks the main functional changes across the extension builds.

## Current baseline

**Latest stable build:** v1.5.1  
**Recommended baseline before new features:** v1.5.1

v1.5.1 adds a settings shortcut in the floating overlay. v1.5.0 added a slightly transparent overlay and fixed right-edge alignment when accessibility mode is toggled.

---

## v1.4.x series

### v1.5.0 — Transparent overlay + accessibility right alignment
- Made the floating panel slightly transparent while keeping text readable.
- Added a subtle background blur to keep the panel usable over YouTube content.
- Fixed accessibility mode alignment: when the 👁 button enlarges the panel, it now snaps cleanly to the right edge instead of keeping an old left coordinate.
- Bumped manifest version to `1.5.0`.

### v1.4.9 — Build history
- Added `BUILD_HISTORY.md`.
- Bumped manifest version to `1.4.9`.
- No intended behavior change versus v1.4.8.

### v1.4.8 — Persistent history and backup
- Fixed Save video / Save channel state so saved items remain saved after list refresh.
- Added persistent viewing history.
- Added new **History** tab in the overlay.
- Preserved `viewing` / `viewed` states across refreshes.
- Added backup export/import in popup.
- Goal: user should not lose channels, saved videos, settings or viewing status after updates when data is preserved/imported.

### v1.4.7 — Smooth save and scroll
- Save buttons update inline to **Saved**.
- Reduced aggressive re-rendering after Save video / Save channel.
- Preserved panel scroll position after local storage updates.
- Kept fullscreen overlay runtime fix.

### v1.4.6 — Runtime error fix
- Fixed missing `syncOverlayHostParent()` runtime error.
- Improved overlay relocation during YouTube fullscreen.
- Preserved previous save-scroll behavior.

### v1.4.5 — Preserve scroll on save
- Preserved panel scroll after Save video.
- Preserved panel scroll after Save channel.
- Preserved panel scroll after removing saved video.
- Added protection against storage refresh resetting list scroll to top.

### v1.4.4 — Visible player, online users, fullscreen overlay
- Improved navigation when starting from a page without an active visible YouTube player.
- Added **online users** counter support via configurable endpoint.
- Added example PHP endpoint: `server/online-users-example.php`.
- Added fullscreen overlay handling so the Favorites icon/panel can appear over YouTube fullscreen when technically possible.

### v1.4.3 — Fallback navigation and GitHub update check
- Added fallback navigation when no player is available.
- Added Settings fields for GitHub update checking.
- Added manual update check against GitHub releases.
- Important limitation: unpacked extensions cannot self-update their local files automatically; the extension can only notify and provide the release link.

### v1.4.2 — Page bridge navigation
- Added `page-bridge.js`.
- Moved YouTube player API calls into the real page context.
- Used bridge messaging from `content.js` to `page-bridge.js`.
- Avoided `location.href`, `popstate`, and synthetic YouTube `yt-navigate-start/finish` events.

### v1.4.1 — Silent player navigation
- Removed `location.href` navigation.
- Removed `popstate` dispatch.
- Removed manual YouTube navigation events.
- Used silent URL update and player loading attempt.

### v1.4.0 — Player API navigation
- Tried navigation via existing YouTube player API.
- Goal: switch video without full page reload and keep extension alive.

---

## v1.3.x series

### v1.3.9 — YouTube finish event fix
- Added `response.url` to synthetic `yt-navigate-finish` detail.
- Fixed earlier YouTube crash: `Cannot read properties of undefined (reading 'url')`.

### v1.3.8 — Strict no-reload navigation
- Tried stricter YouTube SPA navigation without hard reload.
- Avoided ordinary link click fallback.

### v1.3.7 — Native SPA navigation
- Attempted YouTube native SPA event navigation.
- Goal: keep overlay and related list alive during video switches.

### v1.3.6 — No page refresh related cache
- Improved cache behavior for Related videos.
- Tried to reduce full reload side effects.

### v1.3.5 — Theater mode
- Replaced fullscreen attempt with **Theater mode**.
- Added setting/button for opening videos in theater mode.

### v1.3.4 — Fullscreen related stability
- Improved stability around fullscreen and related videos.

### v1.3.3 — Fullscreen state fix
- Improved fullscreen state handling.

### v1.3.2 — Fullscreen cleanup
- Removed older/incorrect fullscreen behavior.
- Cleaned naming and implementation details.

### v1.3.1 — Overlay top layer fix
- Improved overlay z-index/top-layer behavior on YouTube channel pages.
- Goal: keep Favorites panel above sticky YouTube headers.

### v1.3.0 — Related oEmbed channel fix
- Added oEmbed fallback to improve missing channel names in Related videos.

---

## v1.2.x series

### v1.2.9 — Related channel merge fix
- Improved merge of related video channel data.

### v1.2.8 — Syntax fix
- Fixed JavaScript syntax regression from previous build.

### v1.2.7 — Related channel name fix
- Improved related video channel name extraction.

### v1.2.6 — Related pagination and status
- Added pagination for Related lists.
- Improved view status handling.
- Corrected logic so videos are not marked viewed simply because another video is clicked.

### v1.2.5 — Anti-flicker
- Added anti-flicker CSS/behavior for panel re-rendering.
- Improved perceived stability of overlay.

### v1.2.4 — Related/accessibility fix
- Improved Related loading behavior.
- Fixed accessibility button/display behavior.

### v1.2.3 — Play all, Related, Search
- Added **Play all**.
- Added **Related** tab.
- Added **Search** tab.
- Added **Saved videos** and richer overlay interactions.

### v1.2.2 — Accessibility
- Added accessibility / impaired eyesight mode.
- Increased contrast, font size and button/card sizes.

### v1.2.1 — Avatars and view status
- Added channel avatars/icons.
- Added local video status: not viewed / still viewing / viewed.

### v1.2.0 — Multilanguage
- Added multilingual UI support.
- Added language setting.

---

## Earlier builds

### v1.1.0 — Always-on-top overlay
- Added floating overlay panel on YouTube.
- Added same-tab behavior and overlay positioning.

### v1.0.1 — Channel resolution improvements
- Improved handling of `@handle`, YouTube channel URLs and channel IDs.

### v1.0.0 — Initial local favorites prototype
- Local favorite channels.
- Basic feed from YouTube RSS.
- Local-only storage using browser extension storage.

---

## Notes and known limitations

- YouTube changes its internal SPA/player behavior frequently. Navigation and Related extraction may need maintenance.
- Browser extensions loaded with **Load unpacked** cannot replace/update their own local files automatically.
- If the user removes the extension completely from `brave://extensions`, the browser may delete local storage. Use Export backup before replacing/removing the extension.
- Users online requires a server endpoint; the extension cannot know global online usage without a remote heartbeat endpoint.
- Overlay over real browser fullscreen can be restricted by the browser. The extension tries to move the overlay into the fullscreen element, but the browser has final control.
