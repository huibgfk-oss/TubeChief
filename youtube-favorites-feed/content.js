(() => {
  if (window.__youtubeFavoritesFeedOverlayLoaded) return;
  window.__youtubeFavoritesFeedOverlayLoaded = true;

  const ROOT_ID = 'youtube-favorites-feed-overlay-root';
  const DEFAULTS = { overlayOpen: true, overlayTab: 'feed', overlayPages: { feed: 1, related: 1, search: 1, favvideos: 1 } };
  const PAGE_SIZE = 6;
  const STYLE_TEXT = `:host { all: initial; }
.fys-wrap, .fys-wrap * { box-sizing: border-box; font-family: Arial, Helvetica, sans-serif; }
.fys-panel {
  position: fixed;
  top: 72px;
  right: 12px;
  width: 370px;
  max-width: calc(100vw - 24px);
  max-height: calc(100vh - 92px);
  background: #111;
  color: #eee;
  border: 1px solid #303030;
  border-radius: 16px;
  z-index: 2147483647;
  box-shadow: 0 16px 50px rgba(0,0,0,.55);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  contain: layout style;
}
.fys-collapsed {
  position: fixed;
  top: 180px;
  right: 0;
  z-index: 2147483647;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  background: #cc0000;
  color: white;
  border: 0;
  border-radius: 12px 0 0 12px;
  padding: 13px 9px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,.45);
}
.fys-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 11px 12px;
  background: linear-gradient(135deg, #202020, #111);
  border-bottom: 1px solid #303030;
  cursor: grab;
}
.fys-title { font-size: 15px; font-weight: 700; line-height: 1.1; }
.fys-subtitle { font-size: 11px; color: #aaa; margin-top: 2px; }
.fys-actions { display: flex; gap: 6px; }
.fys-btn {
  background: #2f6fed;
  color: #fff;
  border: 0;
  border-radius: 9px;
  padding: 7px 9px;
  font-size: 12px;
  cursor: pointer;
}
.fys-btn:hover { filter: brightness(1.12); }
.fys-btn.gray { background: #333; }
.fys-btn.red { background: #742525; }
.fys-tabs { display: flex; flex-wrap: wrap; border-bottom: 1px solid #303030; overflow: hidden; flex: 0 0 auto; }
.fys-tab {
  flex: 1 1 86px;
  background: #181818;
  color: #bbb;
  border: 0;
  padding: 10px 8px;
  cursor: pointer;
  font-size: 12px;
}
.fys-tab.active { background: #2a2a2a; color: #fff; }
.fys-body { padding: 10px; overflow-y: auto; overflow-x: hidden; flex: 1 1 auto; min-height: 0; scrollbar-gutter: stable; }
.fys-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 9px; }
.fys-count, .fys-status, .fys-meta, .fys-hint { color: #aaa; font-size: 11px; line-height: 1.3; }
.fys-status { color: #f0c674; min-height: 16px; margin: 0 0 8px; }
.fys-status.error { color: #ff7b72; }
.fys-video, .fys-channel {
  display: block;
  width: 100%;
  border: 1px solid #2b2b2b;
  background: #181818;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 8px;
  color: #fff;
  text-decoration: none;
}
.fys-video:hover, .fys-channel:hover { background: #202020; }
.fys-video.unseen { border-color: #2f6fed; box-shadow: inset 3px 0 0 #2f6fed; }
.fys-video-title, .fys-channel-title { font-size: 13px; font-weight: 700; line-height: 1.35; color: #fff; }
.fys-row { display: flex; gap: 8px; align-items: center; }
.fys-row input {
  width: 100%;
  background: #1c1c1c;
  color: #eee;
  border: 1px solid #3a3a3a;
  border-radius: 10px;
  padding: 9px;
  font-size: 13px;
}
.fys-channel { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.fys-channel-info { min-width: 0; overflow: hidden; }
.fys-empty { color: #aaa; text-align: center; padding: 30px 10px; font-size: 13px; }
.fys-hidden { display: none !important; }
.fys-btn.active-eye { background: #f0c674; color: #111; font-weight: 800; }
.fys-empty small { display: block; margin-top: 8px; color: #ccc; line-height: 1.35; }
@media (max-width: 760px) {
  .fys-panel { top: 64px; right: 8px; width: calc(100vw - 16px); max-height: calc(100vh - 76px); }
}
.fys-video {
  display: flex;
  align-items: flex-start;
  gap: 9px;
}
.fys-video-content { min-width: 0; flex: 1; }
.fys-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  flex: 0 0 34px;
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
}
.fys-avatar.fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}
.fys-view-state {
  display: inline-block;
  margin-top: 6px;
  padding: 3px 7px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .02em;
  background: #2a2a2a;
  color: #aaa;
}
.fys-view-state.viewing { background: #3b3214; color: #ffd86b; }
.fys-view-state.viewed { background: #17351f; color: #8be28b; }
.fys-view-state.not_viewed { background: #341a1a; color: #ff9a9a; }


/* Accessibility / impaired eyesight mode */
.fys-accessibility .fys-panel {
  width: 430px;
  background: #000;
  border: 2px solid #fff;
  box-shadow: 0 0 0 3px rgba(255,255,255,.22), 0 18px 60px rgba(0,0,0,.75);
}
.fys-accessibility .fys-header {
  background: #000;
  border-bottom-color: #fff;
  padding: 14px;
}
.fys-accessibility .fys-title { font-size: 19px; }
.fys-accessibility .fys-subtitle { font-size: 14px; color: #fff; }
.fys-accessibility .fys-btn {
  font-size: 15px;
  min-height: 38px;
  padding: 9px 12px;
  border: 1px solid rgba(255,255,255,.65);
}
.fys-accessibility .fys-tabs { border-bottom-color: #fff; }
.fys-accessibility .fys-tab {
  background: #050505;
  color: #fff;
  font-size: 15px;
  padding: 13px 8px;
  border-right: 1px solid #555;
}
.fys-accessibility .fys-tab.active { background: #fff; color: #000; font-weight: 800; }
.fys-accessibility .fys-body { padding: 12px; overflow-x: hidden; }
.fys-accessibility .fys-count,
.fys-accessibility .fys-status,
.fys-accessibility .fys-meta,
.fys-accessibility .fys-hint { color: #fff; font-size: 14px; }
.fys-accessibility .fys-video,
.fys-accessibility .fys-channel {
  background: #000;
  border: 2px solid #fff;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 10px;
}
.fys-accessibility .fys-video:hover,
.fys-accessibility .fys-channel:hover { background: #111; }
.fys-accessibility .fys-video.unseen {
  border-color: #ffd400;
  box-shadow: inset 6px 0 0 #ffd400;
}
.fys-accessibility .fys-video-title,
.fys-accessibility .fys-channel-title { font-size: 17px; line-height: 1.45; }
.fys-accessibility .fys-avatar {
  width: 44px;
  height: 44px;
  flex-basis: 44px;
  border: 2px solid #fff;
}
.fys-accessibility .fys-view-state {
  font-size: 13px;
  padding: 5px 9px;
  border: 1px solid rgba(255,255,255,.7);
}
.fys-accessibility .fys-row input {
  font-size: 16px;
  padding: 12px;
  border: 2px solid #fff;
  background: #000;
}
@media (max-width: 760px) {
  .fys-accessibility .fys-panel { width: calc(100vw - 16px); }
}
.fys-tab { min-width: 0; white-space: nowrap; }
.fys-search-row { margin-bottom: 10px; }
.fys-card-actions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 7px; }
.fys-mini {
  background: #333;
  color: #fff;
  border: 0;
  border-radius: 8px;
  padding: 5px 7px;
  font-size: 11px;
  cursor: pointer;
}
.fys-mini:hover { filter: brightness(1.12); }
.fys-mini.red { background: #742525; }
.fys-accessibility .fys-tab { min-width: 118px; }
.fys-accessibility .fys-card-actions { gap: 8px; }
.fys-accessibility .fys-mini { font-size: 14px; padding: 8px 10px; border: 1px solid rgba(255,255,255,.7); }


/* v1.2.5 anti-flicker: the panel must remain opaque while tabs re-render. */
.fys-wrap { isolation: isolate; }
.fys-panel, .fys-body, .fys-tabs, .fys-header { backface-visibility: hidden; transform: translateZ(0); }
.fys-panel { background-color: #111 !important; will-change: transform; }
.fys-accessibility .fys-panel { background-color: #000 !important; }


/* v1.2.6 pagination and stable tab layout */
.fys-pagination {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  margin: 0 0 10px;
}
.fys-page-btn {
  background: #2b2b2b;
  color: #fff;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  padding: 5px 8px;
  font-size: 11px;
  cursor: pointer;
}
.fys-page-btn:hover { filter: brightness(1.14); }
.fys-page-btn.active { background: #2f6fed; border-color: #2f6fed; font-weight: 800; }
.fys-page-btn[disabled] { opacity: .45; cursor: default; }
.fys-list-note { color: #aaa; font-size: 11px; margin-bottom: 7px; }
.fys-accessibility .fys-pagination { gap: 7px; }
.fys-accessibility .fys-page-btn { font-size: 14px; padding: 8px 11px; border: 1px solid rgba(255,255,255,.75); }
.fys-accessibility .fys-list-note { color: #fff; font-size: 14px; }
`;
  let rootHost = null, shadow = null, state = null, drag = null, lastUrl = location.href;
  let ui = { ...DEFAULTS };
  let lang = 'en';
  let relatedVideos = [];
  let searchResults = [];
  let relatedLoading = false;
  let relatedTimer = null;
  let videoMonitorEl = null;

  const I18N = {
    en: { collapsed:'Favorites', title:'YouTube Favorites', subtitle:'Always on top on YouTube', whatsNew:"What's new", related:'Related', search:'Search', favVideos:'Saved videos', channels:'Channels', add:'Add', playAll:'Play all', saveVideo:'Save video', saved:'Saved', saveChannel:'Save channel', videos:'videos', new:'new', noVideos:'No videos yet. Add a channel.', noRelated:'Open a YouTube video to see related videos.', noSaved:'No saved favorite videos yet.', remove:'Remove', emptyList:'Your local favorites channels list is empty.', placeholder:'@channel, channel ID or URL', searchPlaceholder:'Search YouTube videos...', loadFail:'Could not load extension data.', checking:'Checking new videos...', refreshErrors:'Refresh with errors', refreshOk:'Refresh OK. New', enterChannel:'Enter @handle, URL or UC...', looking:'Looking up channel...', deleted:'Channel removed.', deleting:'Removing channel...', exists:'Channel already exists.', added:'Added', viewed:'viewed', viewing:'still viewing', notViewed:'not viewed', searchFirst:'Type a search term and press Search.', searching:'Searching...', noSearch:'No results.', positionSaved:'Position saved.', accessibilityToggle:'Accessibility', relatedLoading:'Loading related videos...', relatedHint:'If this stays empty, scroll the YouTube page once and press refresh.', next:'Next', previous:'Previous', page:'Page' },
    ro: { collapsed:'Favorite', title:'Favorite YouTube', subtitle:'Always on top pe YouTube', whatsNew:"What's new", related:'Related', search:'Caută', favVideos:'Video favorite', channels:'Canale', add:'Adaugă', playAll:'Play all', saveVideo:'Salvează video', saved:'Salvat', saveChannel:'Salvează canal', videos:'video-uri', new:'noi', noVideos:'Nu există video-uri încă. Adaugă un canal.', noRelated:'Deschide un video YouTube ca să apară video-uri asemănătoare.', noSaved:'Nu ai video-uri favorite salvate.', remove:'Șterge', emptyList:'Lista locală de canale favorite este goală.', placeholder:'@canal, channel ID sau URL', searchPlaceholder:'Caută video-uri pe YouTube...', loadFail:'Nu pot încărca datele extensiei.', checking:'Verific noutățile...', refreshErrors:'Refresh cu erori', refreshOk:'Refresh OK. Noi', enterChannel:'Introdu @handle, URL sau UC...', looking:'Caut canalul...', deleted:'Canal șters.', deleting:'Șterg canalul...', exists:'Canalul exista deja.', added:'Adăugat', viewed:'viewed', viewing:'still viewing', notViewed:'not viewed', searchFirst:'Scrie un termen și apasă Caută.', searching:'Caut...', noSearch:'Nu am găsit rezultate.', positionSaved:'Poziție salvată.', accessibilityToggle:'Accesibilitate', relatedLoading:'Încarc video-uri asemănătoare...', relatedHint:'Dacă rămâne gol, fă scroll o dată în pagina YouTube și apasă refresh.' },
    de: { collapsed:'Favoriten', title:'YouTube Favoriten', subtitle:'Immer oben auf YouTube', whatsNew:'Neu', related:'Ähnlich', search:'Suche', favVideos:'Gespeichert', channels:'Kanäle', add:'Hinzufügen', playAll:'Alle abspielen', saveVideo:'Video speichern', saved:'Gespeichert', saveChannel:'Kanal speichern', videos:'Videos', new:'neu', noVideos:'Noch keine Videos.', noRelated:'Öffne ein YouTube-Video.', noSaved:'Keine gespeicherten Videos.', remove:'Entfernen', emptyList:'Kanalliste ist leer.', placeholder:'@Kanal, ID oder URL', searchPlaceholder:'YouTube suchen...', loadFail:'Daten konnten nicht geladen werden.', checking:'Prüfe neue Videos...', refreshErrors:'Refresh mit Fehlern', refreshOk:'Refresh OK. Neu', enterChannel:'@Handle, URL oder UC... eingeben', looking:'Suche Kanal...', deleted:'Kanal entfernt.', deleting:'Entferne Kanal...', exists:'Kanal existiert bereits.', added:'Hinzugefügt', viewed:'viewed', viewing:'still viewing', notViewed:'not viewed', searchFirst:'Suchbegriff eingeben.', searching:'Suche...', noSearch:'Keine Ergebnisse.', positionSaved:'Position gespeichert.', accessibilityToggle:'Barrierefrei', relatedLoading:'Ähnliche Videos werden geladen...', relatedHint:'Wenn die Liste leer bleibt, scrolle YouTube einmal und drücke Refresh.' },
    fr: { collapsed:'Favoris', title:'Favoris YouTube', subtitle:'Toujours visible sur YouTube', whatsNew:'Nouveautés', related:'Similaires', search:'Recherche', favVideos:'Vidéos sauvées', channels:'Chaînes', add:'Ajouter', playAll:'Tout lire', saveVideo:'Sauver vidéo', saved:'Sauvé', saveChannel:'Sauver chaîne', videos:'vidéos', new:'nouveau', noVideos:'Aucune vidéo.', noRelated:'Ouvrez une vidéo YouTube.', noSaved:'Aucune vidéo sauvée.', remove:'Supprimer', emptyList:'Liste vide.', placeholder:'@chaîne, ID ou URL', searchPlaceholder:'Rechercher sur YouTube...', loadFail:'Impossible de charger.', checking:'Recherche...', refreshErrors:'Erreurs', refreshOk:'OK. Nouveau', enterChannel:'Entrez @handle, URL ou UC...', looking:'Recherche chaîne...', deleted:'Chaîne supprimée.', deleting:'Suppression...', exists:'Déjà existante.', added:'Ajouté', viewed:'viewed', viewing:'still viewing', notViewed:'not viewed', searchFirst:'Entrez une recherche.', searching:'Recherche...', noSearch:'Aucun résultat.', positionSaved:'Position sauvée.', accessibilityToggle:'Accessibilité', relatedLoading:'Chargement des vidéos similaires...', relatedHint:'Si la liste reste vide, faites défiler YouTube puis actualisez.', next:'Suivant', previous:'Précédent', page:'Page' },
    es: { collapsed:'Favoritos', title:'Favoritos YouTube', subtitle:'Siempre encima en YouTube', whatsNew:'Novedades', related:'Relacionados', search:'Buscar', favVideos:'Vídeos guardados', channels:'Canales', add:'Añadir', playAll:'Reproducir todo', saveVideo:'Guardar vídeo', saved:'Guardado', saveChannel:'Guardar canal', videos:'vídeos', new:'nuevo', noVideos:'No hay vídeos.', noRelated:'Abre un vídeo de YouTube.', noSaved:'No hay vídeos guardados.', remove:'Eliminar', emptyList:'Lista vacía.', placeholder:'@canal, ID o URL', searchPlaceholder:'Buscar en YouTube...', loadFail:'No se pudo cargar.', checking:'Buscando...', refreshErrors:'Errores', refreshOk:'OK. Nuevo', enterChannel:'Introduce @handle, URL o UC...', looking:'Buscando canal...', deleted:'Canal eliminado.', deleting:'Eliminando...', exists:'Ya existe.', added:'Añadido', viewed:'viewed', viewing:'still viewing', notViewed:'not viewed', searchFirst:'Escribe una búsqueda.', searching:'Buscando...', noSearch:'Sin resultados.', positionSaved:'Posición guardada.', accessibilityToggle:'Accesibilidad', relatedLoading:'Cargando vídeos relacionados...', relatedHint:'Si sigue vacío, desplaza YouTube una vez y pulsa actualizar.', next:'Siguiente', previous:'Anterior', page:'Página' },
    it: { collapsed:'Preferiti', title:'Preferiti YouTube', subtitle:'Sempre in primo piano', whatsNew:'Novità', related:'Correlati', search:'Cerca', favVideos:'Video salvati', channels:'Canali', add:'Aggiungi', playAll:'Riproduci tutti', saveVideo:'Salva video', saved:'Salvato', saveChannel:'Salva canale', videos:'video', new:'nuovo', noVideos:'Nessun video.', noRelated:'Apri un video YouTube.', noSaved:'Nessun video salvato.', remove:'Rimuovi', emptyList:'Lista vuota.', placeholder:'@canale, ID o URL', searchPlaceholder:'Cerca su YouTube...', loadFail:'Errore caricamento.', checking:'Controllo...', refreshErrors:'Errori', refreshOk:'OK. Nuovo', enterChannel:'Inserisci @handle, URL o UC...', looking:'Cerco canale...', deleted:'Canale rimosso.', deleting:'Rimozione...', exists:'Esiste già.', added:'Aggiunto', viewed:'viewed', viewing:'still viewing', notViewed:'not viewed', searchFirst:'Scrivi una ricerca.', searching:'Cerco...', noSearch:'Nessun risultato.', positionSaved:'Posizione salvata.', accessibilityToggle:'Accessibilità', relatedLoading:'Carico video correlati...', relatedHint:'Se resta vuoto, scorri YouTube una volta e premi aggiorna.', next:'Avanti', previous:'Indietro', page:'Pagina' }
  };
  const t = k => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
  const send = (type, payload = {}) => chrome.runtime.sendMessage({ type, ...payload });
  const storageGet = keys => chrome.storage.local.get(keys);
  const storageSet = obj => chrome.storage.local.set(obj);
  const detectLang = setting => {
    if (setting && setting !== 'auto') return setting;
    const l = (navigator.language || 'en').toLowerCase();
    if (l.startsWith('ro')) return 'ro'; if (l.startsWith('de')) return 'de'; if (l.startsWith('fr')) return 'fr'; if (l.startsWith('es')) return 'es'; if (l.startsWith('it')) return 'it'; return 'en';
  };

  init();

  async function init() {
    const savedUi = await storageGet(Object.keys(DEFAULTS)); ui = { ...DEFAULTS, ...savedUi };
    ensureRoot(); monitorUrlChanges(); installVideoCompletionMonitor(); await updateCurrentVideoStatus(); relatedVideos = extractRelatedVideos(); await loadState();
    chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && (changes.videos || changes.channels || changes.seenVideoIds || changes.settings || changes.videoStatuses || changes.favoriteVideos || changes.overlayPosition)) loadState(); });
  }
  function ensureRoot() { rootHost = document.getElementById(ROOT_ID); if (!rootHost) { rootHost = document.createElement('div'); rootHost.id = ROOT_ID; document.documentElement.appendChild(rootHost); } shadow = rootHost.shadowRoot || rootHost.attachShadow({ mode: 'open' }); }
  async function loadState() { try { state = await send('getState'); lang = detectLang(state.settings?.language); render(); } catch (err) { state = { ok: false, error: String(err?.message || err) }; render(); } }

  function render(statusText = '', isError = false) {
    if (!shadow) return;
    if (state?.ok && state.settings?.showOverlayOnYouTube === false) { shadow.innerHTML = ''; return; }
    const open = Boolean(ui.overlayOpen), accessibility = Boolean(state?.settings?.accessibilityMode);
    const pos = state?.overlayPosition;
    const style = pos && open ? `style="left:${pos.left}px;top:${pos.top}px;right:auto;"` : '';
    shadow.innerHTML = `
      <style>${STYLE_TEXT}</style>
      <div class="fys-wrap ${accessibility ? 'fys-accessibility' : ''}">
        <button class="fys-collapsed ${open ? 'fys-hidden' : ''}" id="fysOpen">${t('collapsed')}</button>
        <section class="fys-panel ${open ? '' : 'fys-hidden'}" id="fysPanel" ${style}>
          <header class="fys-header" id="fysDragHandle">
            <div><div class="fys-title">${t('title')}</div><div class="fys-subtitle">${t('subtitle')}</div></div>
            <div class="fys-actions"><button class="fys-btn" id="fysRefresh" title="Refresh">↻</button><button class="fys-btn ${accessibility ? 'active-eye' : ''}" id="fysAccessibility" title="${escapeAttr(t('accessibilityToggle'))}">👁</button><button class="fys-btn red" id="fysClose" title="Close">×</button></div>
          </header>
          <nav class="fys-tabs">
            <button class="fys-tab ${ui.overlayTab === 'feed' ? 'active' : ''}" data-tab="feed">${t('whatsNew')}</button>
            <button class="fys-tab ${ui.overlayTab === 'related' ? 'active' : ''}" data-tab="related">${t('related')}</button>
            <button class="fys-tab ${ui.overlayTab === 'search' ? 'active' : ''}" data-tab="search">${t('search')}</button>
            <button class="fys-tab ${ui.overlayTab === 'favvideos' ? 'active' : ''}" data-tab="favvideos">${t('favVideos')}</button>
            <button class="fys-tab ${ui.overlayTab === 'channels' ? 'active' : ''}" data-tab="channels">${t('channels')}</button>
          </nav>
          <div class="fys-body"><div id="fysStatus" class="fys-status ${isError ? 'error' : ''}">${escapeHtml(statusText || (!state?.ok ? state?.error || 'Error' : ''))}</div>${renderActiveTab()}</div>
        </section>
      </div>`;
    bindUi();
  }

  function renderActiveTab() {
    if (!state?.ok) return '';
    if (ui.overlayTab === 'channels') return renderChannelsTab();
    if (ui.overlayTab === 'search') return renderSearchTab();
    if (ui.overlayTab === 'related') return renderRelatedTab();
    if (ui.overlayTab === 'favvideos') return renderFavoriteVideosTab();
    return renderFeedTab();
  }
  function renderFeedTab() {
    const seen = new Set(state.seenVideoIds || []), videos = state.videos || [];
    const newCount = videos.filter(v => !seen.has(v.videoId)).length;
    const page = getPage('feed', videos.length), pageVideos = paginate('feed', videos);
    return `<div class="fys-toolbar"><span class="fys-count">${videos.length} ${t('videos')} · ${newCount} ${t('new')} · ${t('page')} ${page}/${totalPages(videos.length)}</span><button class="fys-btn gray" data-play-list="feed">▶ ${t('playAll')}</button></div>${renderPagination('feed', videos.length)}${videos.length ? pageVideos.map(v => renderVideo(v, seen.has(v.videoId), { save: true, channel: false })).join('') : `<div class="fys-empty">${t('noVideos')}</div>`}`;
  }
  function renderRelatedTab() {
    if (!location.href.includes('/watch')) return `<div class="fys-empty">${t('noRelated')}</div>`;
    const videos = relatedVideos || [];
    const page = getPage('related', videos.length), pageVideos = paginate('related', videos);
    const empty = relatedLoading ? t('relatedLoading') : `${t('noRelated')}<br><small>${t('relatedHint')}</small>`;
    return `<div class="fys-toolbar"><span class="fys-count">${videos.length} ${t('videos')} · ${t('page')} ${page}/${totalPages(videos.length)}</span><button class="fys-btn gray" data-play-list="related">▶ ${t('playAll')}</button></div>${renderPagination('related', videos.length)}${videos.length ? pageVideos.map(v => renderVideo(v, false, { save: true, channel: true })).join('') : `<div class="fys-empty">${empty}</div>`}`;
  }
  function renderSearchTab() {
    const videos = searchResults || [], page = getPage('search', videos.length), pageVideos = paginate('search', videos);
    return `<div class="fys-row fys-search-row"><input id="fysSearchInput" placeholder="${escapeAttr(t('searchPlaceholder'))}"><button class="fys-btn" id="fysSearchBtn">${t('search')}</button></div><div class="fys-toolbar"><span class="fys-count">${videos.length ? `${videos.length} ${t('videos')} · ${t('page')} ${page}/${totalPages(videos.length)}` : t('searchFirst')}</span><button class="fys-btn gray" data-play-list="search">▶ ${t('playAll')}</button></div>${renderPagination('search', videos.length)}<div id="fysSearchResults">${videos.length ? pageVideos.map(v => renderVideo(v, false, { save: true, channel: true })).join('') : ''}</div>`;
  }
  function renderFavoriteVideosTab() {
    const videos = state.favoriteVideos || [];
    const page = getPage('favvideos', videos.length), pageVideos = paginate('favvideos', videos);
    return `<div class="fys-toolbar"><span class="fys-count">${videos.length} ${t('videos')} · ${t('page')} ${page}/${totalPages(videos.length)}</span><button class="fys-btn gray" data-play-list="favvideos">▶ ${t('playAll')}</button></div>${renderPagination('favvideos', videos.length)}${videos.length ? pageVideos.map(v => renderVideo(v, true, { removeFav: true, channel: true })).join('') : `<div class="fys-empty">${t('noSaved')}</div>`}`;
  }
  function totalPages(count) { return Math.max(1, Math.ceil(Number(count || 0) / PAGE_SIZE)); }
  function getPage(kind, count) {
    ui.overlayPages = ui.overlayPages || {};
    const max = totalPages(count);
    const page = Math.min(max, Math.max(1, Number(ui.overlayPages[kind] || 1)));
    ui.overlayPages[kind] = page;
    return page;
  }
  function paginate(kind, list) {
    const page = getPage(kind, list.length);
    return list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }
  function renderPagination(kind, count) {
    const pages = totalPages(count);
    if (pages <= 1) return '';
    const page = getPage(kind, count);
    const nums = [];
    for (let i = 1; i <= pages; i++) nums.push(`<button class="fys-page-btn ${i === page ? 'active' : ''}" data-page-number="${i}" data-page-kind="${kind}">${i}</button>`);
    return `<div class="fys-pagination"><button class="fys-page-btn" data-page-action="prev" data-page-kind="${kind}" ${page <= 1 ? 'disabled' : ''}>‹ ${t('previous')}</button>${nums.join('')}<button class="fys-page-btn" data-page-action="next" data-page-kind="${kind}" ${page >= pages ? 'disabled' : ''}>${t('next')} ›</button></div>`;
  }
  function renderChannelsTab() {
    const channels = state.channels || [];
    return `<div class="fys-row"><input id="fysChannelInput" placeholder="${escapeAttr(t('placeholder'))}"><button class="fys-btn" id="fysAddChannel">${t('add')}</button></div><div class="fys-hint">UC... este cel mai stabil.</div>${channels.length ? channels.map(c => `<div class="fys-channel"><div class="fys-channel-info"><a class="fys-channel-title" href="${escapeAttr(c.url)}" data-nav="${escapeAttr(c.url)}">${escapeHtml(c.title)}</a><div class="fys-meta">${escapeHtml(c.channelId)}</div></div><button class="fys-btn red" data-remove-channel="${escapeAttr(c.channelId)}">${t('remove')}</button></div>`).join('') : `<div class="fys-empty">${t('emptyList')}</div>`}`;
  }
  function renderVideo(v, isSeen, opts = {}) {
    const status = getVideoStatus(v.videoId);
    const avatar = v.channelAvatarUrl ? `<img class="fys-avatar" src="${escapeAttr(v.channelAvatarUrl)}" alt="">` : `<div class="fys-avatar fallback">${escapeHtml((v.channelTitle || '?').charAt(0).toUpperCase())}</div>`;
    const fav = isFavoriteVideo(v.videoId);
    return `<article class="fys-video ${isSeen ? '' : 'unseen'}" data-video-card="${escapeAttr(v.videoId)}">
      ${avatar}<div class="fys-video-content">
        <a class="fys-video-title" href="${escapeAttr(v.url || ('https://www.youtube.com/watch?v=' + v.videoId))}" data-video-id="${escapeAttr(v.videoId)}">${escapeHtml(v.title)}</a>
        <div class="fys-meta">${escapeHtml(v.channelTitle || 'YouTube')} · ${escapeHtml(formatDate(v.publishedAt))}</div>
        <div class="fys-view-state ${status}">${escapeHtml(statusLabel(status))}</div>
        <div class="fys-card-actions">
          ${opts.save ? `<button class="fys-mini" data-save-video="${escapeAttr(v.videoId)}">${fav ? t('saved') : t('saveVideo')}</button>` : ''}
          ${opts.removeFav ? `<button class="fys-mini red" data-remove-fav-video="${escapeAttr(v.videoId)}">${t('remove')}</button>` : ''}
          ${opts.channel ? `<button class="fys-mini" data-save-channel="${escapeAttr(v.videoId)}">${t('saveChannel')}</button>` : ''}
        </div>
      </div></article>`;
  }

  function bindUi() {
    const $ = id => shadow.getElementById(id);
    $('fysOpen')?.addEventListener('click', async () => { ui.overlayOpen = true; await storageSet({ overlayOpen: true }); render(); });
    $('fysClose')?.addEventListener('click', async () => { ui.overlayOpen = false; await storageSet({ overlayOpen: false }); render(); });
    $('fysRefresh')?.addEventListener('click', async () => { await updateCurrentVideoStatus(); if (ui.overlayTab === 'related') await refreshRelatedVideos(true); await refresh(); });
    $('fysAccessibility')?.addEventListener('click', toggleAccessibilityMode);
    shadow.querySelectorAll('.fys-tab').forEach(btn => btn.addEventListener('click', async () => { ui.overlayTab = btn.dataset.tab; await storageSet({ overlayTab: ui.overlayTab }); if (ui.overlayTab === 'related') await refreshRelatedVideos(true); else render(); }));
    shadow.querySelectorAll('[data-video-id]').forEach(a => a.addEventListener('click', async e => { e.preventDefault(); const id = a.getAttribute('data-video-id'); if (id) await send('markVideoViewing', { videoId: id }); location.href = a.href; }));
    shadow.querySelectorAll('[data-nav]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); location.href = a.getAttribute('data-nav'); }));
    shadow.querySelectorAll('[data-play-list]').forEach(btn => btn.addEventListener('click', () => playAll(btn.getAttribute('data-play-list'))));
    shadow.querySelectorAll('[data-page-number]').forEach(btn => btn.addEventListener('click', async () => setPage(btn.getAttribute('data-page-kind'), Number(btn.getAttribute('data-page-number')))));
    shadow.querySelectorAll('[data-page-action]').forEach(btn => btn.addEventListener('click', async () => changePage(btn.getAttribute('data-page-kind'), btn.getAttribute('data-page-action'))));
    shadow.querySelectorAll('[data-save-video]').forEach(btn => btn.addEventListener('click', async () => saveVideoById(btn.getAttribute('data-save-video'))));
    shadow.querySelectorAll('[data-remove-fav-video]').forEach(btn => btn.addEventListener('click', async () => { await send('removeFavoriteVideo', { videoId: btn.getAttribute('data-remove-fav-video') }); await loadState(); }));
    shadow.querySelectorAll('[data-save-channel]').forEach(btn => btn.addEventListener('click', async () => saveChannelByVideoId(btn.getAttribute('data-save-channel'))));
    shadow.querySelectorAll('[data-remove-channel]').forEach(btn => btn.addEventListener('click', async () => { render(t('deleting')); const res = await send('removeChannel', { channelId: btn.getAttribute('data-remove-channel') }); await loadState(); render(res.ok ? t('deleted') : res.error, !res.ok); }));
    $('fysAddChannel')?.addEventListener('click', addChannelFromOverlay);
    $('fysChannelInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') addChannelFromOverlay(); });
    $('fysSearchBtn')?.addEventListener('click', searchVideos);
    $('fysSearchInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') searchVideos(); });
    const handle = $('fysDragHandle'); if (handle) { handle.addEventListener('mousedown', startDrag); handle.addEventListener('touchstart', startDrag, { passive: false }); }
  }
  async function setPage(kind, page) {
    ui.overlayPages = ui.overlayPages || {};
    ui.overlayPages[kind] = Math.max(1, Number(page || 1));
    await storageSet({ overlayPages: ui.overlayPages });
    render();
  }
  async function changePage(kind, action) {
    const lists = { feed: state?.videos || [], related: relatedVideos || [], search: searchResults || [], favvideos: state?.favoriteVideos || [] };
    const current = getPage(kind, (lists[kind] || []).length);
    const next = action === 'next' ? current + 1 : current - 1;
    await setPage(kind, Math.min(totalPages((lists[kind] || []).length), Math.max(1, next)));
  }
  async function addChannelFromOverlay() {
    const input = shadow.getElementById('fysChannelInput')?.value.trim(); if (!input) return render(t('enterChannel'), true);
    render(t('looking')); const res = await send('addChannel', { input }); await loadState(); render(res.ok ? (res.duplicate ? t('exists') : `${t('added')}: ${res.channel.title}`) : res.error, !res.ok);
  }
  async function refresh() { render(t('checking')); const res = await send('refresh'); await loadState(); render(res.ok ? (res.errors?.length ? `${t('refreshErrors')}: ${res.errors.join(' | ')}` : `${t('refreshOk')}: ${res.newCount}`) : res.error, !res.ok); }
  async function toggleAccessibilityMode() {
    const current = Boolean(state?.settings?.accessibilityMode);
    const res = await send('saveSettings', { settings: { accessibilityMode: !current } });
    if (res?.ok) { await loadState(); } else { render(res?.error || 'Could not change accessibility mode.', true); }
  }
  async function searchVideos() {
    const q = shadow.getElementById('fysSearchInput')?.value.trim(); if (!q) return render(t('searchFirst'), true);
    render(t('searching')); const res = await send('searchVideos', { query: q }); searchResults = res.ok ? res.videos || [] : []; await loadState(); ui.overlayTab = 'search'; ui.overlayPages = { ...(ui.overlayPages || {}), search: 1 }; await storageSet({ overlayTab: 'search', overlayPages: ui.overlayPages }); render(res.ok ? (searchResults.length ? '' : t('noSearch')) : res.error, !res.ok);
  }
  async function saveVideoById(videoId) { const v = findVideoById(videoId); if (!v) return; await send('addFavoriteVideo', { video: v }); await loadState(); render(t('saved')); }
  async function saveChannelByVideoId(videoId) { const v = findVideoById(videoId); const input = v?.channelId || v?.channelUrl; if (!input) return render('No channel ID/URL found for this video.', true); render(t('looking')); const res = await send('addChannel', { input }); await loadState(); render(res.ok ? (res.duplicate ? t('exists') : `${t('added')}: ${res.channel.title}`) : res.error, !res.ok); }
  function findVideoById(videoId) { return [...(state?.videos || []), ...(state?.favoriteVideos || []), ...relatedVideos, ...searchResults].find(v => v.videoId === videoId); }
  function isFavoriteVideo(videoId) { return (state?.favoriteVideos || []).some(v => v.videoId === videoId); }
  function playAll(kind) {
    let list = [];
    if (kind === 'feed') list = state?.videos || [];
    if (kind === 'related') list = relatedVideos || [];
    if (kind === 'search') list = searchResults || [];
    if (kind === 'favvideos') list = state?.favoriteVideos || [];
    const ids = list.map(v => v.videoId).filter(Boolean).slice(0, 50);
    if (!ids.length) return;
    send('markVideoViewing', { videoId: ids[0] });
    location.href = `https://www.youtube.com/watch_videos?video_ids=${encodeURIComponent(ids.join(','))}`;
  }

  function startDrag(e) {
    const panel = shadow.getElementById('fysPanel'); if (!panel) return;
    const p = e.touches ? e.touches[0] : e; e.preventDefault();
    const rect = panel.getBoundingClientRect(); drag = { dx: p.clientX - rect.left, dy: p.clientY - rect.top };
    window.addEventListener('mousemove', onDrag, true); window.addEventListener('mouseup', stopDrag, true); window.addEventListener('touchmove', onDrag, { passive: false, capture: true }); window.addEventListener('touchend', stopDrag, true);
  }
  function onDrag(e) { if (!drag) return; const p = e.touches ? e.touches[0] : e; if (e.cancelable) e.preventDefault(); const panel = shadow.getElementById('fysPanel'); if (!panel) return; const left = Math.min(window.innerWidth - 80, Math.max(0, p.clientX - drag.dx)); const top = Math.min(window.innerHeight - 80, Math.max(0, p.clientY - drag.dy)); panel.style.left = `${left}px`; panel.style.top = `${top}px`; panel.style.right = 'auto'; }
  async function stopDrag() { if (!drag) return; drag = null; const panel = shadow.getElementById('fysPanel'); if (panel) { const rect = panel.getBoundingClientRect(); await send('saveOverlayPosition', { position: { left: rect.left, top: rect.top } }); } window.removeEventListener('mousemove', onDrag, true); window.removeEventListener('mouseup', stopDrag, true); window.removeEventListener('touchmove', onDrag, true); window.removeEventListener('touchend', stopDrag, true); }

  function monitorUrlChanges() { setInterval(async () => { if (location.href !== lastUrl) { lastUrl = location.href; installVideoCompletionMonitor(); await updateCurrentVideoStatus(); scheduleRelatedRefresh(); setTimeout(() => loadState(), 250); } }, 700); }
  function scheduleRelatedRefresh() { if (relatedTimer) clearTimeout(relatedTimer); relatedTimer = setTimeout(() => refreshRelatedVideos(false), 900); }
  async function refreshRelatedVideos(showLoading) {
    if (!location.href.includes('/watch')) { relatedVideos = []; render(); return; }
    relatedLoading = Boolean(showLoading);
    if (showLoading) render();
    const delays = [0, 700, 1600, 3000, 5500, 8500];
    for (const delay of delays) {
      if (delay) await sleep(delay);
      const found = extractRelatedVideos();
      if (found.length || delay === delays[delays.length - 1]) {
        relatedVideos = await enrichVideosWithChannelData(found);
        break;
      }
    }
    relatedLoading = false;
    ui.overlayPages = { ...(ui.overlayPages || {}), related: getPage('related', relatedVideos.length) };
    render();
  }
  function installVideoCompletionMonitor() {
    setTimeout(() => {
      const video = document.querySelector('video');
      if (!video || video === videoMonitorEl) return;
      videoMonitorEl = video;
      const markViewedIfComplete = async () => {
        const id = getCurrentVideoId();
        if (!id) return;
        const duration = Number(video.duration || 0), current = Number(video.currentTime || 0);
        if (video.ended || (duration > 30 && current / duration >= 0.95)) await send('markVideoViewed', { videoId: id });
      };
      video.addEventListener('ended', markViewedIfComplete, true);
      video.addEventListener('timeupdate', () => { if (video.duration && video.currentTime / video.duration >= 0.95) markViewedIfComplete(); }, true);
    }, 700);
  }
  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
  async function updateCurrentVideoStatus() { await send('updateViewingFromUrl', { videoId: getCurrentVideoId() }); }
  function getCurrentVideoId() { return new URL(location.href).searchParams.get('v') || ''; }

  async function enrichVideosWithChannelData(videos) {
    const list = Array.isArray(videos) ? videos : [];
    const needs = list.some(v => !v.channelTitle || v.channelTitle === 'YouTube' || (!v.channelUrl && !v.channelId));
    if (!needs) return list;
    try {
      const res = await send('enrichVideos', { videos: list });
      if (res?.ok && Array.isArray(res.videos)) return res.videos;
    } catch (_) {}
    return list;
  }

  function extractRelatedVideos() {
    if (!location.href.includes('/watch')) return [];
    const current = getCurrentVideoId();
    const fromAnchors = extractVideosFromAnchors(90);
    const fromDom = extractVideosFromDom(60, true);
    const fromJson = extractVideosFromScripts(120);
    return dedupeVideos([...fromJson, ...fromDom, ...fromAnchors], 45).filter(v => v.videoId && v.videoId !== current).slice(0, 36);
  }
  function extractVideosFromAnchors(max) {
    const roots = [];
    ['#secondary', '#related', 'ytd-watch-next-secondary-results-renderer', 'ytd-watch-flexy'].forEach(sel => { const el = document.querySelector(sel); if (el) roots.push(el); });
    roots.push(document);
    const out = [];
    for (const root of roots) {
      const anchors = root.querySelectorAll('a[href*="/watch?v="], a[href*="watch?v="]');
      for (const a of anchors) {
        const href = a.href || a.getAttribute('href') || '';
        const videoId = videoIdFromUrl(href);
        if (!videoId) continue;
        const node = a.closest('ytd-compact-video-renderer, ytd-rich-item-renderer, ytd-video-renderer, ytd-grid-video-renderer, ytd-playlist-panel-video-renderer, ytd-compact-radio-renderer') || a.parentElement;
        const titleText = cleanText(a.getAttribute('title') || a.getAttribute('aria-label') || node?.querySelector('#video-title, h3, yt-formatted-string#video-title')?.textContent || a.textContent);
        if (!titleText || titleText.length < 3) continue;
        const ch = extractChannelInfoFromNode(node);
        out.push({
          videoId,
          title: titleText.replace(/\s+-\s+\d+.*$/, '').trim(),
          url: `https://www.youtube.com/watch?v=${videoId}`,
          publishedAt: cleanText(node?.querySelector('#metadata-line span, .ytd-video-meta-block span')?.textContent),
          channelTitle: ch.title || 'YouTube',
          channelId: channelIdFromUrl(ch.href),
          channelUrl: ch.href ? absolutizeYouTubeUrl(ch.href) : '',
          channelAvatarUrl: ch.avatar || ''
        });
        if (out.length >= max) break;
      }
      if (out.length >= max) break;
    }
    return dedupeVideos(out, max);
  }
  function extractVideosFromDom(max, preferRelatedArea) {
    const roots = [];
    if (preferRelatedArea) {
      const related = document.querySelector('#related, ytd-watch-next-secondary-results-renderer, #secondary');
      if (related) roots.push(related);
    }
    roots.push(document);
    const out = [];
    for (const root of roots) {
      const nodes = root.querySelectorAll('ytd-compact-video-renderer, ytd-video-renderer, ytd-rich-item-renderer, ytd-grid-video-renderer');
      for (const node of nodes) {
        const a = node.querySelector('a#thumbnail[href*="watch?v="], a#video-title[href*="watch?v="], a[href*="/watch?v="]');
        if (!a) continue;
        const href = a.href || a.getAttribute('href') || '';
        const videoId = videoIdFromUrl(href);
        if (!videoId) continue;
        const titleEl = node.querySelector('#video-title, a#video-title, h3 a, yt-formatted-string#video-title');
        const metaEl = node.querySelector('#metadata-line span, .ytd-video-meta-block span');
        const ch = extractChannelInfoFromNode(node);
        out.push({
          videoId,
          title: cleanText(titleEl?.textContent) || a.getAttribute('title') || videoId,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          publishedAt: cleanText(metaEl?.textContent),
          channelTitle: ch.title || 'YouTube',
          channelId: channelIdFromUrl(ch.href),
          channelUrl: ch.href ? absolutizeYouTubeUrl(ch.href) : '',
          channelAvatarUrl: ch.avatar || ''
        });
        if (out.length >= max) break;
      }
      if (out.length >= max) break;
    }
    return dedupeVideos(out, max);
  }
  function extractVideosFromScripts(max) {
    const scripts = [...document.scripts].map(s => s.textContent || '').filter(s => s.includes('ytInitialData') || s.includes('compactVideoRenderer') || s.includes('videoRenderer'));
    const out = [];
    for (const txt of scripts) { const data = extractInitialData(txt); if (data) walkJsonForVideos(data, out, max); if (out.length >= max) break; }
    return dedupeVideos(out, max);
  }
  function dedupeVideos(list, max) {
    const byId = new Map();
    const order = [];
    for (const v of list) {
      if (!v?.videoId) continue;
      const existing = byId.get(v.videoId);
      if (!existing) {
        byId.set(v.videoId, { ...v });
        order.push(v.videoId);
      } else {
        byId.set(v.videoId, mergeVideoInfo(existing, v));
      }
      if (order.length >= max && !existing) break;
    }
    return order.slice(0, max).map(id => byId.get(id));
  }
  function mergeVideoInfo(a, b) {
    const better = { ...a };
    for (const key of ['title', 'url', 'publishedAt', 'channelTitle', 'channelId', 'channelUrl', 'channelAvatarUrl']) {
      const current = cleanText(better[key]);
      const next = cleanText(b?.[key]);
      if ((!current || current === 'YouTube' || current === b?.videoId) && next && next !== 'YouTube') better[key] = b[key];
    }
    if (better.channelUrl && !better.channelId) better.channelId = channelIdFromUrl(better.channelUrl);
    if ((!better.channelTitle || better.channelTitle === 'YouTube') && b?.title) {
      const fromAria = channelNameFromTitleLikeText(b.title);
      if (fromAria) better.channelTitle = fromAria;
    }
    return better;
  }
  function channelNameFromTitleLikeText(text) {
    const s = cleanText(text);
    if (!s) return '';
    const patterns = [
      /\s+by\s+(.+?)\s+(?:\d|No views|[\d,.]+ views|views|ago|Streamed|Premiered)/i,
      /\s+de\s+(.+?)\s+(?:acum|\d|vizionări|views)/i,
      /\s+von\s+(.+?)\s+(?:vor|\d|Aufrufe|views)/i,
      /\s+par\s+(.+?)\s+(?:il y a|\d|vues|views)/i,
      /\s+por\s+(.+?)\s+(?:hace|\d|visualizaciones|views)/i,
      /\s+di\s+(.+?)\s+(?:\d|visualizzazioni|views|fa)/i
    ];
    for (const re of patterns) {
      const m = s.match(re);
      if (m && cleanText(m[1]).length > 1) return cleanText(m[1]);
    }
    return '';
  }
  function videoIdFromUrl(url) { try { return new URL(absolutizeYouTubeUrl(url)).searchParams.get('v') || ''; } catch (_) { const m = String(url || '').match(/[?&]v=([A-Za-z0-9_-]{6,})/); return m ? m[1] : ''; } }
  function channelIdFromUrl(url) { const s = String(url || ''); const m = s.match(/\/channel\/(UC[A-Za-z0-9_-]+)/); return m ? m[1] : ''; }
  function absolutizeYouTubeUrl(url) { if (!url) return ''; if (url.startsWith('http')) return url; return `https://www.youtube.com${url.startsWith('/') ? '' : '/'}${url}`; }
  function cleanText(s) { return String(s || '').replace(/\s+/g, ' ').trim(); }
  function extractChannelInfoFromNode(node) {
    if (!node) return { title: '', href: '', avatar: '' };
    const selectors = [
      'ytd-channel-name a',
      '#channel-name a',
      '#byline a',
      'a#channel-name',
      'a[href^="/@"]',
      'a[href*="/channel/"]',
      'a[href*="/c/"]',
      'a[href*="/user/"]'
    ];
    let channelEl = null;
    for (const sel of selectors) {
      channelEl = node.querySelector(sel);
      if (channelEl) break;
    }
    let title = cleanText(channelEl?.textContent || channelEl?.getAttribute('title') || channelEl?.getAttribute('aria-label'));
    let href = channelEl?.href || channelEl?.getAttribute('href') || '';

    if (!title || title === 'YouTube') {
      const videoTitleEl = node.querySelector('#video-title, a#video-title, h3 a, yt-formatted-string#video-title, a[href*="/watch?v="]');
      const ariaText = cleanText(videoTitleEl?.getAttribute('aria-label') || videoTitleEl?.getAttribute('title'));
      const parsed = channelNameFromTitleLikeText(ariaText);
      if (parsed) title = parsed;
    }

    if (!title) {
      const textCandidates = [
        node.querySelector('ytd-channel-name'),
        node.querySelector('#channel-name'),
        node.querySelector('#byline'),
        node.querySelector('.ytd-channel-name'),
        node.querySelector('.ytd-video-meta-block')
      ];
      for (const el of textCandidates) {
        const txt = cleanText(el?.textContent);
        if (txt && !txt.match(/^\d|views?|vizion|ago|acum|premier/i)) { title = txt; break; }
      }
    }

    if (!href) {
      const hrefEl = node.querySelector('a[href^="/@"], a[href*="/channel/"], a[href*="/c/"], a[href*="/user/"]');
      href = hrefEl?.href || hrefEl?.getAttribute('href') || '';
    }

    const img = node.querySelector('#avatar img, ytd-channel-name img, yt-img-shadow img, img#img, img[src*="yt3"]');
    return { title: title || 'YouTube', href, avatar: img?.src || img?.getAttribute('data-thumb') || '' };
  }
  function extractInitialData(text) { const idx = text.indexOf('ytInitialData'); if (idx < 0) return null; const start = text.indexOf('{', idx); const end = findJsonEnd(text, start); if (start >= 0 && end > start) { try { return JSON.parse(text.slice(start, end + 1)); } catch (_) {} } return null; }
  function findJsonEnd(text, start) { let depth = 0, str = false, esc = false; for (let i = start; i < text.length; i++) { const ch = text[i]; if (str) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') str = false; } else { if (ch === '"') str = true; else if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) return i; } } } return -1; }
  function textRuns(obj) { const runs = obj?.runs || (obj?.simpleText ? [{ text: obj.simpleText }] : []); return runs.map(r => r.text || '').join('').trim(); }
  function thumbUrl(obj) { const arr = obj?.thumbnails || obj?.thumbnail?.thumbnails || []; return arr[arr.length - 1]?.url || ''; }
  function walkJsonForVideos(node, out, max) {
    if (!node || out.length >= max) return;
    if (Array.isArray(node)) { for (const x of node) { walkJsonForVideos(x, out, max); if (out.length >= max) break; } return; }
    if (typeof node !== 'object') return;
    const vr = node.compactVideoRenderer || node.videoRenderer || node.gridVideoRenderer;
    if (vr?.videoId) {
      const owner = vr.shortBylineText || vr.ownerText || vr.longBylineText || {}; const run = owner.runs?.[0] || {};
      out.push({ videoId: vr.videoId, title: textRuns(vr.title) || vr.videoId, url: `https://www.youtube.com/watch?v=${vr.videoId}`, publishedAt: textRuns(vr.publishedTimeText), channelTitle: textRuns(owner) || 'YouTube', channelId: run.navigationEndpoint?.browseEndpoint?.browseId || '', channelUrl: run.navigationEndpoint?.commandMetadata?.webCommandMetadata?.url ? `https://www.youtube.com${run.navigationEndpoint.commandMetadata.webCommandMetadata.url}` : '', channelAvatarUrl: thumbUrl(vr.channelThumbnailSupportedRenderers?.channelThumbnailWithLinkRenderer?.thumbnail) || thumbUrl(vr.thumbnail) });
    }
    for (const v of Object.values(node)) walkJsonForVideos(v, out, max);
  }
  function getVideoStatus(videoId) { const status = state?.videoStatuses?.[videoId] || 'not_viewed'; return status === 'viewing' ? 'viewing' : status === 'viewed' ? 'viewed' : 'not_viewed'; }
  function statusLabel(status) { if (status === 'viewing') return t('viewing'); if (status === 'viewed') return t('viewed'); return t('notViewed'); }
  function formatDate(value) { if (!value) return ''; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleString(lang === 'ro' ? 'ro-RO' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : lang === 'it' ? 'it-IT' : 'en-US'); }
  function escapeHtml(s) { return String(s || '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
  function escapeAttr(s) { return escapeHtml(s); }
})();
