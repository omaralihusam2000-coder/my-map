export interface Location {
  lat: number;
  lng: number;
  label: string;
}

export interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
}

export interface RouteStep {
  instruction: string;
  distance: number;
  duration: number;
  name: string;
  maneuver?: {
    type: string;
    modifier?: string;
  };
}

export interface RouteInfo {
  distance: number;
  duration: number;
  steps: RouteStep[];
  geometry: [number, number][];
}

export interface Favorite {
  id: string;
  label: string;
  lat: number;
  lng: number;
  addedAt: number;
}

export interface HistoryItem {
  id: string;
  label: string;
  lat: number;
  lng: number;
  searchedAt: number;
}

export type Language = 'ar' | 'en' | 'ku';
export type Theme = 'light' | 'dark';

export type PanelTab = 'search' | 'route' | 'favorites' | 'history';
