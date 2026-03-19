/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/lease.js — Kira Sözleşmesi Üretici
 */
'use strict';

// ── sozlesmeUret ──
function sozlesmeUret() {
  var veren=document.getElementById('s-veren')?.value.trim(),kiraci=document.getElementById('s-kiraci')?.value.trim(),mulk=document.getElementById('s-mulk')?.value.trim();
  if(!veren||!kiraci||!mulk){alert('Kiraya veren, kiracı ve mülk adresi zorunludur.');return;}
  var kira=parseFloat(document.getElementById('s-kira')?.value)||0,dep=parseFloat(document.getElementById('s-depozito')?.value)||0;
  var bas=document.getElementById('s-baslangic')?.value,sure=parseInt(document.getElementById('s-sure')?.value)||12;
  var basT=bas?new Date(bas).toLocaleDateString('tr-TR'):'—';
  var bitT=bas?new Date(new Date(bas).setMonth(new Date(bas).getMonth()+sure)).toLocaleDateString('tr-TR'):'—';
  var metin='KİRA SÖZLEŞMESİ — '+new Date().toLocaleDateString('tr-TR')+'\n━━━━━━━━━━━━━━━━━━━━━━━━\nKİRAYA VEREN : '+veren+' | TC: '+(document.getElementById('s-veren-tc')?.value||'—')+'\nAdres        : '+(document.getElementById('s-veren-adres')?.value||'—')+'\nKİRACI       : '+kiraci+' | TC: '+(document.getElementById('s-kiraci-tc')?.value||'—')+'\n━━━━━━━━━━━━━━━━━━━━━━━━\nTAŞINMAZ     : '+mulk+'\nAlan: '+(document.getElementById('s-alan')?.value||'—')+' m² | Oda: '+(document.getElementById('s-oda')?.value||'—')+'\n━━━━━━━━━━━━━━━━━━━━━━━━\nAYLIK KİRA   : '+kira.toLocaleString('tr-TR')+' ₺\nDEPOZİTO     : '+dep.toLocaleString('tr-TR')+' ₺\nSÜRE         : '+sure+' ay ('+basT+' – '+bitT+')\n━━━━━━━━━━━━━━━━━━━━━━━━\nTBK md.344: Kira artışı TÜFE ile sınırlıdır.\n━━━━━━━━━━━━━━━━━━━━━━━━\nKİRAYA VEREN: ___________  KİRACI: ___________';
  var prev=document.getElementById('lease-preview');if(!prev)return;prev.style.textAlign='left';prev.textContent=metin;
  document.getElementById('sozlesme-butonlar').style.display='flex';
}

/* ── ÖNERİLER ── */
