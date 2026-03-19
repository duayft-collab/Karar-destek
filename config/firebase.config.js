/**
 * Duay Global Trade Company — info@duaycor.com
 * ─────────────────────────────────────────────
 * firebase.config.js — Firebase Bağlantı Konfigürasyonu
 *
 * Anayasa Kural 02 (Sıfır Hardcode):
 *   API anahtarı, URL ve credential'lar asla koda yazılmaz.
 *   Aşağıdaki placeholder'ları kendi Firebase projenizden alın:
 *   Firebase Console → Project Settings → Your Apps → Web App
 *
 * KURULUM:
 *   1. https://console.firebase.google.com adresine gidin
 *   2. Projenizi seçin → Project Settings → General → Your apps
 *   3. Web uygulaması SDK'sını kopyalayıp aşağıya yapıştırın
 *   4. GÜVENLİK: Bu dosyayı .gitignore'a ekleyin!
 */

'use strict';

// ─── Firebase Konfigürasyonu (Placeholder) ────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            'YOUR_FIREBASE_API_KEY',
  authDomain:        'YOUR_PROJECT_ID.firebaseapp.com',
  projectId:         'YOUR_PROJECT_ID',
  storageBucket:     'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId:             'YOUR_APP_ID',
  measurementId:     'YOUR_MEASUREMENT_ID',  // opsiyonel — Analytics için
};

// ─── Firestore Koleksiyon Şeması ──────────────────────────────────────────
// Multi-tenant izolasyon (Anayasa 02):
//   /users/{uid}/                   → kullanıcı profili
//   /users/{uid}/properties/{id}    → mülkler (sadece sahibi erişir)
//   /users/{uid}/rentals/{id}       → kira kayıtları
//   /users/{uid}/payments/{id}      → ödemeler
//   /users/{uid}/activity/{id}      → aktivite logu
//   /announcements/{id}             → duyurular (public read, admin write)
//   /suggestions/{id}               → öneriler (auth read/write)
//   /admin/users/{uid}              → admin user yönetimi (sadece admin)

const FIRESTORE_COLLECTIONS = {
  users:         'users',
  properties:    'properties',      // users/{uid}/properties
  rentals:       'rentals',         // users/{uid}/rentals
  payments:      'payments',        // users/{uid}/payments
  activity:      'activity',        // users/{uid}/activity
  announcements: 'announcements',   // root — admin yazar, herkes okur
  suggestions:   'suggestions',     // root — auth kullanıcılar
  adminUsers:    'admin_users',     // root — sadece super_admin
};

Object.freeze(FIREBASE_CONFIG);
Object.freeze(FIRESTORE_COLLECTIONS);

if (typeof module !== 'undefined') {
  module.exports = { FIREBASE_CONFIG, FIRESTORE_COLLECTIONS };
}
