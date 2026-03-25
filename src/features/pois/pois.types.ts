import { PoiCategory } from '../../services/overpass';
import { MapBounds } from '../../types';

export interface PoiItem {
  id: string;
  lat: number;
  lng: number;
  category: PoiCategory;
  name?: string;
  tags?: Record<string, string>;
}

export type { MapBounds };
