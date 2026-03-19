/**
 * Duay Global Trade Company — info@duaycor.com
 * components/announcements.js — Duyuru & Güncelleme Sistemi
 * Anayasa 05: 24 saatlik bilgi mesajları
 */
'use strict';

var duyurular = [];

// ── duyuruYukle ──
function duyuruYukle() {
  // EP15_ANNOUNCE init edildiğinde zaten yüklüyor
  duyuruListesiGoster();
}

// ── bekleyenDuyuru ──
function bekleyenDuyuru() {
  EP15_ANNOUNCE.bekleyenleriGoster(aktifKullanici, 'tr');
}

// ── annKapat ──
function annKapat(sonra) {
  EP15_ANNOUNCE.kapat(aktifKullanici.id, sonra);
}

// ── duyuruListesiGoster ──
function duyuruListesiGoster() {
  EP15_ANNOUNCE.renderListe('ann-listesi', 'tr', false);
}

// ── duyuruYayinla ──
function duyuruYayinla() {
  var btr = document.getElementById('duyuru-baslik')?.value.trim();
  var ben = document.getElementById('duyuru-baslik-en')?.value.trim();
  var itr = document.getElementById('duyuru-icerik')?.value.trim();
  var ien = document.getElementById('duyuru-icerik-en')?.value.trim();
  var rol = document.getElementById('duyuru-rol')?.value || 'all';
  if (!btr || !itr) { alert('TR başlık ve içerik zorunludur.'); return; }
  EP15_ANNOUNCE.yayinla(btr, ben||btr, itr, ien||itr, rol);
  EP15_LOG.kaydet('admin', 'Duyuru yayınlandı: ' + btr);
  alert('Duyuru yayınlandı!');
  ['duyuru-baslik','duyuru-baslik-en','duyuru-icerik','duyuru-icerik-en'].forEach(function(id){
    var e = document.getElementById(id); if(e) e.value='';
  });
  EP15_ANNOUNCE.renderListe('adm-duyuru-listesi', 'tr', true);
}

/* ── NAV ── */

