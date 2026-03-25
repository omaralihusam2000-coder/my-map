import { Language, HistoryItem, Location } from '../types';
import { t } from '../i18n';

interface HistoryPanelProps {
  lang: Language;
  history: HistoryItem[];
  onSelect: (loc: Location) => void;
  onClear: () => void;
  onSetFrom: (loc: Location) => void;
  onSetTo: (loc: Location) => void;
}

export default function HistoryPanel({ lang, history, onSelect, onClear, onSetFrom, onSetTo }: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🕐</div>
        <div className="empty-text">{t('noHistory', lang)}</div>
      </div>
    );
  }

  return (
    <div>
      <button className="btn btn-secondary" onClick={onClear} style={{ marginBottom: 12 }}>
        🗑️ {t('clearHistory', lang)}
      </button>
      <ul className="steps-list">
        {[...history].reverse().map(item => (
          <li key={item.id} className="list-item">
            <span className="list-icon">🕐</span>
            <div className="list-info" onClick={() => onSelect({ lat: item.lat, lng: item.lng, label: item.label })}>
              <div className="list-label">{item.label}</div>
              <div className="list-sub">{new Date(item.searchedAt).toLocaleDateString(lang === 'ar' ? 'ar-IQ' : 'en-US')}</div>
            </div>
            <div className="list-actions">
              <button className="icon-btn" title={t('useAsStart', lang)} onClick={() => onSetFrom({ lat: item.lat, lng: item.lng, label: item.label })}>🟢</button>
              <button className="icon-btn" title={t('useAsEnd', lang)} onClick={() => onSetTo({ lat: item.lat, lng: item.lng, label: item.label })}>🔴</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
