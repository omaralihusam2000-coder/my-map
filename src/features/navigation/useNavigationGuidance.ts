import { useState, useEffect, useRef, useCallback } from 'react';
import { RouteStep } from '../../types';

export interface GuidanceState {
  currentStepIndex: number;
  distanceToNextManeuver: number;
  offRoute: boolean;
  totalConsumedDistance: number;
}

const ANNOUNCE_FAR = 120;
const ANNOUNCE_NEAR = 35;
const REROUTE_DIST = 50;

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distToPolyline(lat: number, lng: number, geometry: [number, number][]): { dist: number; consumed: number } {
  let minDist = Infinity;
  let consumed = 0;
  let bestConsumed = 0;
  for (let i = 0; i < geometry.length - 1; i++) {
    const [alat, alng] = geometry[i];
    const [blat, blng] = geometry[i + 1];
    const segLen = haversine(alat, alng, blat, blng);
    const dx = blat - alat, dy = blng - alng;
    const lenSq = dx * dx + dy * dy;
    let t = lenSq > 0 ? ((lat - alat) * dx + (lng - alng) * dy) / lenSq : 0;
    t = Math.max(0, Math.min(1, t));
    const clat = alat + t * dx, clng = alng + t * dy;
    const d = haversine(lat, lng, clat, clng);
    if (d < minDist) {
      minDist = d;
      bestConsumed = consumed + t * segLen;
    }
    consumed += segLen;
  }
  return { dist: minDist, consumed: bestConsumed };
}

export function buildInstruction(step: RouteStep, dist: number): string {
  const d = dist >= 1000 ? `${(dist / 1000).toFixed(1)} كيلومتر` : `${Math.round(dist)} متر`;
  if (!step.maneuver) return step.name ? `تابع على ${step.name}` : 'تابع';
  const { type, modifier } = step.maneuver;
  if (type === 'arrive') return 'وصلت إلى وجهتك';
  if (type === 'depart') return 'انطلق الآن';
  const dir: Record<string, string> = {
    'left': 'يساراً', 'right': 'يميناً',
    'sharp left': 'يساراً بشكل حاد', 'sharp right': 'يميناً بشكل حاد',
    'slight left': 'يساراً قليلاً', 'slight right': 'يميناً قليلاً',
    'uturn': 'استدارة', 'straight': 'مستقيماً',
  };
  const d2 = modifier ? (dir[modifier] ?? 'مستقيماً') : 'مستقيماً';
  if (type === 'turn') return `بعد ${d} انعطف ${d2}`;
  if (type === 'roundabout') return `بعد ${d} أدخل الدوار`;
  if (type === 'merge') return `بعد ${d} اندمج ${d2}`;
  if (type === 'fork') return `بعد ${d} خذ الطريق ${d2}`;
  return `بعد ${d} تابع ${d2}`;
}

interface UseNavigationGuidanceParams {
  steps: RouteStep[];
  geometry: [number, number][];
  userLat: number | null;
  userLng: number | null;
  active: boolean;
  speak: (text: string, cooldown?: number) => void;
}

export function useNavigationGuidance({
  steps, geometry, userLat, userLng, active, speak,
}: UseNavigationGuidanceParams): GuidanceState {
  const [state, setState] = useState<GuidanceState>({
    currentStepIndex: 0, distanceToNextManeuver: 0, offRoute: false, totalConsumedDistance: 0,
  });
  const announcedFar = useRef(false);
  const announcedNear = useRef(false);
  const lastStep = useRef(-1);
  const cumDist = useRef<number[]>([]);

  useEffect(() => {
    let s = 0;
    cumDist.current = steps.map(st => { s += st.distance; return s; });
    setState({ currentStepIndex: 0, distanceToNextManeuver: 0, offRoute: false, totalConsumedDistance: 0 });
    announcedFar.current = false;
    announcedNear.current = false;
    lastStep.current = -1;
  }, [steps]);

  const buildInstructionCb = useCallback(buildInstruction, []);

  useEffect(() => {
    if (!active || userLat === null || userLng === null || !steps.length || !geometry.length) return;
    const { dist, consumed } = distToPolyline(userLat, userLng, geometry);
    const offRoute = dist > REROUTE_DIST;

    let stepIdx = 0;
    for (let i = 0; i < cumDist.current.length; i++) {
      if (consumed <= cumDist.current[i]) { stepIdx = i; break; }
      stepIdx = i;
    }

    const remainInStep = (cumDist.current[stepIdx] ?? 0) - consumed;
    const distToNext = Math.max(0, remainInStep);

    if (stepIdx !== lastStep.current) {
      announcedFar.current = false;
      announcedNear.current = false;
      lastStep.current = stepIdx;
    }

    if (distToNext <= ANNOUNCE_FAR && !announcedFar.current) {
      speak(buildInstructionCb(steps[stepIdx], distToNext), 15000);
      announcedFar.current = true;
    }
    if (distToNext <= ANNOUNCE_NEAR && !announcedNear.current) {
      speak(buildInstructionCb(steps[stepIdx], distToNext), 5000);
      announcedNear.current = true;
    }

    setState({ currentStepIndex: stepIdx, distanceToNextManeuver: distToNext, offRoute, totalConsumedDistance: consumed });
  }, [userLat, userLng, active, steps, geometry, speak, buildInstructionCb]);

  return state;
}
