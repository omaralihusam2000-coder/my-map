import { PoiCategory, POI_CATEGORIES } from '../../services/overpass';
import { Language } from '../../types';

interface PoiFiltersProps {
  lang: Language;
  enabled: PoiCategory[];
  onChange: (cats: PoiCategory[]) => void;
  loading: boolean;
  error: string | null;
  count: number;
}

export default function PoiFilters({ lang, enabled, onChange, loading, error, count }: PoiFiltersProps) {
  const toggle = (id: PoiCategory) => {
    if (enabled.includes(id)) {
      onChange(enabled.filter(c => c !== id));
    } else {
      onChange([...enabled, id]);
    }
  };

  const label = (cfg: typeof POI_CATEGORIES[0]) =>
    lang === 'ar' ? cfg.labelAr : lang === 'ku' ? cfg.labelKu : cfg.labelEn;

  return (
    <div>
      <div className="poi-status">
        {loading && <span className="poi-loading">جاري تحميل الأماكن…</span>}
        {error && !loading && <span className="poi-error">تعذر تحميل الأماكن، حاول لاحقاً</span>}
        {!loading && !error && count > 0 && (
          <span className="poi-count">
            {lang === 'ar' ? `${count} مكان` : lang === 'ku' ? `${count} شوێن` : `${count} places`}
          </span>
        )}
      </div>
      <div className="poi-filter-grid">
        {POI_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`poi-filter-btn${enabled.includes(cat.id) ? ' active' : ''}`}
            style={enabled.includes(cat.id) ? { borderColor: cat.color, background: cat.color + '22' } : {}}
            onClick={() => toggle(cat.id)}
            title={label(cat)}
          >
            <span className="poi-filter-icon">{cat.icon}</span>
            <span className="poi-filter-label">{label(cat)}</span>
          </button>
        ))}
      </div>
      <div className="disclaimer">
        {lang === 'ar'
          ? 'بيانات الأماكن من OpenStreetMap وقد لا تكون مكتملة في بعض مناطق العراق.'
          : lang === 'ku'
          ? 'داتای شوێنەکان لە OpenStreetMap و ناچێت تەواو بێت.'
          : 'Place data from OpenStreetMap. Coverage may be incomplete in some areas of Iraq.'}
      </div>
    </div>
  );
}
