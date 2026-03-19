/**
 * Duay Global Trade Company — info@duaycor.com
 * components/nav.js — Navigasyon & Tema Yönetimi
 */
'use strict';

// ── Nav Konfigürasyonu ──
var NAV = [
  { grp: { tr: 'Genel', en: 'Overview' }, items: [
    { p: 'dashboard', ico: '🏠', lbl: 'Dashboard' },
    { p: 'cashflow',  ico: '💰', lbl: 'Nakit Akışı' },
  ]},
  { grp: { tr: 'Portföy', en: 'Portfolio' }, items: [
    { p: 'portfolio', ico: '📋', lbl: 'Portföy' },
    { p: 'mortgage',  ico: '🏦', lbl: 'Kredi Analizi' },
    { p: 'ai',        ico: '🤖', lbl: 'AI Analiz', badge: 'AI' },
  ]},
  { grp: { tr: 'Kira', en: 'Rental' }, items: [
    { p: 'rental',   ico: '🔑', lbl: 'Kira & Kiracı' },
    { p: 'calendar', ico: '🗓', lbl: 'Takvim' },
    { p: 'lease',    ico: '📄', lbl: 'Sözleşme' },
  ]},
  { grp: { tr: 'Analiz', en: 'Analysis' }, items: [
    { p: 'piyasa',        ico: '🌍', lbl: 'Piyasa İstihbaratı' },
    { p: 'bilgi-bankasi', ico: '📚', lbl: 'Bilgi Bankası' },
  ]},
  { grp: { tr: 'Sistem', en: 'System' }, items: [
    { p: 'announcements', ico: '📢', lbl: 'Duyurular', badge: 'ann' },
    { p: 'suggestions',   ico: '💡', lbl: 'Öneriler' },
    { p: 'versions',      ico: '🔖', lbl: 'Sürüm Geçmişi' },
    { p: 'activity',      ico: '📊', lbl: 'Aktivite' },
  ]},
  { grp: { tr: 'Yönetim', en: 'Admin' }, items: [
    { p: 'admin', ico: '⚙️', lbl: 'Admin Panel', adminOnly: true },
  ]},
];

var annBadge = 0;

// ── navOlustur ──
function navOlustur() {
  var html = '';
  NAV.forEach(function(grp) {
    var items = grp.items.filter(function(it) { return !it.adminOnly || aktifKullanici.rol === 'admin'; });
    if (!items.length) return;
    html += '<div class="nlbl">' + grp.grp + '</div>';
    items.forEach(function(it) {
      var badge = it.badge === 'AI' ? '<span class="nbadge">AI</span>' : (it.badge === 'ann' && annBadge > 0 ? '<span class="nbadge">' + annBadge + '</span>' : '');
      html += '<div class="ni" data-p="' + it.p + '" onclick="sayfaGit(\'' + it.p + '\')"><div class="ni-ico">' + it.ico + '</div>' + it.lbl + badge + '</div>';
    });
  });
  document.getElementById('main-nav').innerHTML = html;
  var aktif = document.querySelector('.page.active');
  if (aktif) {
    var id = aktif.id.replace('page-', '');
    var ni = document.querySelector('.ni[data-p="' + id + '"]');
    if (ni) ni.classList.add('active');
  }
}

// ── sayfaGit ──
function sayfaGit(sayfa) {
  document.querySelectorAll('.ni').forEach(function(x) { x.classList.remove('active'); });
  document.querySelectorAll('.page').forEach(function(x) { x.classList.remove('active'); });
  var ni = document.querySelector('.ni[data-p="' + sayfa + '"]');
  if (ni) ni.classList.add('active');
  var pg = document.getElementById('page-' + sayfa);
  if (pg) pg.classList.add('active');
  var fonk = { dashboard: dashboardGoster, cashflow: nakitAkisiGoster, portfolio: portfoyGoster, rental: kiraGoster, calendar: takvimGoster, activity: aktiviteGoster, admin: adminGoster, announcements: duyuruListesiGoster, suggestions: onerilerGoster, versions: surumGecmisiGoster, mortgage: krediHesapla };
  if (fonk[sayfa]) fonk[sayfa]();
  if (window.innerWidth <= 920) document.getElementById('sidebar').classList.remove('mob-open');
}

// ── sbToggle ──
function sbToggle() { document.getElementById('sidebar').classList.toggle('mob-open'); }

/* ── HESAPLAMA / FORMAT ── */

// ── temaToggle ──
function temaToggle() {
  var d = document.documentElement;
  var karanlik = d.getAttribute('data-theme') === 'dark';
  d.setAttribute('data-theme', karanlik ? 'light' : 'dark');
  localStorage.setItem('ep15_tema', karanlik ? 'light' : 'dark');
  document.getElementById('tema-btn').textContent = karanlik ? '🌙' : '☀️';
  document.getElementById('login-tema-btn').textContent = karanlik ? '🌙' : '☀️';
}
(function() {
  var t = localStorage.getItem('ep15_tema');
  if (t) {
    document.documentElement.setAttribute('data-theme', t);
    var dark = t === 'dark';
    document.getElementById('tema-btn').textContent = dark ? '☀️' : '🌙';
    document.getElementById('login-tema-btn').textContent = dark ? '☀️' : '🌙';
  }
})();

/* ── VERİ ── */
var mulkler = [], kiralar = [], odemeler = [], aktiviteler = [], oneriler = [], duyurular = [];
var grafikler = {}, calYil = new Date().getFullYear(), calAy = new Date().getMonth();
var duzenMulkIdx = -1;
var kurlar = { USD: 33, EUR: 36, GOLD: 2700, TRY: 1 };

// ── modalKapat ──
function modalKapat(id) { var el = document.getElementById(id); if (el) el.classList.remove('open'); }

