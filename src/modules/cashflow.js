/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/cashflow.js — Nakit Akışı & Exit Stratejisi
 */
'use strict';

// ── nakitAkisiGoster ──
function nakitAkisiGoster() {
  var topKira=mulkler.reduce(function(s,m){return s+(m.kira||0);},0);
  var topCF=mulkler.reduce(function(s,m){return s+cfHesapla(m).net;},0);
  var topNOI=mulkler.reduce(function(s,m){return s+cfHesapla(m).noi;},0);
  var aktifN=mulkler.filter(function(m){return cfHesapla(m).net>0;}).length;
  var el=document.getElementById('cf-stats');
  if(el) el.innerHTML='<div class="sc"><div class="sc-top"><div class="sc-lbl">Brüt Kira</div><div class="sc-ico gold">💵</div></div><div class="sc-val">'+fTL(topKira)+'</div></div><div class="sc"><div class="sc-top"><div class="sc-lbl">NOI/ay</div><div class="sc-ico grn">🏗</div></div><div class="sc-val pos">'+fTL(topNOI)+'</div></div><div class="sc"><div class="sc-top"><div class="sc-lbl">Net CF/ay</div><div class="sc-ico '+(topCF>=0?'grn':'red')+'">'+(topCF>=0?'📈':'📉')+'</div></div><div class="sc-val" style="color:'+(topCF>=0?'var(--grn)':'var(--red)')+'">'+(topCF>=0?'+':'')+fTL(topCF)+'</div></div><div class="sc"><div class="sc-top"><div class="sc-lbl">Aktif</div><div class="sc-ico grn">✅</div></div><div class="sc-val">'+aktifN+'/'+mulkler.length+'</div></div><div class="sc"><div class="sc-top"><div class="sc-lbl">Yıllık CF</div><div class="sc-ico org">📈</div></div><div class="sc-val '+(topCF>=0?'pos':'neg')+'">'+fTL(topCF*12)+'</div></div>';
  if(mulkler.length){
    grafik('ch-ge','bar',{labels:mulkler.map(function(m){return m.ad.slice(0,9);}),datasets:[{label:'Kira',data:mulkler.map(function(m){return m.kira||0;}),backgroundColor:'rgba(26,122,74,.75)',borderRadius:3},{label:'Gider',data:mulkler.map(function(m){return Math.round(cfHesapla(m).gider+cfHesapla(m).borc);}),backgroundColor:'rgba(192,57,43,.75)',borderRadius:3}]},{plugins:{legend:{labels:{font:{size:9}}}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v.toLocaleString('tr-TR');}}},x:{ticks:{font:{size:9}}}}});
    grafik('ch-cr','bar',{labels:mulkler.map(function(m){return m.ad.slice(0,9);}),datasets:[{label:'Cap Rate%',data:mulkler.map(function(m){return +capRate(m).toFixed(1);}),backgroundColor:'rgba(184,137,58,.8)',borderRadius:3},{label:'ROE%',data:mulkler.map(function(m){return +roeHesapla(m).toFixed(1);}),backgroundColor:'rgba(29,95,168,.7)',borderRadius:3}]},{plugins:{legend:{labels:{font:{size:9}}}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v+'%';}}},x:{ticks:{font:{size:9}}}}});
  }
  var tb=document.getElementById('cf-tbody'); if(!tb)return;
  if(!mulkler.length){tb.innerHTML='<tr><td colspan="11" style="text-align:center;color:var(--ink3);padding:24px">Mülk yok.</td></tr>';return;}
  tb.innerHTML=mulkler.map(function(m){var cf=cfHesapla(m),a=cf.net>0;return '<tr><td><span class="badge '+(a?'bg-grn':'bg-red')+'">'+(a?'Aktif':'Pasif')+'</span></td><td class="fw6">'+m.ad+'</td><td class="pos">'+fTL(m.kira)+'</td><td class="neg">-'+fTL(cf.gider+cf.borc)+'</td><td class="'+(cf.net>=0?'pos':'neg')+'">'+(cf.net>=0?'+':'')+fTL(cf.net)+'</td><td>'+capRate(m).toFixed(1)+'%</td><td>'+roeHesapla(m).toFixed(1)+'%</td><td>'+ltvHesapla(m).toFixed(0)+'%</td><td>'+grmHesapla(m)+'</td><td>'+gerDon(m)+'</td><td><span class="'+(parseFloat(dscrHesapla(m))>=1.25?'pos':'neg')+'">'+dscrHesapla(m)+'</span></td></tr>';}).join('');
  document.getElementById('roe-panel').innerHTML=mulkler.map(function(m){var oz=(m.guncelDeger||m.alisFiyati)-(m.kredi||0),r=roeHesapla(m);if(oz>500000&&r<5)return '<div class="kc mb8"><div class="fw6" style="color:var(--gold);margin-bottom:4px">'+m.ad+'</div><p class="txt-sm" style="color:var(--ink2)">'+fTL(oz)+' — ROE: '+r.toFixed(1)+'%<br>Refinance: <span class="pos">'+fTL(oz*0.05/12)+'/ay</span></p></div>';return '';}).join('')||'<p class="txt-sm neu">Analiz için kredi bilgisi girin.</p>';
  document.getElementById('tax-panel').innerHTML=mulkler.map(function(m){var yil=new Date().getFullYear(),gec=yil-(m.alisYil||yil),vergisiz=gec>=5,cv=m.guncelDeger||m.alisFiyati;return '<div class="kc mb8"><div class="fb mb4"><span class="fw6">'+m.ad+'</span><span class="badge '+(vergisiz?'bg-grn':'bg-gold')+'">'+(vergisiz?'Vergisiz':Math.max(0,5-gec)+' yıl')+'</span></div><div class="txt-sm neu">Amortisman: <span class="pos">'+fTL(cv*0.02/12)+'/ay</span></div></div>';}).join('')||'<p class="txt-sm neu">Veri yok.</p>';
  document.getElementById('kaldıraç-panel').innerHTML=mulkler.map(function(m){var cf=cfHesapla(m),iyi=(m.kredi||0)>0&&cf.net>0;return '<div class="kc mb8"><div class="fb mb4"><span class="fw6">'+m.ad+'</span><span class="badge '+(iyi?'bg-grn':'bg-red')+'">'+(iyi?'OPM ✓':'Yük')+'</span></div><div class="txt-sm neu">LTV: '+ltvHesapla(m).toFixed(0)+'% | DSCR: '+dscrHesapla(m)+' | Net: <span class="'+(cf.net>=0?'pos':'neg')+'">'+fTL(cf.net)+'</span></div></div>';}).join('')||'<p class="txt-sm neu">Veri yok.</p>';
  var sel=document.getElementById('exit-mulk'); if(sel){sel.innerHTML='<option value="">—</option>';mulkler.forEach(function(m,i){sel.innerHTML+='<option value="'+i+'">'+m.ad+'</option>';});}
}

// ── exitHesapla ──
function exitHesapla() {
  var idx=parseInt(document.getElementById('exit-mulk').value);
  var sqm=parseFloat(document.getElementById('exit-sqm').value)||45000;
  var alan=parseFloat(document.getElementById('exit-alan').value)||120;
  if(isNaN(idx)||!mulkler[idx])return;
  var m=mulkler[idx],cv=m.guncelDeger||m.alisFiyati,fark=cv-m.alisFiyati;
  var gec=new Date().getFullYear()-(m.alisYil||new Date().getFullYear()),vergisiz=gec>=5;
  var net=vergisiz?cv:cv-fark*0.15,topFiyat=sqm*alan,adet=Math.floor(net/topFiyat),cf=adet*15000*0.7;
  document.getElementById('exit-sonuc').innerHTML='<div class="g4 mb10"><div class="kc"><div class="kc-lbl">Satış Değeri</div><div class="kc-val">'+fTL(cv)+'</div></div><div class="kc"><div class="kc-lbl">Vergi Sonrası</div><div class="kc-val '+(vergisiz?'pos':'')+'">'+fTL(net)+'</div></div><div class="kc"><div class="kc-lbl">Yeni Mülk</div><div class="kc-val pos">'+adet+'</div></div><div class="kc"><div class="kc-lbl">Tahmini CF</div><div class="kc-val pos">+'+fTL(cf)+'/ay</div></div></div><div class="alert '+(adet>1?'al-ok':'al-wrn')+'"><span>'+(adet>1?'✅ '+adet+' yeni mülk alınabilir.':'⚠️ Hedef bölgede yeterli değil.')+'</span></div>';
}

/* ── PORTFÖY ── */

