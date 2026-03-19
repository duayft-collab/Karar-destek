/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/activity.js — Aktivite Kaydı Görüntüleme
 */
'use strict';

// ── aktiviteGoster ──
function aktiviteGoster() {
  EP15_LOG.renderListe('aktiv-listesi', {
    q: document.getElementById('aktiv-ara')?.value || '',
    tip: document.getElementById('aktiv-tip')?.value || '',
    adminView: false
  });
}

/* ── ADMIN ── */
