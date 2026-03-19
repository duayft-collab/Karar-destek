/**
 * Duay Global Trade Company — info@duaycor.com
 * modules/versions.js — Sürüm Geçmişi
 * Anayasa 07: v[No] / YYYY-MM-DD SS:DD formatı zorunlu
 */
'use strict';

var SURUM_GECMISi=[
  {ver:'V14.0',ts:'2025-03-19 21:00:00',degisiklikler:['🔐 Kullanıcı adı tabanlı giriş (@ sorununu çözdü)','✅ Garantili çalışan localStorage auth','❌ Firebase ve async/await tamamen kaldırıldı','🏦 Kredi & Reel Maliyet Analizi (tam korundu)','📉 Enflasyon/USD/Altın bazlı ödeme erimesi grafiği','📊 4 reel baz karşılaştırma grafiği','🎯 4 faiz senaryosu + erken ödeme simülatörü','🗓 Takvim & ödeme takip sistemi','🔑 Kira yönetimi (sözleşme bitiş uyarısı)','📄 Otomatik kira sözleşmesi üretici']},
  {ver:'V13.0',ts:'2025-03-19 20:30:00',degisiklikler:['Temiz yeniden yazım ama login hâlâ sorunluydu']},
  {ver:'V12.x',ts:'2025-03-19 18:10:00',degisiklikler:['Kredi analizi genişletildi','Reel maliyet hesaplamaları eklendi']},
  {ver:'V09.0',ts:'2025-03-19 14:32:08',degisiklikler:['Login sistemi','Duyurular','Admin panel','Aktivite kaydı']},
];

// ── surumGecmisiGoster ──
function surumGecmisiGoster() {
  EP15_VERSION.renderSurum('surum-listesi');
}

/* ── AKTİVİTE ── */
