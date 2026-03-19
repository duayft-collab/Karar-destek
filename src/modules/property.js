/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/property.js — Mülk Yönetimi & Belge Sistemi
 * Dinamik tür formu: Daire, Arsa, Tarla, Villa, İşyeri...
 */
'use strict';

var mBelgeler = [];

var TUR_FORMLARI = {
  'Daire': [
    {grup:'Konut Özellikleri', alanlar:[
      {id:'m-oda',lbl:'Oda Sayısı',tip:'select',secenekler:['1+0','1+1','2+1','3+1','3+2','4+1','4+2','5+1','Dubleks','Tripleks']},
      {id:'m-kat',lbl:'Kat',tip:'number',ph:'3'},
      {id:'m-bina-kat',lbl:'Bina Toplam Kat',tip:'number',ph:'8'},
      {id:'m-brut',lbl:'Brüt Alan (m²)',tip:'number',ph:'140'},
      {id:'m-net',lbl:'Net Alan (m²)',tip:'number',ph:'120'},
    ]},
    {grup:'Isıtma & Özellikler', alanlar:[
      {id:'m-isitma',lbl:'Isıtma',tip:'select',secenekler:['Doğalgaz Kombi','Merkezi Sistem','Klima','Yerden Isıtma','Soba']},
      {id:'m-esya',lbl:'Eşya Durumu',tip:'select',secenekler:['Boş','Eşyalı','Yarı Eşyalı']},
      {id:'m-cephe',lbl:'Cephe',tip:'select',secenekler:['Kuzey','Güney','Doğu','Batı','K-G','D-B']},
      {id:'m-aidat',lbl:'Aidat (₺/ay)',tip:'number',ph:'500'},
    ]},
  ],
  'Villa': [
    {grup:'Villa Özellikleri', alanlar:[
      {id:'m-oda',lbl:'Oda Sayısı',tip:'select',secenekler:['3+1','4+1','4+2','5+1','5+2','6+1','6+2']},
      {id:'m-bahce',lbl:'Bahçe Alanı (m²)',tip:'number',ph:'500'},
      {id:'m-havuz',lbl:'Havuz',tip:'select',secenekler:['Yok','Özel','Ortak']},
      {id:'m-otopark',lbl:'Otopark',tip:'select',secenekler:['Kapalı Garaj','Açık','Yok']},
    ]},
  ],
  'Arsa': [
    {grup:'Arsa Özellikleri', alanlar:[
      {id:'m-imar',lbl:'İmar Durumu',tip:'select',secenekler:['İmarlı','İmarsız','Konut İmarı','Ticari İmar','Sanayi','Tarım','Orman','Sit Alanı']},
      {id:'m-kaks',lbl:'KAKS (Emsal)',tip:'text',ph:'0.30'},
      {id:'m-taks',lbl:'TAKS',tip:'text',ph:'0.20'},
      {id:'m-yencephesi',lbl:'Yol Cephesi (m)',tip:'number',ph:'20'},
      {id:'m-kot',lbl:'Kot Durumu',tip:'select',secenekler:['Düz','Meyilli','Çukur','Yüksek']},
    ]},
    {grup:'Tapu & Hukuki', alanlar:[
      {id:'m-imar-plani',lbl:'Nazım İmar Planı',tip:'text',ph:'1/5000 onaylı'},
      {id:'m-cinsi',lbl:'Tapu Cinsi',tip:'select',secenekler:['Arsa','Tarla','Bahçe','Bağ','Kargir Bina','Ahır']},
    ]},
  ],
  'Tarla': [
    {grup:'Tarla Özellikleri', alanlar:[
      {id:'m-arazi-sinif',lbl:'Arazi Sınıfı',tip:'select',secenekler:['1. Sınıf','2. Sınıf','3. Sınıf','4. Sınıf','Marjinal']},
      {id:'m-sulama',lbl:'Sulama',tip:'select',secenekler:['Sulu Tarım','Kuru Tarım','Damla Sulama','Yağmurlama']},
      {id:'m-urun',lbl:'Mevcut Ürün',tip:'text',ph:'Buğday, Mısır...'},
      {id:'m-toprak',lbl:'Toprak Yapısı',tip:'select',secenekler:['Killi','Kum-kil karışımı','Kumlu','Humus']},
    ]},
  ],
  'İşyeri': [
    {grup:'Ticari Özellikler', alanlar:[
      {id:'m-ciro',lbl:'Ortalama Ciro (₺/ay)',tip:'number',ph:'50.000'},
      {id:'m-kira-garanti',lbl:'Kira Garanti Süresi',tip:'text',ph:'5 yıl'},
      {id:'m-kiracı',lbl:'Mevcut Kiracı',tip:'text',ph:'Zincir marka, bireysel...'},
      {id:'m-otopark-ticarı',lbl:'Otopark Kapasitesi',tip:'number',ph:'10'},
    ]},
  ],
  'Dükkan': [
    {grup:'Dükkan Özellikleri', alanlar:[
      {id:'m-vitrin',lbl:'Vitrin Genişliği (m)',tip:'number',ph:'5'},
      {id:'m-tabya',lbl:'Depo / Bodrum',tip:'select',secenekler:['Var','Yok']},
      {id:'m-cadde',lbl:'Cadde Konumu',tip:'select',secenekler:['Ana Cadde','Yan Yol','AVM İçi','Pasaj']},
    ]},
  ],
};

// ── mulkKaydet ──
function mulkKaydet() {
  var ad = document.getElementById('m-ad').value.trim();
  if (!ad) { alert('Mülk adı zorunludur.'); return; }
  var ak = document.getElementById('m-alis-kur').value, at = parseFloat(document.getElementById('m-alis-tutar').value)||0;
  var gk = document.getElementById('m-guncel-kur').value, gt = parseFloat(document.getElementById('m-guncel-tutar').value)||0;
  var m = {
    ad: ad, tur: document.getElementById('m-tur').value, konum: document.getElementById('m-konum').value,
    alan: parseFloat(document.getElementById('m-alan').value)||0, sqmFiyat: parseFloat(document.getElementById('m-sqm').value)||0,
    alisTarihi: document.getElementById('m-tarih').value, notlar: document.getElementById('m-notlar').value,
    alisKur: ak, alisTutar: at, alisFiyati: tlCevir(at, ak)||at,
    guncelKur: gk, guncelTutar: gt, guncelDeger: tlCevir(gt, gk)||0,
    masraf: parseFloat(document.getElementById('m-masraf').value)||0, kredi: parseFloat(document.getElementById('m-kredi').value)||0,
    taksit: parseFloat(document.getElementById('m-taksit').value)||0, alisYil: parseInt(document.getElementById('m-alis-yil').value)||0,
    kira: parseFloat(document.getElementById('m-kira').value)||0, vergi: parseFloat(document.getElementById('m-vergi').value)||0,
    bakim: parseFloat(document.getElementById('m-bakim').value)||0, yonetim: parseFloat(document.getElementById('m-yonetim').value)||0,
    bosluk: parseFloat(document.getElementById('m-bosluk').value)||5, binaYas: parseFloat(document.getElementById('m-bina-yas').value)||0
  };
  if (duzenMulkIdx >= 0) mulkler[duzenMulkIdx] = m; else mulkler.push(m);
  EP15_LOG.kaydet('prop', (duzenMulkIdx>=0?'Düzenlendi':'Eklendi') + ': ' + ad);
  mulkleriKaydet(); modalKapat('mulk-modal'); dashboardGoster(); portfoyGoster();
}

// ── mulkModalAc ──
function mulkModalAc(idx) {
  duzenMulkIdx = (idx !== undefined) ? idx : -1;
  document.getElementById('mulk-modal-baslik').textContent = duzenMulkIdx >= 0 ? 'Mülk Düzenle' : 'Yeni Mülk Ekle';
  if (duzenMulkIdx >= 0) {
    var m = mulkler[duzenMulkIdx];
    document.getElementById('m-ad').value       = m.ad || '';
    document.getElementById('m-tur').value      = m.tur || 'Daire';
    document.getElementById('m-konum').value    = m.konum || '';
    document.getElementById('m-alan').value     = m.alan || '';
    document.getElementById('m-sqm').value      = m.sqmFiyat || '';
    document.getElementById('m-tarih').value    = m.alisTarihi || '';
    document.getElementById('m-notlar').value   = m.notlar || '';
    document.getElementById('m-alis-kur').value   = m.alisKur || 'TRY';
    document.getElementById('m-alis-tutar').value = m.alisTutar || '';
    document.getElementById('m-guncel-kur').value   = m.guncelKur || 'TRY';
    document.getElementById('m-guncel-tutar').value = m.guncelTutar || '';
    document.getElementById('m-masraf').value   = m.masraf || '';
    document.getElementById('m-kredi').value    = m.kredi || '';
    document.getElementById('m-taksit').value   = m.taksit || '';
    document.getElementById('m-alis-yil').value = m.alisYil || '';
    document.getElementById('m-kira').value     = m.kira || '';
    document.getElementById('m-vergi').value    = m.vergi || '';
    document.getElementById('m-bakim').value    = m.bakim || '';
    document.getElementById('m-yonetim').value  = m.yonetim || '';
    document.getElementById('m-bosluk').value   = m.bosluk || 5;
    document.getElementById('m-bina-yas').value = m.binaYas || '';
    kurHesapla();
  } else {
    document.querySelectorAll('.mtab input,.mtab textarea').forEach(function(el) { el.value = ''; });
    document.getElementById('m-bosluk').value = '5';
    document.getElementById('m-alis-kur').value = 'TRY';
    document.getElementById('m-guncel-kur').value = 'TRY';
    ['m-alis-tl','m-guncel-tl'].forEach(function(id) { var e=document.getElementById(id); if(e) e.textContent='≈ — ₺'; });
    ['m-deger-ozet','m-cf-onizleme'].forEach(function(id) { var e=document.getElementById(id); if(e) e.innerHTML=''; });
  }
  mulkTab('mt-temel', document.querySelector('#mulk-modal .tabs .tab'));
  document.getElementById('mulk-modal').classList.add('open');
}

// ── mulkSil ──
function mulkSil(i) {
  if (!confirm('"' + mulkler[i].ad + '" silinecek?')) return;
  EP15_LOG.kaydet('prop', 'Silindi: ' + mulkler[i].ad); mulkler.splice(i, 1);
  mulkleriKaydet(); dashboardGoster(); portfoyGoster();
}

/* ── DASHBOARD ── */

// ── mulkTab ──
function mulkTab(tid, el) {
  document.querySelectorAll('.mtab').forEach(function(t) { t.style.display = 'none'; });
  document.querySelectorAll('#mulk-modal .tabs .tab').forEach(function(t) { t.classList.remove('active'); });
  document.getElementById(tid).style.display = 'block';
  el.classList.add('active');
  if (tid === 'mt-gider') cfOnizleme();
  if (tid === 'mt-deger') kurHesapla();
}

// ── mulkTurDegisti ──
function mulkTurDegisti() {
  var tur = document.getElementById('m-tur').value;
  var form = TUR_FORMLARI[tur];
  var el = document.getElementById('tur-form-icerik');
  if (!el) return;
  if (!form) {
    el.innerHTML = '<div class="alert al-inf"><span>Bu tür için özel alan tanımlanmamış. Notlar bölümünü kullanabilirsiniz.</span></div>';
    return;
  }
  var html = '';
  form.forEach(function(grup) {
    html += '<div style="margin-bottom:16px"><div class="fw6 txt-sm mb10" style="color:var(--gold);border-bottom:1px solid var(--bdr);padding-bottom:6px">' + grup.grup + '</div>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">';
    grup.alanlar.forEach(function(a) {
      html += '<div><label>' + a.lbl + '</label>';
      if (a.tip === 'select') {
        html += '<select id="' + a.id + '"><option value="">—</option>' + a.secenekler.map(function(s){return'<option>'+s+'</option>';}).join('') + '</select>';
      } else {
        html += '<input type="' + a.tip + '" id="' + a.id + '" placeholder="' + (a.ph||'') + '">';
      }
      html += '</div>';
    });
    html += '</div></div>';
  });
  el.innerHTML = html;
}

// ── kurHesapla ──
function kurHesapla() {
  var ba=parseFloat(document.getElementById('m-alis-tutar')?.value)||0, bk=document.getElementById('m-alis-kur')?.value||'TRY';
  var ca=parseFloat(document.getElementById('m-guncel-tutar')?.value)||0, ck=document.getElementById('m-guncel-kur')?.value||'TRY';
  var bTL=tlCevir(ba,bk), cTL=tlCevir(ca,ck);
  var bt=document.getElementById('m-alis-tl'); if(bt) bt.textContent=bTL?'≈ '+Math.round(bTL).toLocaleString('tr-TR')+' ₺':'≈ — ₺';
  var ct=document.getElementById('m-guncel-tl'); if(ct) ct.textContent=cTL?'≈ '+Math.round(cTL).toLocaleString('tr-TR')+' ₺':'≈ — ₺';
  var kredi=parseFloat(document.getElementById('m-kredi')?.value)||0;
  var oz=document.getElementById('m-deger-ozet');
  if (oz && (bTL||cTL)) {
    var ozsermaye=cTL-kredi, fark=cTL-bTL, pct=bTL?(fark/bTL*100).toFixed(1):0;
    oz.innerHTML='<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px"><div><div class="kc-lbl">Alış</div><div style="font-family:\'Instrument Serif\',serif;font-size:13px">'+fTL(bTL)+'</div></div><div><div class="kc-lbl">Güncel</div><div style="font-family:\'Instrument Serif\',serif;font-size:13px">'+fTL(cTL)+'</div></div><div><div class="kc-lbl">Öz Sermaye</div><div style="font-family:\'Instrument Serif\',serif;font-size:13px;color:var(--grn)">'+fTL(ozsermaye)+'</div></div><div><div class="kc-lbl">Artış</div><div style="font-family:\'Instrument Serif\',serif;font-size:13px;color:'+(fark>=0?'var(--grn)':'var(--red)')+'">'+(pct>=0?'+':'')+pct+'%</div></div></div>';
  }
}

// ── cfOnizleme ──
function cfOnizleme() {
  var kira=parseFloat(document.getElementById('m-kira')?.value)||0, vergi=parseFloat(document.getElementById('m-vergi')?.value)||0;
  var bakim=parseFloat(document.getElementById('m-bakim')?.value)||0, yon=parseFloat(document.getElementById('m-yonetim')?.value)||0;
  var bosluk=parseFloat(document.getElementById('m-bosluk')?.value)||5, taksit=parseFloat(document.getElementById('m-taksit')?.value)||0;
  var net=kira-vergi/12-bakim-yon-kira*(bosluk/100)-taksit;
  var el=document.getElementById('m-cf-onizleme');
  if(el) el.innerHTML='<div class="fb mb6"><span class="fw6 txt-sm" style="color:'+(net>0?'var(--grn)':'var(--red)')+'">'+(net>0?'✓ Aktif Varlık':'✗ Pasif / Yük')+'</span><span style="font-family:\'Instrument Serif\',serif;font-size:17px;color:'+(net>=0?'var(--grn)':'var(--red)')+'">'+( net>=0?'+':'')+fTL(net)+'/ay</span></div><div class="txt-xs neu">Kira: '+fTL(kira)+' | -Vergi: '+fTL(vergi/12)+' | -Bakım: '+fTL(bakim)+' | -Boşluk: '+fTL(kira*bosluk/100)+' | -Kredi: '+fTL(taksit)+'</div>';
}
document.querySelectorAll('#mt-gider input').forEach(function(el) { el.addEventListener('input', cfOnizleme); });

// ── alanSqmHesapla ──
function alanSqmHesapla() {
  var alan = parseFloat(document.getElementById('m-alan').value) || 0;
  var sqm  = parseFloat(document.getElementById('m-sqm').value) || 0;
  var el   = document.getElementById('m-alan-sonuc');
  if (!el || !alan || !sqm) { if(el) el.innerHTML=''; return; }
  var toplam = alan * sqm;
  el.innerHTML = '<div class="alert al-ok" style="margin:0"><span>📐 ' + alan.toLocaleString('tr-TR') + ' m² × ' + sqm.toLocaleString('tr-TR') + ' ₺/m² = <strong>' + fTL(toplam) + '</strong></span></div>';
}

/* BELGE YÖNETİMİ */

// ── belgeEkle ──
function belgeEkle(files) {
  if (!files || !files.length) return;
  Array.from(files).forEach(function(file) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var belge = {
        id: 'b' + Date.now() + Math.random().toString(36).slice(2),
        ad: file.name,
        tur: belgeturBelirle(file.name),
        boyut: Math.round(file.size / 1024),
        eklendi: new Date().toLocaleString('tr-TR'),
        veri: e.target.result  // base64
      };
      mBelgeler.push(belge);
      belgeListesiGoster();
    };
    reader.readAsDataURL(file);
  });
}

// ── belgeSil ──
function belgeSil(i) {
  mBelgeler.splice(i, 1);
  belgeListesiGoster();
}

// ── belgeIndir ──
function belgeIndir(i) {
  var b = mBelgeler[i];
  if (!b || !b.veri) return;
  var a = document.createElement('a');
  a.href = b.veri; a.download = b.ad; a.click();
}

// ── belgeturBelirle ──
function belgeturBelirle(dosyaAdi) {
  var ext = dosyaAdi.split('.').pop().toLowerCase();
  if (ext === 'pdf') return '📄 PDF';
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return '🖼️ Fotoğraf';
  if (['doc','docx'].includes(ext)) return '📝 Word';
  return '📎 Dosya';
}

// ── belgeListesiGoster ──
function belgeListesiGoster() {
  var el = document.getElementById('belge-listesi');
  if (!el) return;
  if (!mBelgeler.length) { el.innerHTML = ''; return; }
  el.innerHTML = mBelgeler.map(function(b, i) {
    return '<div style="display:flex;align-items:center;gap:10px;padding:9px 12px;background:var(--surf2);border:1px solid var(--bdr);border-radius:8px">' +
      '<div style="font-size:18px">' + (b.tur.split(' ')[0] || '📎') + '</div>' +
      '<div style="flex:1">' +
        '<div class="fw6 txt-sm">' + b.ad + '</div>' +
        '<div class="txt-xs neu">' + b.tur + (b.boyut ? ' · ' + b.boyut + ' KB' : '') + ' · ' + b.eklendi + '</div>' +
      '</div>' +
      (b.veri ? '<button class="btn btn-out btn-xs" onclick="belgeIndir(' + i + ')">↓</button>' : '') +
      '<button class="btn btn-danger btn-xs" onclick="belgeSil(' + i + ')">✕</button>' +
    '</div>';
  }).join('');
}

// ── belgeDrop ──
function belgeDrop(event) {
  event.preventDefault();
  document.getElementById('belge-drop-zone').style.borderColor = 'var(--bdr)';
  belgeEkle(event.dataTransfer.files);
}

// ── belgeKategoriEkle ──
function belgeKategoriEkle(kategori) {
  mBelgeler.push({
    id: 'b' + Date.now(),
    ad: kategori,
    tur: '📁 Kategori',
    boyut: 0,
    eklendi: new Date().toLocaleString('tr-TR'),
    veri: null,
    kategoriAdi: kategori
  });
  belgeListesiGoster();
}

