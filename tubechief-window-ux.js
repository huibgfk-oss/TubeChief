/* TubeChief Windows UX companion: independent of YouTube's private APIs. */
(() => {
  'use strict';
  if (window.__tubechiefWindowUxFix2026) return;
  window.__tubechiefWindowUxFix2026 = true;
  const ROOT = 'youtube-favorites-feed-overlay-root';
  const isMobile = /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent);
  let registeredShadow = null;
  let observer = null;
  let pending = false;
  let relatedBusy = false;
  let lastKnownFullscreen = false;
  const css = `
    @media (max-width: 900px), (pointer: coarse) {
      #fysPanel { max-width: calc(100vw - 16px) !important; max-height: calc(100dvh - 16px) !important; }
      .fys-header button, .fys-header [role=button] { touch-action: manipulation !important; }
      .fys-footer { position: sticky !important; bottom: 0 !important; z-index: 5 !important; }
    }
    .fys-footer { flex: 0 0 auto !important; order: 20 !important; border-top: 1px solid #333 !important; background: #161616 !important; padding: 9px 10px !important; min-height: 0 !important; }
    .fys-footer .fys-pagination { display: flex !important; gap: 5px !important; margin: 0 !important; flex-wrap: nowrap !important; overflow-x: auto !important; scrollbar-width: thin !important; padding-bottom: 2px !important; }
    .fys-footer .fys-page-btn { flex: 0 0 auto !important; }
    .tc-more-related { display: block !important; width: 100% !important; margin: 7px 0 0 !important; padding: 8px !important; border: 1px solid #444 !important; border-radius: 8px !important; background: #2b2b2b !important; color: #fff !important; cursor: pointer !important; }
    .tc-more-related[disabled] { opacity: .55 !important; cursor: wait !important; }
  `;

  function currentShadow() {
    const host = document.getElementById(ROOT);
    return host && host.shadowRoot;
  }
    function inspect() {
    const sh = currentShadow();
    if (!sh) return;
    if (sh !== registeredShadow) {
      if (observer) observer.disconnect();
      registeredShadow = sh;
      observer = new MutationObserver(queueInspect);
      observer.observe(sh, {childList: true, subtree: true});
      sh.addEventListener('click', tryVideoFullscreen, true);
      sh.addEventListener('click', onLoadMore, true);
    }
    const panel = sh.getElementById('fysPanel');
    if (!panel || panel.classList.contains('fys-hidden')) return;
    let style = sh.getElementById('tcUxStyles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'tcUxStyles';
      style.textContent = css;
      sh.appendChild(style);
    }
    const controls = panel.querySelector('.fys-header .fys-actions');
    if (controls && !controls.dataset.tcDragSafe) {
      controls.dataset.tcDragSafe = '1';
      controls.addEventListener('touchstart', event => event.stopPropagation(), {passive:true});
      controls.addEventListener('mousedown', event => event.stopPropagation());
    }
    const footer = panel.querySelector('#fysFooter');
    if (!footer) return;
    const related = Boolean(panel.querySelector('.fys-tab.active[data-tab="related"]'));
    let more = footer.querySelector('.tc-more-related');
    if (related) {
      if (!more) {
        more = document.createElement('button');
        more.className = 'tc-more-related';
        more.type = 'button';
        more.textContent = 'Încarcă mai multe recomandări';
        footer.appendChild(more);
      }
      more.disabled = relatedBusy;
      if (relatedBusy) more.textContent = 'Se încarcă recomandări…';
    } else if (more) {
      more.remove();
    }
  }

  function queueInspect() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      pending = false;
      inspect();
    });
  }
  function tryVideoFullscreen(event) {
    if (event.button > 0 || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target;
    const link = target && target.closest && target.closest('a[data-video-id]');
    if (!link || !link.getAttribute('data-video-id') || document.fullscreenElement) return;
    const player = document.querySelector('#movie_player') || document.querySelector('ytd-player #container');
    // No existing player on home/search pages. Requesting fullscreen after
    // asynchronous navigation would be blocked without a fresh user gesture.
    if (player && typeof player.requestFullscreen === 'function') {
      try { Promise.resolve(player.requestFullscreen({navigationUI:'hide'})).catch(() => {}); } catch (_) {}
    }
  }
  function onLoadMore(event) {
    const btn = event.target && event.target.closest && event.target.closest('.tc-more-related');
    if (!btn || relatedBusy) return;
    event.preventDefault();
    event.stopPropagation();
    loadMoreRelated().catch(() => {}).finally(() => {
      relatedBusy = false;
      queueInspect();
    });
  }
  async function loadMoreRelated() {
    relatedBusy = true;
    queueInspect();
    const sh = currentShadow();
    const panel = sh && sh.getElementById('fysPanel');
    const label = panel && panel.querySelector('.fys-count');
    const before = label ? label.textContent : '';
    const savedY = window.scrollY;
    const roots = ['#related', '#secondary', 'ytd-watch-next-secondary-results-renderer'];
    let container = null;
    for (const sel of roots) {
      container = document.querySelector(sel);
      if (container) break;
    }
    const list = container && container.querySelectorAll('ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer');
    const last = list && list.length ? list[list.length-1] : container;
    if (last) last.scrollIntoView({block:'end',behavior:'instant'});
    else window.scrollTo({top:document.documentElement.scrollHeight,behavior:'instant'});
    await new Promise(resolve => setTimeout(resolve, 1400));
    window.scrollTo({top:savedY,behavior:'instant'});
    const updated = currentShadow();
    // Clicking the already-active Related tab uses TubeChief's own refresh path
    // without triggering its unrelated global channel refresh.
    const related = updated && updated.querySelector('.fys-tab[data-tab="related"]');
    if (related) related.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newerLabel = currentShadow()?.getElementById('fysPanel')?.querySelector('.fys-count');
    const later = newerLabel ? newerLabel.textContent : '';
    if (later && later === before) {
      const message = currentShadow()?.querySelector('.tc-more-related');
      if (message) message.textContent = 'Nu sunt alte rezultate încărcate de YouTube';
    }
  }

  const timer = setInterval(() => {
    if (currentShadow()) { clearInterval(timer); inspect(); }
  }, 250);
  setTimeout(() => clearInterval(timer), 18000);
})();
