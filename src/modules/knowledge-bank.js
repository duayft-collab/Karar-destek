/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/knowledge-bank.js — Bilgi Bankası
 * Kitaplar, Özlü Sözler, Yatırım İlkeleri
 */
'use strict';

var BB_KEY    = 'ep15_bilgi_bankasi';
var BB_FILTRE = 'hepsi';

// ── bbYukle ──
function bbYukle() {
  var saved = localStorage.getItem(BB_KEY);
  if (!saved) {
    localStorage.setItem(BB_KEY, JSON.stringify(BB_VARSAYILAN));
    return BB_VARSAYILAN;
  }
  return JSON.parse(saved);
}

// ── bbKaydet ──
function bbKaydet(liste) {
  localStorage.setItem(BB_KEY, JSON.stringify(liste));
}

// ── bilgiBankasiGoster ──
function bilgiBankasiGoster() {
  var liste = bbYukle();
  var q = (document.getElementById('bilgi-ara').value || '').toLowerCase();

  var filtrelenmis = liste.filter(function(b) {
    if (BB_FILTRE !== 'hepsi' && b.kat !== BB_FILTRE) return false;
    if (q) {
      var metin = (b.icerik + ' ' + b.yazar + ' ' + b.eser + ' ' + (b.etiket||[]).join(' ')).toLowerCase();
      return metin.includes(q);
    }
    return true;
  });

  // Gunun sozu
  var sozler = liste.filter(function(b){ return b.kat==='sozler'||b.kat==='ilkeler'; });
  if (sozler.length) {
    var idx2 = new Date().getDate() % sozler.length;
    var gs = sozler[idx2];
    var gsEl = document.getElementById('gunun-sozu');
    var gsYazar = document.getElementById('gunun-sozu-yazar');
    if (gsEl) gsEl.textContent = gs.icerik;
    if (gsYazar) gsYazar.textContent = '— ' + gs.yazar + (gs.eser ? ' · ' + gs.eser : '');
  }

  var el = document.getElementById('bilgi-listesi');
  if (!el) return;
  if (!filtrelenmis.length) {
    el.innerHTML = '<div class="card" style="grid-column:1/-1;text-align:center;padding:40px;color:var(--ink3)">Sonuc bulunamadi.</div>';
    return;
  }

  var KAT_RENK = {sozler:'bg-gold', kitaplar:'bg-blu', ilkeler:'bg-grn', ipuclari:'bg-pur'};
  var KAT_ICO  = {sozler:'💬', kitaplar:'📖', ilkeler:'🎯', ipuclari:'💡'};
  var KAT_LBL  = {sozler:'Ozlu Soz', kitaplar:'Kitap', ilkeler:'Yatirim Ilkesi', ipuclari:'Ipucu'};

  el.innerHTML = filtrelenmis.map(function(b, i) {
    var isItalic = b.kat === 'sozler';
    var fontStyle = isItalic ? 'font-style:italic;font-family:\'Instrument Serif\',serif;font-size:15px' : '';
    var etiketHTML = (b.etiket && b.etiket.length)
      ? '<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:10px">' +
          b.etiket.map(function(t){ return '<span class="badge bg-ink" style="font-size:9px">#'+t+'</span>'; }).join('') +
        '</div>'
      : '';
    var adminBtn = (aktifKullanici && aktifKullanici.rol === 'admin')
      ? '<button class="btn btn-danger btn-xs" onclick="bilgiSil(\'' + b.id + '\')">✕</button>'
      : '';
    var kaynak = (b.yazar || b.eser)
      ? '<div class="txt-sm" style="color:var(--gold);font-weight:700">— ' + (b.yazar||'') +
          (b.eser ? ' <span style="color:var(--ink3);font-weight:400">· ' + b.eser + '</span>' : '') +
        '</div>'
      : '';

    return '<div class="card">' +
      '<div class="fb mb8">' +
        '<span class="badge ' + (KAT_RENK[b.kat]||'bg-ink') + '">' + (KAT_ICO[b.kat]||'📌') + ' ' + (KAT_LBL[b.kat]||b.kat) + '</span>' +
        adminBtn +
      '</div>' +
      '<div style="font-size:13.5px;color:var(--ink);line-height:1.7;margin-bottom:10px;' + fontStyle + '">' + b.icerik + '</div>' +
      kaynak +
      etiketHTML +
    '</div>';
  }).join('');
}

// ── bilgiFiltre ──
function bilgiFiltre(filtre, el) {
  BB_FILTRE = filtre;
  document.querySelectorAll('#bilgi-tabs .tab').forEach(function(t){t.classList.remove('active');});
  if (el) el.classList.add('active');
  bilgiBankasiGoster();
}

// ── bilgiEkleModal ──
function bilgiEkleModal() {
  document.getElementById('bilgi-modal').classList.add('open');
}

// ── bilgiKaydet ──
function bilgiKaydet() {
  var icerik = document.getElementById('bilgi-icerik').value.trim();
  var yazar  = document.getElementById('bilgi-yazar').value.trim();
  if (!icerik) { alert('İçerik zorunludur.'); return; }
  var liste = bbYukle();
  var etiketler = (document.getElementById('bilgi-etiket').value || '').split(',').map(function(t){return t.trim();}).filter(Boolean);
  liste.unshift({
    id: 'bb-' + Date.now(),
    kat: document.getElementById('bilgi-kategori').value,
    icerik: icerik,
    yazar: yazar,
    eser: document.getElementById('bilgi-eser').value.trim(),
    etiket: etiketler,
    tarih: new Date().toLocaleDateString('tr-TR'),
    ekleyen: aktifKullanici.adsoyad
  });
  bbKaydet(liste);
  EP15_LOG.kaydet('sugg', 'Bilgi bankasına eklendi: ' + icerik.slice(0,50));
  modalKapat('bilgi-modal');
  ['bilgi-icerik','bilgi-yazar','bilgi-eser','bilgi-etiket'].forEach(function(id){
    var e = document.getElementById(id); if(e) e.value='';
  });
  bilgiBankasiGoster();
  alert('Bilgi bankasına eklendi!');
}

// ── bilgiSil ──
function bilgiSil(id) {
  if (!confirm('Bu kayıt silinecek?')) return;
  var liste = bbYukle().filter(function(b){return b.id!==id;});
  bbKaydet(liste);
  bilgiBankasiGoster();
}

/* Sidebar ipuçlarını bilgi bankasından doldur */

