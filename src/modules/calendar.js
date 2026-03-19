/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/calendar.js — Takvim & Ödeme Takibi
 */
'use strict';

// ── takvimGoster ──
function takvimGoster() {
  var bugun=new Date();bugun.setHours(0,0,0,0);
  var ayAdlari=['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  var baslik=document.getElementById('cal-baslik');if(baslik)baslik.textContent=ayAdlari[calAy]+' '+calYil;
  var ilkGun=new Date(calYil,calAy,1).getDay(),ayGunSayisi=new Date(calYil,calAy+1,0).getDate();
  var gundeOdemeler={};odemeler.forEach(function(o){var d=new Date(o.tarih);if(d.getMonth()!==calAy||d.getFullYear()!==calYil)return;var gun=d.getDate();if(!gundeOdemeler[gun])gundeOdemeler[gun]=[];gundeOdemeler[gun].push(o);});
  var gunAdlari=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
  var html=gunAdlari.map(function(g){return '<div class="cal-hdr">'+g+'</div>';}).join('');
  var offset=(ilkGun+6)%7;for(var i=0;i<offset;i++)html+='<div class="cal-day other-m"></div>';
  for(var g=1;g<=ayGunSayisi;g++){var dt=new Date(calYil,calAy,g);dt.setHours(0,0,0,0);var bugunMu=dt.getTime()===bugun.getTime(),varOdeme=gundeOdemeler[g]&&gundeOdemeler[g].length>0;html+='<div class="cal-day '+(bugunMu?'today':'')+(varOdeme&&!bugunMu?' has-ev':'')+'"><div>'+g+'</div>'+(varOdeme?'<div class="cal-dot"></div>':'')+'</div>';}
  var grid=document.getElementById('cal-grid');if(grid)grid.innerHTML=html;
  var turIco={kira:'💚',kredi:'💸',vergi:'📋',bakim:'🔧',diger:'📌'};
  var buAy=odemeler.filter(function(o){var d=new Date(o.tarih);return d.getMonth()===calAy&&d.getFullYear()===calYil;}).sort(function(a,b){return new Date(a.tarih)-new Date(b.tarih);});
  var etk=document.getElementById('cal-etkinlikler');
  if(etk)etk.innerHTML=buAy.length?buAy.map(function(o){return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--bdr)"><span>'+(turIco[o.tur]||'📌')+'</span><div style="flex:1"><div class="fw6 txt-sm">'+o.baslik+'</div><div class="txt-xs neu">'+new Date(o.tarih).toLocaleDateString('tr-TR')+'</div></div><div class="fw6 txt-sm '+(o.tur==='kira'?'pos':'neg')+'">'+(o.tur==='kira'?'+':'−')+fTL(o.tutar)+'</div></div>';}).join(''):'<p class="txt-sm neu mt8">Bu ay kayıt yok.</p>';
  var in30=new Date(bugun);in30.setDate(in30.getDate()+30);
  var yaklasan=odemeler.filter(function(o){var d=new Date(o.tarih);d.setHours(0,0,0,0);return d>=bugun&&d<=in30&&o.durum!=='paid';}).slice(0,4);
  var yp=document.getElementById('yaklasan-odemeler');
  if(yp)yp.innerHTML=yaklasan.length?yaklasan.map(function(o){var d=new Date(o.tarih),fark=Math.round((d-bugun)/(864e5));return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--bdr)"><div style="width:8px;height:8px;border-radius:50%;background:'+(fark<=7?'var(--org)':'var(--gold)')+'"></div><div style="flex:1"><div class="fw6 txt-sm">'+o.baslik+'</div><div class="txt-xs neu">'+(fark===0?'Bugün':fark+' gün')+'</div></div><div class="txt-sm '+(o.tur==='kira'?'pos':'neg')+'">'+fTL(o.tutar)+'</div></div>';}).join(''):'<p class="txt-sm neu">Yaklaşan ödeme yok ✓</p>';
  var gecen=odemeler.filter(function(o){var d=new Date(o.tarih);d.setHours(0,0,0,0);return d<bugun&&o.durum!=='paid';}).slice(0,4);
  var gp=document.getElementById('geciken-odemeler');
  if(gp)gp.innerHTML=gecen.length?gecen.map(function(o){var d=new Date(o.tarih),fark=Math.round((bugun-d)/(864e5));return '<div style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--bdr)"><div style="width:8px;height:8px;border-radius:50%;background:var(--red)"></div><div style="flex:1"><div class="fw6 txt-sm">'+o.baslik+'</div><div class="txt-xs neg">'+fark+' gün gecikmeli</div></div><div class="txt-sm neg">'+fTL(o.tutar)+'</div></div>';}).join(''):'<div class="alert al-ok" style="margin:0"><span>✓ Gecikmiş ödeme yok.</span></div>';
  var gelir=buAy.filter(function(o){return o.tur==='kira';}).reduce(function(s,o){return s+o.tutar;},0);
  var giderTot=buAy.filter(function(o){return o.tur!=='kira';}).reduce(function(s,o){return s+o.tutar;},0);
  var oz=document.getElementById('cal-ozet');
  if(oz)oz.innerHTML='<div class="g2"><div class="kc"><div class="kc-lbl">Gelir</div><div class="kc-val pos">'+fTL(gelir)+'</div></div><div class="kc"><div class="kc-lbl">Gider</div><div class="kc-val neg">'+fTL(giderTot)+'</div></div></div><div class="kc mt8"><div class="kc-lbl">Net</div><div class="kc-val '+(gelir-giderTot>=0?'pos':'neg')+'">'+fTL(gelir-giderTot)+'</div></div>';
}

/* ── SÖZLEŞME ── */

// ── odemeKaydet ──
function odemeKaydet() {
  var baslik=document.getElementById('om-baslik')?.value.trim(); if(!baslik)return;
  odemeler.push({baslik:baslik,tutar:parseFloat(document.getElementById('om-tutar').value)||0,tarih:document.getElementById('om-tarih').value,tur:document.getElementById('om-tur').value,durum:document.getElementById('om-durum').value,mulkIdx:parseInt(document.getElementById('om-mulk').value)||-1,not:document.getElementById('om-not').value});
  EP15_LOG.kaydet('pay','Ödeme: '+baslik+' '+fTL(odemeler[odemeler.length-1].tutar));
  odemeleriKaydet(); modalKapat('odeme-modal'); takvimGoster();
}

// ── odemeModalAc ──
function odemeModalAc() {
  var sel=document.getElementById('om-mulk'); if(!sel)return;
  sel.innerHTML='<option value="">—</option>';mulkler.forEach(function(m,i){sel.innerHTML+='<option value="'+i+'">'+m.ad+'</option>';});
  document.getElementById('om-tarih').value=new Date().toISOString().slice(0,10);
  document.getElementById('odeme-modal').classList.add('open');
}

// ── ayDegistir ──
function ayDegistir(d){calAy+=d;if(calAy>11){calAy=0;calYil++;}if(calAy<0){calAy=11;calYil--;}takvimGoster();}

