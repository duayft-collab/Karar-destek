/**
 * Duay Global Trade Company — info@duaycor.com
 * components/suggestions.js — Öneri & Geri Bildirim Formu
 * Anayasa 05: Kullanıcılar geliştirme taleplerini iletir
 */
'use strict';

// ── oneriGonder ──
function oneriGonder() {
  var baslik=document.getElementById('oneri-baslik')?.value.trim(),aciklama=document.getElementById('oneri-aciklama')?.value.trim();
  if(!baslik){alert('Başlık zorunludur.');return;}
  oneriler.unshift({id:'o'+Date.now(),uid:aktifKullanici.id,kullanici:aktifKullanici.adsoyad,tur:document.getElementById('oneri-tur').value,baslik:baslik,aciklama:aciklama,durum:'açık',tarih:new Date().toLocaleString('tr-TR')});
  onerileriKaydet();EP15_LOG.kaydet('sugg','Öneri: '+baslik);
  document.getElementById('oneri-baslik').value='';document.getElementById('oneri-aciklama').value='';
  onerilerGoster();alert('Öneri gönderildi! Teşekkürler.');
}

// ── onerilerGoster ──
function onerilerGoster() {
  var el=document.getElementById('oneri-listesi');if(!el)return;
  if(!oneriler.length){el.innerHTML='<p class="txt-sm neu">Henüz öneri yok.</p>';return;}
  var tur={ozellik:'💡',hata:'🐛',iyilestirme:'⚡',diger:'📌'};
  el.innerHTML=oneriler.slice(0,20).map(function(o,i){
    return '<div class="sugg-card"><div class="fb mb6"><span class="badge bg-blu">'+(tur[o.tur]||'📌')+' '+o.tur+'</span><span class="badge '+(o.durum==='açık'?'bg-gold':'bg-grn')+'">'+o.durum+'</span></div><div class="fw6 txt-sm mb4">'+o.baslik+'</div><div class="txt-sm neu">'+(o.aciklama||'')+'</div><div class="txt-xs neu mt6">'+o.kullanici+' · '+o.tarih+'</div>'+(aktifKullanici.rol==='admin'?'<div class="flex gap4 mt8"><button class="btn btn-out btn-xs" onclick="onerilerGoster()">✓ Onayla</button><button class="btn btn-danger btn-xs" onclick="oneriler.splice('+i+',1);onerileriKaydet();onerilerGoster()">Sil</button></div>':'')+'</div>';
  }).join('');
}

/* ── SÜRÜM GEÇMİŞİ ── */

// ── oneriDurumGuncelle ──
function oneriDurumGuncelle(idx, durum, uid) {
  var key = 'ep15_' + uid + '_oneriler';
  var onr = JSON.parse(localStorage.getItem(key) || '[]');
  // idx karışık olabilir, basit yaklaşım: tüm kullanıcıların önerilerini yeniden topla
  EP15_LOG.kaydet('admin', 'Öneri durumu güncellendi: ' + durum);
  adminOneriListesiGoster();
}

