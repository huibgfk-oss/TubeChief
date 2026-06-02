# YouTube-Favorites-Feed
YouTube Favorites Feed is a lightweight Chrome extension that upgrades your YouTube experience without tracking. Create custom playlists, bookmark your favorite channels, and organize your feed completely anonymously.  With all data stored locally, you get full control over your content with zero tracking. The ultimate no-login replacer.
YouTube Favorites Feed
YouTube Favorites Feed is a local browser extension for Brave and Chrome that lets you create your own private list of favorite YouTube channels and videos without subscribing with a YouTube/Google account.
It adds a floating panel directly on YouTube, so you can follow new videos, related videos, saved videos, and search results while staying on the same YouTube page.
---
Main idea
This extension does not perform real YouTube subscriptions.
Instead, it works like a private local favorites system:
you add YouTube channels to your own local list
the extension checks the public YouTube feed of those channels
new videos appear in the What's new tab
you can open videos in the same YouTube tab
the floating panel stays visible on top of YouTube
you can save favorite videos locally
you can save channels from related/search results
All data is stored locally in the browser by using Chrome/Brave extension storage.
---
Features
Floating YouTube panel
When you open YouTube, the extension shows a floating panel on the right side of the page.
The panel can be:
moved by dragging the top bar
closed/hidden
shown again from the extension popup, depending on settings
kept visible while videos are opened in the same browser tab
The last panel position is remembered automatically.
---
What's new
The What's new tab shows recent uploads from your saved favorite channels.
Each video item can show:
video title
channel name
channel avatar/icon, when available
publish date or available date text
local watch status:
`not viewed`
`still viewing`
`viewed`
You can also use Play all to open the current list as a YouTube playlist.
---
Related videos
The Related tab appears when you are watching a YouTube video.
It tries to extract related/recommended videos from the current YouTube page. If the channel name is not directly available in the page, the extension uses YouTube oEmbed data to complete the missing channel name and author URL.
From the Related tab you can:
open related videos in the same tab
use Play all
save a video to your local saved videos list
save the video's channel to your favorite channels list
Note: YouTube loads parts of the page dynamically. Sometimes related videos may need a few seconds to appear.
---
Search videos
The Search tab lets you search YouTube videos from inside the floating panel.
For each result, you can:
open the video in the same tab
save the video locally
save the channel to your favorite channels list
use Play all for the current search results
---
Saved videos
The Saved videos tab stores videos that you manually saved.
This list is local to your browser.
You can:
open saved videos
remove saved videos
use Play all for saved videos
---
Favorite channels
The Channels tab lets you manage your local favorite YouTube channels.
You can add channels using:
```text
@ChannelHandle
```
```text
https://www.youtube.com/@ChannelHandle
```
```text
https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxx
```
```text
UCxxxxxxxxxxxxxxxx
```
The most reliable format is the YouTube Channel ID starting with `UC`.
Example:
```text
https://www.youtube.com/channel/UC2X_S_M0z8NLFIDJYmhYpWg
```
You can also remove channels from the list.
---
Video status
The extension keeps local status information for videos:
not viewed: the video has not been opened/watched yet
still viewing: the video was opened but not completed
viewed: the video reached the end or almost the end
The status is local and does not sync with your YouTube account.
---
Accessibility mode
The extension includes an accessibility mode for people with impaired eyesight.
When enabled, the panel uses:
larger text
larger buttons
bigger video cards
stronger contrast
larger channel avatars
clearer unread/unviewed highlighting
Accessibility mode can be toggled directly from the floating panel by using the eye button.
---
Multi-language support
The extension includes interface text for:
English
Romanian
German
French
Spanish
Italian
The language can be selected in the extension settings.
---
Installation in Brave or Chrome
This extension can be installed locally as an unpacked extension.
Step 1: Extract the ZIP
Download and extract the extension ZIP file.
You should see a folder containing files such as:
```text
manifest.json
background.js
content.js
popup.html
popup.js
```
Do not select the ZIP file directly. You must select the extracted folder.
---
Step 2: Open extensions page
In Brave:
```text
brave://extensions/
```
In Chrome:
```text
chrome://extensions/
```
---
Step 3: Enable Developer Mode
Enable:
```text
Developer mode
```
Usually this is a switch in the top-right corner of the extensions page.
---
Step 4: Load unpacked
Click:
```text
Load unpacked
```
Then select the extracted extension folder.
---
Step 5: Open YouTube
Open:
```text
https://www.youtube.com/
```
Refresh the YouTube page if the panel does not appear immediately.
---
How to add a channel
Open the floating panel or extension popup and go to Channels.
Enter one of the following:
```text
@ChannelHandle
```
or:
```text
https://www.youtube.com/@ChannelHandle
```
or the most reliable version:
```text
https://www.youtube.com/channel/UCxxxxxxxxxxxxxxxx
```
Then click Add.
If the handle method fails, use the `UC...` Channel ID.
---
How to find a YouTube Channel ID
If a handle does not work, use the Channel ID.
One possible method:
Open the YouTube channel page.
Right-click the page.
Choose View page source.
Press `Ctrl + F`.
Search for:
```text
channelId
```
Copy the value that starts with:
```text
UC
```
Add it to the extension.
Example:
```text
UC2X_S_M0z8NLFIDJYmhYpWg
```
---
How Play all works
The Play all button creates a temporary YouTube playlist URL from the videos currently shown in the tab.
It works for:
What's new
Related
Search
Saved videos
The first video is marked as `still viewing`.
---
Local data
The extension stores the following locally:
favorite channels
saved videos
video watch status
selected language
refresh/settings options
floating panel position
accessibility mode
This data remains in your local Brave/Chrome profile.
Removing the extension or clearing extension storage may delete this data.
---
Privacy
This extension is designed to work without a YouTube login and without accessing your Google account.
The extension does not intentionally collect, sell, or transmit personal user data to a private server.
The extension may request public YouTube pages or public YouTube endpoints to load:
channel feeds
video information
related video/channel metadata
oEmbed metadata for missing channel names
All saved channels, saved videos, and watch states are stored locally in the browser.
---
Permissions overview
The extension needs permissions for functionality such as:
local storage of settings and favorites
running the floating panel on YouTube pages
checking public YouTube feed/video data
optional notifications for new videos
periodic refresh checks
Permissions should be kept minimal for Chrome Web Store review.
---
Known limitations
YouTube handle detection
YouTube RSS works most reliably with Channel IDs starting with `UC`.
Handles such as `@ChannelName` may not always resolve correctly because YouTube changes page structure and loading behavior.
Related videos
Related videos are extracted from the current YouTube page and completed with public metadata when possible.
Because YouTube loads recommendations dynamically, related videos may take a few seconds to appear.
Channel avatars
Channel avatars are displayed when available. If no avatar is available, the extension uses a fallback letter icon.
Watch status
Watch status is local and approximate. It is based on interaction with videos opened through the extension panel and the YouTube player state.



