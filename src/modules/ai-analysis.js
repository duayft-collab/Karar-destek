/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/ai-analysis.js — AI Gayrimenkul Analizi
 * Claude claude-sonnet-4-20250514 entegrasyonu
 */
'use strict';

// ── aiCalistir ──
function aiCalistir() {
  var soru=document.getElementById('ai-soru')?.value.trim(); if(!soru)return;
  var btn=document.getElementById('ai-btn'); btn.disabled=true; btn.textContent='⏳...';
  var cikti=document.getElementById('ai-cikti');
  if(cikti) cikti.innerHTML='<div class="flex gap8" style="align-items:center;padding:12px"><div class="ai-dot"><span></span><span></span><span></span></div><span class="txt-sm neu">Analiz ediliyor...</span></div>';
  var ctx=mulkler.map(function(m,i){var cf=cfHesapla(m);return (i+1)+'. '+m.ad+'('+m.tur+') Alış:'+fTL(m.alisFiyati)+' Güncel:'+fTL(m.guncelDeger||m.alisFiyati)+' Kira:'+fTL(m.kira)+'/ay CF:'+fTL(cf.net)+'/ay Cap:'+capRate(m).toFixed(1)+'% ROE:'+roeHesapla(m).toFixed(1)+'% LTV:'+ltvHesapla(m).toFixed(0)+'% GRM:'+grmHesapla(m)+' DSCR:'+dscrHesapla(m);}).join('\n')||'Portföy boş.';
  fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,system:'Sen Türkiye gayrimenkul piyasasında uzman finansal danışmansın. Cap Rate, GRM, DSCR, ROE, LTV metriklerini yorumlarsın. Yanıtlarını Türkçe ver.',messages:[{role:'user',content:'Portföy:\n'+ctx+'\n\nSoru: '+soru}]})})
  .then(function(r){return r.json();}).then(function(data){
    var metin=data.content&&data.content.filter(function(b){return b.type==='text';}).map(function(b){return b.text;}).join('')||'—';
    if(cikti) cikti.innerHTML='<div class="ai-resp">'+metin.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>')+'</div>';
    EP15_LOG.kaydet('ai','AI: '+soru.slice(0,50));
  }).catch(function(){if(cikti)cikti.innerHTML='<div class="alert al-err">⚠️ AI bağlantı hatası. API anahtarı gerekiyor.</div>';})
  .then(function(){btn.disabled=false;btn.textContent='🤖 Analiz Et';});
}

/* ── KREDİ ANALİZİ ── */

// ── aiSorgulariOlustur ──
function aiSorgulariOlustur() {
  var sorgular=['📊 Portföy Performans Analizi','⚠️ Risk Değerlendirmesi','🗽 Özgürlük Stratejisi','🛡 Vergi Optimizasyonu','🚪 Exit Stratejileri'];
  var el=document.getElementById('ai-sorgular');
  if(el) el.innerHTML=sorgular.map(function(s){return '<button class="btn btn-out btn-sm" style="justify-content:flex-start" onclick="document.getElementById(\'ai-soru\').value=\''+s+'\'">'+s+'</button>';}).join('');
}

