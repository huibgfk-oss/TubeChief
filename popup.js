let state = null;
let lang = 'en';

const $ = id => document.getElementById(id);
const I18N = {
  en: {
    appTitle: 'YouTube Favorites', appSubtitle: 'Local channel favorites, no real YouTube subscription.',
    add: 'Add', whatsNew: "What's new", channels: 'Channels', settings: 'Settings', markSeen: 'Mark seen',
    language: 'Language', checkEvery: 'Check every minutes', videosPerChannel: 'Videos per channel', notifications: 'Notifications for new videos', saveSettings: 'Save settings',
    privacyHint: 'Brave/Chrome may ask for notification permission. The extension does not use your YouTube account.',
    placeholder: '@channel, channel ID or YouTube URL', loadError: 'Loading error.', videos: 'videos', new: 'new', noVideos: 'No videos yet. Add a channel.',
    checked: 'checked', remove: 'Remove', emptyList: 'Your local favorites list is empty.', deleting: 'Removing channel...', removed: 'Channel removed.',
    enterChannel: 'Enter @handle, channel ID or YouTube URL.', looking: 'Looking up channel...', exists: 'Channel already exists.', added: 'Added', refreshing: 'Checking new videos...',
    refreshErrors: 'Refresh with errors', refreshOk: 'Refresh OK. New', allSeen: 'All marked as seen.', saved: 'Settings saved.', showOverlay: 'Show floating panel on YouTube', accessibilityMode: 'Accessibility mode / impaired eyesight', theaterMode: 'Open videos in theater mode', githubRepo: 'GitHub repo for updates', githubUpdateCheck: 'Check GitHub for updates automatically', checkUpdate: 'Check update now', updateAvailable: 'Update available', noUpdate: 'No update available', updateCheckFailed: 'Update check failed', onlineUsersEnabled: 'Enable online users counter', onlineUsersEndpoint: 'Online users endpoint', checkOnline: 'Check online now', usersOnline: 'users online', onlineDisabled: 'Online counter disabled', onlineFailed: 'Online check failed', viewed: 'viewed', viewing: 'still viewing', notViewed: 'not viewed'
  },
  ro: {
    appTitle: 'Favorite YouTube', appSubtitle: 'Favorite YouTube locale, fără subscribe real.',
    add: 'Adaugă', whatsNew: "What's new", channels: 'Canale', settings: 'Setări', markSeen: 'Marchează citite',
    language: 'Limbă', checkEvery: 'Verificare la fiecare minute', videosPerChannel: 'Video-uri per canal', notifications: 'Notificări pentru video-uri noi', saveSettings: 'Salvează setări',
    privacyHint: 'Brave/Chrome poate cere permisiune pentru notificări. Extensia nu folosește contul tău YouTube.',
    placeholder: '@canal, channel ID sau URL YouTube', loadError: 'Eroare la încărcare.', videos: 'video-uri', new: 'noi', noVideos: 'Nu există video-uri încă. Adaugă un canal.',
    checked: 'verificat', remove: 'Șterge', emptyList: 'Lista ta locală de favorite este goală.', deleting: 'Șterg canalul...', removed: 'Canal șters.',
    enterChannel: 'Introdu @handle, channel ID sau URL YouTube.', looking: 'Caut canalul...', exists: 'Canalul exista deja.', added: 'Adăugat', refreshing: 'Verific noutățile...',
    refreshErrors: 'Refresh cu erori', refreshOk: 'Refresh OK. Noi', allSeen: 'Toate marcate ca citite.', saved: 'Setări salvate.', showOverlay: 'Afișează panoul flotant pe YouTube', accessibilityMode: 'Mod accesibilitate / vedere slabă', theaterMode: 'Deschide video-urile în mod cinema', githubRepo: 'Repo GitHub pentru update-uri', githubUpdateCheck: 'Verifică automat update-uri pe GitHub', checkUpdate: 'Verifică update acum', updateAvailable: 'Update disponibil', noUpdate: 'Nu există update disponibil', updateCheckFailed: 'Verificarea update-ului a eșuat', onlineUsersEnabled: 'Activează contor utilizatori online', onlineUsersEndpoint: 'Endpoint utilizatori online', checkOnline: 'Verifică online acum', usersOnline: 'utilizatori online', onlineDisabled: 'Contor online oprit', onlineFailed: 'Verificare online eșuată', viewed: 'viewed', viewing: 'still viewing', notViewed: 'not viewed'
  },
  de: { appTitle: 'YouTube Favoriten', appSubtitle: 'Lokale Kanal-Favoriten, kein echtes YouTube-Abo.', add: 'Hinzufügen', whatsNew: 'Neuigkeiten', channels: 'Kanäle', settings: 'Einstellungen', markSeen: 'Gesehen markieren', language: 'Sprache', checkEvery: 'Prüfen alle Minuten', videosPerChannel: 'Videos pro Kanal', notifications: 'Benachrichtigungen für neue Videos', showOverlay: 'Schwebendes Panel auf YouTube anzeigen', accessibilityMode: 'Barrierefreier Modus / Sehschwäche', theaterMode: 'Videos im Kinomodus öffnen', githubRepo: 'GitHub repo for updates', githubUpdateCheck: 'Check GitHub for updates automatically', checkUpdate: 'Check update now', updateAvailable: 'Update available', noUpdate: 'No update available', updateCheckFailed: 'Update check failed', saveSettings: 'Einstellungen speichern', privacyHint: 'Die Erweiterung nutzt dein YouTube-Konto nicht.', placeholder: '@Kanal, Channel ID oder YouTube URL', loadError: 'Ladefehler.', videos: 'Videos', new: 'neu', noVideos: 'Noch keine Videos. Füge einen Kanal hinzu.', checked: 'geprüft', remove: 'Entfernen', emptyList: 'Deine lokale Favoritenliste ist leer.', deleting: 'Entferne Kanal...', removed: 'Kanal entfernt.', enterChannel: '@Handle, Channel ID oder YouTube URL eingeben.', looking: 'Suche Kanal...', exists: 'Kanal existiert bereits.', added: 'Hinzugefügt', refreshing: 'Prüfe neue Videos...', refreshErrors: 'Refresh mit Fehlern', refreshOk: 'Refresh OK. Neu', allSeen: 'Alle als gesehen markiert.', saved: 'Einstellungen gespeichert.', viewed: 'viewed', viewing: 'still viewing', notViewed: 'not viewed' },
  fr: { appTitle: 'Favoris YouTube', appSubtitle: 'Favoris locaux, sans abonnement YouTube réel.', add: 'Ajouter', whatsNew: 'Nouveautés', channels: 'Chaînes', settings: 'Paramètres', markSeen: 'Marquer vu', language: 'Langue', checkEvery: 'Vérifier toutes les minutes', videosPerChannel: 'Vidéos par chaîne', notifications: 'Notifications pour nouvelles vidéos', showOverlay: 'Afficher le panneau flottant sur YouTube', accessibilityMode: 'Mode accessibilité / basse vision', theaterMode: 'Ouvrir les vidéos en mode cinéma', githubRepo: 'GitHub repo for updates', githubUpdateCheck: 'Check GitHub for updates automatically', checkUpdate: 'Check update now', updateAvailable: 'Update available', noUpdate: 'No update available', updateCheckFailed: 'Update check failed', saveSettings: 'Enregistrer', privacyHint: 'L’extension n’utilise pas votre compte YouTube.', placeholder: '@chaîne, ID ou URL YouTube', loadError: 'Erreur de chargement.', videos: 'vidéos', new: 'nouveau', noVideos: 'Aucune vidéo. Ajoutez une chaîne.', checked: 'vérifié', remove: 'Supprimer', emptyList: 'Votre liste locale est vide.', deleting: 'Suppression...', removed: 'Chaîne supprimée.', enterChannel: 'Entrez @handle, ID ou URL YouTube.', looking: 'Recherche de la chaîne...', exists: 'La chaîne existe déjà.', added: 'Ajouté', refreshing: 'Recherche de nouvelles vidéos...', refreshErrors: 'Actualisation avec erreurs', refreshOk: 'Actualisation OK. Nouveau', allSeen: 'Tout marqué comme vu.', saved: 'Paramètres enregistrés.', viewed: 'viewed', viewing: 'still viewing', notViewed: 'not viewed' },
  es: { appTitle: 'Favoritos de YouTube', appSubtitle: 'Favoritos locales, sin suscripción real.', add: 'Añadir', whatsNew: 'Novedades', channels: 'Canales', settings: 'Ajustes', markSeen: 'Marcar visto', language: 'Idioma', checkEvery: 'Comprobar cada minutos', videosPerChannel: 'Vídeos por canal', notifications: 'Notificaciones para vídeos nuevos', showOverlay: 'Mostrar panel flotante en YouTube', accessibilityMode: 'Modo accesibilidad / baja visión', theaterMode: 'Abrir vídeos en modo cine', githubRepo: 'GitHub repo for updates', githubUpdateCheck: 'Check GitHub for updates automatically', checkUpdate: 'Check update now', updateAvailable: 'Update available', noUpdate: 'No update available', updateCheckFailed: 'Update check failed', saveSettings: 'Guardar ajustes', privacyHint: 'La extensión no usa tu cuenta de YouTube.', placeholder: '@canal, ID o URL de YouTube', loadError: 'Error de carga.', videos: 'vídeos', new: 'nuevo', noVideos: 'No hay vídeos. Añade un canal.', checked: 'comprobado', remove: 'Eliminar', emptyList: 'Tu lista local está vacía.', deleting: 'Eliminando canal...', removed: 'Canal eliminado.', enterChannel: 'Introduce @handle, ID o URL.', looking: 'Buscando canal...', exists: 'El canal ya existe.', added: 'Añadido', refreshing: 'Buscando vídeos nuevos...', refreshErrors: 'Actualización con errores', refreshOk: 'Actualización OK. Nuevo', allSeen: 'Todo marcado como visto.', saved: 'Ajustes guardados.', viewed: 'viewed', viewing: 'still viewing', notViewed: 'not viewed' },
  it: { appTitle: 'Preferiti YouTube', appSubtitle: 'Canali preferiti locali, nessun abbonamento reale.', add: 'Aggiungi', whatsNew: 'Novità', channels: 'Canali', settings: 'Impostazioni', markSeen: 'Segna visto', language: 'Lingua', checkEvery: 'Controlla ogni minuti', videosPerChannel: 'Video per canale', notifications: 'Notifiche per nuovi video', showOverlay: 'Mostra pannello flottante su YouTube', accessibilityMode: 'Modalità accessibilità / vista ridotta', theaterMode: 'Apri i video in modalità cinema', githubRepo: 'GitHub repo for updates', githubUpdateCheck: 'Check GitHub for updates automatically', checkUpdate: 'Check update now', updateAvailable: 'Update available', noUpdate: 'No update available', updateCheckFailed: 'Update check failed', saveSettings: 'Salva impostazioni', privacyHint: 'L’estensione non usa il tuo account YouTube.', placeholder: '@canale, ID o URL YouTube', loadError: 'Errore di caricamento.', videos: 'video', new: 'nuovo', noVideos: 'Nessun video. Aggiungi un canale.', checked: 'controllato', remove: 'Rimuovi', emptyList: 'La lista locale è vuota.', deleting: 'Rimozione canale...', removed: 'Canale rimosso.', enterChannel: 'Inserisci @handle, ID o URL.', looking: 'Cerco il canale...', exists: 'Il canale esiste già.', added: 'Aggiunto', refreshing: 'Controllo nuovi video...', refreshErrors: 'Aggiornamento con errori', refreshOk: 'Aggiornamento OK. Nuovo', allSeen: 'Tutto segnato come visto.', saved: 'Impostazioni salvate.', viewed: 'viewed', viewing: 'still viewing', notViewed: 'not viewed' }
};
const t = k => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;

async function send(type, payload = {}) { return await chrome.runtime.sendMessage({ type, ...payload }); }
function detectLang(setting) {
  if (setting && setting !== 'auto') return setting;
  const l = (navigator.language || 'en').toLowerCase(); if (l.startsWith('ro')) return 'ro'; if (l.startsWith('de')) return 'de'; if (l.startsWith('fr')) return 'fr'; if (l.startsWith('es')) return 'es'; if (l.startsWith('it')) return 'it'; return 'en';
}
function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $('channelInput').placeholder = t('placeholder');
}
function setStatus(text, isError = false) { $('status').textContent = text || ''; $('status').style.color = isError ? '#ff7b72' : '#f0c674'; }

async function load() { state = await send('getState'); lang = detectLang(state.settings?.language); applyI18n(); render(); }
function render() { if (!state?.ok) return setStatus(state?.error || t('loadError'), true); document.body.classList.toggle('accessibility-mode', Boolean(state.settings?.accessibilityMode)); renderVideos(); renderChannels(); renderSettings(); renderOnlineBox(); }
function renderVideos() {
  const seen = new Set(state.seenVideoIds || []); const videos = state.videos || [];
  const newCount = videos.filter(v => !seen.has(v.videoId)).length;
  $('feedCount').textContent = `${videos.length} ${t('videos')} · ${newCount} ${t('new')}`;
  $('videos').innerHTML = videos.length ? videos.map(v => renderVideoCard(v, seen.has(v.videoId))).join('') : `<div class="empty">${t('noVideos')}</div>`;
  document.querySelectorAll('[data-video-id]').forEach(a => a.addEventListener('click', async e => {
    const id = a.getAttribute('data-video-id');
    if (id) await send('markVideoViewing', { videoId: id });
  }));
}
function renderVideoCard(v, isSeen) {
  const status = getVideoStatus(v.videoId);
  const avatar = v.channelAvatarUrl ? `<img class="avatar" src="${escapeAttr(v.channelAvatarUrl)}" alt="">` : `<div class="avatar fallback">${escapeHtml((v.channelTitle || '?').charAt(0).toUpperCase())}</div>`;
  return `<article class="video ${isSeen ? '' : 'unseen'}">
    ${avatar}
    <div class="video-main">
      <a href="${escapeAttr(v.url)}" target="_blank" data-video-id="${escapeAttr(v.videoId)}">${escapeHtml(v.title)}</a>
      <div class="meta">${escapeHtml(v.channelTitle)} · ${formatDate(v.publishedAt)}</div>
      <div class="view-state ${status}">${escapeHtml(statusLabel(status))}</div>
    </div>
  </article>`;
}
function getVideoStatus(videoId) { const status = state.videoStatuses?.[videoId] || 'not_viewed'; return status === 'viewing' ? 'viewing' : status === 'viewed' ? 'viewed' : 'not_viewed'; }
function statusLabel(status) { if (status === 'viewing') return t('viewing'); if (status === 'viewed') return t('viewed'); return t('notViewed'); }
function renderChannels() {
  const channels = state.channels || [];
  $('channelList').innerHTML = channels.length ? channels.map(c => `
    <div class="channel">
      <div>
        <a href="${escapeAttr(c.url)}" target="_blank">${escapeHtml(c.title)}</a>
        <div class="meta">${escapeHtml(c.channelId)}${c.lastCheckedAt ? ' · ' + t('checked') + ' ' + formatDate(c.lastCheckedAt) : ''}</div>
      </div>
      <button data-remove="${escapeAttr(c.channelId)}">${t('remove')}</button>
    </div>`).join('') : `<div class="empty">${t('emptyList')}</div>`;
  document.querySelectorAll('[data-remove]').forEach(btn => btn.addEventListener('click', async () => {
    setStatus(t('deleting')); const res = await send('removeChannel', { channelId: btn.getAttribute('data-remove') });
    if (!res.ok) return setStatus(res.error, true); await load(); setStatus(t('removed'));
  }));
}
function renderSettings() {
  $('language').value = state.settings?.language || 'auto'; $('checkMinutes').value = state.settings?.checkMinutes || 30;
  $('maxVideos').value = state.settings?.maxVideosPerChannel || 8; $('notify').checked = Boolean(state.settings?.notify); $('showOverlay').checked = state.settings?.showOverlayOnYouTube !== false; $('accessibilityMode').checked = Boolean(state.settings?.accessibilityMode); $('theaterMode').checked = Boolean(state.settings?.theaterMode); $('githubRepo').value = state.settings?.githubRepo || ''; $('githubUpdateCheck').checked = Boolean(state.settings?.githubUpdateCheck); $('onlineUsersEnabled').checked = Boolean(state.settings?.onlineUsersEnabled); $('onlineUsersEndpoint').value = state.settings?.onlineUsersEndpoint || '';
}
function bind() {
  $('addBtn').addEventListener('click', addChannel); $('channelInput').addEventListener('keydown', e => { if (e.key === 'Enter') addChannel(); });
  $('refreshBtn').addEventListener('click', refresh); $('markSeenBtn').addEventListener('click', markSeen); $('saveSettingsBtn').addEventListener('click', saveSettings); $('checkUpdateBtn').addEventListener('click', checkUpdate); $('checkOnlineBtn').addEventListener('click', checkOnline);
  $('language').addEventListener('change', () => { lang = detectLang($('language').value); applyI18n(); renderVideos(); renderChannels(); });
  document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
    document.querySelectorAll('.tab,.panel').forEach(x => x.classList.remove('active')); tab.classList.add('active'); $(tab.dataset.tab).classList.add('active');
  }));
}
async function addChannel() {
  const input = $('channelInput').value.trim(); if (!input) return setStatus(t('enterChannel'), true);
  setStatus(t('looking')); const res = await send('addChannel', { input }); if (!res.ok) return setStatus(res.error, true);
  $('channelInput').value = ''; await load(); setStatus(res.duplicate ? t('exists') : `${t('added')}: ${res.channel.title}`);
}
async function refresh() { setStatus(t('refreshing')); const res = await send('refresh'); if (!res.ok) return setStatus(res.error, true); await load(); setStatus(res.errors?.length ? `${t('refreshErrors')}: ${res.errors.join(' | ')}` : `${t('refreshOk')}: ${res.newCount}`); }
async function markSeen() { const res = await send('markAllSeen'); if (!res.ok) return setStatus(res.error, true); await load(); setStatus(t('allSeen')); }
async function saveSettings() {
  const settings = { language: $('language').value, checkMinutes: Number($('checkMinutes').value || 30), maxVideosPerChannel: Number($('maxVideos').value || 8), notify: $('notify').checked, showOverlayOnYouTube: $('showOverlay').checked, accessibilityMode: $('accessibilityMode').checked, theaterMode: $('theaterMode').checked, githubRepo: $('githubRepo').value.trim(), githubUpdateCheck: $('githubUpdateCheck').checked, onlineUsersEnabled: $('onlineUsersEnabled').checked, onlineUsersEndpoint: $('onlineUsersEndpoint').value.trim() };
  const res = await send('saveSettings', { settings }); if (!res.ok) return setStatus(res.error, true); await load(); setStatus(t('saved'));
}

async function checkUpdate() {
  setStatus('Checking GitHub...');
  const saveRes = await send('saveSettings', { settings: { githubRepo: $('githubRepo').value.trim(), githubUpdateCheck: $('githubUpdateCheck').checked, onlineUsersEnabled: $('onlineUsersEnabled').checked, onlineUsersEndpoint: $('onlineUsersEndpoint').value.trim() } });
  if (!saveRes.ok) return setStatus(saveRes.error, true);
  const res = await send('checkGitHubUpdate');
  if (!res.ok) return setStatus(`${t('updateCheckFailed')}: ${res.error}`, true);
  await load();
  if (res.hasUpdate) {
    setStatus(`${t('updateAvailable')}: v${res.latestVersion} · ${res.downloadUrl || res.releaseUrl}`);
  } else {
    setStatus(`${t('noUpdate')}. Current: v${res.currentVersion}${res.latestVersion ? ' · Latest: v' + res.latestVersion : ''}`);
  }
}

function renderOnlineBox() {
  const box = $('onlineUsersBox');
  if (!box) return;
  const enabled = Boolean(state.settings?.onlineUsersEnabled && state.settings?.onlineUsersEndpoint);
  if (!enabled) {
    box.textContent = t('onlineDisabled');
    return;
  }
  const stats = state.onlineStats || {};
  if (Number.isFinite(Number(stats.onlineUsers))) {
    const total = Number.isFinite(Number(stats.totalUsers)) && Number(stats.totalUsers) > 0 ? ` · total ${Number(stats.totalUsers)}` : '';
    box.textContent = `${Number(stats.onlineUsers)} ${t('usersOnline')}${total}${stats.checkedAt ? ' · ' + formatDate(stats.checkedAt) : ''}`;
  } else if (stats.error) {
    box.textContent = `${t('onlineFailed')}: ${stats.error}`;
  } else {
    box.textContent = t('onlineDisabled');
  }
}

async function checkOnline() {
  const saveRes = await send('saveSettings', { settings: { onlineUsersEnabled: $('onlineUsersEnabled').checked, onlineUsersEndpoint: $('onlineUsersEndpoint').value.trim() } });
  if (!saveRes.ok) return setStatus(saveRes.error, true);
  setStatus('Checking online users...');
  const res = await send('onlineHeartbeat');
  await load();
  if (!res.ok) return setStatus(`${t('onlineFailed')}: ${res.error || 'disabled'}`, true);
  setStatus(`${Number(res.onlineUsers || 0)} ${t('usersOnline')}`);
}

function formatDate(value) { if (!value) return ''; const d = new Date(value); return Number.isNaN(d.getTime()) ? value : d.toLocaleString(lang === 'ro' ? 'ro-RO' : lang === 'de' ? 'de-DE' : lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : lang === 'it' ? 'it-IT' : 'en-US'); }
function escapeHtml(s) { return String(s || '').replace(/[&<>'"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c])); }
function escapeAttr(s) { return escapeHtml(s); }
bind(); load();
