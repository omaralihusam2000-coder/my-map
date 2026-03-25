import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Location, RouteInfo } from '../types';
import { PoiItem } from '../features/pois/pois.types';
import { POI_CATEGORIES } from '../services/overpass';

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
  pois: PoiItem[];
  navPosition: { lat: number; lng: number } | null;
  autoFollow: boolean;
  onBoundsChange: (south: number, west: number, north: number, east: number, zoom: number) => void;
  onPoiSetDestination: (lat: number, lng: number, name: string) => void;
}

export default function MapView({ searchMarker, fromMarker, toMarker, routeInfo, theme, onMapClick, pois, navPosition, autoFollow, onBoundsChange, onPoiSetDestination }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const onMapClickRef = useRef(onMapClick);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const navMarkerRef = useRef<L.Marker | null>(null);
  const onBoundsChangeRef = useRef(onBoundsChange);
  const onPoiSetDestRef = useRef(onPoiSetDestination);
  onMapClickRef.current = onMapClick;
  onBoundsChangeRef.current = onBoundsChange;
  onPoiSetDestRef.current = onPoiSetDestination;

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

    // Initialize cluster group
    const clusterGroup = L.markerClusterGroup({ maxClusterRadius: 60, disableClusteringAtZoom: 17 });
    map.addLayer(clusterGroup);
    clusterGroupRef.current = clusterGroup;

    const emitBounds = () => {
      const b = map.getBounds();
      onBoundsChangeRef.current(b.getSouth(), b.getWest(), b.getNorth(), b.getEast(), map.getZoom());
    };

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClickRef.current?.(e.latlng.lat, e.latlng.lng);
    });

    map.on('moveend', emitBounds);
    map.on('zoomend', emitBounds);
    emitBounds();

    return () => {
      map.remove();
      mapRef.current = null;
      clusterGroupRef.current = null;
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

  // POI cluster layer
  useEffect(() => {
    const map = mapRef.current;
    const clusterGroup = clusterGroupRef.current;
    if (!map || !clusterGroup) return;
    clusterGroup.clearLayers();
    for (const poi of pois) {
      const catCfg = POI_CATEGORIES.find(c => c.id === poi.category);
      const icon = L.divIcon({
        html: `<span style="font-size:18px;line-height:1">${catCfg?.icon ?? '📍'}</span>`,
        className: 'poi-div-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([poi.lat, poi.lng], { icon });
      const name = poi.name ?? (catCfg ? catCfg.labelAr : poi.category);
      const addr = poi.tags?.['addr:street'] ?? poi.tags?.['addr:full'] ?? '';
      const phone = poi.tags?.phone ?? poi.tags?.['contact:phone'] ?? '';
      const popupHtml = [
        `<strong>${name}</strong>`,
        addr ? `<div>📍 ${addr}</div>` : '',
        phone ? `<div>📞 ${phone}</div>` : '',
        `<br><button onclick="window.__poiSetDest(${poi.lat},${poi.lng},'${name.replace(/'/g, "\\'")}')">تعيين كوجهة</button>`,
      ].join('');
      marker.bindPopup(popupHtml);
      clusterGroup.addLayer(marker);
    }
  }, [pois]);

  // Navigation position marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (navPosition) {
      const navIcon = L.divIcon({
        html: '<span style="font-size:24px;line-height:1">🧭</span>',
        className: 'nav-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      if (!navMarkerRef.current) {
        navMarkerRef.current = L.marker([navPosition.lat, navPosition.lng], { icon: navIcon, zIndexOffset: 1000 }).addTo(map);
      } else {
        navMarkerRef.current.setLatLng([navPosition.lat, navPosition.lng]);
      }
      if (autoFollow) {
        map.panTo([navPosition.lat, navPosition.lng]);
      }
    } else {
      if (navMarkerRef.current) {
        map.removeLayer(navMarkerRef.current);
        navMarkerRef.current = null;
      }
    }
  }, [navPosition, autoFollow]);

  // Expose poi destination setter globally for popup button
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__poiSetDest = (lat: number, lng: number, name: string) => {
      onPoiSetDestRef.current(lat, lng, name);
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__poiSetDest;
    };
  }, []);

  return <div ref={containerRef} className="map-container" />;
}

export { BAGHDAD };
