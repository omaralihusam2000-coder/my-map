import { RouteInfo, RouteStep } from '../types';

const OSRM_URL = import.meta.env.VITE_OSRM_URL || 'https://router.project-osrm.org';

function decodePolyline(encoded: string): [number, number][] {
  const points: [number, number][] = [];
  let index = 0;
  let lat = 0;
  let lng = 0;

  while (index < encoded.length) {
    let shift = 0;
    let result = 0;
    let byte: number;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push([lat / 1e5, lng / 1e5]);
  }
  return points;
}

function parseStep(step: Record<string, unknown>): RouteStep {
  const maneuver = step.maneuver as Record<string, unknown> | undefined;
  return {
    instruction: (step.name as string) || '',
    distance: (step.distance as number) || 0,
    duration: (step.duration as number) || 0,
    name: (step.name as string) || '',
    maneuver: maneuver ? {
      type: (maneuver.type as string) || '',
      modifier: maneuver.modifier as string | undefined,
    } : undefined,
  };
}

export async function getRoute(
  fromLat: number, fromLng: number,
  toLat: number, toLng: number
): Promise<RouteInfo> {
  const url = `${OSRM_URL}/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=polyline&steps=true`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Routing failed');
  
  const data = await res.json() as { code: string; routes?: Array<{ distance: number; duration: number; geometry: string; legs: Array<{ steps: Record<string, unknown>[] }> }> };
  if (data.code !== 'Ok' || !data.routes?.length) throw new Error('No route found');
  
  const route = data.routes[0];
  const leg = route.legs[0];
  
  const steps: RouteStep[] = leg.steps.map(parseStep);
  const geometry = decodePolyline(route.geometry);

  return {
    distance: route.distance,
    duration: route.duration,
    steps,
    geometry,
  };
}
