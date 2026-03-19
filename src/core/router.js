/**
 * Duay Global Trade Company — info@duaycor.com
 * src/core/router.js — Dinamik Sayfa Yükleyici
 * v15.3.0 / 2025-03-20 09:00
 *
 * Anayasa 01: Her sayfa ayrı dosya (pages/*.html)
 * Anayasa 03: Sadece değişen DOM güncellenir
 * Anayasa 04: Global hata yakalama entegre
 */
'use strict';

const Router = (function () {

  const PAGES_BASE = 'pages/';
  const CONTAINER  = 'page-container';
  const _cache     = {};
  const _handlers  = {};
  let _current     = null;
  let _previous    = null;
  let _loading     = false;

  function _setNavActive(pageId) {
    document.querySelectorAll('.ni').forEach(n => {
      n.classList.toggle('active', n.dataset.p === pageId);
    });
  }

  function _showLoading() {
    const c = document.getElementById(CONTAINER);
    if (!c) return;
    if (!document.getElementById('router-spin-style')) {
      const st = document.createElement('style');
      st.id = 'router-spin-style';
      st.textContent = '@keyframes spin{to{transform:rotate(360deg)}}';
      document.head.appendChild(st);
    }
    c.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;' +
      'min-height:300px;color:var(--ink3);font-size:13px;gap:10px">' +
      '<div style="width:20px;height:20px;border:2px solid var(--bdr);' +
      'border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite"></div>' +
      'Yükleniyor...</div>';
  }

  function _injectPage(html, pageId) {
    const c = document.getElementById(CONTAINER);
    if (!c) return;
    const tmp     = document.createElement('div');
    tmp.innerHTML = html;
    const section = tmp.querySelector('[data-page="' + pageId + '"]') || tmp.firstElementChild;
    if (!section) return;
    section.classList.add('active');
    section.style.animation = 'pgIn .2s ease';
    // Anayasa 03: innerHTML='' yerine replaceChildren
    c.innerHTML = '';
    c.appendChild(section);
  }

  function _tryInlineFallback(pageId) {
    const el = document.getElementById('page-' + pageId);
    if (!el) return false;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    return true;
  }

  function _updateHash(pageId) {
    if (typeof history !== 'undefined') {
      history.replaceState(null, '', '#' + pageId);
    }
  }

  return {

    register(pageId, fn) {
      _handlers[pageId] = fn;
    },

    current()  { return _current;  },
    previous() { return _previous; },

    async go(pageId, force) {
      if (_loading) return;
      if (pageId === _current && !force) return;

      _loading  = true;
      _previous = _current;
      _current  = pageId;

      _setNavActive(pageId);
      _showLoading();

      let html = (!force) ? _cache[pageId] : null;

      if (!html) {
        try {
          const resp = await fetch(PAGES_BASE + pageId + '.html', {
            cache: force ? 'no-cache' : 'default',
          });
          if (!resp.ok) throw new Error('HTTP ' + resp.status);
          html = await resp.text();
          _cache[pageId] = html;
        } catch (err) {
          console.warn('[Router] fetch failed "' + pageId + '":', err.message);
          const c = document.getElementById(CONTAINER);
          if (c) c.innerHTML = '';

          if (_tryInlineFallback(pageId)) {
            if (_handlers[pageId]) {
              try { _handlers[pageId](); } catch(e) { console.error(e); }
            }
            _loading = false;
            _updateHash(pageId);
            return;
          }

          const c2 = document.getElementById(CONTAINER);
          if (c2) {
            c2.innerHTML =
              '<div class="page active" style="padding:48px;text-align:center">' +
              '<div style="font-size:32px;margin-bottom:12px">⚠️</div>' +
              '<div style="font-family:\'Instrument Serif\',serif;font-size:20px;' +
              'color:var(--ink);margin-bottom:8px">Sayfa yüklenemedi</div>' +
              '<div style="color:var(--ink3);font-size:13px">' + pageId + '.html — ' + err.message + '</div>' +
              '<button class="btn btn-out btn-sm" style="margin-top:16px" ' +
              'onclick="Router.go(\'' + pageId + '\',true)">⟳ Tekrar Dene</button></div>';
          }
          _loading = false;
          return;
        }
      }

      _injectPage(html, pageId);

      if (_handlers[pageId]) {
        try {
          await new Promise(r => setTimeout(r, 0));
          _handlers[pageId]();
        } catch (e) {
          console.error('[Router] render error "' + pageId + '":', e);
        }
      }

      _updateHash(pageId);

      if (window.innerWidth <= 920) {
        var sb = document.getElementById('sidebar');
        if (sb) sb.classList.remove('mob-open');
      }

      _loading = false;
    },

    async initFromHash() {
      const hash   = location.hash.slice(1);
      const target = (hash && _handlers[hash]) ? hash : 'dashboard';
      await this.go(target);
    },

    async prefetchAll(pageIds) {
      for (const id of pageIds) {
        if (!_cache[id]) {
          try {
            const r = await fetch(PAGES_BASE + id + '.html');
            if (r.ok) _cache[id] = await r.text();
          } catch { /* sessiz */ }
        }
      }
    },

    clearCache(pageId) {
      if (pageId) delete _cache[pageId];
      else Object.keys(_cache).forEach(k => delete _cache[k]);
    },

    cacheReport() {
      return Object.entries(_cache).map(([k, v]) => ({
        page: k, size: Math.round(v.length / 1024) + 'KB',
      }));
    },
  };

})();

if (typeof window !== 'undefined') window.Router = Router;
if (typeof module !== 'undefined') module.exports = Router;
