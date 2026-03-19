/**
 * Duay Global Trade Company — info@duaycor.com
 * ─────────────────────────────────────────────
 * i18n.js — Türkçe / İngilizce Çeviri Modülü
 * Anayasa Kural 01 & 07: Tüm arayüz TR/EN destekli
 */

'use strict';

const I18N = (function () {

  // ── Çeviri Sözlüğü ─────────────────────────────────────────
  const TRANSLATIONS = {
    tr: {
      // ── Genel ──
      appName:          'Emlak Pro',
      appSubtitle:      'Gayrimenkul Yönetim Sistemi',
      company:          'Duay Global Trade Company',
      loading:          'Yükleniyor...',
      save:             'Kaydet',
      cancel:           'İptal',
      delete:           'Sil',
      edit:             'Düzenle',
      add:              'Ekle',
      close:            'Kapat',
      confirm:          'Onaylıyorum',
      search:           'Ara...',
      noData:           'Veri yok.',
      yes:              'Evet',
      no:               'Hayır',
      ok:               'Tamam',
      back:             'Geri',
      next:             'İleri',
      filter:           'Filtrele',
      all:              'Tümü',
      active:           'Aktif',
      passive:          'Pasif',
      success:          'Başarılı',
      error:            'Hata',
      warning:          'Uyarı',
      info:             'Bilgi',

      // ── Auth ──
      loginTitle:       'Giriş Yap',
      registerTitle:    'Kayıt Ol',
      username:         'Kullanıcı Adı',
      password:         'Şifre',
      passwordMin:      'Şifre (min. 6 karakter)',
      fullName:         'Ad Soyad',
      loginBtn:         'Giriş Yap →',
      registerBtn:      'Kayıt Ol →',
      logout:           'Çıkış',
      loginSuccess:     'Giriş başarılı.',
      loginError:       'Hatalı kullanıcı adı veya şifre.',
      logoutConfirm:    'Çıkış yapmak istediğinize emin misiniz?',
      accountInactive:  'Hesabınız pasif. Yönetici ile iletişime geçin.',
      localMode:        'Yerel Mod',
      errEmpty:         'Kullanıcı adı ve şifre giriniz.',
      errWeak:          'Şifre en az 6 karakter olmalı.',
      errUserExists:    'Bu kullanıcı adı zaten kayıtlı.',
      regSuccess:       'Kayıt başarılı! Giriş yapabilirsiniz.',

      // ── Navigasyon ──
      nav: {
        dashboard:      'Dashboard',
        cashflow:       'Nakit Akışı',
        portfolio:      'Portföy',
        mortgage:       'Kredi Analizi',
        ai:             'AI Analiz',
        rental:         'Kira & Kiracı',
        calendar:       'Takvim',
        lease:          'Sözleşme',
        market:         'Piyasa İstihbaratı',
        knowledge:      'Bilgi Bankası',
        announcements:  'Duyurular',
        suggestions:    'Öneriler',
        versions:       'Sürüm Geçmişi',
        activity:       'Aktivite',
        admin:          'Admin Panel',
      },

      // ── Dashboard ──
      portfolioValue:   'Portföy Değeri',
      equity:           'Öz Sermaye',
      netCashFlow:      'Net CF/ay',
      activeAssets:     'Aktif Varlık',
      avgCapRate:       'Ort. Cap Rate',
      financialFreedom: 'Finansal Özgürlük',
      monthlyExpense:   'Aylık Gider (₺)',
      activePassive:    'Aktif / Pasif Varlıklar',
      noProperty:       'Henüz mülk yok',
      addFirstProperty: '+ İlk Mülkü Ekle',

      // ── Mülk ──
      property:         'Mülk',
      properties:       'Mülkler',
      addProperty:      '+ Mülk Ekle',
      editProperty:     'Mülk Düzenle',
      newProperty:      'Yeni Mülk Ekle',
      propertyName:     'Mülk Adı',
      propertyType:     'Tür',
      location:         'Konum / Adres',
      area:             'Alan (m²)',
      sqmPrice:         'm² Fiyatı (₺)',
      buyDate:          'Alış Tarihi',
      notes:            'Notlar',
      buyPrice:         'Alış Fiyatı',
      currentValue:     'Güncel Değer',
      purchaseCosts:    'Alış Masrafları (₺)',
      loanBalance:      'Kredi Bakiyesi (₺)',
      monthlyPayment:   'Aylık Taksit (₺)',
      buyYear:          'Alış Yılı',
      rent:             'Kira (₺/ay)',
      annualTax:        'Yıllık Vergi/Aidat (₺)',
      maintenance:      'Bakım (₺/ay)',
      management:       'Yönetim (₺/ay)',
      vacancy:          'Boşluk (%)',
      buildingAge:      'Bina Yaşı',
      deleteConfirm:    'silinecek?',
      propTypes: {
        apartment:      '🏢 Daire',
        villa:          '🏡 Villa',
        land:           '🌿 Arsa',
        field:          '🌾 Tarla',
        vineyard:       '🍇 Bağ / Bahçe',
        commercial:     '🏬 İşyeri',
        shop:           '🏪 Dükkan',
        warehouse:      '📦 Depo',
        office:         '💼 Ofis',
        hotel:          '🏨 Otel / Apart',
      },

      // ── Tapu ──
      titleDeed:        'Tapu Bilgileri',
      adaNo:            'Ada No',
      parselNo:         'Parsel No',
      pafta:            'Pafta',
      district:         'İl / İlçe',
      neighborhood:     'Mahalle',
      titleType:        'Tapu Türü',
      share:            'Hisse',

      // ── Finansal ──
      capRate:          'Cap Rate',
      roe:              'ROE',
      ltv:              'LTV',
      grm:              'GRM',
      dscr:             'DSCR',
      noi:              'NOI',
      grossRent:        'Brüt Kira',
      annualCF:         'Yıllık CF',

      // ── Kredi ──
      propertyValue:    'Mülk Değeri (₺)',
      downPayment:      'Peşinat (%)',
      monthlyRate:      'Aylık Faiz (%)',
      term:             'Vade (Ay)',
      rentIncome:       'Kira Geliri (₺/ay)',
      otherExpense:     'Diğer Gider (₺/ay)',
      inflation:        'Yıllık Enflasyon (%)',
      extraPayment:     'Ek Aylık Ödeme (₺)',
      usdRate:          'USD/TRY',
      goldPrice:        'Altın (₺/gram)',
      usdLoss:          'Yıllık USD Kaybı (%)',
      principalInterest:'Anapara / Faiz',
      debtCurve:        'Borç Azalma Eğrisi',

      // ── Kira ──
      tenantManagement: 'Kira & Kiracı',
      tenant:           'Kiracı',
      rentalStart:      'Başlangıç',
      paymentDay:       'Ödeme Günü',
      contractEnd:      'Sözleşme Bitiş',
      suggestedRent:    'Önerilen Kira',
      addRental:        '+ Kira Kaydı',
      noRental:         'Henüz kira kaydı yok.',
      contractExpired:  '⚠️ Süresi Doldu',
      daysLeft:         'gün kaldı',

      // ── Takvim ──
      calendarTitle:    'Takvim & Ödemeler',
      addPayment:       '+ Ödeme',
      thisMonth:        'Bu Ayın Ödemeleri',
      upcoming30:       'Yaklaşan (30 Gün)',
      overdue:          'Gecikmiş Ödemeler',
      monthSummary:     'Aylık Özet',
      income:           'Gelir',
      expense:          'Gider',
      net:              'Net',
      today:            'Bugün',
      noUpcoming:       'Yaklaşan ödeme yok ✓',
      noOverdue:        'Gecikmiş ödeme yok ✓',
      paymentTypes: {
        rent:           '💚 Kira',
        loan:           '💸 Kredi',
        tax:            '📋 Vergi',
        maintenance:    '🔧 Bakım',
        other:          '📌 Diğer',
      },

      // ── Admin ──
      adminPanel:       'Admin Panel',
      userList:         'Kullanıcı Listesi',
      addUser:          '+ Kullanıcı Ekle',
      role:             'Rol',
      status:           'Durum',
      lastLogin:        'Son Giriş',
      registered:       'Kayıt',
      permissions:      'İzinler',
      byRole:           'role göre',
      makePassive:      'Pasif Yap',
      makeActive:       'Aktif Yap',
      changeRole:       'Rol Değiştir',
      deleteUser:       'Kullanıcıyı Sil',
      deleteUserConfirm:'Kullanıcı silinecek? Bu işlem geri alınamaz.',
      roleConfirm:      'Rol değiştirilsin mi?',
      userCreated:      'Kullanıcı oluşturuldu.',
      allFields:        'Tüm alanlar zorunludur.',
      noAt:             'Kullanıcı adında @ kullanmayın.',
      publishAnn:       '📢 Yayınla',
      annPublished:     'Duyuru yayınlandı!',
      titleRequired:    'TR başlık ve içerik zorunludur.',

      // ── Duyurular ──
      announcements:    'Duyurular',
      noAnnouncement:   'Duyuru yok.',
      understood:       'Anladım',
      later:            'Sonra',
      update:           'Güncelleme',

      // ── Sürüm Geçmişi ──
      versions:         'Sürüm Geçmişi',

      // ── Aktivite ──
      activityLog:      'Aktivite Kaydı',
      noActivity:       'Log bulunamadı.',

      // ── Öneriler ──
      suggestions:      'Güncelleme Önerileri',
      newSuggestion:    'Yeni Öneri Gönder',
      category:         'Kategori',
      title:            'Başlık',
      description:      'Açıklama',
      sendSuggestion:   'Gönder →',
      suggSent:         'Öneri gönderildi! Teşekkürler.',
      suggCategories: {
        feature:        '💡 Yeni Özellik',
        bug:            '🐛 Hata Bildirimi',
        improvement:    '⚡ İyileştirme',
        other:          '📌 Diğer',
      },
      suggStatus: {
        yeni:           'Yeni',
        inceleniyor:    'İnceleniyor',
        kabul:          'Kabul Edildi',
        red:            'Reddedildi',
      },

      // ── Veri ──
      exportExcel:      '↓ Excel',
      exportPDF:        '↓ PDF',
      exportBackup:     '↓ Yedek',
      importData:       '↑ Yükle',
      savedAt:          'kaydedildi',

      // ── Sözleşme ──
      leaseTitle:       'Sözleşme Üretici',
      landlord:         'Kiraya Veren',
      tcVkn:            'TC/VKN',
      address:          'Adres',
      renter:           'Kiracı',
      renterAddress:    'Kiracı Adresi',
      propertyAddress:  'Mülk Adresi',
      roomCount:        'Oda',
      floor:            'Kat',
      usage:            'Kullanım',
      depositAmount:    'Depozito (₺)',
      startDate:        'Başlangıç',
      duration:         'Süre',
      generateLease:    'Sözleşme Oluştur →',
      fillForm:         'Formu doldurun →',
      print:            'Yazdır',
      copy:             'Kopyala',
      copied:           'Kopyalandı.',

      // ── Piyasa ──
      marketIntel:      'Piyasa İstihbaratı',
      liveAnalysis:     '🔴 Canlı Analiz',
      refresh:          '⟳ Güncelle',
      analyzing:        'Analiz ediliyor...',
      updateHint:       'Güncelle butonuna basın — AI piyasa analizi yapacak',
      refCity:          'Referans Şehir / Bölge',
      focus:            'Portföy Odak',
      headlines:        '📰 Başlıklar',
      indicators:       '📊 Temel Göstergeler',
      watchList:        '🌐 Takip Listesi',
      portfolioImpact:  '💡 Portföy Etkisi',
      savedAnalyses:    '🗂 Kayıtlı Analizler',
      noAnalysis:       'Henüz analiz yapılmadı.',

      // ── Bilgi Bankası ──
      knowledgeBank:    'Bilgi Bankası',
      dailyQuote:       '✨ Günün Sözü',
      noResult:         'Sonuç bulunamadı.',
      addKnowledge:     '+ Ekle',
      addToBank:        'Bilgi Bankasına Ekle',
      content:          'İçerik / Söz / Başlık',
      author:           'Yazar / Kaynak',
      book:             'Kitap / Eser',
      tags:             'Etiketler (virgülle ayır)',
      knowledgeAdded:   'Bilgi bankasına eklendi!',
      knowledgeCategories: {
        sozler:   '💬 Özlü Sözler',
        kitaplar: '📖 Kitaplar',
        ilkeler:  '🎯 Yatırım İlkeleri',
        ipuclari: '💡 İpuçları',
      },
    },

    // ══════════════════════════════════════════════
    en: {
      appName:          'Emlak Pro',
      appSubtitle:      'Real Estate Management System',
      company:          'Duay Global Trade Company',
      loading:          'Loading...',
      save:             'Save',
      cancel:           'Cancel',
      delete:           'Delete',
      edit:             'Edit',
      add:              'Add',
      close:            'Close',
      confirm:          'Confirm',
      search:           'Search...',
      noData:           'No data.',
      yes:              'Yes',
      no:               'No',
      ok:               'OK',
      back:             'Back',
      next:             'Next',
      filter:           'Filter',
      all:              'All',
      active:           'Active',
      passive:          'Passive',
      success:          'Success',
      error:            'Error',
      warning:          'Warning',
      info:             'Info',

      loginTitle:       'Sign In',
      registerTitle:    'Register',
      username:         'Username',
      password:         'Password',
      passwordMin:      'Password (min. 6 chars)',
      fullName:         'Full Name',
      loginBtn:         'Sign In →',
      registerBtn:      'Register →',
      logout:           'Log Out',
      loginSuccess:     'Login successful.',
      loginError:       'Incorrect username or password.',
      logoutConfirm:    'Are you sure you want to log out?',
      accountInactive:  'Your account is inactive. Contact admin.',
      localMode:        'Local Mode',
      errEmpty:         'Please enter username and password.',
      errWeak:          'Password must be at least 6 characters.',
      errUserExists:    'This username is already taken.',
      regSuccess:       'Registered! You can now sign in.',

      nav: {
        dashboard:      'Dashboard',
        cashflow:       'Cash Flow',
        portfolio:      'Portfolio',
        mortgage:       'Loan Analysis',
        ai:             'AI Analysis',
        rental:         'Rent & Tenants',
        calendar:       'Calendar',
        lease:          'Contract',
        market:         'Market Intel',
        knowledge:      'Knowledge Bank',
        announcements:  'Announcements',
        suggestions:    'Suggestions',
        versions:       'Version History',
        activity:       'Activity Log',
        admin:          'Admin Panel',
      },

      portfolioValue:   'Portfolio Value',
      equity:           'Equity',
      netCashFlow:      'Net CF/mo',
      activeAssets:     'Active Assets',
      avgCapRate:       'Avg. Cap Rate',
      financialFreedom: 'Financial Freedom',
      monthlyExpense:   'Monthly Expense (₺)',
      activePassive:    'Active / Passive Assets',
      noProperty:       'No properties yet',
      addFirstProperty: '+ Add First Property',

      property:         'Property',
      properties:       'Properties',
      addProperty:      '+ Add Property',
      editProperty:     'Edit Property',
      newProperty:      'Add New Property',
      propertyName:     'Property Name',
      propertyType:     'Type',
      location:         'Location / Address',
      area:             'Area (m²)',
      sqmPrice:         'm² Price (₺)',
      buyDate:          'Purchase Date',
      notes:            'Notes',
      buyPrice:         'Purchase Price',
      currentValue:     'Current Value',
      purchaseCosts:    'Purchase Costs (₺)',
      loanBalance:      'Loan Balance (₺)',
      monthlyPayment:   'Monthly Payment (₺)',
      buyYear:          'Purchase Year',
      rent:             'Rent (₺/mo)',
      annualTax:        'Annual Tax/Fee (₺)',
      maintenance:      'Maintenance (₺/mo)',
      management:       'Management (₺/mo)',
      vacancy:          'Vacancy (%)',
      buildingAge:      'Building Age',
      deleteConfirm:    'will be deleted?',
      propTypes: {
        apartment:      '🏢 Apartment',
        villa:          '🏡 Villa',
        land:           '🌿 Land',
        field:          '🌾 Field',
        vineyard:       '🍇 Vineyard',
        commercial:     '🏬 Commercial',
        shop:           '🏪 Shop',
        warehouse:      '📦 Warehouse',
        office:         '💼 Office',
        hotel:          '🏨 Hotel / Apart',
      },

      titleDeed:        'Title Deed Info',
      adaNo:            'Block No',
      parselNo:         'Parcel No',
      pafta:            'Sheet',
      district:         'Province / District',
      neighborhood:     'Neighborhood',
      titleType:        'Title Type',
      share:            'Share',

      capRate:          'Cap Rate',
      roe:              'ROE',
      ltv:              'LTV',
      grm:              'GRM',
      dscr:             'DSCR',
      noi:              'NOI',
      grossRent:        'Gross Rent',
      annualCF:         'Annual CF',

      propertyValue:    'Property Value (₺)',
      downPayment:      'Down Payment (%)',
      monthlyRate:      'Monthly Rate (%)',
      term:             'Term (Months)',
      rentIncome:       'Rent Income (₺/mo)',
      otherExpense:     'Other Expense (₺/mo)',
      inflation:        'Annual Inflation (%)',
      extraPayment:     'Extra Payment (₺/mo)',
      usdRate:          'USD/TRY',
      goldPrice:        'Gold (₺/gram)',
      usdLoss:          'Annual USD Loss (%)',
      principalInterest:'Principal / Interest',
      debtCurve:        'Debt Reduction Curve',

      tenantManagement: 'Rent & Tenants',
      tenant:           'Tenant',
      rentalStart:      'Start Date',
      paymentDay:       'Payment Day',
      contractEnd:      'Contract End',
      suggestedRent:    'Suggested Rent',
      addRental:        '+ Add Rental',
      noRental:         'No rental records yet.',
      contractExpired:  '⚠️ Expired',
      daysLeft:         'days left',

      calendarTitle:    'Calendar & Payments',
      addPayment:       '+ Payment',
      thisMonth:        'This Month\'s Payments',
      upcoming30:       'Upcoming (30 Days)',
      overdue:          'Overdue Payments',
      monthSummary:     'Monthly Summary',
      income:           'Income',
      expense:          'Expense',
      net:              'Net',
      today:            'Today',
      noUpcoming:       'No upcoming payments ✓',
      noOverdue:        'No overdue payments ✓',
      paymentTypes: {
        rent:           '💚 Rent',
        loan:           '💸 Loan',
        tax:            '📋 Tax',
        maintenance:    '🔧 Maintenance',
        other:          '📌 Other',
      },

      adminPanel:       'Admin Panel',
      userList:         'User List',
      addUser:          '+ Add User',
      role:             'Role',
      status:           'Status',
      lastLogin:        'Last Login',
      registered:       'Registered',
      permissions:      'Permissions',
      byRole:           'by role',
      makePassive:      'Set Passive',
      makeActive:       'Set Active',
      changeRole:       'Change Role',
      deleteUser:       'Delete User',
      deleteUserConfirm:'User will be deleted. This cannot be undone.',
      roleConfirm:      'Change role?',
      userCreated:      'User created.',
      allFields:        'All fields are required.',
      noAt:             'Do not use @ in username.',
      publishAnn:       '📢 Publish',
      annPublished:     'Announcement published!',
      titleRequired:    'TR title and content are required.',

      announcements:    'Announcements',
      noAnnouncement:   'No announcements.',
      understood:       'Got It',
      later:            'Later',
      update:           'Update',

      versions:         'Version History',
      activityLog:      'Activity Log',
      noActivity:       'No logs found.',

      suggestions:      'Suggestions',
      newSuggestion:    'Send a Suggestion',
      category:         'Category',
      title:            'Title',
      description:      'Description',
      sendSuggestion:   'Send →',
      suggSent:         'Suggestion sent! Thank you.',
      suggCategories: {
        feature:        '💡 New Feature',
        bug:            '🐛 Bug Report',
        improvement:    '⚡ Improvement',
        other:          '📌 Other',
      },
      suggStatus: {
        yeni:           'New',
        inceleniyor:    'Reviewing',
        kabul:          'Accepted',
        red:            'Rejected',
      },

      exportExcel:      '↓ Excel',
      exportPDF:        '↓ PDF',
      exportBackup:     '↓ Backup',
      importData:       '↑ Import',
      savedAt:          'saved',

      leaseTitle:       'Contract Generator',
      landlord:         'Landlord',
      tcVkn:            'ID / Tax No',
      address:          'Address',
      renter:           'Tenant',
      renterAddress:    'Tenant Address',
      propertyAddress:  'Property Address',
      roomCount:        'Rooms',
      floor:            'Floor',
      usage:            'Usage',
      depositAmount:    'Deposit (₺)',
      startDate:        'Start Date',
      duration:         'Duration',
      generateLease:    'Generate Contract →',
      fillForm:         'Fill the form →',
      print:            'Print',
      copy:             'Copy',
      copied:           'Copied.',

      marketIntel:      'Market Intelligence',
      liveAnalysis:     '🔴 Live Analysis',
      refresh:          '⟳ Refresh',
      analyzing:        'Analyzing...',
      updateHint:       'Click Refresh — AI will analyze the market',
      refCity:          'Reference City / Region',
      focus:            'Portfolio Focus',
      headlines:        '📰 Headlines',
      indicators:       '📊 Key Indicators',
      watchList:        '🌐 Watch List',
      portfolioImpact:  '💡 Portfolio Impact',
      savedAnalyses:    '🗂 Saved Analyses',
      noAnalysis:       'No analyses yet.',

      knowledgeBank:    'Knowledge Bank',
      dailyQuote:       '✨ Quote of the Day',
      noResult:         'No results found.',
      addKnowledge:     '+ Add',
      addToBank:        'Add to Knowledge Bank',
      content:          'Content / Quote / Title',
      author:           'Author / Source',
      book:             'Book / Work',
      tags:             'Tags (comma separated)',
      knowledgeAdded:   'Added to knowledge bank!',
      knowledgeCategories: {
        sozler:   '💬 Quotes',
        kitaplar: '📖 Books',
        ilkeler:  '🎯 Investment Principles',
        ipuclari: '💡 Tips & Tricks',
      },
    },
  };

  // ── Aktif Dil ──────────────────────────────────────────────
  let _lang = 'tr';

  // ── Public API ─────────────────────────────────────────────
  return {
    /**
     * Aktif dili değiştir
     * @param {'tr'|'en'} lang
     */
    setLang(lang) {
      if (!TRANSLATIONS[lang]) return;
      _lang = lang;
      document.documentElement.setAttribute('lang', lang);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ep_lang_v15', lang);
      }
    },

    /** Aktif dili döndür */
    getLang() { return _lang; },

    /**
     * Çeviri anahtarını çözümle
     * @param {string} key   Noktalı yol: 'nav.dashboard', 'propTypes.apartment'
     * @param {string} [fallback]
     */
    t(key, fallback) {
      const parts = key.split('.');
      let obj = TRANSLATIONS[_lang];
      for (const p of parts) {
        if (obj == null) break;
        obj = obj[p];
      }
      if (obj == null || typeof obj === 'object') {
        // Fallback to tr
        let fallObj = TRANSLATIONS['tr'];
        for (const p of parts) {
          if (fallObj == null) break;
          fallObj = fallObj[p];
        }
        return (typeof fallObj === 'string' ? fallObj : fallback) || key;
      }
      return obj;
    },

    /** Tüm dil sözlüğünü döndür (debug) */
    getAll() { return TRANSLATIONS[_lang]; },

    /** Uygulama başladığında localStorage'dan dili yükle */
    init() {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('ep_lang_v15');
        if (saved && TRANSLATIONS[saved]) _lang = saved;
      }
    },
  };
})();

if (typeof module !== 'undefined') module.exports = I18N;
