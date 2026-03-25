import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, RouteInfo } from '../types';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const BAGHDAD = { lat: 33.3152, lng: 44.3661 };

interface MapViewProps {
  searchMarker: Location | null;
  fromMarker: Location | null;
  toMarker: Location | null;
  routeInfo: RouteInfo | null;
  theme: 'light' | 'dark';
  onMapClick?: (lat: number, lng: number) => void;
}

export default function MapView({ searchMarker, fromMarker, toMarker, routeInfo, theme, onMapClick }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [BAGHDAD.lat, BAGHDAD.lng],
      zoom: 11,
      zoomControl: false,
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tile = L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tile;
    mapRef.current = map;

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClickRef.current?.(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
  }, [theme]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    if (searchMarker) {
      const m = L.marker([searchMarker.lat, searchMarker.lng])
        .addTo(map)
        .bindPopup(searchMarker.label);
      markersRef.current.push(m);
      map.setView([searchMarker.lat, searchMarker.lng], 15);
    }

    if (fromMarker) {
      const greenIcon = L.divIcon({
        html: '🟢',
        className: 'div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });
      const m = L.marker([fromMarker.lat, fromMarker.lng], { icon: greenIcon })
        .addTo(map)
        .bindPopup(fromMarker.label);
      markersRef.current.push(m);
    }

    if (toMarker) {
      const redIcon = L.divIcon({
        html: '🔴',
        className: 'div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });
      const m = L.marker([toMarker.lat, toMarker.lng], { icon: redIcon })
        .addTo(map)
        .bindPopup(toMarker.label);
      markersRef.current.push(m);
    }
  }, [searchMarker, fromMarker, toMarker]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    if (routeInfo) {
      const polyline = L.polyline(routeInfo.geometry, {
        color: '#1a73e8',
        weight: 5,
        opacity: 0.8,
      }).addTo(map);
      routeLayerRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }
  }, [routeInfo]);

  return <div ref={containerRef} className="map-container" />;
}

export { BAGHDAD };
