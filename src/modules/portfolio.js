/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/portfolio.js — Portföy Yönetimi
 */
'use strict';

// ── portfoyGoster ──
function portfoyGoster() {
  var totV=mulkler.reduce(function(s,m){return s+(m.guncelDeger||m.alisFiyati);},0);
  var totA=mulkler.reduce(function(s,m){return s+m.alisFiyati;},0);
  var totAlan=mulkler.reduce(function(s,m){return s+(m.alan||0);},0);
  var ortCap=mulkler.length?mulkler.reduce(function(s,m){return s+capRate(m);},0)/mulkler.length:0;
  var el=document.getElementById('port-ozet');
  if(el) el.innerHTML='<div class="kc"><div class="kc-lbl">Toplam Değer</div><div class="kc-val">'+fTL(totV)+'</div></div><div class="kc"><div class="kc-lbl">Değer Artışı</div><div class="kc-val '+(totV>=totA?'pos':'neg')+'">'+fTL(totV-totA)+'</div></div><div class="kc"><div class="kc-lbl">Toplam Alan</div><div class="kc-val">'+totAlan.toLocaleString('tr-TR')+' m²</div></div><div class="kc"><div class="kc-lbl">Cap Rate</div><div class="kc-val pos">'+ortCap.toFixed(1)+'%</div></div>';
  if(mulkler.length) grafik('ch-trend','bar',{labels:mulkler.map(function(m){return m.ad.slice(0,9);}),datasets:[{label:'Alış',data:mulkler.map(function(m){return m.alisFiyati;}),backgroundColor:'rgba(154,149,141,.5)',borderRadius:3},{label:'Güncel',data:mulkler.map(function(m){return m.guncelDeger||m.alisFiyati;}),backgroundColor:'rgba(184,137,58,.75)',borderRadius:3}]},{plugins:{legend:{labels:{font:{size:9}}}},scales:{y:{ticks:{font:{size:9},callback:function(v){return v>=1e6?(v/1e6).toFixed(1)+'M':(v/1000).toFixed(0)+'K';}}},x:{ticks:{font:{size:9}}}}});
  portTablo();
}

// ── portTablo ──
function portTablo() {
  var q=(document.getElementById('port-ara')?.value||'').toLowerCase(),tf=document.getElementById('port-tur')?.value||'';
  var liste=mulkler.map(function(m,i){return{m:m,i:i};}).filter(function(x){if(q&&!x.m.ad.toLowerCase().includes(q))return false;if(tf&&x.m.tur!==tf)return false;return true;});
  var tb=document.getElementById('port-tbody'); if(!tb)return;
  if(!liste.length){tb.innerHTML='<tr><td colspan="9" style="text-align:center;color:var(--ink3);padding:24px">Sonuç yok.</td></tr>';return;}
  tb.innerHTML=liste.map(function(x){var m=x.m,i=x.i,cv=m.guncelDeger||m.alisFiyati,pct=m.alisFiyati?((cv-m.alisFiyati)/m.alisFiyati*100):0;return '<tr><td class="tdm">'+m.ad+'</td><td><span class="badge bg-ink">'+m.tur+'</span></td><td class="txt-sm neu">'+(m.konum||'—')+'</td><td>'+(m.alan?m.alan+' m²':'—')+'</td><td>'+fTL(m.alisFiyati)+'</td><td><strong>'+fTL(cv)+'</strong></td><td><span class="'+(pct>=0?'pos':'neg')+'">'+fYzd(pct)+'</span></td><td class="txt-sm">'+(m.alan&&cv?Math.round(cv/m.alan).toLocaleString('tr-TR')+' ₺/m²':'—')+'</td><td><div class="flex gap4"><button class="btn btn-out btn-xs" onclick="mulkModalAc('+i+')">Düzenle</button><button class="btn btn-danger btn-xs" onclick="mulkSil('+i+')">Sil</button></div></td></tr>';}).join('');
}

/* ── AI ── */

