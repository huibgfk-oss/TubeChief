# YouTube Favorites Feed - Build 1.2.3

New in 1.2.3:
- Floating panel remembers last dragged position.
- What's new tab has Play all.
- Related tab appears while watching a YouTube video and can Play all related items.
- Saved videos tab stores local favorite videos.
- Search videos tab searches YouTube and offers Save video / Save channel.
- Favorite channels tab supports add/remove.
- Channel save works from related/search cards when YouTube exposes a channel ID or channel URL.

No real YouTube subscription is created. All favorites are local browser storage.
# YouTube Favorites Feed - Store preparation notes

## Current status
- Manifest V3 extension
- Local channel favorites list
- Always-on-top overlay on youtube.com
- Popup UI
- Manual and automatic feed refresh
- Notifications for new videos
- Languages: English and Romanian
- No login, no Google/YouTube account access, no real YouTube subscription action

## Suggested Chrome Web Store listing
Name: YouTube Favorites Feed
Short description: Keep a local list of favorite YouTube channels and see their latest videos in an always-on-top sidebar.
Category: Productivity or Accessibility
Language: English, Romanian

## Privacy summary
The extension stores the user's favorite channel list, videos fetched from public YouTube RSS feeds, seen video IDs, and settings locally in the browser using chrome.storage.local. It does not collect, sell, transmit, or share personal data. It does not access the user's YouTube account.

## Permissions explanation
- storage: saves channels, videos, seen status and settings locally
- alarms: checks public YouTube feeds periodically
- notifications: optional notification for new videos
- host permissions for youtube.com: resolves channel pages and reads public YouTube RSS feeds

## Important naming note
For Chrome Web Store, avoid names like "Favorites Feed" because Google review may interpret it as deceptive. Use "YouTube Favorites Feed" or "Local YouTube Subscriptions" instead.

## Build 1.2.1 changes
- Adds channel/user avatar beside each video in What's new.
- Adds local viewing status per video: viewed, still viewing, not viewed.
- Adds real popup setting for showing/hiding the floating YouTube panel.


## Build 1.2.2 notes
- Removed the redundant minimize button from the floating YouTube panel.
- Added Accessibility mode / impaired eyesight setting.
- Accessibility mode increases panel width, font sizes, contrast, button size, video card readability and avatar size.


## v1.2.5
- Fixed floating-panel flicker by embedding overlay CSS inline in the shadow DOM instead of reloading content.css on every render.
- Added stronger opaque background/compositing rules for tab switches on YouTube.
