import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchPois, PoiCategory, OverpassElement, POI_CATEGORIES } from '../../services/overpass';
import { PoiItem, MapBounds } from './pois.types';

function elementToPoiItem(el: OverpassElement): PoiItem | null {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (lat === undefined || lng === undefined) return null;
  const amenity = el.tags?.amenity as PoiCategory | undefined;
  if (!amenity) return null;
  const catCfg = POI_CATEGORIES.find(c => c.id === amenity);
  if (!catCfg) return null;
  return {
    id: `${el.type}-${el.id}`,
    lat, lng,
    category: amenity,
    name: el.tags?.['name:ar'] ?? el.tags?.name ?? el.tags?.['name:en'],
    tags: el.tags,
  };
}

export interface UsePoisResult {
  pois: PoiItem[];
  loading: boolean;
  error: string | null;
}

const MIN_ZOOM = 12;

export function usePois(bounds: MapBounds | null, enabledCategories: PoiCategory[]): UsePoisResult {
  const [pois, setPois] = useState<PoiItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const catsRef = useRef(enabledCategories);
  catsRef.current = enabledCategories;

  const doFetch = useCallback(async (b: MapBounds, cats: PoiCategory[]) => {
    if (!cats.length || b.zoom < MIN_ZOOM) { setPois([]); return; }
    setLoading(true);
    setError(null);
    try {
      const elements = await fetchPois(b.south, b.west, b.north, b.east, cats);
      const seen = new Set<string>();
      const items: PoiItem[] = [];
      for (const el of elements) {
        const item = elementToPoiItem(el);
        if (item && cats.includes(item.category) && !seen.has(item.id)) {
          seen.add(item.id);
          items.push(item);
        }
      }
      setPois(items);
    } catch {
      setError('overpass_error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!bounds) return;
    clearTimeout(debounceRef.current);
    const cats = catsRef.current;
    debounceRef.current = setTimeout(() => { void doFetch(bounds, cats); }, 800);
    return () => clearTimeout(debounceRef.current);
  }, [bounds, enabledCategories, doFetch]);

  return { pois, loading, error };
}
