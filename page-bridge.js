(() => {
  if (window.__youtubeFavoritesFeedPageBridgeLoaded) return;
  window.__youtubeFavoritesFeedPageBridgeLoaded = true;

  function post(requestId, ok, extra = {}) {
    window.postMessage({ source: 'youtube-favorites-feed-page-bridge', type: 'NAVIGATE_RESULT', requestId, ok, ...extra }, '*');
  }

  function getPlayer() {
    return document.getElementById('movie_player') || document.querySelector('.html5-video-player') || window.movie_player || null;
  }

  function isTheaterModeActive() {
    const flexy = document.querySelector('ytd-watch-flexy');
    return Boolean(
      document.body.classList.contains('theater') ||
      document.querySelector('.html5-video-player.ytp-big-mode') ||
      flexy?.hasAttribute('theater') ||
      flexy?.getAttribute('theater') === 'true'
    );
  }

  function ensureTheaterMode() {
    if (isTheaterModeActive()) return;
    const button = document.querySelector('.ytp-size-button');
    if (button) button.click();
  }

  function isWatchUiVisible() {
    const flexy = document.querySelector('ytd-watch-flexy');
    const player = document.getElementById('movie_player') || document.querySelector('.html5-video-player');
    const playerRect = player?.getBoundingClientRect?.();
    const hasVisiblePlayer = Boolean(playerRect && playerRect.width > 180 && playerRect.height > 120);
    return location.pathname === '/watch' && Boolean(flexy) && hasVisiblePlayer;
  }

  function restoreHiddenPlayers() {
    const selectors = ['ytd-watch-flexy', '#player-container', '#movie_player', '.html5-video-player', '.html5-video-container', 'video'];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => {
        try {
          el.style.visibility = '';
          el.style.opacity = '';
          el.style.display = '';
        } catch (_) {}
      });
    }
  }

  async function waitForWatchUi(videoId) {
    for (const delay of [120, 250, 500, 900, 1400, 2200, 3200, 4500]) {
      await sleep(delay);
      restoreHiddenPlayers();
      if (new URL(location.href).searchParams.get('v') === videoId && isWatchUiVisible()) return true;
    }
    return false;
  }

  async function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  function videoIdFromHref(href) {
    try { return new URL(href, location.origin).searchParams.get('v') || ''; }
    catch (_) { return String(href || '').match(/[?&]v=([A-Za-z0-9_-]{6,})/)?.[1] || ''; }
  }

  function findNativeWatchAnchor(videoId) {
    const selectors = [
      `ytd-app a[href*="watch?v=${cssEscape(videoId)}"]`,
      `ytd-app a[href*="/watch?v=${cssEscape(videoId)}"]`,
      `a[href*="watch?v=${cssEscape(videoId)}"]`,
      `a[href*="/watch?v=${cssEscape(videoId)}"]`
    ];
    const anchors = [];
    for (const selector of selectors) {
      try { anchors.push(...document.querySelectorAll(selector)); } catch (_) {}
    }
    return anchors
      .filter(a => a && a.isConnected && videoIdFromHref(a.href || a.getAttribute('href')) === videoId)
      .map(a => ({ a, r: a.getBoundingClientRect() }))
      .sort((x, y) => (Number(y.r.width > 0 && y.r.height > 0) - Number(x.r.width > 0 && x.r.height > 0)))[0]?.a || null;
  }

  function cssEscape(value) {
    if (window.CSS && typeof window.CSS.escape === 'function') return window.CSS.escape(value);
    return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  async function clickNativeWatchLink(videoId) {
    const path = `/watch?v=${encodeURIComponent(videoId)}`;
    let anchor = findNativeWatchAnchor(videoId);
    let temporary = false;
    if (!anchor) {
      anchor = document.createElement('a');
      anchor.href = path;
      anchor.setAttribute('data-yff-temp-nav', '1');
      anchor.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;';
      (document.querySelector('ytd-app') || document.body || document.documentElement).appendChild(anchor);
      temporary = true;
    }
    const before = location.href;
    try {
      anchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window }));
      anchor.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window, button: 0 }));
      anchor.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window, button: 0 }));
      anchor.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, button: 0 }));
    } finally {
      if (temporary) setTimeout(() => { try { anchor.remove(); } catch (_) {} }, 1500);
    }
    for (const delay of [120, 250, 500, 900, 1400, 2200]) {
      await sleep(delay);
      if (new URL(location.href).searchParams.get('v') === videoId) return { ok: true, method: 'native-anchor-click', changed: location.href !== before };
      const p = getPlayer();
      if (p && typeof p.loadVideoById === 'function') return { ok: true, method: 'native-anchor-player-ready', changed: location.href !== before };
    }
    return { ok: false, error: 'native-anchor-navigation-failed' };
  }

  async function loadVideo(videoId, theater) {
    // Important: on channel/home pages YouTube may already expose movie_player from a
    // previous/miniplayer instance. Calling loadVideoById there can start audio while the
    // visible watch layout is still missing. Use direct player loading only when the
    // watch UI is already visible; otherwise let YouTube create the watch page first.
    if (isWatchUiVisible()) {
      const delays = [0, 100, 250, 500, 900, 1400, 2200];
      for (const delay of delays) {
        if (delay) await sleep(delay);
        const player = getPlayer();
        if (!player) continue;
        try {
          if (typeof player.loadVideoById === 'function') {
            if (new URL(location.href).searchParams.get('v') !== videoId) {
              history.pushState({ yff: true, videoId, yffBridge: true }, '', `/watch?v=${encodeURIComponent(videoId)}`);
            }
            restoreHiddenPlayers();
            player.loadVideoById(videoId);
            try { if (typeof player.playVideo === 'function') player.playVideo(); } catch (_) {}
            if (theater) setTimeout(ensureTheaterMode, 250);
            return { ok: true, method: 'loadVideoById-visible-watch-ui' };
          }
        } catch (e) {
          return { ok: false, error: String(e && e.message || e) };
        }
        try {
          if (typeof player.cueVideoById === 'function') {
            if (new URL(location.href).searchParams.get('v') !== videoId) {
              history.pushState({ yff: true, videoId, yffBridge: true }, '', `/watch?v=${encodeURIComponent(videoId)}`);
            }
            restoreHiddenPlayers();
            player.cueVideoById(videoId);
            setTimeout(() => { try { player.playVideo && player.playVideo(); } catch (_) {} }, 180);
            if (theater) setTimeout(ensureTheaterMode, 300);
            return { ok: true, method: 'cueVideoById-visible-watch-ui' };
          }
        } catch (e) {
          return { ok: false, error: String(e && e.message || e) };
        }
      }
    }

    // If we are not already on a visible watch page, use YouTube's own navigation
    // so the real watch layout/player is created. This prevents the audio-only case.
    const nativeResult = await clickNativeWatchLink(videoId);
    if (!nativeResult.ok) return nativeResult;

    const uiReady = await waitForWatchUi(videoId);
    const player = getPlayer();
    if (player) {
      try {
        restoreHiddenPlayers();
        if (typeof player.loadVideoById === 'function') {
          player.loadVideoById(videoId);
          try { player.playVideo && player.playVideo(); } catch (_) {}
          if (theater) setTimeout(ensureTheaterMode, 350);
          return { ok: true, method: uiReady ? 'native-watch-ui+loadVideoById' : 'native-anchor-click+loadVideoById', uiReady };
        }
        if (typeof player.playVideo === 'function') {
          player.playVideo();
          if (theater) setTimeout(ensureTheaterMode, 350);
          return { ok: true, method: uiReady ? 'native-watch-ui+playVideo' : 'native-anchor-click+playVideo', uiReady };
        }
      } catch (_) {}
    }
    if (theater) setTimeout(ensureTheaterMode, 500);
    return { ok: Boolean(uiReady), method: nativeResult.method || 'native-anchor-click', uiReady, error: uiReady ? undefined : 'watch-ui-not-visible' };
  }

  window.addEventListener('message', async (event) => {
    if (event.source !== window) return;
    const data = event.data || {};
    if (data.source !== 'youtube-favorites-feed-content' || data.type !== 'NAVIGATE_VIDEO') return;
    const requestId = data.requestId;
    const videoId = String(data.videoId || '').trim();
    if (!videoId) return post(requestId, false, { error: 'missing-video-id' });

    try {
      const result = await loadVideo(videoId, Boolean(data.theater));
      post(requestId, Boolean(result.ok), result);
    } catch (e) {
      post(requestId, false, { error: String(e && e.message || e) });
    }
  }, true);
})();
