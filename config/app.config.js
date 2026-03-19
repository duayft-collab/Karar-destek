/**
 * Duay Global Trade Company
 * info@duaycor.com
 * ─────────────────────────────────────────
 * app.config.js — Merkezi Uygulama Konfigürasyonu
 * Anayasa Kural 07: Statik versiyonlama zorunlu
 */

'use strict';

const APP_CONFIG = {
  // ── Şirket Bilgileri ──────────────────────────────────────
  company: {
    name:    'Duay Global Trade Company',
    email:   'info@duaycor.com',
    website: 'https://duaycor.com',
  },

  // ── Versiyon (Anayasa 07: FORMAT v[No] / YYYY-MM-DD SS:DD) ─
  version: {
    number:    'v15.3.0',
    buildDate: '2025-03-20 09:00',          // statik — deploy anında güncellenir
    display:   'v15.3.0 / 2025-03-20 09:00',
  },

  // ── Uygulama Bilgileri ────────────────────────────────────
  app: {
    name:        'Emlak Pro',
    description: { tr: 'Gayrimenkul Yönetim Sistemi', en: 'Real Estate Management System' },
    defaultLang: 'tr',
    supportedLangs: ['tr', 'en'],
  },

  // ── Güvenlik (Anayasa 02) ─────────────────────────────────
  security: {
    sessionKey:      'ep_session_v15',
    langKey:         'ep_lang_v15',
    themeKey:        'ep_theme_v15',
    tokenExpireHours: 72,
  },

  // ── Bağımlılıklar — Sabit sürüm (Anayasa 03) ─────────────
  dependencies: {
    chartjs:       'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
    xlsx:          'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',
    jspdf:         'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    jspdfAutoTable:'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.28/jspdf.plugin.autotable.min.js',
    fonts:         'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap',
  },
};

// Dondur — runtime değişikliği yasak (Anayasa 03)
Object.freeze(APP_CONFIG);
Object.freeze(APP_CONFIG.version);
Object.freeze(APP_CONFIG.security);

if (typeof module !== 'undefined') module.exports = APP_CONFIG;
