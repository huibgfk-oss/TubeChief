const STORAGE_DEFAULTS = {
  channels: [],
  videos: [],
  seenVideoIds: [],
  videoStatuses: {},
  favoriteVideos: [],
  overlayPosition: null,
  instanceId: null,
  onlineStats: null,
  settings: {
    checkMinutes: 30,
    notify: true,
    maxVideosPerChannel: 8,
    language: 'auto',
    showOverlayOnYouTube: true,
    accessibilityMode: false,
    theaterMode: false,
    githubRepo: '',
    githubUpdateCheck: false,
    lastGithubUpdateCheck: null,
    lastGithubUpdate: null,
    onlineUsersEnabled: false,
    onlineUsersEndpoint: '',
    onlineUsersLastCheck: null
  }
};

chrome.runtime.onInstalled.addListener(async () => {
  const current = await chrome.storage.local.get(Object.keys(STORAGE_DEFAULTS));
  const update = {};
  for (const [k, v] of Object.entries(STORAGE_DEFAULTS)) {
    if (typeof current[k] === 'undefined') update[k] = v;
  }
  if (Object.keys(update).length) await chrome.storage.local.set(update);
  await setupAlarm();
});

chrome.runtime.onStartup.addListener(setupAlarm);
chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === 'checkYouTubeFavorites') await refreshAllFeeds(true);
  if (alarm.name === 'checkYouTubeFavoritesGitHubUpdate') await checkGitHubUpdate(true);
  if (alarm.name === 'checkYouTubeFavoritesOnlineUsers') await onlineHeartbeat(true);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg?.type === 'addChannel') sendResponse(await addChannel(msg.input));
      else if (msg?.type === 'removeChannel') sendResponse(await removeChannel(msg.channelId));
      else if (msg?.type === 'refresh') sendResponse(await refreshAllFeeds(false));
      else if (msg?.type === 'getState') sendResponse(await getState());
      else if (msg?.type === 'markAllSeen') sendResponse(await markAllSeen());
      else if (msg?.type === 'saveSettings') sendResponse(await saveSettings(msg.settings));
      else if (msg?.type === 'markVideoViewing') sendResponse(await markVideoViewing(msg.videoId));
      else if (msg?.type === 'markVideoViewed') sendResponse(await markVideoViewed(msg.videoId));
      else if (msg?.type === 'updateViewingFromUrl') sendResponse(await updateViewingFromUrl(msg.videoId || ''));
      else if (msg?.type === 'addFavoriteVideo') sendResponse(await addFavoriteVideo(msg.video));
      else if (msg?.type === 'removeFavoriteVideo') sendResponse(await removeFavoriteVideo(msg.videoId));
      else if (msg?.type === 'searchVideos') sendResponse(await searchVideos(msg.query));
      else if (msg?.type === 'enrichVideos') sendResponse(await enrichVideos(msg.videos));
      else if (msg?.type === 'saveOverlayPosition') sendResponse(await saveOverlayPosition(msg.position));
      else if (msg?.type === 'checkGitHubUpdate') sendResponse(await checkGitHubUpdate(false));
      else if (msg?.type === 'onlineHeartbeat') sendResponse(await onlineHeartbeat(false));
      else sendResponse({ ok: false, error: 'Unknown message type' });
    } catch (err) { sendResponse({ ok: false, error: String(err?.message || err) }); }
  })();
  return true;
});

async function setupAlarm() {
  const { settings } = await chrome.storage.local.get('settings');
  const minutes = Math.max(15, Number(settings?.checkMinutes || 30));
  await chrome.alarms.clear('checkYouTubeFavorites');
  chrome.alarms.create('checkYouTubeFavorites', { periodInMinutes: minutes });
  await chrome.alarms.clear('checkYouTubeFavoritesGitHubUpdate');
  if (settings?.githubUpdateCheck && String(settings?.githubRepo || '').trim()) {
    chrome.alarms.create('checkYouTubeFavoritesGitHubUpdate', { periodInMinutes: 360 });
  }
  await chrome.alarms.clear('checkYouTubeFavoritesOnlineUsers');
  if (settings?.onlineUsersEnabled && String(settings?.onlineUsersEndpoint || '').trim()) {
    chrome.alarms.create('checkYouTubeFavoritesOnlineUsers', { periodInMinutes: 1 });
  }
}

async function getState() {
  const data = await chrome.storage.local.get(Object.keys(STORAGE_DEFAULTS));
  return { ok: true, ...STORAGE_DEFAULTS, ...data, settings: { ...STORAGE_DEFAULTS.settings, ...(data.settings || {}) }, videoStatuses: { ...(data.videoStatuses || {}) }, favoriteVideos: Array.isArray(data.favoriteVideos) ? data.favoriteVideos : [] };
}

async function saveSettings(next) {
  const { settings } = await chrome.storage.local.get('settings');
  const merged = { ...STORAGE_DEFAULTS.settings, ...(settings || {}), ...(next || {}) };
  merged.checkMinutes = Math.max(15, Number(merged.checkMinutes || 30));
  merged.maxVideosPerChannel = Math.max(1, Math.min(30, Number(merged.maxVideosPerChannel || 8)));
  merged.notify = Boolean(merged.notify);
  merged.showOverlayOnYouTube = Boolean(merged.showOverlayOnYouTube);
  merged.accessibilityMode = Boolean(merged.accessibilityMode);
  merged.language = ['auto', 'en', 'ro', 'de', 'fr', 'es', 'it'].includes(merged.language) ? merged.language : 'auto';
  merged.theaterMode = Boolean(merged.theaterMode);
  merged.githubRepo = normalizeGithubRepo(merged.githubRepo || '');
  merged.githubUpdateCheck = Boolean(merged.githubUpdateCheck);
  merged.onlineUsersEnabled = Boolean(merged.onlineUsersEnabled);
  merged.onlineUsersEndpoint = normalizeOnlineEndpoint(merged.onlineUsersEndpoint || '');
  await chrome.storage.local.set({ settings: merged });
  await setupAlarm();
  return { ok: true, settings: merged };
}

async function saveOverlayPosition(position) {
  const pos = position && Number.isFinite(position.left) && Number.isFinite(position.top)
    ? { left: Math.max(0, Math.round(position.left)), top: Math.max(0, Math.round(position.top)) }
    : null;
  await chrome.storage.local.set({ overlayPosition: pos });
  return { ok: true, overlayPosition: pos };
}



function normalizeOnlineEndpoint(value) {
  const s = String(value || '').trim();
  if (!s) return '';
  try {
    const u = new URL(s);
    if (u.protocol !== 'https:') return '';
    return u.toString();
  } catch (_) { return ''; }
}

function makeInstanceId() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return [...arr].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function onlineHeartbeat(isAutomatic) {
  const data = await chrome.storage.local.get(['settings', 'instanceId', 'onlineStats']);
  const settings = { ...STORAGE_DEFAULTS.settings, ...(data.settings || {}) };
  if (!settings.onlineUsersEnabled || !settings.onlineUsersEndpoint) {
    return { ok: false, disabled: true, error: 'Online users endpoint is not enabled.' };
  }
  let instanceId = data.instanceId || '';
  if (!instanceId) {
    instanceId = makeInstanceId();
    await chrome.storage.local.set({ instanceId });
  }
  const payload = {
    instanceId,
    extension: 'youtube-favorites-feed',
    version: chrome.runtime.getManifest().version,
    ts: new Date().toISOString()
  };
  try {
    const res = await fetch(settings.onlineUsersEndpoint, {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const stats = {
      ok: true,
      checkedAt: new Date().toISOString(),
      onlineUsers: Number(json.onlineUsers ?? json.online ?? json.usersOnline ?? 0),
      totalUsers: Number(json.totalUsers ?? json.total ?? 0),
      raw: json
    };
    const nextSettings = { ...settings, onlineUsersLastCheck: stats.checkedAt };
    await chrome.storage.local.set({ onlineStats: stats, settings: nextSettings });
    return { ok: true, ...stats };
  } catch (err) {
    const stats = { ok: false, checkedAt: new Date().toISOString(), error: String(err?.message || err), onlineUsers: null };
    await chrome.storage.local.set({ onlineStats: stats });
    return stats;
  }
}

async function checkGitHubUpdate(isAutomatic) {
  const { settings } = await chrome.storage.local.get('settings');
  const repo = normalizeGithubRepo(settings?.githubRepo || '');
  if (!repo) return { ok: false, error: 'No GitHub repository configured. Use owner/repo, for example: yourname/youtube-favorites-feed.' };
  const url = `https://api.github.com/repos/${repo}/releases/latest`;
  const res = await fetch(url, { cache: 'no-store', headers: { 'Accept': 'application/vnd.github+json' } });
  if (!res.ok) return { ok: false, error: `GitHub update check failed: HTTP ${res.status}` };
  const release = await res.json();
  const latest = String(release.tag_name || release.name || '').replace(/^v/i, '').trim();
  const current = chrome.runtime.getManifest().version;
  const htmlUrl = release.html_url || `https://github.com/${repo}/releases/latest`;
  const zipAsset = Array.isArray(release.assets) ? release.assets.find(a => String(a.name || '').endsWith('.zip')) : null;
  const downloadUrl = zipAsset?.browser_download_url || htmlUrl;
  const hasUpdate = latest && compareVersions(latest, current) > 0;
  const info = {
    checkedAt: new Date().toISOString(),
    repo,
    currentVersion: current,
    latestVersion: latest || '',
    hasUpdate,
    releaseUrl: htmlUrl,
    downloadUrl
  };
  await chrome.storage.local.set({ settings: { ...STORAGE_DEFAULTS.settings, ...(settings || {}), githubRepo: repo, lastGithubUpdateCheck: info.checkedAt, lastGithubUpdate: info } });
  if (isAutomatic && hasUpdate && settings?.notify) {
    chrome.notifications.create(`ytfav-update-${latest}`, {
      type: 'basic',
      iconUrl: 'icon-128.png',
      title: 'YouTube Favorites Feed update available',
      message: `Version ${latest} is available on GitHub. Current version: ${current}.`
    });
  }
  return { ok: true, ...info };
}

function normalizeGithubRepo(value) {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const u = new URL(raw);
    if (!/github\.com$/i.test(u.hostname)) return raw.replace(/^\/+|\/+$/g, '');
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  } catch (_) {}
  return raw.replace(/^\/+|\/+$/g, '').replace(/\.git$/i, '');
}

function compareVersions(a, b) {
  const pa = String(a || '').split(/[.-]/).map(x => parseInt(x, 10)).filter(n => !Number.isNaN(n));
  const pb = String(b || '').split(/[.-]/).map(x => parseInt(x, 10)).filter(n => !Number.isNaN(n));
  const len = Math.max(pa.length, pb.length, 3);
  for (let i = 0; i < len; i++) {
    const da = pa[i] || 0, db = pb[i] || 0;
    if (da > db) return 1;
    if (da < db) return -1;
  }
  return 0;
}

async function addChannel(input) {
  const resolved = await resolveChannel(input);
  const { channels } = await chrome.storage.local.get('channels');
  const list = Array.isArray(channels) ? channels : [];
  if (list.some(c => c.channelId === resolved.channelId)) return { ok: true, duplicate: true, channel: resolved };
  const channel = {
    channelId: resolved.channelId,
    title: resolved.title || resolved.channelId,
    avatarUrl: resolved.avatarUrl || '',
    url: `https://www.youtube.com/channel/${resolved.channelId}`,
    feedUrl: `https://www.youtube.com/feeds/videos.xml?channel_id=${resolved.channelId}`,
    addedAt: new Date().toISOString(),
    lastCheckedAt: null
  };
  list.push(channel);
  await chrome.storage.local.set({ channels: list });
  await refreshAllFeeds(false);
  return { ok: true, channel };
}

async function removeChannel(channelId) {
  const { channels, videos, videoStatuses } = await chrome.storage.local.get(['channels', 'videos', 'videoStatuses']);
  const newChannels = (channels || []).filter(c => c.channelId !== channelId);
  const newVideos = (videos || []).filter(v => v.channelId !== channelId);
  const nextStatuses = { ...(videoStatuses || {}) };
  for (const v of videos || []) if (v.channelId === channelId) delete nextStatuses[v.videoId];
  await chrome.storage.local.set({ channels: newChannels, videos: newVideos, videoStatuses: nextStatuses });
  return { ok: true };
}

async function enrichVideos(videos) {
  const list = Array.isArray(videos) ? videos.slice(0, 60).map(normalizeVideo) : [];
  const enriched = [];
  for (const video of list) {
    if (!video.videoId) continue;
    if (video.channelTitle && video.channelTitle !== 'YouTube' && (video.channelUrl || video.channelId)) {
      enriched.push(video);
      continue;
    }
    try {
      const url = `https://www.youtube.com/oembed?url=${encodeURIComponent('https://www.youtube.com/watch?v=' + video.videoId)}&format=json`;
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        enriched.push({
          ...video,
          title: video.title && video.title !== video.videoId ? video.title : (data.title || video.title),
          channelTitle: data.author_name || video.channelTitle || 'YouTube',
          channelUrl: data.author_url || video.channelUrl || '',
          channelAvatarUrl: video.channelAvatarUrl || data.thumbnail_url || ''
        });
        continue;
      }
    } catch (_) {}
    enriched.push(video);
  }
  return { ok: true, videos: enriched };
}

async function addFavoriteVideo(video) {
  const normalized = normalizeVideo(video);
  if (!normalized.videoId) return { ok: false, error: 'Missing video id.' };
  const { favoriteVideos } = await chrome.storage.local.get('favoriteVideos');
  const list = Array.isArray(favoriteVideos) ? favoriteVideos : [];
  const next = [normalized, ...list.filter(v => v.videoId !== normalized.videoId)].slice(0, 500);
  await chrome.storage.local.set({ favoriteVideos: next });
  return { ok: true, favoriteVideos: next };
}

async function removeFavoriteVideo(videoId) {
  const { favoriteVideos } = await chrome.storage.local.get('favoriteVideos');
  const next = (favoriteVideos || []).filter(v => v.videoId !== videoId);
  await chrome.storage.local.set({ favoriteVideos: next });
  return { ok: true, favoriteVideos: next };
}

function normalizeVideo(v) {
  const videoId = String(v?.videoId || '').trim() || extractVideoId(v?.url || '');
  return {
    videoId,
    title: String(v?.title || videoId || 'Video').trim(),
    url: v?.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''),
    publishedAt: v?.publishedAt || v?.publishedTimeText || new Date().toISOString(),
    channelId: String(v?.channelId || '').trim(),
    channelTitle: String(v?.channelTitle || 'YouTube').trim(),
    channelUrl: v?.channelUrl || (v?.channelId ? `https://www.youtube.com/channel/${v.channelId}` : ''),
    channelAvatarUrl: v?.channelAvatarUrl || '',
    savedAt: new Date().toISOString()
  };
}

async function markVideoViewing(videoId) {
  if (!videoId) return { ok: false, error: 'Missing videoId' };
  const { videoStatuses } = await chrome.storage.local.get('videoStatuses');
  const next = { ...(videoStatuses || {}) };
  if (next[videoId] !== 'viewed') next[videoId] = 'viewing';
  await chrome.storage.local.set({ videoStatuses: next });
  return { ok: true, videoStatuses: next };
}

async function markVideoViewed(videoId) {
  if (!videoId) return { ok: false, error: 'Missing videoId' };
  const { videoStatuses } = await chrome.storage.local.get('videoStatuses');
  const next = { ...(videoStatuses || {}) };
  next[videoId] = 'viewed';
  await chrome.storage.local.set({ videoStatuses: next });
  return { ok: true, videoStatuses: next };
}

async function updateViewingFromUrl(videoId) {
  const { videoStatuses } = await chrome.storage.local.get('videoStatuses');
  const next = { ...(videoStatuses || {}) };
  let changed = false;
  if (videoId && next[videoId] !== 'viewed' && next[videoId] !== 'viewing') { next[videoId] = 'viewing'; changed = true; }
  if (changed) await chrome.storage.local.set({ videoStatuses: next });
  return { ok: true, videoStatuses: next };
}

async function searchVideos(query) {
  const q = String(query || '').trim();
  if (!q) return { ok: false, error: 'Enter a search term.' };
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const html = await fetchText(url);
  const videos = extractVideosFromHtml(html, 30).map(v => ({ ...v, source: 'search' }));
  return { ok: true, videos };
}

async function resolveChannel(inputRaw) {
  const input = String(inputRaw || '').trim();
  if (!input) throw new Error('Enter a channel URL, handle or channel_id.');
  const directId = input.match(/UC[a-zA-Z0-9_-]{20,}/)?.[0];
  if (directId) return await resolveByChannelUrl(`https://www.youtube.com/channel/${directId}`, directId);
  let url;
  if (input.startsWith('@')) url = `https://www.youtube.com/${input}`;
  else if (/^https?:\/\//i.test(input)) url = input;
  else if (/^[a-zA-Z0-9_.-]+$/.test(input)) url = `https://www.youtube.com/@${input}`;
  else throw new Error('Unsupported format. Example: @handle or YouTube channel URL.');
  return await resolveByChannelUrl(url);
}

async function resolveByChannelUrl(url, fallbackId = null) {
  const candidates = buildChannelUrlCandidates(url);
  let lastError = '';
  for (const candidate of candidates) {
    try {
      const html = await fetchText(candidate);
      const channelId = extractChannelId(html, fallbackId);
      if (!channelId) { lastError = 'page was read, but it did not contain a channel_id'; continue; }
      const title = decodeHtml(html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] || html.match(/<meta name="title" content="([^"]+)"/)?.[1] || html.match(/<title>([^<]+)<\/title>/)?.[1] || channelId).replace(/ - YouTube$/, '').trim();
      const avatarUrl = extractChannelAvatar(html);
      return { channelId, title, avatarUrl };
    } catch (err) { lastError = String(err?.message || err); }
  }
  throw new Error('Could not resolve the channel automatically. Use the channel ID starting with UC... or the /channel/UC... URL. Last error: ' + lastError);
}

function buildChannelUrlCandidates(url) {
  const list = [];
  const add = u => { if (u && !list.includes(u)) list.push(u); };
  add(url); add(url.replace(/\/$/, '') + '/about'); add(url.replace(/\/$/, '') + '/videos'); add(url + (url.includes('?') ? '&' : '?') + 'cbrd=1&ucbcb=1'); add(url.replace('https://youtube.com/', 'https://www.youtube.com/'));
  return list;
}

function extractChannelId(html, fallbackId = null) {
  const patterns = [/https:\/\/www\.youtube\.com\/feeds\/videos\.xml\?channel_id=([^"\\&<]+)/, /"browseId"\s*:\s*"(UC[a-zA-Z0-9_-]{20,})"/, /"channelId"\s*:\s*"(UC[a-zA-Z0-9_-]{20,})"/, /"externalId"\s*:\s*"(UC[a-zA-Z0-9_-]{20,})"/, /<meta itemprop="channelId" content="(UC[a-zA-Z0-9_-]{20,})"/, /<link rel="canonical" href="https:\/\/www\.youtube\.com\/channel\/(UC[a-zA-Z0-9_-]{20,})"/, /\/channel\/(UC[a-zA-Z0-9_-]{20,})/];
  for (const re of patterns) { const match = html.match(re); if (match?.[1]) return decodeURIComponent(match[1]); }
  return fallbackId || '';
}
function extractChannelAvatar(html) {
  const raw = html.match(/<meta property="og:image" content="([^"]+)"/)?.[1] || html.match(/"avatar"\s*:\s*\{[\s\S]{0,1000}?"url"\s*:\s*"([^"]+)"/)?.[1] || html.match(/"thumbnails"\s*:\s*\[[\s\S]{0,500}?"url"\s*:\s*"([^"]+)"/)?.[1] || '';
  return decodeHtml(raw).replace(/\\u0026/g, '&');
}

async function refreshAllFeeds(isAutomatic) {
  const { channels, videos, seenVideoIds, settings, videoStatuses } = await chrome.storage.local.get(['channels', 'videos', 'seenVideoIds', 'settings', 'videoStatuses']);
  const channelList = Array.isArray(channels) ? channels : [];
  let oldSeen = Array.isArray(seenVideoIds) ? seenVideoIds : [];
  const previousIds = new Set((videos || []).map(v => v.videoId));
  const allVideos = [], updatedChannels = [], errors = [];
  for (const channel of channelList) {
    let workingChannel = channel;
    try {
      if (!workingChannel.avatarUrl) { try { const resolved = await resolveByChannelUrl(workingChannel.url, workingChannel.channelId); workingChannel = { ...workingChannel, title: workingChannel.title || resolved.title, avatarUrl: resolved.avatarUrl || '' }; } catch (_) {} }
      const xml = await fetchText(workingChannel.feedUrl);
      const parsed = parseFeed(xml, workingChannel);
      allVideos.push(...parsed.slice(0, Number(settings?.maxVideosPerChannel || 8)));
      updatedChannels.push({ ...workingChannel, lastCheckedAt: new Date().toISOString() });
    } catch (err) { errors.push(`${workingChannel.title}: ${String(err?.message || err)}`); updatedChannels.push(workingChannel); }
  }
  allVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  const newItems = allVideos.filter(v => !previousIds.has(v.videoId));
  const knownSeen = new Set(oldSeen);
  for (const v of allVideos) if (previousIds.has(v.videoId)) knownSeen.add(v.videoId);
  const currentIds = new Set(allVideos.map(v => v.videoId));
  const nextStatuses = {};
  for (const [id, status] of Object.entries(videoStatuses || {})) if (currentIds.has(id)) nextStatuses[id] = status;
  await chrome.storage.local.set({ channels: updatedChannels, videos: allVideos, seenVideoIds: [...knownSeen].slice(-1000), videoStatuses: nextStatuses });
  if (isAutomatic && settings?.notify && newItems.length) {
    const first = newItems[0]; chrome.notifications.create(`ytfav-${first.videoId}`, { type: 'basic', iconUrl: 'icon-128.png', title: `${newItems.length} new video${newItems.length > 1 ? 's' : ''}`, message: `${first.channelTitle}: ${first.title}` });
  }
  return { ok: true, videos: allVideos, newCount: newItems.length, errors };
}

async function markAllSeen() { const { videos } = await chrome.storage.local.get('videos'); const ids = (videos || []).map(v => v.videoId); await chrome.storage.local.set({ seenVideoIds: ids.slice(-1000) }); return { ok: true }; }
async function fetchText(url) { const res = await fetch(url, { credentials: 'omit', cache: 'no-store', redirect: 'follow', headers: { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' } }); if (!res.ok) throw new Error(`${url} · HTTP ${res.status}`); return await res.text(); }
function parseFeed(xml, channel) { const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => m[1]); return entries.map(entry => { const videoId = getTag(entry, 'yt:videoId'); const title = decodeHtml(getTag(entry, 'title')); const publishedAt = getTag(entry, 'published'); const updatedAt = getTag(entry, 'updated'); const link = entry.match(/<link[^>]+href="([^"]+)"/)?.[1] || `https://www.youtube.com/watch?v=${videoId}`; return { videoId, title, url: link, publishedAt, updatedAt, channelId: channel.channelId, channelTitle: channel.title, channelUrl: channel.url, channelAvatarUrl: channel.avatarUrl || '' }; }).filter(v => v.videoId && v.title); }
function getTag(xml, tag) { const safeTag = tag.replace(':', '\\:'); const re = new RegExp(`<${safeTag}[^>]*>([\\s\\S]*?)<\\/${safeTag}>`); return xml.match(re)?.[1]?.trim() || ''; }
function extractVideoId(url) { return String(url || '').match(/[?&]v=([a-zA-Z0-9_-]{6,})/)?.[1] || String(url || '').match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/)?.[1] || ''; }

function extractVideosFromHtml(html, max = 30) {
  const json = extractInitialData(html);
  const results = [];
  if (json) walkJsonForVideos(json, results, max);
  const dedup = [];
  const seen = new Set();
  for (const v of results) {
    if (!v.videoId || seen.has(v.videoId)) continue;
    seen.add(v.videoId); dedup.push(normalizeVideo(v));
    if (dedup.length >= max) break;
  }
  return dedup;
}
function extractInitialData(html) {
  const markers = ['var ytInitialData = ', 'window["ytInitialData"] = '];
  for (const marker of markers) {
    const idx = html.indexOf(marker);
    if (idx >= 0) {
      const start = html.indexOf('{', idx);
      const end = findJsonEnd(html, start);
      if (start >= 0 && end > start) { try { return JSON.parse(html.slice(start, end + 1)); } catch (_) {} }
    }
  }
  return null;
}
function findJsonEnd(text, start) { let depth = 0, str = false, esc = false; for (let i = start; i < text.length; i++) { const ch = text[i]; if (str) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') str = false; } else { if (ch === '"') str = true; else if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return i; } } } return -1; }
function textRuns(obj) { const runs = obj?.runs || obj?.simpleText ? (obj.runs || [{ text: obj.simpleText }]) : []; return runs.map(r => r.text || '').join('').trim(); }
function thumbUrl(obj) { const arr = obj?.thumbnails || obj?.thumbnail?.thumbnails || []; return arr[arr.length - 1]?.url || ''; }
function walkJsonForVideos(node, out, max) {
  if (!node || out.length >= max) return;
  if (Array.isArray(node)) { for (const x of node) { walkJsonForVideos(x, out, max); if (out.length >= max) break; } return; }
  if (typeof node !== 'object') return;
  const vr = node.videoRenderer || node.compactVideoRenderer || node.gridVideoRenderer || node.reelItemRenderer;
  if (vr?.videoId) {
    const owner = vr.ownerText || vr.shortBylineText || vr.longBylineText || {};
    const run = owner.runs?.[0] || {};
    out.push({
      videoId: vr.videoId,
      title: textRuns(vr.title) || textRuns(vr.headline) || vr.videoId,
      url: `https://www.youtube.com/watch?v=${vr.videoId}`,
      publishedAt: textRuns(vr.publishedTimeText) || '',
      channelTitle: textRuns(owner) || 'YouTube',
      channelId: run.navigationEndpoint?.browseEndpoint?.browseId || '',
      channelUrl: run.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url ? `https://www.youtube.com${run.navigationEndpoint.commandMetadata.webCommandMetadata.url}` : '',
      channelAvatarUrl: thumbUrl(vr.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail) || thumbUrl(vr.thumbnail)
    });
  }
  for (const v of Object.values(node)) walkJsonForVideos(v, out, max);
}
function decodeHtml(s) { return String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'); }
