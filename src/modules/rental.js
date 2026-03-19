/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/rental.js — Kira & Kiracı Yönetimi
 */
'use strict';

// ── kiraGoster ──
function kiraGoster() {
  kiraGuncelle();
  var tb=document.getElementById('kira-tbody'); if(!tb)return;
  if(!kiralar.length){tb.innerHTML='<tr><td colspan="8" style="text-align:center;padding:32px;color:var(--ink3)"><div style="font-size:28px;margin-bottom:8px">🔑</div><div>Henüz kira kaydı yok.</div><button class="btn btn-gold btn-sm mt12" onclick="kiraModalAc()">+ Kira Ekle</button></td></tr>';return;}
  var tufe=parseFloat(document.getElementById('kira-tufe')?.value)||48,bugun=new Date();
  tb.innerHTML=kiralar.map(function(r,i){
    var m=mulkler[r.mulkIdx];if(!m)return'';
    var cf=cfHesapla(Object.assign({},m,{kira:r.kira}));
    var bitis=new Date(r.baslangic||Date.now());bitis.setFullYear(bitis.getFullYear()+1);
    var kalanGun=Math.round((bitis-bugun)/(864e5)),yeniKira=Math.round(r.kira*(1+tufe/100));
    var doldu=kalanGun<=0,yakında=kalanGun<=30&&kalanGun>0;
    return '<tr><td class="tdm">'+m.ad+'</td><td>'+r.kiraci+'</td><td class="pos">'+fTL(r.kira)+'</td><td class="'+(cf.net>=0?'pos':'neg')+'">'+(cf.net>=0?'+':'')+fTL(cf.net)+'</td><td class="txt-sm neu">'+(r.baslangic||'—')+'</td><td><span class="badge '+(doldu?'bg-red':yakında?'bg-gold':'bg-grn')+'">'+(doldu?'⚠️ Süresi Doldu':yakında?'⏰ '+kalanGun+' gün':bitis.toLocaleDateString('tr-TR'))+'</span></td><td class="pos fw6">'+fTL(yeniKira)+'</td><td><button class="btn btn-danger btn-xs" onclick="kiralar.splice('+i+',1);kiralariKaydet();kiraGoster()">Sil</button></td></tr>';
  }).join('');
}

/* ── TAKVİM ── */

// ── kiraGuncelle ──
function kiraGuncelle() {
  var mevcut=parseFloat(document.getElementById('kira-mevcut')?.value)||0;
  var tufe=parseFloat(document.getElementById('kira-tufe')?.value)||0;
  if(!mevcut){document.getElementById('kira-kartlar').innerHTML='';return;}
  var yasal=mevcut*(1+tufe/100);
  document.getElementById('kira-kartlar').innerHTML='<div class="kc"><div class="kc-lbl">Yasal Max (TÜFE)</div><div class="kc-val pos">'+fTL(yasal)+'</div><div class="kc-sub">+'+fTL(yasal-mevcut)+'</div></div><div class="kc"><div class="kc-lbl">Piyasa Tahmini</div><div class="kc-val">'+fTL(mevcut*1.25)+'</div></div><div class="kc"><div class="kc-lbl">Mevcut</div><div class="kc-val">'+fTL(mevcut)+'</div></div>';
}

// ── kiraKaydet ──
function kiraKaydet() {
  var mi=document.getElementById('km-mulk').value, kir=document.getElementById('km-kiraci').value.trim();
  if(!mi||!kir)return;
  kiralar.push({mulkIdx:parseInt(mi),kiraci:kir,kira:parseFloat(document.getElementById('km-kira').value)||0,baslangic:document.getElementById('km-baslangic').value,gun:document.getElementById('km-gun').value});
  kiralariKaydet(); EP15_LOG.kaydet('pay','Kira: '+kir); modalKapat('kira-modal'); kiraGoster();
}

// ── kiraModalAc ──
function kiraModalAc() {
  var sel=document.getElementById('km-mulk'); if(!sel)return;
  sel.innerHTML='<option value="">—</option>';mulkler.forEach(function(m,i){sel.innerHTML+='<option value="'+i+'">'+m.ad+'</option>';});
  document.getElementById('kira-modal').classList.add('open');
}

