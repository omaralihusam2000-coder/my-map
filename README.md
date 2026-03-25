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
- ⭐ **المفضلة** — حفظ الأماكن (localStorage)
- 🕐 **سجل البحث** مع إمكانية المسح
- 🌙 **الوضع الليلي / النهاري**
- 🌐 **ثلاث لغات**: العربية، الإنجليزية، الكردية
- 📤 **مشاركة الموقع والمسارات** عبر روابط قابلة للنسخ
- 📡 **كشف الاتصال بالإنترنت** مع بانر تحذيري
- 📱 **PWA** — قابل للتثبيت على الجوال مع دعم خدمة Service Worker

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
| `VITE_BASE_PATH` | `/my-map/` | Base path (use `/` for custom domain) |

---

## البنية / Project Structure

```
src/
  components/     # React components (MapView, BottomSheet, panels…)
  hooks/          # Custom hooks (useDarkMode, useGeolocation, useLocalStorage)
  i18n/           # Translation strings (ar/en/ku)
  services/       # API clients (Nominatim, OSRM)
  types/          # TypeScript type definitions
public/           # Static assets (icons, manifest)
```

## التقنيات / Tech Stack

- **React 18** + **TypeScript**
- **Vite 5** + **vite-plugin-pwa**
- **Leaflet** + **react-leaflet**
- **Nominatim** (geocoding) + **OSRM** (routing)

---

## إخلاء المسؤولية / Disclaimer

بيانات الخرائط والمسارات مقدَّمة من OpenStreetMap/OSRM وقد تكون غير مكتملة في بعض مناطق العراق.  
Map and routing data from OpenStreetMap/OSRM may be incomplete in some areas of Iraq.
