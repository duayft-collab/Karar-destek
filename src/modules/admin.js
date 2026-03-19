/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/admin.js — Admin Panel
 * Anayasa 02: RBAC + Multi-tenant yönetimi
 */
'use strict';

// ── adminGoster ──
function adminGoster() {
  if(aktifKullanici.rol!=='admin')return;
  var users=kullanicilariBaslat();
  var tb=document.getElementById('kullanici-tbody');if(!tb)return;
  tb.innerHTML=users.map(function(u){
    return '<tr><td class="tdm">'+u.kullanici+'</td><td>'+u.adsoyad+'</td><td><span class="badge '+(u.rol==='admin'?'bg-gold':'bg-blu')+'">'+u.rol+'</span></td><td><span class="badge '+(u.aktif!==false?'bg-grn':'bg-red')+'">'+(u.aktif!==false?'Aktif':'Pasif')+'</span></td><td class="txt-xs neu">'+(u.sGiris?new Date(u.sGiris).toLocaleDateString('tr-TR'):'—')+'</td><td><div class="flex gap4"><button class="btn btn-out btn-xs" onclick="kullaniciToggle(\''+u.id+'\')">'+(u.aktif!==false?'Pasif Yap':'Aktif Yap')+'</button><button class="btn btn-out btn-xs" onclick="rolDegistir(\''+u.id+'\',\''+(u.rol==='admin'?'user':'admin')+'\')">↕ Rol</button>'+(u.id!==aktifKullanici.id?'<button class="btn btn-danger btn-xs" onclick="kullaniciSil(\''+u.id+'\')">✕</button>':'')+'</div></td></tr>';
  }).join('');
}

// ── adminTab ──
function adminTab(tab, el) {
  ['kullanici','duyuru','aktivite','oneriler-adm'].forEach(function(t){var d=document.getElementById('adm-'+t);if(d)d.style.display='none';});
  document.querySelectorAll('#page-admin .tab').forEach(function(t){t.classList.remove('active');});
  var d=document.getElementById('adm-'+tab);if(d)d.style.display='block';
  el.classList.add('active');
  if(tab==='aktivite')adminAktiviteGoster();
}

// ── adminAktiviteGoster ──
function adminAktiviteGoster(){
  var el=document.getElementById('adm-aktiv-listesi');if(!el)return;
  var hepsi=[];
  var users=kullanicilariBaslat();
  users.forEach(function(u){var a=JSON.parse(localStorage.getItem('ep15_'+u.id+'_aktivite')||'[]');hepsi.push.apply(hepsi,a);});
  hepsi.sort(function(a,b){return new Date(b.zaman)-new Date(a.zaman);});
  var ico={login:'🔑',logout:'↩',prop:'🏠',pay:'💰',ai:'🤖',admin:'⚙️',sugg:'💡'};
  el.innerHTML=hepsi.slice(0,50).map(function(a){return '<div class="act-row"><div style="width:26px;height:26px;border-radius:7px;background:var(--surf3);display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0">'+(ico[a.tip]||'📌')+'</div><div style="flex:1"><div class="fw6 txt-sm">'+(a.aciklama||'')+'</div><div class="txt-xs neu"><strong>'+a.kullanici+'</strong> · '+a.zaman+'</div></div></div>';}).join('')||'<p class="txt-sm neu" style="padding:12px">Aktivite yok.</p>';
}

/* ── BİLDİRİMLER ── */

// ── adminOneriListesiGoster ──
function adminOneriListesiGoster() {
  var el = document.getElementById('adm-oneri-listesi'); if (!el) return;
  var tumOneri = [];
  EP15_AUTH.getAll().forEach(function(u) {
    var onr = JSON.parse(localStorage.getItem('ep15_'+u.id+'_oneriler') || '[]');
    onr.forEach(function(o){ o._uid = u.id; });
    tumOneri = tumOneri.concat(onr);
  });
  tumOneri.sort(function(a,b){ return (b.tarih||'').localeCompare(a.tarih||''); });
  if (!tumOneri.length) { el.innerHTML = '<p class="txt-sm neu">Öneri yok.</p>'; return; }
  var DLbl = {yeni:'Yeni', inceleniyor:'Inceleniyor', kabul:'Kabul Edildi', red:'Reddedildi'};
  var DClr = {yeni:'bg-gold', inceleniyor:'bg-blu', kabul:'bg-grn', red:'bg-red'};
  el.innerHTML = tumOneri.map(function(o) {
    return '<div class="sugg-card">' +
      '<div class="fb mb6"><span class="badge bg-blu">' + (o.tur||'—') + '</span>' +
      '<span class="badge ' + (DClr[o.durum]||'bg-ink') + '">' + (DLbl[o.durum]||o.durum||'yeni') + '</span></div>' +
      '<div class="fw6 txt-sm mb4">' + (o.baslik||'') + '</div>' +
      '<div class="txt-sm neu mb6">' + (o.aciklama||'') + '</div>' +
      '<div class="txt-xs neu">' + (o.kullanici||'—') + ' · ' + (o.tarih||'') + '</div>' +
    '</div>';
  }).join('');
}

// ── kullaniciEkle ──
function kullaniciEkle() {
  var adsoyad   = document.getElementById('ku-adsoyad').value.trim();
  var kullanici = document.getElementById('ku-kullanici').value.trim();
  var sifre     = document.getElementById('ku-sifre').value.trim();
  var rol       = document.getElementById('ku-rol').value;
  if (!adsoyad || !kullanici || !sifre) { alert('Tüm alanlar zorunludur.'); return; }
  if (kullanici.includes('@')) { alert('Kullanıcı adında @ kullanmayın.'); return; }
  var sonuc = EP15_AUTH.ekle(kullanici, sifre, adsoyad, rol, []);
  if (sonuc.hata) { alert(sonuc.hata); return; }
  EP15_LOG.kaydet('admin', 'Kullanıcı eklendi: ' + kullanici + ' (' + rol + ')');
  alert('Kullanıcı oluşturuldu.');
  modalKapat('kullanici-modal');
  adminGoster();
}

// ── kullaniciSil ──
function kullaniciSil(id) {
  if (!confirm('Kullanıcı silinecek? Bu işlem geri alınamaz.')) return;
  EP15_AUTH.sil(id);
  EP15_LOG.kaydet('admin', 'Kullanıcı silindi: ' + id);
  adminGoster();
}

// ── kullaniciDuzenle ──
function kullaniciDuzenle(id) {
  var users = EP15_AUTH.getAllUsers();
  var u = users.find(function(x){ return x.id === id; });
  if (!u) return;
  var yeniSifre = prompt('Yeni şifre (boş bırakırsan değişmez):');
  if (yeniSifre === null) return;
  var degisiklik = {};
  if (yeniSifre.trim()) degisiklik.sifre = yeniSifre.trim();
  var yeniRol = prompt('Rol (admin/manager/user):') || u.rol;
  if (yeniRol && ['super_admin','admin','manager','user'].includes(yeniRol)) degisiklik.rol = yeniRol;
  if (Object.keys(degisiklik).length) {
    EP15_AUTH.guncelle(id, degisiklik);
    EP15_LOG.kaydet('admin', 'Kullanıcı güncellendi: ' + u.kullanici);
    adminGoster();
  }
}

// ── kullaniciToggle ──
function kullaniciToggle(id) {
  var users = EP15_AUTH.getAllUsers();
  var u = users.find(function(x){ return x.id === id; });
  if (u) EP15_AUTH.guncelle(id, {aktif: !u.aktif});
  EP15_LOG.kaydet('admin', 'Kullanıcı durum değiştirildi: ' + id);
  adminGoster();
}

// ── kullaniciModalAc ──
function kullaniciModalAc(){document.getElementById('kullanici-modal').classList.add('open');}

// ── rolDegistir ──
function rolDegistir(id, rol) {
  if (!confirm('Rol "' + rol + '" yapılsın mı?')) return;
  EP15_AUTH.guncelle(id, {rol: rol});
  EP15_LOG.kaydet('admin', 'Rol değiştirildi: ' + id + ' → ' + rol);
  adminGoster();
}

