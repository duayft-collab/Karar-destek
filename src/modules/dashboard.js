/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/dashboard.js — Dashboard & Finansal Özgürlük
 */
'use strict';

// ── dashboardGoster ──
function dashboardGoster() {
  var dt = document.getElementById('dash-tarih');
  if (dt) dt.textContent = new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (!mulkler.length) {
    var el=document.getElementById('dash-stats'); if(el) el.innerHTML='';
    var tb=document.getElementById('dash-tbody');
    if(tb) tb.innerHTML='<tr><td colspan="10" style="text-align:center;padding:40px 20px"><div style="font-size:36px;margin-bottom:12px">🏠</div><div style="font-family:\'Instrument Serif\',serif;font-size:20px;color:var(--ink);margin-bottom:8px">Henüz mülk yok</div><div style="color:var(--ink3);font-size:13px;margin-bottom:16px">İlk mülkünüzü ekleyerek portföy takibine başlayın.</div><button class="btn btn-gold" onclick="mulkModalAc()">+ İlk Mülkü Ekle</button></td></tr>';
    document.getElementById('ap-list').innerHTML = '<p class="txt-sm neu">Mülk ekleyerek başlayın.</p>';
    return;
  }

  var totV=mulkler.reduce(function(s,m){return s+(m.guncelDeger||m.alisFiyati);},0);
  var totA=mulkler.reduce(function(s,m){return s+m.alisFiyati;},0);
  var totCF=mulkler.reduce(function(s,m){return s+cfHesapla(m).net;},0);
  var totOz=mulkler.reduce(function(s,m){return s+(m.guncelDeger||m.alisFiyati)-(m.kredi||0);},0);
  var artis=totA?((totV-totA)/totA*100):0;
  var aktifN=mulkler.filter(function(m){return cfHesapla(m).net>0;}).length;
  var ortCap=mulkler.length?mulkler.reduce(function(s,m){return s+capRate(m);},0)/mulkler.length:0;

  var el=document.getElementById('dash-stats');
  if(el) el.innerHTML='<div class="sc"><div class="sc-top"><div class="sc-lbl">Portföy Değeri</div><div class="sc-ico gold">🏛</div></div><div class="sc-val">'+fTL(totV)+'</div><div class="sc-sub"><span class="sc-tr '+(artis>=0?'up':'dn')+'">'+fYzd(artis)+'</span></div></div><div class="sc"><div class="sc-top"><div class="sc-lbl">Öz Sermaye</div><div class="sc-ico blu">💎</div></div><div class="sc-val">'+fTL(totOz)+'</div><div class="sc-sub">'+mulkler.length+' mülk</div></div><div class="sc"><div class="sc-top"><div class="sc-lbl">Net CF/ay</div><div class="sc-ico '+(totCF>=0?'grn':'red')+'">'+(totCF>=0?'📈':'📉')+'</div></div><div class="sc-val" style="color:'+(totCF>=0?'var(--grn)':'var(--red)')+'">'+(totCF>=0?'+':'')+fTL(totCF)+'</div></div><div class="sc"><div class="sc-top"><div class="sc-lbl">Aktif Varlık</div><div class="sc-ico grn">✅</div></div><div class="sc-val">'+aktifN+'/'+mulkler.length+'</div></div><div class="sc"><div class="sc-top"><div class="sc-lbl">Ort. Cap Rate</div><div class="sc-ico org">📊</div></div><div class="sc-val">'+ortCap.toFixed(1)+'%</div></div>';

  var turler = {};
  mulkler.forEach(function(m){ turler[m.tur]=(turler[m.tur]||0)+(m.guncelDeger||m.alisFiyati); });
  grafik('ch-dagilim','doughnut',{labels:Object.keys(turler),datasets:[{data:Object.values(turler),backgroundColor:CC,borderWidth:0,hoverOffset:5}]},{cutout:'60%'});
  grafik('ch-nakitakis','bar',{labels:mulkler.map(function(m){return m.ad.slice(0,10);}),datasets:[{label:'CF/ay',data:mulkler.map(function(m){return Math.round(cfHesapla(m).net);}),backgroundColor:mulkler.map(function(m){return cfHesapla(m).net>=0?'rgba(26,122,74,.8)':'rgba(192,57,43,.8)';}),borderRadius:3}]},{plugins:{legend:{display:false}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v.toLocaleString('tr-TR');}}},x:{ticks:{font:{size:9}}}}});

  dashTablo(); ozgurlukHesapla();
  var ap=document.getElementById('ap-list');
  if(ap) ap.innerHTML=mulkler.map(function(m){var cf=cfHesapla(m),a=cf.net>0;return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--bdr)"><div><div class="fw6 txt-sm">'+m.ad+'</div><div class="txt-xs neu">'+fTL(cf.kira)+' → <span class="'+(a?'pos':'neg')+'">'+(cf.net>=0?'+':'')+fTL(cf.net)+'/ay</span></div></div><span class="badge '+(a?'bg-grn':'bg-red')+'">'+(a?'Aktif':'Pasif')+'</span></div>';}).join('');
}

// ── dashTablo ──
function dashTablo() {
  var q=(document.getElementById('dash-ara')?.value||'').toLowerCase();
  var tf=document.getElementById('dash-tur')?.value||'';
  var liste=mulkler.map(function(m,i){return{m:m,i:i};}).filter(function(x){if(q&&!x.m.ad.toLowerCase().includes(q)&&!(x.m.konum||'').toLowerCase().includes(q))return false;if(tf&&x.m.tur!==tf)return false;return true;});
  var tb=document.getElementById('dash-tbody'); if(!tb)return;
  if(!liste.length){tb.innerHTML='<tr><td colspan="10" style="text-align:center;color:var(--ink3);padding:28px">Sonuç yok.</td></tr>';return;}
  tb.innerHTML=liste.map(function(x){var m=x.m,i=x.i,cf=cfHesapla(m),cv=m.guncelDeger||m.alisFiyati,cap=capRate(m),g=grmHesapla(m);return '<tr><td><span class="badge '+(cf.net>0?'bg-grn':'bg-red')+'">'+(cf.net>0?'Aktif':'Pasif')+'</span></td><td><div class="tdm">'+m.ad+'</div><div class="tds">'+(m.konum||'')+'</div></td><td><span class="badge bg-ink">'+m.tur+'</span></td><td>'+fTL(m.alisFiyati)+'</td><td><strong>'+fTL(cv)+'</strong></td><td class="'+(m.kira?'pos':'')+'">'+fTL(m.kira)+'</td><td class="'+(cf.net>=0?'pos':'neg')+'">'+(cf.net>=0?'+':'')+fTL(cf.net)+'</td><td>'+cap.toFixed(1)+'%</td><td>'+g+'</td><td><div class="flex gap4"><button class="btn btn-out btn-xs" onclick="mulkModalAc('+i+')">Düzenle</button><button class="btn btn-danger btn-xs" onclick="mulkSil('+i+')">Sil</button></div></td></tr>';}).join('');
}

// ── ozgurlukHesapla ──
function ozgurlukHesapla() {
  var gider=parseFloat(document.getElementById('yasam-gider')?.value)||0;
  var topKira=mulkler.reduce(function(s,m){return s+(m.kira||0);},0);
  var pct=gider>0?Math.min(100,(topKira/gider)*100):0;
  document.getElementById('ozgurluk-pct').textContent=Math.round(pct)+'%';
  document.getElementById('ozgurluk-arc').style.strokeDashoffset=270-(270*pct/100);
  var txt=document.getElementById('ozgurluk-txt');
  if(!gider){if(txt)txt.textContent='';return;}
  if(txt) txt.textContent=pct>=100?'🎉 Finansal özgürlük!':fTL(topKira)+' / '+fTL(gider)+' — '+(100-pct).toFixed(0)+'% eksik';
}

/* ── CASHFLOW ── */

