import { Language, Favorite, Location } from '../types';
import { t } from '../i18n';

interface FavoritesPanelProps {
  lang: Language;
  favorites: Favorite[];
  onSelect: (loc: Location) => void;
  onRemove: (id: string) => void;
  onSetFrom: (loc: Location) => void;
  onSetTo: (loc: Location) => void;
}

export default function FavoritesPanel({ lang, favorites, onSelect, onRemove, onSetFrom, onSetTo }: FavoritesPanelProps) {
  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⭐</div>
        <div className="empty-text">{t('noFavorites', lang)}</div>
      </div>
    );
  }

  return (
    <ul className="steps-list">
      {favorites.map(fav => (
        <li key={fav.id} className="list-item">
          <span className="list-icon">⭐</span>
          <div className="list-info" onClick={() => onSelect({ lat: fav.lat, lng: fav.lng, label: fav.label })}>
            <div className="list-label">{fav.label}</div>
            <div className="list-sub">{fav.lat.toFixed(4)}, {fav.lng.toFixed(4)}</div>
          </div>
          <div className="list-actions">
            <button className="icon-btn" title={t('useAsStart', lang)} onClick={() => onSetFrom({ lat: fav.lat, lng: fav.lng, label: fav.label })}>🟢</button>
            <button className="icon-btn" title={t('useAsEnd', lang)} onClick={() => onSetTo({ lat: fav.lat, lng: fav.lng, label: fav.label })}>🔴</button>
            <button className="icon-btn" title={t('removeFavorite', lang)} onClick={() => onRemove(fav.id)}>🗑️</button>
          </div>
        </li>
      ))}
    </ul>
  );
}
