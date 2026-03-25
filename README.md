# خريطة العراق — Iraq Map PWA

تطبيق خرائط وملاحة تفاعلي للعراق، مبني كـ Progressive Web App.  
An interactive maps & navigation Progressive Web App focused on Iraq.

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

| Variable | Default |
|---|---|
| `VITE_NOMINATIM_URL` | `https://nominatim.openstreetmap.org` |
| `VITE_OSRM_URL` | `https://router.project-osrm.org` |

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
