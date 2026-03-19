/**
 * Duay Global Trade Company — info@duaycor.com
 * utils.js — Yardımcı Fonksiyonlar & Veri Yönetimi
 * Anayasa 03: Sabit sürüm bağımlılıkları, veri şeması koruması
 */
'use strict';

// ── Global Durum Değişkenleri ──────────────────────────────
var mulkler = [], kiralar = [], odemeler = [], aktiviteler = [], oneriler = [], duyurular = [];
var grafikler = {}, calYil = new Date().getFullYear(), calAy = new Date().getMonth();
var duzenMulkIdx = -1;
var kurlar = { USD: 33, EUR: 36, GOLD: 2700, SILVER: 440, TRY: 1 };
var aktifKullanici = null;

// ── fTL ──
function fTL(n) { if (!n && n !== 0) return '—'; return Math.round(n).toLocaleString('tr-TR') + ' ₺'; }
// ── fYzd ──
function fYzd(n) { return (n >= 0 ? '+' : '') + n.toFixed(1) + '%'; }
// ── cfHesapla ──
function cfHesapla(m) { var kira=m.kira||0, bosluk=kira*((m.bosluk||5)/100), vergim=(m.vergi||0)/12, gider=vergim+(m.bakim||0)+(m.yonetim||0)+bosluk, borc=m.taksit||0; return { kira:kira, gider:gider, borc:borc, net:kira-gider-borc, noi:kira-gider }; }
// ── capRate ──
function capRate(m) { var cf=cfHesapla(m), cv=m.guncelDeger||m.alisFiyati; return cv>0?(cf.noi*12/cv)*100:0; }
// ── roeHesapla ──
function roeHesapla(m) { var cf=cfHesapla(m), ozsermaye=(m.guncelDeger||m.alisFiyati)-(m.kredi||0); return ozsermaye>0?(cf.net*12/ozsermaye)*100:0; }
// ── ltvHesapla ──
function ltvHesapla(m) { var cv=m.guncelDeger||m.alisFiyati; return cv>0?((m.kredi||0)/cv)*100:0; }
// ── grmHesapla ──
function grmHesapla(m) { return m.kira>0?((m.guncelDeger||m.alisFiyati)/(m.kira*12)).toFixed(1):'—'; }
// ── gerDon ──
function gerDon(m) { var cf=cfHesapla(m); if(cf.net<=0) return '∞'; return ((m.alisFiyati+(m.masraf||0))/(cf.net*12)).toFixed(1)+' yıl'; }
// ── dscrHesapla ──
function dscrHesapla(m) { var cf=cfHesapla(m), yd=(m.taksit||0)*12; if(!yd) return '—'; return (cf.noi*12/yd).toFixed(2); }
// ── tlCevir ──
function tlCevir(miktar, kur) { return miktar * (kurlar[kur] || 1); }
/* ── CANLI KUR ── */
// ── grafik ──
function grafik(id, tip, veri, ayarlar) {
  ayarlar = ayarlar || {};
  if (grafikler[id]) grafikler[id].destroy();
  var c = document.getElementById(id); if (!c) return;
  grafikler[id] = new Chart(c, { type: tip, data: veri, options: Object.assign({ responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { font: { family: 'Inter', size: 10 }, boxWidth: 8 } } } }, ayarlar) });
}

/* ── MODAL ── */
// ── kurGuncelle ──
function kurGuncelle() {
  // Manuel değiştirildi — chip güncelle yeter
  kurlar.USD  = parseFloat(document.getElementById('kur-usd')?.value)   || kurlar.USD;
  kurlar.EUR  = parseFloat(document.getElementById('kur-eur')?.value)   || kurlar.EUR;
  kurlar.GOLD = parseFloat(document.getElementById('kur-altin')?.value) || kurlar.GOLD;
  kurChipGuncelle();
}
// ── kurChipGuncelle ──
function kurChipGuncelle() {
  var e;
  e = document.getElementById('rc-usd');    if(e) e.textContent = kurlar.USD.toFixed(2);
  e = document.getElementById('rc-eur');    if(e) e.textContent = kurlar.EUR.toFixed(2);
  e = document.getElementById('rc-gold');   if(e) e.textContent = kurlar.GOLD.toLocaleString('tr-TR');
  e = document.getElementById('rc-silver'); if(e) e.textContent = kurlar.SILVER ? kurlar.SILVER.toFixed(0) : '—';
  // AI sayfasındaki input'ları da güncelle
  var uu = document.getElementById('kur-usd');    if(uu) uu.value = kurlar.USD.toFixed(2);
  var eu = document.getElementById('kur-eur');    if(eu) eu.value = kurlar.EUR.toFixed(2);
  var gu = document.getElementById('kur-altin');  if(gu) gu.value = Math.round(kurlar.GOLD);
  // Kredi sayfası inputları
  var ku = document.getElementById('k-usd');   if(ku && !ku._touched) ku.value = kurlar.USD.toFixed(2);
  var ka = document.getElementById('k-altin'); if(ka && !ka._touched) ka.value = Math.round(kurlar.GOLD);
}
// ── canliKurCek ──
function canliKurCek() {
  var zaman = document.getElementById('rc-time');
  if(zaman) zaman.textContent = '⟳';

  // exchangerate-api.com ücretsiz endpoint (CORS açık)
  fetch('https://api.exchangerate-api.com/v4/latest/USD')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      if(d && d.rates) {
        var tryRate = d.rates['TRY'] || 33;
        var eurRate = d.rates['EUR'] || 0.92;
        kurlar.USD = tryRate;
        kurlar.EUR = tryRate / eurRate;
        // Altın: USD fiyatını TL'ye çevir (sabit USD baz kullan, sonra güncel kur ile çarp)
        return fetch('https://api.exchangerate-api.com/v4/latest/XAU');
      }
    })
    .then(function(r){ if(r) return r.json(); })
    .then(function(d) {
      if(d && d.rates && d.rates['TRY']) {
        kurlar.GOLD = d.rates['TRY'];
      } else if(d && d.rates && d.rates['USD']) {
        // 1 ons altın USD cinsinden, gram = ons/31.1, TRY'ye çevir
        kurlar.GOLD = Math.round((d.rates['USD'] > 1 ? 1/d.rates['USD'] : d.rates['USD']) / 31.1035 * kurlar.USD * 1000) / 1000;
      }
    })
    .catch(function(){})
    .then(function() {
      // Gümüş tahmini (altının ~1/80'i genellikle)
      kurlar.SILVER = Math.round(kurlar.GOLD / 75);
      kurChipGuncelle();
      var now = new Date();
      var saat = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
      if(zaman) zaman.textContent = saat;
    });
}
// ── uk ──
function uk(k) { return 'ep15_' + aktifKullanici.id + '_' + k; }
// ── kayitGoster ──
function kayitGoster() { var e = document.getElementById('sinf'); if (e) e.textContent = '✓ ' + new Date().toLocaleTimeString('tr-TR', {hour:'2-digit', minute:'2-digit'}) + ' kaydedildi'; }

/* log() artık EP15_LOG.kaydet() */

/* ── DUYURULAR ── */
// ── veriYukle ──
function veriYukle() {
  mulkler     = JSON.parse(localStorage.getItem(uk('mulkler'))    || '[]');
  kiralar     = JSON.parse(localStorage.getItem(uk('kiralar'))    || '[]');
  odemeler    = JSON.parse(localStorage.getItem(uk('odemeler'))   || '[]');
  aktiviteler = JSON.parse(localStorage.getItem(uk('aktivite'))   || '[]');
  oneriler    = JSON.parse(localStorage.getItem(uk('oneriler'))   || '[]');
}
// ── mulkleriKaydet ──
function mulkleriKaydet()  { localStorage.setItem(uk('mulkler'),  JSON.stringify(mulkler));  bildirimleriOlustur(); kayitGoster(); }
// ── kiralariKaydet ──
function kiralariKaydet()  { localStorage.setItem(uk('kiralar'),  JSON.stringify(kiralar));  }
// ── odemeleriKaydet ──
function odemeleriKaydet() { localStorage.setItem(uk('odemeler'), JSON.stringify(odemeler)); }
// ── onerileriKaydet ──
function onerileriKaydet() { localStorage.setItem(uk('oneriler'), JSON.stringify(oneriler)); }
// ── expExcel ──
function expExcel(){var wb=XLSX.utils.book_new();var d=[['Mülk','Tür','Konum','Alan','Alış ₺','Güncel ₺','Kira','Net CF','Cap Rate%','GRM']];mulkler.forEach(function(m){var cf=cfHesapla(m);d.push([m.ad,m.tur,m.konum||'',m.alan||'',Math.round(m.alisFiyati),Math.round(m.guncelDeger||m.alisFiyati),m.kira||0,Math.round(cf.net),capRate(m).toFixed(1),grmHesapla(m)]);});XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(d),'Portföy');XLSX.writeFile(wb,'EmlakPro_V14.xlsx');}
// ── expJSON ──
function expJSON(){var a=document.createElement('a');a.href='data:application/json;charset=utf-8,'+encodeURIComponent(JSON.stringify({mulkler:mulkler,kiralar:kiralar,odemeler:odemeler,versiyon:'V14.0',tarih:new Date().toISOString()},null,2));a.download='EmlakPro_V14_'+new Date().toLocaleDateString('tr-TR').replace(/\./g,'-')+'.json';a.click();}
// ── expPDF ──
function expPDF(){var jsPDF=window.jspdf?.jsPDF;if(!jsPDF){alert('PDF kütüphanesi yüklenmedi.');return;}var doc=new jsPDF();doc.setFontSize(16);doc.text('Emlak Pro V14',14,18);doc.setFontSize(9);doc.setTextColor(150);doc.text(aktifKullanici.adsoyad+' · '+new Date().toLocaleDateString('tr-TR'),14,26);doc.setTextColor(0);if(mulkler.length)doc.autoTable({startY:32,head:[['Mülk','Tür','Alış','Güncel','Cap Rate%','CF/ay']],body:mulkler.map(function(m){var cf=cfHesapla(m);return[m.ad,m.tur,Math.round(m.alisFiyati).toLocaleString(),Math.round(m.guncelDeger||m.alisFiyati).toLocaleString(),capRate(m).toFixed(1)+'%',Math.round(cf.net).toLocaleString()];}),headStyles:{fillColor:[26,24,20]},styles:{fontSize:8}});doc.save('EmlakPro_V14.pdf');}

/* ── İPUÇLARI ── */
var ipuclari=[{t:'"Net Cash Flow önceliklidir!"',a:'Robert Kiyosaki'},{t:'"Cap Rate %5+ = sağlıklı yatırım."',a:'Emlak Pro'},{t:'"GRM 120 altı = iyi fırsat."',a:'Gayrimenkul Analisti'},{t:'"DSCR 1.25+ = banka onayı."',a:'Mortgage Uzmanı'},{t:'"5 yıl = vergisiz satış."',a:'Vergi Danışmanı'},{t:'"OPM: kiracı borcunuzu ödüyor."',a:'Kiyosaki'}];
var ipIdx=0;
// ── impJSON ──
function impJSON(ev){var f=ev.target.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){try{var d=JSON.parse(e.target.result);if(d.mulkler)mulkler=d.mulkler;if(d.kiralar)kiralar=d.kiralar;if(d.odemeler)odemeler=d.odemeler;mulkleriKaydet();dashboardGoster();portfoyGoster();EP15_LOG.kaydet('prop','JSON yüklendi: '+mulkler.length+' mülk');alert('Yüklendi: '+mulkler.length+' mülk');}catch(e){alert('Hata: '+e.message);}};r.readAsText(f);ev.target.value='';}
// ── bildirimleriOlustur ──
function bildirimleriOlustur() {
  var uyarilar=[];
  var bugun=new Date();bugun.setHours(0,0,0,0);
  kiralar.forEach(function(r){var m=mulkler[r.mulkIdx];if(!m)return;var b=new Date(r.baslangic||Date.now());b.setFullYear(b.getFullYear()+1);var fark=Math.round((b-bugun)/(864e5));if(fark<=30&&fark>=0)uyarilar.push({ico:'🔑',baslik:'Sözleşme Bitiyor',aciklama:m.ad+': '+fark+' gün'});});
  odemeler.forEach(function(o){var d=new Date(o.tarih);d.setHours(0,0,0,0);if(d<bugun&&o.durum!=='paid')uyarilar.push({ico:'💸',baslik:'Gecikmiş Ödeme',aciklama:o.baslik});});
  mulkler.forEach(function(m){if(cfHesapla(m).net<-5000)uyarilar.push({ico:'📉',baslik:'Negatif Nakit Akışı',aciklama:m.ad+': '+fTL(cfHesapla(m).net)+'/ay'});});
  annBadge=duyurular.filter(function(d){return d.kapatanlar.indexOf(aktifKullanici.id)===-1;}).length;
  if(annBadge>0)uyarilar.unshift({ico:'📢',baslik:'Yeni Duyuru',aciklama:annBadge+' okunmamış'});
  var nl=document.getElementById('n-list'),nd=document.getElementById('ndot'),nc=document.getElementById('n-count');
  if(!uyarilar.length){if(nl)nl.innerHTML='<div style="padding:18px;text-align:center;color:var(--ink3);font-size:13px">✓ Bildirim yok</div>';if(nd)nd.style.display='none';if(nc)nc.textContent='';}
  else{if(nd)nd.style.display='block';if(nc)nc.textContent=uyarilar.length+' yeni';if(nl)nl.innerHTML=uyarilar.map(function(u){return '<div class="ni-item"><div style="font-size:16px">'+u.ico+'</div><div><p class="txt-sm fw6">'+u.baslik+'</p><p class="txt-xs neu">'+u.aciklama+'</p></div></div>';}).join('');}
  navOlustur();
}
// ── notifToggle ──
function notifToggle(){document.getElementById('npanel')?.classList.toggle('open');}
document.addEventListener('click',function(e){var np=document.getElementById('npanel'),nb=document.getElementById('notif-btn');if(np&&nb&&np.classList.contains('open')&&!np.contains(e.target)&&!nb.contains(e.target))np.classList.remove('open');});

/* ── EXPORT / IMPORT ── */
// ── ipucuDondur ──
function ipucuDondur(){var ip=ipuclari[ipIdx%ipuclari.length];var s=document.getElementById('tip-txt'),a=document.getElementById('tip-auth');if(s)s.textContent=ip.t;if(a)a.textContent='— '+ip.a;ipIdx++;}
setInterval(function(){if(document.getElementById('app-screen').style.display==='block')ipucuDondur();},8000);

/* ── KLAVYE ── */
document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){document.querySelectorAll('.overlay.open').forEach(function(m){m.classList.remove('open');});document.getElementById('ann-overlay').classList.remove('open');}
  if((e.ctrlKey||e.metaKey)&&e.key==='n'&&document.getElementById('app-screen').style.display==='block'){e.preventDefault();mulkModalAc();}
});

