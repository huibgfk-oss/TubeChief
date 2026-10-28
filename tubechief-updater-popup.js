// TubeChief update panel (no remote executable code).
(() => {
  const releaseHome = 'https://github.com/huibgfk-oss/TubeChief/releases';
  const s = (tag, text) => { const e = document.createElement(tag); if (text) e.textContent = text; return e; };
  const ro = (navigator.language || '').toLowerCase().startsWith('ro');
  const t = (r, en) => ro ? r : en;
  const settings = document.getElementById('settings');
  if (!settings || document.getElementById('tubechiefUpdates')) return;
  const box = s('div'); box.id = 'tubechiefUpdates';
  Object.assign(box.style, { marginTop:'15px', padding:'12px', borderTop:'1px solid #555',
    borderRadius:'10px', background:'#1d1d1d', color:'#eee', lineHeight:'1.5' });
  const title = s('h3', t('Actualizări TubeChief', 'TubeChief updates'));
  Object.assign(title.style, { margin:'0 0 8px', fontSize:'15px' });
  const line = s('p', t('Se verifică actualizările…', 'Checking updates…'));
  Object.assign(line.style, { margin:'0 0 8px', fontSize:'12px', overflowWrap:'anywhere' });
  const row = s('div'); Object.assign(row.style, { display:'flex', gap:'6px', flexWrap:'wrap' });
  const check = s('button', t('Verifică acum', 'Check now'));
  const action = s('button', ''); action.hidden = true;
  const prefs = s('label'); Object.assign(prefs.style, { display:'flex', alignItems:'center', gap:'7px', marginTop:'10px', fontSize:'12px' });
  const notify = document.createElement('input'); notify.type = 'checkbox';
  prefs.append(notify, document.createTextNode(t('Anunță automat versiuni noi', 'Notify me about new releases')));
  const hint = s('p', t('Instalarea automată se face doar când Edge acceptă actualizarea semnată. Pentru Load unpacked, este necesară reîncărcarea manuală.',
    'Automatic installation works only when Edge accepts the signed update. Unpacked extensions require manual reloading.'));
  Object.assign(hint.style, { fontSize:'11px', opacity:'0.78', margin:'7px 0 0' });
  row.append(check, action); box.append(title, line, row, prefs, hint); settings.appendChild(box);
  let last = null;
  async function send(type, extra = {}) { return chrome.runtime.sendMessage({ type, ...extra }); }
  async function show() {
    try {
      const data = await send('tubechiefUpdateStatus');
      if (!data?.ok) throw new Error(data?.error || 'No updater status');
      last = data; notify.checked = Boolean(data.notificationsEnabled);
      const when = data.checkedAt ? new Date(data.checkedAt).toLocaleString() : t('niciodată', 'never');
      const version = data.ready ? data.readyVersion : data.latest;
      if (data.ready) {
        line.textContent = t(`Instalat: ${data.installed} · ${version} descărcată, pregătită pentru aplicare.`,
          `Installed: ${data.installed} · ${version} downloaded and ready to apply.`);
        action.textContent = t('Aplică acum', 'Apply now'); action.hidden = false;
      } else if (data.updateAvailable) {
        line.textContent = t(`Instalat: ${data.installed} · Versiune nouă: ${version}.`,
          `Installed: ${data.installed} · New release: ${version}.`);
        action.textContent = t('Vezi versiunea', 'View release'); action.hidden = false;
      } else {
        line.textContent = t(`Versiunea instalată: ${data.installed}. Ultima verificare: ${when}.`,
          `Installed version: ${data.installed}. Last checked: ${when}.`);
        action.hidden = true;
      }
      if (data.error === 'no_release') line.textContent += t(' Nu există încă release-uri publicate.', ' No public release is published yet.');
      else if (data.error) line.textContent += ` (${data.error})`;
    } catch (err) { line.textContent = t('Actualizările nu au putut fi verificate: ', 'Unable to check updates: ') + String(err.message || err); }
  }
  check.addEventListener('click', async () => {
    check.disabled = true; line.textContent = t('Verific GitHub…', 'Checking GitHub…');
    try { await send('tubechiefUpdateCheck'); } catch (_) {}
    check.disabled = false; await show();
  });
  notify.addEventListener('change', async () => {
    try { await send('tubechiefUpdateNotifications', { enabled: notify.checked }); } catch (_) {}
    await show();
  });
  action.addEventListener('click', async () => {
    if (!last) return;
    if (last.ready) { const r = await send('tubechiefUpdateApply'); if (!r?.ok) { line.textContent = r?.error || 'Update not ready'; await show(); } return; }
    chrome.tabs.create({ url: /^https:\/\/github\.com\/huibgfk-oss\/TubeChief\/releases/.test(last.latestUrl || '')
      ? last.latestUrl : releaseHome });
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.tubechiefUpdaterStateV1) show();
  });
  show();
})();
