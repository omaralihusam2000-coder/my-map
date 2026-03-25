# خريطة العراق — Iraq Map PWA

تطبيق خرائط وملاحة تفاعلي للعراق، مبني كـ Progressive Web App.  
An interactive maps & navigation Progressive Web App focused on Iraq.

🌐 **Live demo:** https://omaralihusam2000-coder.github.io/my-map/

---

## الميزات / Features

- 🗺️ **خريطة تفاعلية** مركزها بغداد (OpenStreetMap + Leaflet)
- 🔍 **بحث عن الأماكن** عبر Nominatim API (مقيّد بالعراق)
- 🧭 **حساب المسارات** مع تعليمات خطوة بخطوة عبر OSRM
- 🚕 **تقدير أجرة التاكسي** بالدينار العراقي
- 📍 **طبقة أماكن الاهتمام (POI)** — مطاعم، كافيهات، صيدليات، مستشفيات، محطات وقود عبر Overpass API
- 🔊 **ملاحة صوتية باللغة العربية** — توجيهات صوتية بالعربية (Web Speech API)
- ⭐ **المفضلة** — حفظ الأماكن (localStorage)
- 🕐 **سجل البحث** مع إمكانية المسح
- 🌙 **الوضع الليلي / النهاري**
- 🌐 **ثلاث لغات**: العربية، الإنجليزية، الكردية
- 📤 **مشاركة الموقع والمسارات** عبر روابط قابلة للنسخ
- 📡 **كشف الاتصال بالإنترنت** مع بانر تحذيري
- 📱 **PWA** — قابل للتثبيت على الجوال مع دعم خدمة Service Worker

---

## طبقة أماكن الاهتمام (POI) / POI Layer

يعرض التطبيق أماكن الاهتمام على الخريطة تلقائياً عند مستوى تكبير 12 فأعلى، وتتحدث الأماكن تلقائياً عند التنقل في الخريطة (مع تأخير 800ms).

**الفئات المدعومة:** 🍽️ مطاعم | ☕ كافيهات | 💊 صيدليات | 🏥 مستشفيات | ⛽ وقود

- البيانات من **Overpass API** (OpenStreetMap)
- **التجميع التلقائي** للعلامات عبر `leaflet.markercluster`
- **التخزين المؤقت** في الذاكرة (5 دقائق) لتقليل الطلبات
- يمكن تفعيل/تعطيل كل فئة من تبويب "أماكن" في اللوحة السفلية

> بيانات الأماكن من OpenStreetMap وقد لا تكون مكتملة في بعض مناطق العراق.

---

## الملاحة الصوتية / Voice Navigation

بعد حساب المسار، اضغط "ابدأ الملاحة" لتفعيل وضع الملاحة:

- **تتبع موقعك** في الوقت الفعلي عبر `watchPosition` بدقة عالية
- **توجيهات صوتية** بالعربية عند اقتراب المنعطفات (120م و 35م)
- **تفضيل الصوت العربي:** `ar-IQ` → `ar-SA` → أي `ar-*` → إنجليزية مع تحذير
- **زر كتم الصوت** لإيقاف التوجيهات الصوتية مؤقتاً
- **إعادة حساب المسار** تلقائياً عند الانحراف عن المسار (> 50م)
- **تتبع الخريطة تلقائياً** مع إمكانية تعطيله

### ملاحظات الأجهزة / Device Notes

**Android (Chrome):** الدعم الكامل للصوت العربي. قد تحتاج إلى تحميل حزمة الصوت العربية من إعدادات النص للكلام.

**iOS (Safari):** يدعم Web Speech API منذ iOS 14.5. الصوت العربي متاح لكن قد يختلف عن Android. تأكد من عدم كتم صوت الجهاز.

**متصفحات أخرى:** Firefox لا يدعم Web Speech API بالكامل — ستظهر رسالة تحذير.

---

## النشر على GitHub Pages / Deploy to GitHub Pages

لا تحتاج لتنزيل أي شيء! التطبيق يُنشر تلقائياً عند كل push إلى `main`.  
**You don't need to download anything!** The app deploys automatically on every push to `main`.

### خطوات التفعيل (مرة واحدة فقط) / One-time setup

1. **افتح إعدادات المستودع** → Settings → Pages
2. **Source:** اختر `GitHub Actions`
3. ادفع أي تغيير إلى `main` — سيبدأ الـ workflow تلقائياً
4. بعد دقيقتين يصبح التطبيق متاحاً على:  
   👉 `https://omaralihusam2000-coder.github.io/my-map/`

> **للتثبيت كتطبيق على الجوال (PWA):** افتح الرابط في Chrome/Edge على Android → اضغط "إضافة إلى الشاشة الرئيسية"

---

## التشغيل المحلي / Local Development

```bash
npm install
npm run dev
```

## البناء / Build

```bash
npm run build
npm run preview
```

## متغيرات البيئة / Environment Variables

انسخ `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|---|---|---|
| `VITE_NOMINATIM_URL` | `https://nominatim.openstreetmap.org` | Geocoding API |
| `VITE_OSRM_URL` | `https://router.project-osrm.org` | Routing API |
| `VITE_OVERPASS_URL` | `https://overpass-api.de/api/interpreter` | POI data (Overpass API) |
| `VITE_BASE_PATH` | `/my-map/` | Base path (use `/` for custom domain) |

---

## البنية / Project Structure

```
src/
  components/       # React components (MapView, BottomSheet, panels…)
  features/
    pois/           # POI layer (usePois hook, PoiFilters panel)
    navigation/     # Voice navigation (useVoice, useNavigationGuidance, NavigationPanel)
  hooks/            # Custom hooks (useDarkMode, useGeolocation, useLocalStorage)
  i18n/             # Translation strings (ar/en/ku)
  services/         # API clients (Nominatim, OSRM, Overpass)
  types/            # TypeScript type definitions
public/             # Static assets (icons, manifest)
```

## التقنيات / Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** + **vite-plugin-pwa**
- **Leaflet** (vanilla) + **leaflet.markercluster**
- **Nominatim** (geocoding) + **OSRM** (routing) + **Overpass API** (POI)
- **Web Speech API** (voice navigation)

---

## إخلاء المسؤولية / Disclaimer

بيانات الخرائط والمسارات والأماكن مقدَّمة من OpenStreetMap/OSRM/Overpass وقد تكون غير مكتملة في بعض مناطق العراق.  
Map, routing and POI data from OpenStreetMap/OSRM/Overpass may be incomplete in some areas of Iraq.

