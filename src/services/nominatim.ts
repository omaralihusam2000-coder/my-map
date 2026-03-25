import { SearchResult } from '../types';

const NOMINATIM_URL = import.meta.env.VITE_NOMINATIM_URL || 'https://nominatim.openstreetmap.org';

export async function searchPlaces(query: string, lang = 'ar'): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    addressdetails: '1',
    limit: '8',
    'accept-language': lang,
    countrycodes: 'iq',
  });

  const res = await fetch(`${NOMINATIM_URL}/search?${params}`, {
    headers: { 'Accept-Language': lang },
  });

  if (!res.ok) throw new Error('Search failed');
  return res.json() as Promise<SearchResult[]>;
}

export async function reverseGeocode(lat: number, lng: number, lang = 'ar'): Promise<SearchResult | null> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: 'json',
    'accept-language': lang,
  });

  const res = await fetch(`${NOMINATIM_URL}/reverse?${params}`);
  if (!res.ok) return null;
  return res.json() as Promise<SearchResult>;
}
