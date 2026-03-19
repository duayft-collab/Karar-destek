/**
 * Duay Global Trade Company — info@duaycor.com
 * ─────────────────────────────────────────────
 * error-handler.js — Merkezi Hata Yönetimi
 *
 * Anayasa Kural 04:
 *   - Tüm işlemler için merkezi hata yakalama
 *   - Kullanıcıya anlamlı Toast/Alert mesajları
 *   - Offline-first dayanıklılık
 */

'use strict';

const ErrorHandler = (function () {

  // Toast sırası
  const _queue = [];
  let   _showing = false;

  function _createToast(message, type = 'error', duration = 4000) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:9999;
      background:${type === 'error' ? 'var(--redbg)' : type === 'success' ? 'var(--grnbg)' : type === 'warning' ? 'var(--goldbg)' : 'var(--blubg)'};
      border:1px solid ${type === 'error' ? 'rgba(192,57,43,.3)' : type === 'success' ? 'rgba(26,122,74,.3)' : type === 'warning' ? 'rgba(184,137,58,.3)' : 'rgba(29,95,168,.3)'};
      color:${type === 'error' ? 'var(--red)' : type === 'success' ? 'var(--grn)' : type === 'warning' ? 'var(--gold)' : 'var(--blu)'};
      padding:12px 18px;border-radius:10px;font-size:13px;font-weight:600;
      font-family:'Inter',sans-serif;max-width:360px;line-height:1.5;
      box-shadow:0 4px 20px rgba(0,0,0,.12);
      animation:toastIn .2s ease;
    `;

    const ico = { error: '⚠️', success: '✅', warning: '⚡', info: 'ℹ️' }[type] || '📌';
    el.textContent = `${ico} ${message}`;

    // Toast animasyonu (CSS inject)
    if (!document.getElementById('toast-style')) {
      const style = document.createElement('style');
      style.id = 'toast-style';
      style.textContent = '@keyframes toastIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}';
      document.head.appendChild(style);
    }

    return { el, duration };
  }

  function _showNext() {
    if (!_queue.length) { _showing = false; return; }
    _showing = true;
    const { el, duration } = _queue.shift();
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'all .2s ease';
      setTimeout(() => { el.remove(); _showNext(); }, 200);
    }, duration);
  }

  return {

    /**
     * Toast bildirimi göster
     * @param {string} message
     * @param {'error'|'success'|'warning'|'info'} type
     * @param {number} duration  ms
     */
    show(message, type = 'error', duration = 4000) {
      const toast = _createToast(message, type, duration);
      _queue.push(toast);
      if (!_showing) _showNext();
    },

    /** Başarı mesajı */
    success(msg, dur) { this.show(msg, 'success', dur || 3000); },

    /** Uyarı */
    warning(msg, dur) { this.show(msg, 'warning', dur || 4000); },

    /** Bilgi */
    info(msg, dur)    { this.show(msg, 'info', dur || 3000); },

    /**
     * Global hata yakalayıcı (Anayasa 04)
     * Uygulama başlangıcında bir kez çağrılır
     */
    init() {
      window.onerror = (msg, src, line, col, err) => {
        console.error('[GlobalError]', msg, src, line, col, err);
        this.show(`Sistem hatası: ${msg}`, 'error', 5000);
        // Hata logunu kaydet
        if (typeof LogModule !== 'undefined' && window.aktifKullanici) {
          LogModule.kaydet('error', `JS Error: ${msg} (${src}:${line})`, { src, line, col });
        }
        return false; // tarayıcı default hatayı da göstersin
      };

      window.addEventListener('unhandledrejection', e => {
        console.error('[UnhandledPromise]', e.reason);
        this.show('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.', 'error');
      });

      // Anayasa 04: Offline algılama
      window.addEventListener('offline', () => {
        this.warning('İnternet bağlantısı kesildi. Çevrimdışı modda çalışılıyor.', 6000);
      });
      window.addEventListener('online', () => {
        this.success('Bağlantı yeniden kuruldu.', 3000);
      });
    },

    /**
     * Async işlemleri güvenli wrap et
     * @param {Function} fn   async fonksiyon
     * @param {string}   [errMsg]
     */
    async wrap(fn, errMsg) {
      try {
        return await fn();
      } catch (e) {
        console.error('[ErrorHandler.wrap]', e);
        this.show(errMsg || e.message || 'İşlem başarısız.', 'error');
        return null;
      }
    },
  };

})();

if (typeof window !== 'undefined') window.ErrorHandler = ErrorHandler;
if (typeof module !== 'undefined') module.exports = ErrorHandler;
