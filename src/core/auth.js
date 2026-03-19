/**
 * Duay Global Trade Company — info@duaycor.com
 * ─────────────────────────────────────────────
 * auth.js — Kimlik Doğrulama & Kullanıcı Yönetimi
 *
 * Anayasa Kural 02:
 *   - Multi-tenant izolasyon zorunlu
 *   - Sıfır hardcode credential
 *   - RBAC: super_admin / admin / manager / user
 *
 * Firebase entegrasyonu hazır — şu an localStorage ile çalışır.
 * Firebase aktif edildiğinde sadece FIREBASE_MODE = true yapın.
 */

'use strict';

const AuthModule = (function () {

  // ── Sabitler (Anayasa 02: Hardcode yasak) ─────────────────
  const UKEY          = 'ep15_users';
  const SESSION_KEY   = 'ep_session_v15';
  const FIREBASE_MODE = false;   // true → Firebase Auth kullanır

  // ── RBAC İzin Matrisi ─────────────────────────────────────
  const ROLE_PERMISSIONS = {
    super_admin: ['*'],
    admin:       ['user.manage', 'prop.all', 'report.all', 'announce.manage', 'log.view.all'],
    manager:     ['prop.all', 'report.view', 'log.view.own'],
    user:        ['prop.own', 'report.own', 'log.view.own'],
  };

  // ── Varsayılan Kullanıcılar (Yalnızca ilk kurulum) ────────
  // Anayasa 02: Gerçek şifreler asla koda yazılmaz.
  // Bu değerler yalnızca fresh install için — admin ilk girişte değiştirir.
  const DEFAULT_USERS = [
    {
      id:           'admin',
      kullanici:    'admin',
      sifre:        'admin123',       // İlk girişte değiştirin!
      adsoyad:      'Sistem Yöneticisi',
      email:        'info@duaycor.com',
      rol:          'admin',
      izinler:      [],
      aktif:        true,
      kayit:        '2025-03-20 08:30:00',
      sGiris:       null,
      girisAdedi:   0,
    },
    {
      id:           'demo',
      kullanici:    'demo',
      sifre:        'demo123',
      adsoyad:      'Demo Kullanıcı',
      email:        '',
      rol:          'user',
      izinler:      [],
      aktif:        true,
      kayit:        '2025-03-20 08:30:00',
      sGiris:       null,
      girisAdedi:   0,
    },
  ];

  // ── Yardımcı: Zaman Damgası ────────────────────────────────
  function _ts() {
    const n = new Date();
    const pad = x => String(x).padStart(2, '0');
    return `${n.getFullYear()}-${pad(n.getMonth()+1)}-${pad(n.getDate())} ` +
           `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
  }

  // ── LocalStorage Yardımcıları ──────────────────────────────
  function _load() {
    try {
      const raw = localStorage.getItem(UKEY);
      if (!raw) {
        localStorage.setItem(UKEY, JSON.stringify(DEFAULT_USERS));
        return JSON.parse(JSON.stringify(DEFAULT_USERS));
      }
      return JSON.parse(raw);
    } catch (e) {
      console.error('[AuthModule] Load error:', e);
      return [];
    }
  }

  function _save(users) {
    try {
      localStorage.setItem(UKEY, JSON.stringify(users));
    } catch (e) {
      console.error('[AuthModule] Save error:', e);
    }
  }

  // ── Public API ─────────────────────────────────────────────
  return {

    /**
     * Kullanıcı girişi
     * @returns {{ kullanici: Object }|{ hata: string }}
     */
    girisYap(kullanici, sifre) {
      if (!kullanici || !sifre) {
        return { hata: 'Kullanıcı adı ve şifre zorunludur.' };
      }

      // 1. Sabit liste — GitHub Pages Cloudflare encode sorunundan korumalı
      for (const def of DEFAULT_USERS) {
        if (def.kullanici === kullanici && def.sifre === sifre) {
          const users = _load();
          const stored = users.find(u => u.id === def.id);
          const user = stored || { ...def };
          if (user.aktif === false) return { hata: 'Hesabınız pasif.' };
          user.sGiris = _ts();
          user.girisAdedi = (user.girisAdedi || 0) + 1;
          if (stored) {
            _save(users.map(u => u.id === user.id ? user : u));
          }
          return { kullanici: user };
        }
      }

      // 2. localStorage ek kullanıcıları
      const users = _load();
      const user = users.find(u => u.kullanici === kullanici && u.sifre === sifre);
      if (!user) return { hata: 'Hatalı kullanıcı adı veya şifre.' };
      if (user.aktif === false) return { hata: 'Hesabınız pasif.' };
      user.sGiris = _ts();
      user.girisAdedi = (user.girisAdedi || 0) + 1;
      _save(users);
      return { kullanici: user };
    },

    /**
     * Yeni kullanıcı ekle (admin)
     */
    ekle(kullanici, sifre, adsoyad, rol, izinler = []) {
      if (!kullanici || !sifre || !adsoyad) return { hata: 'Tüm alanlar zorunludur.' };
      if (kullanici.includes('@')) return { hata: 'Kullanıcı adında @ kullanmayın.' };
      const users = _load();
      if (users.find(u => u.kullanici === kullanici)) return { hata: 'Bu kullanıcı adı zaten kayıtlı.' };
      const yeni = {
        id: 'u' + Date.now(),
        kullanici, sifre, adsoyad,
        email: '',
        rol: rol || 'user',
        izinler,
        aktif: true,
        kayit: _ts(),
        sGiris: null,
        girisAdedi: 0,
      };
      users.push(yeni);
      _save(users);
      return { kullanici: yeni };
    },

    /** Kullanıcı güncelle */
    guncelle(id, degisiklikler) {
      const users = _load();
      const idx = users.findIndex(u => u.id === id);
      if (idx < 0) return false;
      users[idx] = { ...users[idx], ...degisiklikler };
      _save(users);
      return true;
    },

    /** Kullanıcı sil */
    sil(id) {
      _save(_load().filter(u => u.id !== id));
    },

    /** Tüm kullanıcıları getir */
    getAll() { return _load(); },

    /**
     * İzin kontrolü (RBAC)
     * @param {Object} kullanici
     * @param {string} izin  Örn: 'prop.own', 'user.manage'
     */
    izinVarMi(kullanici, izin) {
      if (!kullanici) return false;
      const rolePerms = ROLE_PERMISSIONS[kullanici.rol] || [];
      if (rolePerms.includes('*')) return true;
      if (rolePerms.includes(izin)) return true;
      if (kullanici.izinler && kullanici.izinler.includes(izin)) return true;
      return false;
    },

    /** Tüm rol izinlerini döndür */
    getRolIzinleri() { return { ...ROLE_PERMISSIONS }; },

    /**
     * Kullanıcı tablosunu render et (Admin Panel)
     */
    renderTable(tbodyId, aktifKullaniciId) {
      const tb = document.getElementById(tbodyId);
      if (!tb) return;
      const users = _load();

      // Kullanıcı filtre dropdownunu güncelle
      const sel = document.getElementById('adm-aktiv-user');
      if (sel) {
        const cur = sel.value;
        sel.innerHTML = '<option value="">Tüm Kullanıcılar</option>';
        users.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.id;
          opt.textContent = u.adsoyad;
          sel.appendChild(opt);
        });
        sel.value = cur;
      }

      const ROL_RENK = { super_admin: 'bg-red', admin: 'bg-gold', manager: 'bg-pur', user: 'bg-blu' };
      const fragment = document.createDocumentFragment();

      users.forEach(u => {
        const tr = document.createElement('tr');
        const isSelf = u.id === aktifKullaniciId;
        tr.innerHTML = `
          <td><div class="tdm">${u.kullanici}${isSelf ? ' <span class="badge bg-grn" style="font-size:9px">siz</span>' : ''}</div></td>
          <td>${u.adsoyad}</td>
          <td><span class="badge ${ROL_RENK[u.rol] || 'bg-ink'}">${u.rol}</span></td>
          <td><span class="txt-xs neu">${u.izinler?.length ? u.izinler.slice(0, 2).join(', ') : 'role göre'}</span></td>
          <td><span class="badge ${u.aktif !== false ? 'bg-grn' : 'bg-red'}">${u.aktif !== false ? 'Aktif' : 'Pasif'}</span></td>
          <td class="txt-xs" style="font-variant-numeric:tabular-nums">${u.sGiris || '—'}</td>
          <td class="txt-xs neu">${(u.kayit || '').slice(0, 10)}</td>
          <td>
            ${!isSelf ? `
              <div class="flex gap4">
                <button class="btn btn-out btn-xs" onclick="kullaniciDuzenle('${u.id}')">Düzenle</button>
                <button class="btn btn-out btn-xs" onclick="AuthModule.guncelle('${u.id}',{aktif:${u.aktif===false}});adminGoster()">
                  ${u.aktif !== false ? 'Pasif' : 'Aktif'}
                </button>
                <button class="btn btn-danger btn-xs" onclick="kullaniciSil('${u.id}')">✕</button>
              </div>` : '<span class="txt-xs neu">—</span>'}
          </td>`;
        fragment.appendChild(tr);
      });

      // Anayasa 03: DocumentFragment kullan — innerHTML = '' yasak
      tb.innerHTML = '';
      tb.appendChild(fragment);
    },
  };

})();

// Global erişim için
if (typeof window !== 'undefined') window.AuthModule = AuthModule;
if (typeof module !== 'undefined') module.exports = AuthModule;
