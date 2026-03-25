import { useState, useCallback, useRef } from 'react';
import { Language, SearchResult, Location, Favorite, HistoryItem } from '../types';
import { t } from '../i18n';
import { searchPlaces } from '../services/nominatim';

interface SearchPanelProps {
  lang: Language;
  favorites: Favorite[];
  onSelectLocation: (loc: Location) => void;
  onSetFrom: (loc: Location) => void;
  onSetTo: (loc: Location) => void;
  onAddFavorite: (loc: Location) => void;
  onRemoveFavorite: (id: string) => void;
  onAddHistory: (item: HistoryItem) => void;
}

export default function SearchPanel({
  lang, favorites, onSelectLocation, onSetFrom, onSetTo, onAddFavorite, onRemoveFavorite, onAddHistory
}: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    setError('');
    clearTimeout(debounceRef.current);
    if (!q.trim()) { setResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchPlaces(q, lang);
        setResults(res);
        if (res.length === 0) setError(t('noResults', lang));
      } catch {
        setError(t('error', lang));
      } finally {
        setLoading(false);
      }
    }, 600);
  }, [lang]);

  const handleSelect = (r: SearchResult) => {
    const loc: Location = {
      lat: parseFloat(r.lat),
      lng: parseFloat(r.lon),
      label: r.display_name.split(',')[0],
    };
    onSelectLocation(loc);
    onAddHistory({
      id: `h_${Date.now()}`,
      label: loc.label,
      lat: loc.lat,
      lng: loc.lng,
      searchedAt: Date.now(),
    });
    setResults([]);
    setQuery(loc.label);
  };

  const isFav = (lat: number, lng: number) =>
    favorites.some(f => Math.abs(f.lat - lat) < 0.0001 && Math.abs(f.lng - lng) < 0.0001);

  const getFavId = (lat: number, lng: number) =>
    favorites.find(f => Math.abs(f.lat - lat) < 0.0001 && Math.abs(f.lng - lng) < 0.0001)?.id;

  return (
    <div>
      <div className="search-input-wrap">
        <input
          className="search-input"
          value={query}
          onChange={e => handleSearch(e.target.value)}
          placeholder={t('searchPlaceholder', lang)}
          type="search"
        />
        <span className="search-icon">{loading ? <span className="spinner" /> : '🔍'}</span>
      </div>
      {error && <div className="disclaimer">{error}</div>}
      {results.length > 0 && (
        <ul className="search-results">
          {results.map(r => {
            const lat = parseFloat(r.lat);
            const lng = parseFloat(r.lon);
            const nameParts = r.display_name.split(',');
            const favId = getFavId(lat, lng);
            return (
              <li key={r.place_id} className="search-result-item">
                <span className="result-icon">📍</span>
                <div className="result-text">
                  <div className="result-name">{nameParts[0]}</div>
                  <div className="result-sub">{nameParts.slice(1, 3).join(', ')}</div>
                  <div className="result-actions">
                    <button className="action-btn" onClick={() => handleSelect(r)}>
                      {t('setOnMap', lang)}
                    </button>
                    <button className="action-btn" onClick={() => {
                      onSetFrom({ lat, lng, label: nameParts[0] });
                    }}>
                      {t('useAsStart', lang)}
                    </button>
                    <button className="action-btn" onClick={() => {
                      onSetTo({ lat, lng, label: nameParts[0] });
                    }}>
                      {t('useAsEnd', lang)}
                    </button>
                    <button className="action-btn" onClick={() => {
                      if (favId) onRemoveFavorite(favId);
                      else onAddFavorite({ lat, lng, label: nameParts[0] });
                    }}>
                      {isFav(lat, lng) ? '💛' : '⭐'} {isFav(lat, lng) ? t('removeFavorite', lang) : t('addFavorite', lang)}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
