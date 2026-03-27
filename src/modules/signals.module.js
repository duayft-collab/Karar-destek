/**
 * Strategy Hub — src/modules/signals.module.js
 * Strateji Merkezi — canlı sinyaller + AI analiz + ülke haritası + fuar takvimi
 * Versiyon: 5.5.0 | 2026-03-27
 */

'use strict';
import { Store }  from '../core/store.js';
import { Logger } from '../core/logger.js';
import { UI }     from '../core/ui.js';

const CACHE_KEY    = 'strategy_analysis';
const CACHE_TTL    = 4 * 60 * 60 * 1000; // 4 saat

/* ── VERİ KAYNAKLARI ─────────────────────────────────────────────────── */
const COUNTRIES = [
  { id:'bae',   name:'BAE',            region:'arab',   growth:6.2, risk:'low',    gdp:'$500B+',  sector:'İnşaat malz., iç mekan, premium tüketim',     note:'Re-export hub — Körfez+Afrika+Asya',    payment:'Açık hesap' },
  { id:'sau',   name:'Suudi Arabistan',region:'arab',   growth:5.8, risk:'low',    gdp:'Vision2030', sector:'Çelik, makine, mobilya, tekstil',          note:'NEOM ve mega projeler 2030\'a dek sürer', payment:'Açık hesap' },
  { id:'iraq',  name:'Irak',           region:'arab',   growth:4.5, risk:'medium', gdp:'$11.84B ihracat', sector:'Yapı malz., elektrik ekipmanı, gıda', note:'Kara yolu avantajı, 4. büyük pazar',     payment:'Akreditif önerilir' },
  { id:'egypt', name:'Mısır',          region:'africa', growth:4.2, risk:'medium', gdp:'$3.3B ihracat', sector:'İnşaat, gıda, tekstil',                note:'Türkiye ilişkileri normalleşiyor',        payment:'Akreditif' },
  { id:'nga',   name:'Nijerya',        region:'africa', growth:3.8, risk:'high',   gdp:'$477B',   sector:'İnşaat malz., tekstil, gıda, ambalaj',        note:'220M nüfus — Afrika\'nın en büyüğü',     payment:'Akreditif zorunlu' },
  { id:'ken',   name:'Kenya',          region:'africa', growth:5.2, risk:'medium', gdp:'$118B',   sector:'Makine, tekstil, kimya',                      note:'Doğu Afrika hub\'ı — teknoloji büyüyor',  payment:'%30 ön ödeme' },
  { id:'zaf',   name:'Güney Afrika',   region:'africa', growth:2.1, risk:'low',    gdp:'$377B',   sector:'Her sektör — gümrük birliği avantajı',        note:'Tüm Güney Afrika\'ya tarifesiz erişim',   payment:'Açık hesap' },
  { id:'sen',   name:'Senegal',        region:'africa', growth:8.5, risk:'low',    gdp:'$28B',    sector:'Makine, tekstil, gıda',                       note:'CFA=Euro sabitli, petrol keşfi sıçrama',  payment:'Açık hesap' },
  { id:'mar',   name:'Fas',            region:'africa', growth:3.5, risk:'low',    gdp:'$142B',   sector:'Tekstil, gıda, kimya',                        note:'AB STA — Avrupa-Afrika köprüsü',          payment:'Açık hesap' },
  { id:'gha',   name:'Gana',           region:'africa', growth:4.8, risk:'medium', gdp:'$76B',    sector:'Tekstil, gıda işleme, ambalaj',               note:'Batı Afrika\'da güvenilir pazar',          payment:'%30 ön ödeme' },
  { id:'eth',   name:'Etiyopya',       region:'africa', growth:6.1, risk:'high',   gdp:'$156B',   sector:'İnşaat malz., gıda, tekstil',                 note:'Cibuti üzerinden çalış',                  payment:'Akreditif zorunlu' },
  { id:'civ',   name:'Fildişi Sahili', region:'africa', growth:6.8, risk:'low',    gdp:'$78B',    sector:'Gıda işleme, makine, ambalaj',                note:'Abidjan — Batı Afrika finans merkezi',    payment:'Açık hesap' },
];

const SECTORS = [
  { name:'İnşaat Malzemeleri', icon:'🏗️', markets:'BAE, Suudi, Irak, Mısır, Nijerya', detail:'Çimento, seramik, çelik profil, alüminyum doğrama. Tüm bölgede inşaat patlaması var.' },
  { name:'Tekstil & Hazır Giyim', icon:'👕', markets:'Nijerya, Kenya, Gana, Senegal, BAE', detail:'Fiyat-kalite dengesi ve hız Türkiye\'nin en büyük avantajı. 220M Nijeryalı talebi güçlü.' },
  { name:'Makine & Ekipman', icon:'⚙️', markets:'Kenya, Senegal, Güney Afrika, Fas', detail:'Tarımsal makine, sanayi ekipmanı. AfDB ihalelerini takip et — finansman garantili.' },
  { name:'Gıda İşleme & Ambalaj', icon:'📦', markets:'Tüm Afrika, Körfez', detail:'Nüfus artışı + şehirleşme = işlenmiş gıda talebi. Plastik ambalaj ve gıda makineleri öne çıkar.' },
  { name:'Kimya & Plastik', icon:'🧪', markets:'BAE, Fas, Mısır, Kenya', detail:'BAE üzerinden Güney Asya\'ya re-export. Tarım kimyasalları Afrika genelinde talep görüyor.' },
  { name:'Elektrik Ekipmanları', icon:'⚡', markets:'Irak, Nijerya, Etiyopya', detail:'Enerji altyapı yatırımları hızlanıyor. Kablo, pano, aydınlatma, enerji depolama.' },
];

const FAIRS = [
  { name:'Arab Health Dubai',         date:'Ocak 2026',    loc:'Dubai',     detail:'Sağlık teknolojisi & ekipman. Körfez sağlık yatırımları artıyor.',        urgent:false },
  { name:'Gulfood Dubai',             date:'Şubat 2026',   loc:'Dubai',     detail:'Gıda & içecek. Türk gıda ihracatı için en büyük platform. Devlet desteği al.', urgent:true },
  { name:'TABEF İş ve Ekonomi Forumu',date:'2026 İstanbul',loc:'İstanbul',  detail:'53 ülkeden 4000 katılımcı. DEİK üzerinden kayıt. En doğrudan Afrika bağlantısı.', urgent:true },
  { name:'IV. Türkiye-Afrika Zirvesi',date:'2026',         loc:'Afrika',    detail:'Devlet düzeyinde STA müzakereleri. Mümkünse katıl — üst düzey bağlantı.',  urgent:true },
  { name:'Big 5 Dubai',               date:'Kasım 2026',   loc:'Dubai',     detail:'İnşaat malz. & yapı ürünleri. BAE+Körfez alıcıları. Stand için devlet desteği al.', urgent:false },
  { name:'African Development Bank',  date:'Sürekli',      loc:'Online',    detail:'Finansman garantili ihale takibi. afdb.org — en güvenli Afrika işleri buradan.', urgent:false },
];

const SUPPORTS = [
  { name:'Sertifika Hibesi',      amount:'15.260.421 TL',  detail:'Uluslararası zorunlu sertifika ve test raporları. Afrika pazarında şart.',        cls:'gd' },
  { name:'Fuar Desteği',         amount:'Stand dahil',    detail:'Stand kiralama + tasarım. Afrika heyetleri 2026\'da artırıldı. Hemen başvur.',     cls:'gd' },
  { name:'Marka Tescili',        amount:'2.860.670 TL/yıl',detail:'4 yıl boyunca. Hedef Afrika ülkelerinde marka koruması için zorunlu.',            cls:'te' },
  { name:'Pazar Araştırması',    amount:'761.017 TL',     detail:'5 yurt dışı seyahat dahil. Hedef ülke seçimi için kullan.',                         cls:'te' },
  { name:'Türk Eximbank Sigortası', amount:'Prim oranı',  detail:'Yüksek riskli Afrika ülkelerinde ihracat alacak sigortası. Nijerya, Etiyopya zorunlu.', cls:'wn' },
  { name:'TURQUALITY',           amount:'Mağaza+Franchising', detail:'Afrika\'da kalıcı varlık için. Mağaza açma, dekorasyon, franchising desteklenir.', cls:'tu' },
];

/* ── YARDIMCILAR ─────────────────────────────────────────────────────── */
function _esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function _riskBadge(r) {
  return r === 'low'    ? '<span class="bdg up">Düşük Risk</span>'
       : r === 'medium' ? '<span class="bdg wn">Orta Risk</span>'
                        : '<span class="bdg dn">Yüksek Risk</span>';
}

/* ── CANLI KUR SİNYALLERİ ────────────────────────────────────────────── */
let _fxData = {};

async function loadFXSignals() {
  try {
    const res  = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json');
    const d    = await res.json();
    const r    = d?.usd;
    if (!r?.try) throw new Error('no data');

    _fxData = {
      usdTRY:  r.try,
      eurTRY:  r.try / r.eur,
      eurUSD:  1 / r.eur,
      usdXOF:  r.xof,
      usdNGN:  r.ngn,
      usdKES:  r.kes,
      ts: new Date().toISOString(),
    };

    // FX şeridini güncelle
    _setVal('sig-usd',    _fxData.usdTRY.toFixed(2) + ' ₺');
    _setVal('sig-eur',    _fxData.eurTRY.toFixed(2) + ' ₺');
    _setVal('sig-eurusd', _fxData.eurUSD.toFixed(4));
    _setBadge('sig-usd-dir',    'Güçlü Al', 'up');
    _setBadge('sig-eur-dir',    'Güçlü Al', 'up');
    _setBadge('sig-eurusd-dir', 'EUR Zayıf', 'dn');

    // Altın
    try {
      const g = await fetch('https://data-asg.goldprice.org/dbXRates/USD');
      const gd = await g.json();
      const gold = gd?.items?.[0]?.xauPrice;
      if (gold) {
        _setVal('sig-gold', '$' + Math.round(gold).toLocaleString('en-US'));
        _setBadge('sig-gold-dir', '+Güçlü', 'gd');
        _fxData.gold = gold;
      }
    } catch(_) {}

    renderSignals();
    _setVal('sig-updated', 'Son: ' + new Date().toLocaleTimeString('tr-TR'));

    // AI strateji — veri geldikten sonra tetikle
    await generateStrategy(false);

    // Global state ile entegre
    if (window.FXState) {
      window.FXState.usd = _fxData.usdTRY;
      window.FXState.eur = _fxData.eurTRY;
    }
    Logger.info('SIGNALS_FX_LOADED');
  } catch(e) {
    Logger.warn('SIGNALS_FX_FAILED', { message: e.message });
  }
}

function _setVal(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }
function _setBadge(id, txt, cls) {
  const el = document.getElementById(id);
  if (el) { el.textContent = txt; el.className = 'pc-chg ' + cls; }
}

/* ── SİNYAL HESAPLAMA ────────────────────────────────────────────────── */
function _buildSignals() {
  const fx = _fxData;
  const signals = [
    { dir:'negative', label:'USD/TRY teknik', detail:'Tüm zaman dilimlerinde Güçlü Al sinyali aktif', impact:'TL aleyhine' },
    { dir:'negative', label:'EUR/TRY teknik', detail:'Günlük, haftalık, aylık Güçlü Al sinyali', impact:'TL aleyhine' },
    { dir:'negative', label:'Fed faiz ötelendi', detail:'Temmuz\'dan Eylül\'e ertelendi — dolar güçlü kalır', impact:'USD güçlü' },
    { dir:'negative', label:'DXY 99.75 jeopolitik', detail:'ABD-İran gerilimi güvenli liman talebini artırıyor', impact:'Dolar baskısı' },
    { dir:'neutral',  label:'EUR/USD 1.1563', detail:'Mart\'tan bu yana düşüş trendi sürüyor', impact:'EUR tahsilat dikkat' },
    { dir:'neutral',  label:'TCMB faiz yaz\'a kaldı', detail:'%42.50 sabit — TL yapısal baskı altında', impact:'TL baskısı sürüyor' },
    { dir:'positive', label:'DXY 100 geçemiyor', detail:'Psikolojik direnç aşılamıyor — dolar gücü sınırlı', impact:'Denge faktörü' },
    { dir:'positive', label:'EUR ihracat avantajı', detail:'EUR değerliyken Avrupa ihracat marjı iyi', impact:'İhracatçı lehine' },
  ];
  return signals;
}

function renderSignals() {
  const el = document.getElementById('sig-list');
  if (!el) return;
  const signals  = _buildSignals();
  const negCount = signals.filter(s => s.dir === 'negative').length;
  const posCount = signals.filter(s => s.dir === 'positive').length;

  const badge = document.getElementById('sig-count-badge');
  if (badge) {
    badge.textContent = `${negCount} Negatif · ${posCount} Pozitif`;
    badge.className   = 'bdg ' + (negCount > posCount ? 'dn' : 'wn');
  }

  el.innerHTML = signals.map(s => {
    const dot  = s.dir === 'negative' ? '#E24B4A' : s.dir === 'positive' ? '#639922' : '#BA7517';
    const cls  = s.dir === 'negative' ? 'dn' : s.dir === 'positive' ? 'up' : 'wn';
    return `<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:1px solid var(--sidebar-border)">
      <div style="width:8px;height:8px;border-radius:50%;background:${dot};margin-top:3px;flex-shrink:0"></div>
      <div style="flex:1">
        <div style="font-size:11px;font-weight:700;color:var(--text);margin-bottom:1px">${_esc(s.label)}</div>
        <div style="font-size:10px;color:var(--text2)">${_esc(s.detail)}</div>
      </div>
      <span class="bdg ${cls}" style="font-size:8px;white-space:nowrap">${_esc(s.impact)}</span>
    </div>`;
  }).join('');
}

/* ── AI STRATEJİ ANALİZİ ─────────────────────────────────────────────── */
async function generateStrategy(force = false) {
  const el = document.getElementById('ai-strategy-result');
  if (!el) return;

  // Cache kontrolü
  if (!force) {
    const cached = Store.get(CACHE_KEY);
    if (cached && Date.now() - new Date(cached.ts).getTime() < CACHE_TTL) {
      el.innerHTML = cached.html;
      return;
    }
  }

  el.innerHTML = `<span class="sp" style="width:95%;height:13px;display:inline-block;margin-bottom:5px"></span><br>
    <span class="sp" style="width:80%;height:13px;display:inline-block;margin-bottom:5px"></span><br>
    <span class="sp" style="width:90%;height:13px;display:inline-block"></span>`;

  const fx = _fxData;
  if (!fx.usdTRY) { el.innerHTML = '<span style="color:var(--text3);font-size:11px">Kur verisi bekleniyor…</span>'; return; }

  const prompt = `Sen Türk ihracatçılara hizmet eden stratejik finans danışmanısın. Aşağıdaki güncel piyasa verilerine bakarak 3 somut aksiyon içeren kısa strateji önerisi yaz. Türkçe. Rakamları kullan. Net ve doğrudan ol.

Güncel veriler (${new Date().toLocaleDateString('tr-TR')}):
- USD/TRY: ${fx.usdTRY?.toFixed(2)}
- EUR/TRY: ${fx.eurTRY?.toFixed(2)}
- EUR/USD: ${fx.eurUSD?.toFixed(4)}
- Ons Altın: $${fx.gold ? Math.round(fx.gold) : '3080'}
- DXY: 99.75 (ABD-İran gerginliği güvenli liman talebini artırıyor)
- Fed: Faiz indirimi Eylül'e ötelendi
- TCMB: %42.50 faiz, yaz'a kadar değişmez
- Teknik: USD/TRY ve EUR/TRY tüm zaman dilimlerinde Güçlü Al

Bağlam: Türkiye'den Afrika ve Arap pazarına ihracat yapan bir firma.

Format: 
ÖZET: [1 cümle genel değerlendirme]
AKSIYON 1: [Ne yapmalı — somut]
AKSIYON 2: [Ne yapmalı — somut]
AKSIYON 3: [Ne yapmalı — somut]
UYARI: [1 cümle kritik risk]`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 350,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) throw new Error('API ' + res.status);
    const data = await res.json();
    const text = data.content?.[0]?.text?.trim();
    if (!text) throw new Error('Boş yanıt');

    // Formatı HTML'e çevir
    const html = text
      .replace(/^ÖZET:/m,       '<div style="font-size:10px;font-weight:800;color:var(--text3);letter-spacing:.1em;text-transform:uppercase;margin-bottom:3px">Özet</div><div style="margin-bottom:10px">')
      .replace(/^AKSİYON 1:/m,  '</div><div style="padding:7px 10px;background:rgba(5,150,105,.06);border:1px solid rgba(5,150,105,.15);border-radius:7px;margin-bottom:5px"><span style="font-size:9px;font-weight:800;color:var(--green);text-transform:uppercase;letter-spacing:.1em">Aksiyon 1</span><br>')
      .replace(/^AKSIYON 1:/m,  '</div><div style="padding:7px 10px;background:rgba(5,150,105,.06);border:1px solid rgba(5,150,105,.15);border-radius:7px;margin-bottom:5px"><span style="font-size:9px;font-weight:800;color:var(--green);text-transform:uppercase;letter-spacing:.1em">Aksiyon 1</span><br>')
      .replace(/^AKSİYON 2:/m,  '</div><div style="padding:7px 10px;background:rgba(37,99,235,.06);border:1px solid rgba(37,99,235,.15);border-radius:7px;margin-bottom:5px"><span style="font-size:9px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:.1em">Aksiyon 2</span><br>')
      .replace(/^AKSIYON 2:/m,  '</div><div style="padding:7px 10px;background:rgba(37,99,235,.06);border:1px solid rgba(37,99,235,.15);border-radius:7px;margin-bottom:5px"><span style="font-size:9px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:.1em">Aksiyon 2</span><br>')
      .replace(/^AKSİYON 3:/m,  '</div><div style="padding:7px 10px;background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.15);border-radius:7px;margin-bottom:5px"><span style="font-size:9px;font-weight:800;color:var(--accent2);text-transform:uppercase;letter-spacing:.1em">Aksiyon 3</span><br>')
      .replace(/^AKSIYON 3:/m,  '</div><div style="padding:7px 10px;background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.15);border-radius:7px;margin-bottom:5px"><span style="font-size:9px;font-weight:800;color:var(--accent2);text-transform:uppercase;letter-spacing:.1em">Aksiyon 3</span><br>')
      .replace(/^UYARI:/m,       '</div><div style="padding:7px 10px;background:rgba(220,38,38,.06);border:1px solid rgba(220,38,38,.2);border-radius:7px"><span style="font-size:9px;font-weight:800;color:var(--red);text-transform:uppercase;letter-spacing:.1em">Kritik Uyarı</span><br>')
      + '</div>';

    el.innerHTML = html;
    Store.set(CACHE_KEY, { html, ts: new Date().toISOString() });
    Logger.info('STRATEGY_GENERATED');
  } catch(e) {
    el.innerHTML = `<span style="color:var(--text3);font-size:11px">AI analizi şu an mevcut değil — manuel sinyallere bak.</span>`;
    Logger.warn('STRATEGY_FAILED', { message: e.message });
  }
}

/* ── ÜLKE HARİTASI ───────────────────────────────────────────────────── */
let _activeFilter = 'all';

function filterCountries(f) {
  _activeFilter = f;
  renderCountries();
}

function renderCountries() {
  const el = document.getElementById('country-grid');
  if (!el) return;
  let list = COUNTRIES;
  if (_activeFilter === 'africa')  list = COUNTRIES.filter(c => c.region === 'africa');
  if (_activeFilter === 'arab')    list = COUNTRIES.filter(c => c.region === 'arab');
  if (_activeFilter === 'low')     list = COUNTRIES.filter(c => c.risk === 'low');
  if (_activeFilter === 'high')    list = COUNTRIES.sort((a,b) => b.growth - a.growth).slice(0, 6);

  el.innerHTML = list.map(c => `
    <div style="padding:11px 12px;border-radius:10px;border:1px solid var(--sidebar-border);background:var(--bg3)">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
        <span style="font-size:13px;font-weight:700;color:var(--text)">${_esc(c.name)}</span>
        ${_riskBadge(c.risk)}
      </div>
      <div style="font-size:9px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">
        ${_esc(c.gdp)} · %${c.growth} büyüme
      </div>
      <div style="font-size:10px;color:var(--text2);line-height:1.45;margin-bottom:4px">${_esc(c.sector)}</div>
      <div style="font-size:10px;color:var(--text3);font-style:italic;margin-bottom:4px">${_esc(c.note)}</div>
      <div style="font-size:9px;font-weight:700;color:var(--accent)">${_esc(c.payment)}</div>
    </div>`).join('');
}

/* ── SEKTÖR GRİDİ ────────────────────────────────────────────────────── */
function renderSectors() {
  const el = document.getElementById('sector-grid');
  if (!el) return;
  el.innerHTML = SECTORS.map(s => `
    <div style="padding:11px 12px;border-radius:10px;border:1px solid var(--sidebar-border);background:var(--bg3)">
      <div style="font-size:16px;margin-bottom:5px">${s.icon}</div>
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:3px">${_esc(s.name)}</div>
      <div style="font-size:9px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px">${_esc(s.markets)}</div>
      <div style="font-size:10px;color:var(--text2);line-height:1.45">${_esc(s.detail)}</div>
    </div>`).join('');
}

/* ── FUAR TAKVİMİ ────────────────────────────────────────────────────── */
function renderFairs() {
  const el = document.getElementById('fair-list');
  if (!el) return;
  el.innerHTML = FAIRS.map(f => `
    <div style="display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:start;padding:10px 12px;border-radius:10px;border:1px solid ${f.urgent ? 'rgba(37,99,235,.2)' : 'var(--sidebar-border)'};background:${f.urgent ? 'rgba(37,99,235,.04)' : 'var(--bg3)'}">
      <div>
        <div style="font-size:9px;font-weight:800;color:${f.urgent ? 'var(--accent)' : 'var(--text3)'};text-transform:uppercase;letter-spacing:.1em;white-space:nowrap">${_esc(f.date)}</div>
        <div style="font-size:9px;color:var(--text3);margin-top:2px">${_esc(f.loc)}</div>
      </div>
      <div>
        <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:2px">${_esc(f.name)}</div>
        <div style="font-size:10px;color:var(--text2);line-height:1.45">${_esc(f.detail)}</div>
      </div>
      ${f.urgent ? '<span class="bdg up" style="white-space:nowrap">Öncelikli</span>' : '<span class="bdg nt" style="white-space:nowrap">Takip et</span>'}
    </div>`).join('');
}

/* ── DEVLET DESTEKLERİ ───────────────────────────────────────────────── */
function renderSupports() {
  const el = document.getElementById('support-grid');
  if (!el) return;
  el.innerHTML = SUPPORTS.map(s => `
    <div style="padding:11px 12px;border-radius:10px;border:1px solid var(--sidebar-border);background:var(--bg3)">
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:3px">${_esc(s.name)}</div>
      <div style="margin-bottom:5px"><span class="bdg ${s.cls}">${_esc(s.amount)}</span></div>
      <div style="font-size:10px;color:var(--text2);line-height:1.45">${_esc(s.detail)}</div>
    </div>`).join('');
}

/* ── BAŞLATMA ─────────────────────────────────────────────────────────── */
async function init() {
  renderCountries();
  renderSectors();
  renderFairs();
  renderSupports();
  await loadFXSignals();
  setInterval(() => { if (!document.hidden) loadFXSignals(); }, 60_000);
  Logger.info('SIGNALS_MODULE_INIT_v5.5');
}

export const SignalsModule = { init, generateStrategy, filterCountries, renderCountries };
window.SignalsModule = SignalsModule;
