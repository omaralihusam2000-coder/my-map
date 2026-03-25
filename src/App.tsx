import { useState, useCallback, useEffect, useRef } from 'react';
import MapView from './components/MapView';
import BottomSheet from './components/BottomSheet';
import SearchPanel from './components/SearchPanel';
import RoutePanel from './components/RoutePanel';
import FavoritesPanel from './components/FavoritesPanel';
import HistoryPanel from './components/HistoryPanel';
import PoiFilters from './features/pois/PoiFilters';
import NavigationPanel from './features/navigation/NavigationPanel';
import { useDarkMode } from './hooks/useDarkMode';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useGeolocation } from './hooks/useGeolocation';
import { usePois } from './features/pois/usePois';
import { useVoice } from './features/navigation/useVoice';
import { useNavigationGuidance } from './features/navigation/useNavigationGuidance';
import { t } from './i18n';
import { Location, RouteInfo, Favorite, HistoryItem, Language, PanelTab, MapBounds } from './types';
import { PoiCategory, POI_CATEGORIES } from './services/overpass';
import { getRoute } from './services/osrm';

function App() {
  const [theme, toggleTheme] = useDarkMode();
  const [lang, setLang] = useLocalStorage<Language>('lang', 'ar');
  const [activeTab, setActiveTab] = useState<PanelTab>('search');
  const [searchMarker, setSearchMarker] = useState<Location | null>(null);
  const [fromMarker, setFromMarker] = useState<Location | null>(null);
  const [toMarker, setToMarker] = useState<Location | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Favorite[]>('favorites', []);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('history', []);
  const [toast, setToast] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [enabledCategories, setEnabledCategories] = useLocalStorage<PoiCategory[]>(
    'poi_cats',
    POI_CATEGORIES.map(c => c.id)
  );
  const [navMode, setNavMode] = useState(false);
  const [navPosition, setNavPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [autoFollow, setAutoFollow] = useState(true);
  const watchIdRef = useRef<number | null>(null);
  const langRef = useRef(lang);
  const geo = useGeolocation();

  const { pois, loading: poisLoading, error: poisError } = usePois(mapBounds, enabledCategories);
  const { speak, muted, toggleMute, noArabicVoice, cancelSpeech } = useVoice();
  const guidance = useNavigationGuidance({
    steps: routeInfo?.steps ?? [],
    geometry: routeInfo?.geometry ?? [],
    userLat: navPosition?.lat ?? null,
    userLng: navPosition?.lng ?? null,
    active: navMode,
    speak,
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'en' ? 'ltr' : 'rtl';
  }, [lang]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat');
    const lng = params.get('lng');
    const fromParam = params.get('from');
    const toParam = params.get('to');
    if (lat && lng) {
      setSearchMarker({ lat: parseFloat(lat), lng: parseFloat(lng), label: `${lat},${lng}` });
    }
    if (fromParam && toParam) {
      const [fLat, fLng] = fromParam.split(',').map(Number);
      const [tLat, tLng] = toParam.split(',').map(Number);
      if (!isNaN(fLat) && !isNaN(fLng)) setFromMarker({ lat: fLat, lng: fLng, label: t('from', langRef.current) });
      if (!isNaN(tLat) && !isNaN(tLng)) setToMarker({ lat: tLat, lng: tLng, label: t('to', langRef.current) });
      setActiveTab('route');
    }
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleLocate = useCallback(() => {
    geo.locate();
  }, [geo]);

  const handleBoundsChange = useCallback((south: number, west: number, north: number, east: number, zoom: number) => {
    setMapBounds({ south, west, north, east, zoom });
  }, []);

  const handlePoiSetDestination = useCallback((lat: number, lng: number, name: string) => {
    setToMarker({ lat, lng, label: name });
    setActiveTab('route');
  }, []);

  const handleStartNavigation = useCallback(() => {
    if (!routeInfo) return;
    setNavMode(true);
    setAutoFollow(true);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    watchIdRef.current = navigator.geolocation.watchPosition(
      pos => setNavPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { /* ignore errors */ },
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
  }, [routeInfo]);

  const handleStopNavigation = useCallback(() => {
    setNavMode(false);
    setNavPosition(null);
    cancelSpeech();
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, [cancelSpeech]);

  const handleReroute = useCallback(async () => {
    if (!navPosition || !toMarker) return;
    try {
      const info = await getRoute(navPosition.lat, navPosition.lng, toMarker.lat, toMarker.lng);
      setRouteInfo(info);
      setFromMarker({ lat: navPosition.lat, lng: navPosition.lng, label: t('locateMe', lang) });
    } catch {
      showToast(t('error', lang));
    }
  }, [navPosition, toMarker, lang]);

  // Cleanup watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (geo.lat && geo.lng) {
      setSearchMarker({ lat: geo.lat, lng: geo.lng, label: t('locateMe', lang) });
    }
  }, [geo.lat, geo.lng, lang]);

  const handleShareLocation = () => {
    if (!geo.lat || !geo.lng) {
      geo.locate();
      showToast(t('loading', lang));
      return;
    }
    const url = `${window.location.origin}${window.location.pathname}?lat=${geo.lat}&lng=${geo.lng}`;
    navigator.clipboard.writeText(url).then(() => showToast(t('linkCopied', lang)));
  };

  const handleShareRoute = () => {
    if (!fromMarker || !toMarker) return;
    const url = `${window.location.origin}${window.location.pathname}?from=${fromMarker.lat},${fromMarker.lng}&to=${toMarker.lat},${toMarker.lng}`;
    navigator.clipboard.writeText(url).then(() => showToast(t('linkCopied', lang)));
  };

  const addFavorite = (loc: Location) => {
    setFavorites((prev: Favorite[]) => {
      if (prev.some(f => Math.abs(f.lat - loc.lat) < 0.0001 && Math.abs(f.lng - loc.lng) < 0.0001)) return prev;
      return [...prev, { id: `f_${Date.now()}`, label: loc.label, lat: loc.lat, lng: loc.lng, addedAt: Date.now() }];
    });
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev: Favorite[]) => prev.filter(f => f.id !== id));
  };

  const addHistory = (item: HistoryItem) => {
    setHistory((prev: HistoryItem[]) => {
      const filtered = prev.filter(h => h.label !== item.label);
      return [...filtered.slice(-19), item];
    });
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="app">
      {!isOnline && <div className="offline-banner">{t('offlineMessage', lang)}</div>}

      <div className="toolbar">
        <button
          className="toolbar-btn"
          title={theme === 'dark' ? t('lightMode', lang) : t('darkMode', lang)}
          onClick={toggleTheme}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <select
          className="lang-select"
          value={lang}
          onChange={e => setLang(e.target.value as Language)}
        >
          <option value="ar">🇮🇶 العربية</option>
          <option value="en">🇬🇧 English</option>
          <option value="ku">🏔️ کوردی</option>
        </select>
        <div className="toolbar-spacer" />
        {fromMarker && toMarker && (
          <button className="toolbar-btn" title={t('copyLink', lang)} onClick={handleShareRoute}>
            🔗
          </button>
        )}
        <button className="toolbar-btn" title={t('shareLocation', lang)} onClick={handleShareLocation}>
          📤
        </button>
      </div>

      <MapView
        searchMarker={searchMarker}
        fromMarker={fromMarker}
        toMarker={toMarker}
        routeInfo={routeInfo}
        theme={theme}
        onMapClick={() => { /* reserved for future map-click to set from/to */ }}
        pois={pois}
        navPosition={navPosition}
        autoFollow={autoFollow}
        onBoundsChange={handleBoundsChange}
        onPoiSetDestination={handlePoiSetDestination}
      />

      <button className="fab-locate" onClick={handleLocate} title={t('locateMe', lang)}>
        {geo.loading ? '⏳' : '📍'}
      </button>

      {navMode && (
        <NavigationPanel
          lang={lang}
          steps={routeInfo?.steps ?? []}
          guidance={guidance}
          muted={muted}
          noArabicVoice={noArabicVoice}
          autoFollow={autoFollow}
          onToggleMute={toggleMute}
          onToggleAutoFollow={() => setAutoFollow(f => !f)}
          onStopNavigation={handleStopNavigation}
          onReroute={handleReroute}
        />
      )}

      <BottomSheet lang={lang} activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'search' && (
          <SearchPanel
            lang={lang}
            favorites={favorites}
            onSelectLocation={loc => { setSearchMarker(loc); setRouteInfo(null); }}
            onSetFrom={loc => { setFromMarker(loc); setActiveTab('route'); }}
            onSetTo={loc => { setToMarker(loc); setActiveTab('route'); }}
            onAddFavorite={addFavorite}
            onRemoveFavorite={removeFavorite}
            onAddHistory={addHistory}
          />
        )}
        {activeTab === 'route' && (
          <RoutePanel
            lang={lang}
            from={fromMarker}
            to={toMarker}
            routeInfo={routeInfo}
            onFromChange={setFromMarker}
            onToChange={setToMarker}
            onRouteChange={setRouteInfo}
            onStartNavigation={routeInfo ? handleStartNavigation : undefined}
          />
        )}
        {activeTab === 'favorites' && (
          <FavoritesPanel
            lang={lang}
            favorites={favorites}
            onSelect={loc => { setSearchMarker(loc); setActiveTab('search'); }}
            onRemove={removeFavorite}
            onSetFrom={loc => { setFromMarker(loc); setActiveTab('route'); }}
            onSetTo={loc => { setToMarker(loc); setActiveTab('route'); }}
          />
        )}
        {activeTab === 'history' && (
          <HistoryPanel
            lang={lang}
            history={history}
            onSelect={loc => { setSearchMarker(loc); setActiveTab('search'); }}
            onClear={clearHistory}
            onSetFrom={loc => { setFromMarker(loc); setActiveTab('route'); }}
            onSetTo={loc => { setToMarker(loc); setActiveTab('route'); }}
          />
        )}
        {activeTab === 'pois' && (
          <PoiFilters
            lang={lang}
            enabled={enabledCategories}
            onChange={setEnabledCategories}
            loading={poisLoading}
            error={poisError}
            count={pois.length}
          />
        )}
        <div className="disclaimer">{t('disclaimer', lang)}</div>
      </BottomSheet>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
