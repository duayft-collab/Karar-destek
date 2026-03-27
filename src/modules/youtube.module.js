/**
 * Strategy Hub — src/modules/youtube.module.js
 * YouTube özetlerini tracker repo'dan çeker ve görüntüler
 * Anayasa: K04, K07 (cache), K12
 * Versiyon: 5.5.0 | 2026-03-27
 */

'use strict';
import { Store }  from '../core/store.js';
import { Logger } from '../core/logger.js';

// ── BURAYA KENDİ TRACKER REPO URL'İNİ YAZ ──────────────────────────
// Örnek: https://raw.githubusercontent.com/KULLANICI/youtube-tracker/main/data/summaries.json
const SUMMARIES_URL = Store.get('yt_summaries_url')
  || 'https://raw.githubusercontent.com/duayft-collab/youtube-tracker/main/data/summaries.json';

const CACHE_KEY = 'yt_summaries';
const CACHE_TTL = 30 * 60 * 1000; // 30 dakika

function _esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

let _allVideos = [];
let _activeFilter = 'all';

/* ── VERİ ÇEKME ──────────────────────────────────────────────────────── */
async function loadSummaries() {
  // Cache kontrolü
  const cached = Store.get(CACHE_KEY);
  if (cached && Date.now() - new Date(cached.ts).getTime() < CACHE_TTL) {
    _allVideos = cached.videos;
    renderVideos();
    _updateMeta(cached.generated_at, true);
    return;
  }

  try {
    const res  = await fetch(SUMMARIES_URL + '?t=' + Date.now());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    _allVideos = data.videos || [];
    Store.set(CACHE_KEY, { videos: _allVideos, generated_at: data.generated_at, ts: new Date().toISOString() });
    renderVideos();
    _updateMeta(data.generated_at, false);
    Logger.info('YT_SUMMARIES_LOADED', { count: _allVideos.length });
  } catch(e) {
    Logger.warn('YT_SUMMARIES_FAILED', { message: e.message });
    _showSetup();
  }
}

function _updateMeta(generatedAt, fromCache) {
  const el = document.getElementById('yt-meta');
  if (!el || !generatedAt) return;
  const d = new Date(generatedAt);
  el.textContent = `Son güncelleme: ${d.toLocaleString('tr-TR')}${fromCache ? ' (cache)' : ''}`;
}

/* ── FİLTRELER ───────────────────────────────────────────────────────── */
function renderFilters() {
  const el = document.getElementById('yt-filters');
  if (!el) return;

  const categories = ['Tümü', ...new Set(_allVideos.map(v => v.category).filter(Boolean))];
  const channels   = [...new Set(_allVideos.map(v => v.channel).filter(Boolean))];

  el.innerHTML = categories.map(c => {
    const val = c === 'Tümü' ? 'all' : c;
    const act = _activeFilter === val;
    return `<button onclick="YouTubeModule.setFilter('${val}')"
      style="padding:3px 11px;border-radius:20px;font-size:10px;font-weight:700;cursor:pointer;border:1px solid var(--sidebar-border);
      background:${act ? 'var(--accent)' : 'var(--bg3)'};color:${act ? '#fff' : 'var(--text2)'};transition:all .15s">
      ${_esc(c)}
    </button>`;
  }).join('');
}

function setFilter(f) {
  _activeFilter = f;
  renderFilters();
  renderVideos();
}

/* ── VİDEO LİSTESİ ──────────────────────────────────────────────────── */
function renderVideos() {
  document.getElementById('yt-loading')?.style && (document.getElementById('yt-loading').style.display = 'none');

  const list = document.getElementById('yt-list');
  if (!list) return;

  let videos = _allVideos;
  if (_activeFilter !== 'all') {
    videos = videos.filter(v => v.category === _activeFilter);
  }

  renderFilters();

  if (!videos.length) {
    document.getElementById('yt-empty').style.display = 'block';
    list.innerHTML = '';
    return;
  }

  document.getElementById('yt-empty').style.display = 'none';
  list.innerHTML = videos.map(v => _renderCard(v)).join('');
}

function _renderCard(v) {
  const bullets  = (v.bullets || []).map(b => `<li style="margin-bottom:4px">${_esc(b)}</li>`).join('');
  const quotes   = (v.quotes  || []).filter(q => q).map(q => `
    <div style="padding:8px 12px;margin-bottom:5px;border-left:3px solid var(--accent);background:rgba(37,99,235,.04);border-radius:0 6px 6px 0;font-size:11px;font-style:italic;color:var(--text2);line-height:1.5">
      "${_esc(q)}"
    </div>`).join('');
  const tags     = (v.tags || []).map(t => `<span class="bdg nt" style="font-size:9px">${_esc(t)}</span>`).join(' ');
  const transcriptBadge = v.has_transcript
    ? '<span class="bdg up" style="font-size:9px">Transcript</span>'
    : '<span class="bdg wn" style="font-size:9px">Açıklama</span>';

  return `
  <div style="padding:16px;background:var(--bg3);border-radius:12px;border:1px solid var(--sidebar-border);margin-bottom:12px">
    <!-- Üst satır: thumbnail + başlık -->
    <div style="display:flex;gap:12px;margin-bottom:12px">
      ${v.thumbnail ? `<a href="${_esc(v.url)}" target="_blank" rel="noopener" style="flex-shrink:0">
        <img src="${_esc(v.thumbnail)}" style="width:120px;height:68px;border-radius:6px;object-fit:cover;display:block" loading="lazy">
      </a>` : ''}
      <div style="flex:1;min-width:0">
        <a href="${_esc(v.url)}" target="_blank" rel="noopener" style="text-decoration:none">
          <div style="font-size:13px;font-weight:700;color:var(--text);line-height:1.35;margin-bottom:4px">${_esc(v.title)}</div>
        </a>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
          <span style="font-size:10px;font-weight:700;color:var(--accent)">${_esc(v.channel)}</span>
          <span style="font-size:10px;color:var(--text3)">·</span>
          <span style="font-size:10px;color:var(--text3)">${_esc(v.published_tr || '')}</span>
          <span style="font-size:10px;color:var(--text3)">·</span>
          ${transcriptBadge}
        </div>
      </div>
    </div>

    <!-- Özet -->
    ${v.summary ? `<div style="font-size:12px;color:var(--text2);line-height:1.65;margin-bottom:10px;padding:10px 12px;background:var(--bg2);border-radius:8px">${_esc(v.summary)}</div>` : ''}

    <!-- 5 Madde -->
    ${bullets ? `<ul style="padding-left:18px;margin-bottom:10px;font-size:11px;color:var(--text2);line-height:1.6">${bullets}</ul>` : ''}

    <!-- Anahtar Alıntılar -->
    ${quotes ? `<div style="margin-bottom:10px">${quotes}</div>` : ''}

    <!-- Alt satır: etiketler + buton -->
    <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px">
      <div style="display:flex;gap:4px;flex-wrap:wrap">${tags}</div>
      <a href="${_esc(v.url)}" target="_blank" rel="noopener"
        style="display:inline-flex;align-items:center;gap:5px;padding:6px 14px;background:var(--accent);color:#fff;border-radius:8px;font-size:11px;font-weight:700;text-decoration:none">
        Videoyu İzle →
      </a>
    </div>
  </div>`;
}

function _showSetup() {
  document.getElementById('yt-loading').style.display = 'none';
  document.getElementById('yt-empty').style.display   = 'block';
  document.getElementById('yt-setup').style.display   = 'block';
}

/* ── URL GÜNCELLEME ──────────────────────────────────────────────────── */
function setUrl(url) {
  Store.set('yt_summaries_url', url);
  UI.toast('URL kaydedildi. Sayfa yenileniyor…', 'success');
  setTimeout(() => location.reload(), 1000);
}

/* ── BAŞLATMA ────────────────────────────────────────────────────────── */
async function init() {
  await loadSummaries();
  // 30 dakikada bir yenile
  setInterval(() => { if (!document.hidden) loadSummaries(); }, 30 * 60 * 1000);
  Logger.info('YOUTUBE_MODULE_INIT');
}

export const YouTubeModule = { init, setFilter, setUrl, loadSummaries };
window.YouTubeModule = YouTubeModule;
