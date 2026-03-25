import { Language, RouteStep } from '../../types';
import { GuidanceState } from './useNavigationGuidance';

function formatDist(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} كم`;
  return `${Math.round(meters)} م`;
}

function getManeuverIcon(step: RouteStep): string {
  if (!step.maneuver) return '⬆️';
  const { type, modifier } = step.maneuver;
  if (type === 'arrive') return '🏁';
  if (type === 'depart') return '🚦';
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
  return '⬆️';
}

interface NavigationPanelProps {
  lang: Language;
  steps: RouteStep[];
  guidance: GuidanceState;
  muted: boolean;
  noArabicVoice: boolean;
  autoFollow: boolean;
  onToggleMute: () => void;
  onToggleAutoFollow: () => void;
  onStopNavigation: () => void;
  onReroute: () => void;
}

export default function NavigationPanel({
  lang, steps, guidance, muted, noArabicVoice, autoFollow,
  onToggleMute, onToggleAutoFollow, onStopNavigation, onReroute,
}: NavigationPanelProps) {
  const step = steps[guidance.currentStepIndex];
  const isAr = lang !== 'en';

  return (
    <div className="nav-panel">
      {noArabicVoice && (
        <div className="nav-warning">
          {isAr ? '⚠️ لم يُعثر على صوت عربي — يتم استخدام الإنجليزية' : '⚠️ No Arabic voice found — using English'}
        </div>
      )}
      <div className="nav-instruction">
        <div className="nav-icon">{step ? getManeuverIcon(step) : '⬆️'}</div>
        <div className="nav-text">
          <div className="nav-step-name">
            {step ? (step.name || (isAr ? 'تابع' : 'Continue')) : (isAr ? 'في الطريق' : 'On route')}
          </div>
          <div className="nav-dist">{formatDist(guidance.distanceToNextManeuver)}</div>
        </div>
      </div>

      {guidance.offRoute && (
        <button className="btn btn-warning nav-reroute" onClick={onReroute}>
          {isAr ? '🔄 إعادة حساب المسار' : '🔄 Recalculate Route'}
        </button>
      )}

      <div className="nav-controls">
        <button
          className="nav-ctrl-btn"
          onClick={onToggleMute}
          title={muted ? (isAr ? 'تشغيل الصوت' : 'Unmute') : (isAr ? 'كتم الصوت' : 'Mute')}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          className="nav-ctrl-btn"
          onClick={onToggleAutoFollow}
          title={autoFollow ? (isAr ? 'إيقاف التتبع' : 'Stop following') : (isAr ? 'تتبع موقعي' : 'Follow me')}
        >
          {autoFollow ? '📍' : '🗺️'}
        </button>
        <button
          className="nav-ctrl-btn nav-stop"
          onClick={onStopNavigation}
          title={isAr ? 'إيقاف الملاحة' : 'Stop navigation'}
        >
          ✖
        </button>
      </div>
    </div>
  );
}
