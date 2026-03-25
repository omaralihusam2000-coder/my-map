import { useState, ReactNode } from 'react';
import { Language, PanelTab } from '../types';
import { t, TranslationKey } from '../i18n';

const TABS: { id: PanelTab; icon: string; labelKey: TranslationKey }[] = [
  { id: 'search', icon: '🔍', labelKey: 'search' },
  { id: 'route', icon: '🗺️', labelKey: 'route' },
  { id: 'favorites', icon: '⭐', labelKey: 'favorites' },
  { id: 'history', icon: '🕐', labelKey: 'history' },
  { id: 'pois', icon: '📍', labelKey: 'pois' },
];

interface BottomSheetProps {
  lang: Language;
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  children: ReactNode;
}

export default function BottomSheet({ lang, activeTab, onTabChange, children }: BottomSheetProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bottom-sheet${collapsed ? ' collapsed' : ''}`}>
      <div className="sheet-handle" onClick={() => setCollapsed(c => !c)}>
        <div className="handle-bar" />
      </div>
      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => { onTabChange(tab.id); setCollapsed(false); }}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span>{t(tab.labelKey, lang)}</span>
          </button>
        ))}
      </div>
      <div className="panel-content">
        {children}
      </div>
    </div>
  );
}
