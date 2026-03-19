/**
 * Duay Global Trade Company — info@duaycor.com
 * ─────────────────────────────────────────────
 * logger.js — Kullanıcı Aktivite Log Sistemi
 *
 * Anayasa Kural 05:
 *   Giriş, veri silme, güncelleme gibi tüm hareketler
 *   tarih ve UID ile kaydedilir. Milisaniye hassasiyeti.
 *
 * Log şeması:
 *   { id, uid, kullanici, rol, tip, aciklama, detay, zaman }
 */

'use strict';

const LogModule = (function () {

  const PREFIX = 'ep15_log_';
  const MAX_PER_USER = 500;
  const MAX_GLOBAL   = 2500;

  // ── İkon & Renk Haritası ──────────────────────────────────
  const TIP_ICO = {
    login:    '🔑',
    logout:   '↩',
    prop:     '🏠',
    pay:      '💰',
    kira:     '🔑',
    ai:       '🤖',
    admin:    '⚙️',
    sugg:     '💡',
    update:   '✏️',
    delete:   '🗑',
    create:   '➕',
    export:   '📤',
    import:   '📥',
    error:    '⚠️',
  };

  const TIP_RENK = {
    login:  'bg-grn',
    logout: 'bg-ink',
    prop:   'bg-blu',
    pay:    'bg-gold',
    ai:     'bg-pur',
    admin:  'bg-red',
    delete: 'bg-red',
    error:  'bg-red',
  };

  // ── Zaman Damgası ──────────────────────────────────────────
  function _ts() {
    const n = new Date();
    const pad = x => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())} ` +
           `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}.${String(n.getMilliseconds()).padStart(3, '0')}`;
  }

  // ── Yardımcı ──────────────────────────────────────────────
  function _getKey(uid)    { return PREFIX + uid; }
  function _getGlobalKey() { return PREFIX + 'global'; }

  function _read(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); }
    catch { return []; }
  }

  function _write(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); }
    catch (e) { console.warn('[LogModule] Write error:', e); }
  }

  // ── Public API ─────────────────────────────────────────────
  return {

    /**
     * Log kaydı oluştur (Anayasa 05)
     * @param {string} tip       login|logout|prop|pay|ai|admin|sugg|delete|update|create
     * @param {string} aciklama  İnsan okunabilir mesaj
     * @param {*}      [detay]   Ek veri (eski/yeni değer)
     */
    kaydet(tip, aciklama, detay = null) {
      if (!window.aktifKullanici) return;

      const entry = {
        id:        Date.now(),
        uid:       aktifKullanici.id,
        kullanici: aktifKullanici.adsoyad,
        rol:       aktifKullanici.rol,
        tip,
        aciklama,
        detay,
        zaman:     _ts(),
      };

      // Kişisel log
      const pKey = _getKey(aktifKullanici.id);
      const pLog = _read(pKey);
      pLog.unshift(entry);
      _write(pKey, pLog.slice(0, MAX_PER_USER));

      // Global log (admin görür)
      const gKey = _getGlobalKey();
      const gLog = _read(gKey);
      gLog.unshift(entry);
      _write(gKey, gLog.slice(0, MAX_GLOBAL));
    },

    /** Kişisel logları getir */
    getOwn(uid) { return _read(_getKey(uid)); },

    /** Global logları getir (admin) */
    getGlobal() { return _read(_getGlobalKey()); },

    /**
     * Log listesini render et
     * @param {string} elId      Hedef container ID
     * @param {Object} opts      { q, tip, userId, adminView }
     */
    render(elId, opts = {}) {
      const el = document.getElementById(elId);
      if (!el) return;

      let liste = opts.adminView
        ? this.getGlobal()
        : this.getOwn(aktifKullanici.id);

      // Filtrele
      if (opts.q) {
        const q = opts.q.toLowerCase();
        liste = liste.filter(l =>
          (l.aciklama || '').toLowerCase().includes(q) ||
          (l.kullanici || '').toLowerCase().includes(q)
        );
      }
      if (opts.tip)    liste = liste.filter(l => l.tip === opts.tip);
      if (opts.userId) liste = liste.filter(l => l.uid === opts.userId);

      if (!liste.length) {
        el.innerHTML = '<p class="txt-sm neu" style="padding:16px">Log bulunamadı.</p>';
        return;
      }

      // Anayasa 03: DocumentFragment — innerHTML = '' yasak
      const fragment = document.createDocumentFragment();
      liste.slice(0, 200).forEach(a => {
        const row = document.createElement('div');
        row.className = 'act-row';
        row.innerHTML = `
          <div style="width:28px;height:28px;border-radius:7px;background:var(--surf3);
               display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">
            ${TIP_ICO[a.tip] || '📌'}
          </div>
          <div style="flex:1;min-width:0">
            <div class="fw6 txt-sm">${a.aciklama || ''}</div>
            <div style="display:flex;gap:8px;align-items:center;margin-top:2px">
              ${opts.adminView
                ? `<span class="badge ${TIP_RENK[a.tip] || 'bg-ink'}" style="font-size:9px">${a.kullanici || '?'}</span>`
                : ''}
              <span class="txt-xs neu" style="font-variant-numeric:tabular-nums">${a.zaman}</span>
            </div>
          </div>`;
        fragment.appendChild(row);
      });

      el.innerHTML = '';
      el.appendChild(fragment);
    },

    /**
     * Logları CSV olarak dışa aktar
     * Anayasa 05: İzlenebilirlik
     */
    exportCSV() {
      const logs  = this.getGlobal();
      const rows  = [['Kullanıcı', 'UID', 'Rol', 'İşlem', 'Açıklama', 'Zaman']];
      logs.forEach(l => {
        rows.push([
          `"${l.kullanici || ''}"`,
          l.uid || '',
          l.rol  || '',
          l.tip  || '',
          `"${(l.aciklama || '').replace(/"/g, "'")}"`,
          l.zaman || '',
        ]);
      });
      const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `EmlakPro_Log_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    },
  };

})();

if (typeof window !== 'undefined') window.LogModule = LogModule;
if (typeof module !== 'undefined') module.exports = LogModule;
