const OVERPASS_URL = import.meta.env.VITE_OVERPASS_URL ?? 'https://overpass-api.de/api/interpreter';

export type PoiCategory = 'restaurant' | 'cafe' | 'pharmacy' | 'hospital' | 'fuel';

export interface PoiCategoryConfig {
  id: PoiCategory;
  labelAr: string;
  labelEn: string;
  labelKu: string;
  icon: string;
  color: string;
}

export const POI_CATEGORIES: PoiCategoryConfig[] = [
  { id: 'restaurant', labelAr: 'مطاعم',    labelEn: 'Restaurants', labelKu: 'چێشتخانەکان',  icon: '🍽️', color: '#e53935' },
  { id: 'cafe',       labelAr: 'كافيهات',  labelEn: 'Cafés',       labelKu: 'کافێکان',       icon: '☕',  color: '#6d4c41' },
  { id: 'pharmacy',   labelAr: 'صيدليات',  labelEn: 'Pharmacies',  labelKu: 'دەرمانخانەکان', icon: '💊',  color: '#43a047' },
  { id: 'hospital',   labelAr: 'مستشفيات', labelEn: 'Hospitals',   labelKu: 'نەخۆشخانەکان',  icon: '🏥',  color: '#1e88e5' },
  { id: 'fuel',       labelAr: 'وقود',     labelEn: 'Fuel',        labelKu: 'سووتەمەنی',     icon: '⛽',  color: '#fb8c00' },
];

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

const memCache = new Map<string, { data: OverpassElement[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function cacheKey(south: number, west: number, north: number, east: number, cats: PoiCategory[]): string {
  const r = (n: number) => Math.round(n * 100) / 100;
  return `${r(south)},${r(west)},${r(north)},${r(east)},${[...cats].sort().join(',')}`;
}

function buildQuery(south: number, west: number, north: number, east: number, cats: PoiCategory[]): string {
  const bbox = `${south},${west},${north},${east}`;
  const union = cats.map(cat => `
  node[amenity=${cat}](${bbox});
  way[amenity=${cat}](${bbox});`).join('');
  return `[out:json][timeout:25][maxsize:16777216];\n(\n${union}\n);\nout center 2000;`;
}

export async function fetchPois(
  south: number, west: number, north: number, east: number,
  categories: PoiCategory[]
): Promise<OverpassElement[]> {
  if (!categories.length) return [];
  const key = cacheKey(south, west, north, east, categories);
  const cached = memCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;

  const query = buildQuery(south, west, north, east, categories);
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!res.ok) throw new Error(`Overpass ${res.status}`);
  const json = await res.json() as { elements?: OverpassElement[] };
  const data = json.elements ?? [];
  memCache.set(key, { data, ts: Date.now() });
  return data;
}
