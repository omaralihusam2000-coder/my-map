import { useState, useCallback, useRef } from 'react';
import { Language, Location, RouteInfo, RouteStep, SearchResult } from '../types';
import { t } from '../i18n';
import { searchPlaces } from '../services/nominatim';
import { getRoute } from '../services/osrm';

function getManeuverIcon(step: RouteStep): string {
  if (!step.maneuver) return '➡️';
  const { type, modifier } = step.maneuver;
  if (type === 'depart') return '🚦';
  if (type === 'arrive') return '🏁';
  if (type === 'turn') {
    if (modifier === 'left') return '⬅️';
    if (modifier === 'right') return '➡️';
    if (modifier === 'sharp left') return '↖️';
    if (modifier === 'sharp right') return '↗️';
    if (modifier === 'slight left') return '↙️';
    if (modifier === 'slight right') return '↘️';
    if (modifier === 'uturn') return '🔄';
  }
  if (type === 'roundabout') return '🔁';
  if (type === 'merge') return '🔀';
  return '⬆️';
}

function getStepName(step: RouteStep, index: number, totalSteps: number, lang: Language): string {
  if (step.name) return step.name;
  if (index === 0) return t('stepDepart', lang);
  if (index === totalSteps - 1) return t('stepArrive', lang);
  return `${t('stepN', lang)} ${index + 1}`;
}

function formatDist(meters: number, lang: Language): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} ${t('km', lang)}`;
  return `${Math.round(meters)} ${lang === 'en' ? 'm' : 'م'}`;
}

interface RoutePanelProps {
  lang: Language;
  from: Location | null;
  to: Location | null;
  routeInfo: RouteInfo | null;
  onFromChange: (loc: Location | null) => void;
  onToChange: (loc: Location | null) => void;
  onRouteChange: (info: RouteInfo | null) => void;
  onStartNavigation?: () => void;
}

export default function RoutePanel({ lang, from, to, routeInfo, onFromChange, onToChange, onRouteChange, onStartNavigation }: RoutePanelProps) {
  const [fromQuery, setFromQuery] = useState(from?.label ?? '');
  const [toQuery, setToQuery] = useState(to?.label ?? '');
  const [fromResults, setFromResults] = useState<SearchResult[]>([]);
  const [toResults, setToResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [baseFare, setBaseFare] = useState(1000);
  const [perKm, setPerKm] = useState(500);
  const debounceFrom = useRef<ReturnType<typeof setTimeout>>();
  const debounceTo = useRef<ReturnType<typeof setTimeout>>();

  const handleFromSearch = useCallback((q: string) => {
    setFromQuery(q);
    clearTimeout(debounceFrom.current);
    if (!q.trim()) { setFromResults([]); return; }
    debounceFrom.current = setTimeout(async () => {
      try { setFromResults(await searchPlaces(q, lang)); } catch { /* ignore */ }
    }, 600);
  }, [lang]);

  const handleToSearch = useCallback((q: string) => {
    setToQuery(q);
    clearTimeout(debounceTo.current);
    if (!q.trim()) { setToResults([]); return; }
    debounceTo.current = setTimeout(async () => {
      try { setToResults(await searchPlaces(q, lang)); } catch { /* ignore */ }
    }, 600);
  }, [lang]);

  const selectFrom = (r: SearchResult) => {
    const loc = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name.split(',')[0] };
    onFromChange(loc);
    setFromQuery(loc.label);
    setFromResults([]);
  };

  const selectTo = (r: SearchResult) => {
    const loc = { lat: parseFloat(r.lat), lng: parseFloat(r.lon), label: r.display_name.split(',')[0] };
    onToChange(loc);
    setToQuery(loc.label);
    setToResults([]);
  };

  const calculate = async () => {
    if (!from || !to) return;
    setLoading(true);
    setError('');
    try {
      const info = await getRoute(from.lat, from.lng, to.lat, to.lng);
      onRouteChange(info);
    } catch {
      setError(t('error', lang));
    } finally {
      setLoading(false);
    }
  };

  const estimatedFare = routeInfo
    ? Math.round(baseFare + (routeInfo.distance / 1000) * perKm)
    : null;

  return (
    <div>
      <div className="route-inputs">
        <div className="route-input-row">
          <span className="route-label">🟢</span>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              className="search-input"
              value={fromQuery}
              onChange={e => handleFromSearch(e.target.value)}
              placeholder={t('fromPlaceholder', lang)}
            />
            {fromResults.length > 0 && (
              <ul className="search-results" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
                {fromResults.map(r => (
                  <li key={r.place_id} className="search-result-item" onClick={() => selectFrom(r)}>
                    <span>📍</span> {r.display_name.split(',')[0]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="route-input-row">
          <span className="route-label">🔴</span>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              className="search-input"
              value={toQuery}
              onChange={e => handleToSearch(e.target.value)}
              placeholder={t('toPlaceholder', lang)}
            />
            {toResults.length > 0 && (
              <ul className="search-results" style={{ position: 'absolute', zIndex: 10, width: '100%' }}>
                {toResults.map(r => (
                  <li key={r.place_id} className="search-result-item" onClick={() => selectTo(r)}>
                    <span>📍</span> {r.display_name.split(',')[0]}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary"
        onClick={calculate}
        disabled={!from || !to || loading}
        style={{ marginBottom: 12 }}
      >
        {loading ? t('loading', lang) : t('calculateRoute', lang)}
      </button>

      {error && <div className="disclaimer">{error}</div>}

      {routeInfo && (
        <>
          <div className="route-info">
            <div className="route-info-item">
              <div className="route-info-value">{(routeInfo.distance / 1000).toFixed(1)}</div>
              <div className="route-info-label">{t('km', lang)}</div>
            </div>
            <div className="route-info-item">
              <div className="route-info-value">{Math.round(routeInfo.duration / 60)}</div>
              <div className="route-info-label">{t('min', lang)}</div>
            </div>
          </div>

          {onStartNavigation && (
            <button className="btn btn-primary" onClick={onStartNavigation} style={{ marginBottom: 12 }}>
              🧭 {t('startNavigation', lang)}
            </button>
          )}

          <div className="fare-inputs">
            <div className="fare-input-group">
              <div className="fare-label">{t('baseFare', lang)}</div>
              <input
                className="fare-input"
                type="number"
                value={baseFare}
                onChange={e => setBaseFare(Number(e.target.value))}
              />
            </div>
            <div className="fare-input-group">
              <div className="fare-label">{t('perKm', lang)}</div>
              <input
                className="fare-input"
                type="number"
                value={perKm}
                onChange={e => setPerKm(Number(e.target.value))}
              />
            </div>
          </div>
          {estimatedFare !== null && (
            <div className="fare-result" style={{ marginBottom: 12 }}>
              <div className="fare-amount">{estimatedFare.toLocaleString()}</div>
              <div className="fare-unit">{t('iqd', lang)}</div>
            </div>
          )}

          <div className="steps-list-header" style={{ fontWeight: 700, marginBottom: 8 }}>
            {t('steps', lang)}
          </div>
          <ul className="steps-list">
            {routeInfo.steps.map((step, i) => (
              <li key={i} className="step-item">
                <span className="step-icon">{getManeuverIcon(step)}</span>
                <div className="step-info">
                  <div className="step-name">{getStepName(step, i, routeInfo.steps.length, lang)}</div>
                  <div className="step-dist">{formatDist(step.distance, lang)}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="disclaimer">{t('routeDisclaimer', lang)}</div>
        </>
      )}
    </div>
  );
}
