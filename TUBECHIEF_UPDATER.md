# TubeChief updater

- The extension checks the latest **published stable GitHub Release** every six hours and on browser startup.
- A new version triggers one notification per release (subject to browser/OS notification permission).
- Settings > TubeChief updates displays installed/latest versions and a manual Check now action.
- When Edge/Chromium calls `chrome.runtime.onUpdateAvailable` after downloading a **trusted extension update**, the UI shows **Apply now**. This calls `chrome.runtime.reload()`; the browser performs the installation.
- When GitHub has a newer release, but Edge has NOT downloaded a trusted extension update, only **View release** is offered. Remote source files are never executed or silently installed.
- Existing local favorites, subscriptions, preferences, and video history remain in `chrome.storage.local`.
- `Load unpacked` installations do not self-update via native CRX. Reload the unpacked extension manually.
- For automatic installation use an approved browser extension distribution (Edge Add-ons/enterprise policy), or a supported **signed CRX with a working HTTPS update manifest**. That requires a constant private signing key, a stable extension ID, and a published `update.xml`. No private key is stored in GitHub.
- Windows and Android Canary may differ in CRX/update support; Android installation and updates remain experimental.
- Every new release is built automatically as an unpacked ZIP when a tag `v<manifest version>` is pushed. A ZIP is NOT a signed CRX.
