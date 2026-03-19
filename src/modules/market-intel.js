/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/market-intel.js — Piyasa İstihbaratı
 * AI destekli yerel & global gayrimenkul analizi
 */
'use strict';

var piyasaGecmisAnalizler = (function(){
  try { return JSON.parse(localStorage.getItem('ep15_piyasa_gecmis') || '[]'); }
  catch { return []; }
})();

// ── piyasaGoster ──
function piyasaGoster() {
  piyasaKPIGoster();
  piyasaGecmisGoster();
  if (!piyasaGecmisAnalizler.length) {
    piyasaHaberlerYukle();
  }
}

// ── piyasaKPIGoster ──
function piyasaKPIGoster() {
  var el = document.getElementById('piyasa-kpi');
  if (!el) return;
  var kpiData = [
    {lbl:'USD/TRY', val:kurlar.USD.toFixed(2), ico:'💵', renk:'var(--blu)'},
    {lbl:'EUR/TRY', val:kurlar.EUR.toFixed(2), ico:'💶', renk:'var(--pur)'},
    {lbl:'Altın (₺/gr)', val:Math.round(kurlar.GOLD).toLocaleString('tr-TR'), ico:'🥇', renk:'var(--gold)'},
    {lbl:'Portföy Değeri', val:fTL(mulkler.reduce(function(s,m){return s+(m.guncelDeger||m.alisFiyati);},0)), ico:'🏛', renk:'var(--grn)'},
  ];
  el.innerHTML = kpiData.map(function(k) {
    return '<div class="sc"><div class="sc-top"><div class="sc-lbl">' + k.lbl + '</div><div style="font-size:16px">' + k.ico + '</div></div>' +
      '<div style="font-family:Inter,sans-serif;font-size:19px;font-weight:700;color:' + k.renk + '">' + k.val + '</div></div>';
  }).join('');
}

// ── piyasaHaberlerYukle ──
function piyasaHaberlerYukle() {
  var el = document.getElementById('piyasa-haberler');
  if (el) el.innerHTML = '<div class="txt-sm neu" style="padding:12px">Analiz bekleniyor...</div>';
}

// ── piyasaYenile ──
function piyasaYenile() {
  var sehir = document.getElementById('piyasa-sehir').value || 'Istanbul';
  var odak  = document.getElementById('piyasa-odak').value || 'Konut';
  var btn   = document.querySelector('[onclick="piyasaYenile()"]');
  if (btn) { btn.disabled=true; btn.textContent='Analiz ediliyor...'; }

  var sonucEl = document.getElementById('piyasa-analiz-sonuc');
  var yukEl   = document.getElementById('piyasa-analiz-yukleniyor');
  if (yukEl) yukEl.style.display = 'block';
  if (sonucEl) sonucEl.style.display = 'none';

  var portfoy = mulkler.length
    ? mulkler.map(function(m,i){ var cf=cfHesapla(m); return (i+1)+'. '+m.ad+'('+m.tur+'): '+fTL(m.guncelDeger||m.alisFiyati)+' CF:'+fTL(cf.net)+'/ay Cap:'+capRate(m).toFixed(1)+'%'; }).join(' | ')
    : 'Portfoy bos.';

  var soru = "Turkiye gayrimenkul piyasasi uzmanisin. Asagidaki konulari kapsamli analiz et:\n\n" +
    "1. TURKIYE MAKRO: Enflasyon, faiz, doviz ve " + odak + " piyasasina etkisi\n" +
    "2. " + sehir.toUpperCase() + " GAYRIMENKUL: Fiyat trendleri, arz/talep, firsatlar\n" +
    "3. GLOBAL ETKILER: Fed, kuresel enflasyon, sermaye akislari\n" +
    "4. SEKTOR - " + odak.toUpperCase() + ": Ozel degerlendirme, 6-12 ay trend tahmini\n" +
    "5. PORTFOY ETKISI:\n" + portfoy + "\n\n" +
    "6. 3 SOMUT TAVSIYE: Al / Sat / Bekle - gerekceli\n\n" +
    "Analizi Turkce yap. Tarih: " + new Date().toLocaleDateString('tr-TR');

  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: 'Sen Turkiye gayrimenkul piyasasinda uzman bir analist ve ekonomistsin.',
      messages: [{role:'user', content: soru}]
    })
  })
  .then(function(r){ return r.json(); })
  .then(function(data){
    var metin = (data.content||[]).filter(function(b){return b.type==='text';}).map(function(b){return b.text;}).join('') || 'API yanit vermedi.';
    var formatli = metin.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');

    if (yukEl) yukEl.style.display = 'none';
    if (sonucEl) {
      sonucEl.innerHTML = '<div class="ai-resp" style="line-height:1.8">' + formatli + '</div>' +
        '<div class="txt-xs neu mt12">' + new Date().toLocaleString('tr-TR') + ' | ' + sehir + ' | ' + odak + '</div>';
      sonucEl.style.display = 'block';
    }

    var etki = document.getElementById('piyasa-portfolyo-etki');
    if (etki) etki.innerHTML = '<div class="txt-sm" style="color:var(--ink2)">Analiz tamamlandi. <strong>' + mulkler.length + ' mulk</strong> icin gecerli.</div>';

    piyasaGecmisAnalizler.unshift({
      tarih: new Date().toLocaleString('tr-TR'),
      sehir: sehir, odak: odak,
      ozet: metin.slice(0, 200) + '...'
    });
    if (piyasaGecmisAnalizler.length > 10) piyasaGecmisAnalizler.pop();
    localStorage.setItem('ep15_piyasa_gecmis', JSON.stringify(piyasaGecmisAnalizler));
    piyasaGecmisGoster();
    EP15_LOG.kaydet('ai', 'Piyasa analizi: ' + sehir + ' / ' + odak);
  })
  .catch(function() {
    if (yukEl) yukEl.style.display = 'none';
    if (sonucEl) { sonucEl.innerHTML = '<div class="alert al-err">API baglanti hatasi.</div>'; sonucEl.style.display='block'; }
  })
  .then(function() {
    if (btn) { btn.disabled=false; btn.textContent='\u27F3 Guncelle'; }
  });
}

// ── piyasaGecmisGoster ──
function piyasaGecmisGoster() {
  var el = document.getElementById('piyasa-gecmis');
  if (!el) return;
  var gecmis = piyasaGecmisAnalizler;
  if (!gecmis.length) {
    el.innerHTML = '<p class="txt-sm neu">Henüz analiz yapılmadı.</p>';
    return;
  }
  el.innerHTML = gecmis.map(function(a, i) {
    return '<div class="kc mb8"><div class="fb mb4">' +
      '<span class="fw6 txt-sm">' + a.sehir + ' · ' + a.odak + '</span>' +
      '<span class="txt-xs neu" style="font-variant-numeric:tabular-nums">' + a.tarih + '</span>' +
      '</div><div class="txt-xs neu">' + a.ozet + '</div></div>';
  }).join('');
}

// Piyasa geçmişini yükle
(function(){
  var saved = localStorage.getItem('ep15_piyasa_gecmis');
  if (saved) piyasaGecmisAnalizler = JSON.parse(saved);
})();

