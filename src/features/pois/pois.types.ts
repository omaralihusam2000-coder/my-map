import { PoiCategory } from '../../services/overpass';

export interface PoiItem {
  id: string;
  lat: number;
  lng: number;
  category: PoiCategory;
  name?: string;
  tags?: Record<string, string>;
}

export interface MapBounds {
  south: number;
  west: number;
  north: number;
  east: number;
  zoom: number;
}
