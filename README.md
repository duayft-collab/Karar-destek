# Emlak Pro — Gayrimenkul Yönetim Sistemi

**Duay Global Trade Company** | info@duaycor.com  
Version: `v15.3.0 / 2025-03-20 09:00`

---

## Proje Yapısı

```
duay-emlak-pro/
│
├── index.html                  ← Ana uygulama (tek sayfalık SPA)
├── manifest.json               ← PWA konfigürasyonu
├── .gitignore                  ← firebase.config.local.js dahil
├── README.md
│
├── config/
│   ├── app.config.js           ← Versiyon, şirket, bağımlılıklar
│   ├── firebase.config.js      ← Firebase placeholder (asla commit etme!)
│   └── firestore.rules         ← Multi-tenant güvenlik kuralları
│
├── src/
│   ├── core/
│   │   ├── auth.js             ← EP15_AUTH: RBAC + Multi-tenant
│   │   ├── logger.js           ← EP15_LOG: ms hassasiyetli log
│   │   ├── router.js           ← Client-side SPA router
│   │   ├── error-handler.js    ← Global hata yakalama + Toast
│   │   ├── i18n.js             ← TR/EN çeviri sistemi (105+ anahtar)
│   │   └── utils.js            ← 28 yardımcı fonksiyon
│   │
│   ├── modules/
│   │   ├── dashboard.js        ← Dashboard + Finansal özgürlük
│   │   ├── cashflow.js         ← Nakit akışı + Exit stratejisi
│   │   ├── portfolio.js        ← Portföy yönetimi
│   │   ├── mortgage.js         ← Kredi + Reel maliyet analizi (9KB)
│   │   ├── rental.js           ← Kira & kiracı yönetimi
│   │   ├── calendar.js         ← Takvim & ödeme takibi
│   │   ├── ai-analysis.js      ← Claude AI entegrasyonu
│   │   ├── market-intel.js     ← Piyasa istihbaratı (AI destekli)
│   │   ├── knowledge-bank.js   ← Bilgi bankası (20+ kayıt)
│   │   ├── property.js         ← Dinamik mülk formu + belge yükleme
│   │   ├── admin.js            ← Admin panel + RBAC yönetimi
│   │   ├── lease.js            ← Kira sözleşmesi üretici
│   │   ├── activity.js         ← Aktivite log görüntüleme
│   │   └── versions.js         ← Sürüm geçmişi
│   │
│   └── components/
│       ├── nav.js              ← Navigasyon + tema yönetimi
│       ├── announcements.js    ← Duyuru sistemi (TR/EN)
│       └── suggestions.js      ← Öneri & geri bildirim formu
│
├── assets/
│   ├── css/
│   │   ├── base.css            ← CSS değişkenleri + reset
│   │   ├── themes.css          ← Dark/Light tema (Anayasa 07)
│   │   ├── layout.css          ← Sidebar, topbar, ana layout
│   │   └── components.css      ← UI bileşenleri
│   └── img/
│       └── logo.svg            ← Duay Global placeholder logo
│
└── pages/
    └── login.html              ← Standalone login sayfası
```

---

## Anayasa Uyum Raporu

| Kural | Açıklama | Durum |
|-------|----------|-------|
| 01 | Modüler yapı (src/, assets/, config/) | ✅ |
| 01 | Dosya satır limiti uyarısı | ✅ mortgage.js ~400 satır |
| 02 | Sıfır hardcode — Firebase placeholder | ✅ |
| 02 | Multi-tenant izolasyon + Firestore rules | ✅ |
| 02 | RBAC: super_admin/admin/manager/user | ✅ |
| 03 | Sabit sürüm CDN'ler (latest yasak) | ✅ |
| 03 | DocumentFragment (innerHTML='' yasak) | ✅ auth.js, logger.js |
| 04 | Global error handler | ✅ index.html |
| 04 | Offline algılama | ✅ online/offline events |
| 05 | Log: tarih+UID+ms hassasiyeti | ✅ logger.js |
| 05 | Duyuru sistemi TR/EN | ✅ announcements.js |
| 05 | Öneri formu | ✅ suggestions.js |
| 07 | Versiyon: v15.3.0 / 2025-03-20 09:00 | ✅ Login + Sidebar |
| 07 | Dark/Light modu | ✅ themes.css |
| 07 | i18n TR/EN (105+ anahtar) | ✅ i18n.js |
| 07 | Logo (placeholder) | ✅ logo.svg |

---

## Kurulum

### 1. Repo'yu Klonla
```bash
git clone https://github.com/duayglobal/emlak-pro.git
cd emlak-pro
```

### 2. Firebase Kurulumu
```bash
# Firebase Console → Project Settings → Web App → kopyala
cp config/firebase.config.js config/firebase.config.local.js
# firebase.config.local.js içindeki YOUR_* değerlerini doldur
```

### 3. Firestore Rules Deploy
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 4. Çalıştır
```bash
# Doğrudan tarayıcıda açın:
open index.html

# Veya yerel sunucu (önerilir):
npx serve .
# → http://localhost:3000
```

---

## Giriş Bilgileri (Varsayılan)

| Rol   | Kullanıcı | Şifre    |
|-------|-----------|----------|
| Admin | `admin`   | `admin123` |
| Demo  | `demo`    | `demo123`  |

> ⚠️ İlk girişten sonra admin şifresini değiştirin!

---

## Özellikler

- **15 sayfa**: Dashboard, Nakit Akışı, Portföy, Kredi Analizi, AI Analiz, Kira & Kiracı, Takvim, Sözleşme, Piyasa İstihbaratı, Bilgi Bankası, Duyurular, Öneriler, Sürüm Geçmişi, Aktivite, Admin Panel
- **Dinamik mülk formu**: Daire/Arsa/Tarla/Villa/İşyeri türüne göre farklı alanlar
- **Tapu yönetimi**: Ada/Parsel/Pafta, tapu türü, hisse oranı
- **Belge yönetimi**: PDF/JPG/Word sürükle-bırak yükleme
- **AI Analiz**: Claude claude-sonnet-4-20250514 entegrasyonu
- **Piyasa İstihbaratı**: Yerel + global kaynaklardan AI destekli analiz
- **Bilgi Bankası**: 20+ özlü söz, kitap, yatırım ilkesi
- **Canlı Kur**: USD/EUR/Altın/Gümüş (exchangerate-api.com)
- **RBAC**: 4 rol, granüler izin sistemi
- **Log**: Milisaniye hassasiyetli, CSV export
- **i18n**: Tam TR/EN dil desteği
- **PWA**: Offline-first, yüklenebilir

---

## Firebase Entegrasyonu (Gelecek Adım)

```javascript
// config/firebase.config.js içinde:
const FIREBASE_CONFIG = {
  apiKey:    'YOUR_FIREBASE_API_KEY',   // ← Buraya gerçek değeri koy
  // ...
};

// src/core/auth.js içinde:
const FIREBASE_MODE = true;  // ← false'tan true'ya çevir
```

Firebase aktif olduğunda:
- `localStorage` → `Firestore` (otomatik geçiş)
- Çok cihaz desteği
- Gerçek multi-tenant izolasyon
- Offline persistence (enablePersistence)

---

## Lisans

© 2025 Duay Global Trade Company. Tüm hakları saklıdır.  
info@duaycor.com
