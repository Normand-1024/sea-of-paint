/** globals.tsx */

let volume = 1.0;

export type SpeedMode = 
  | 'very-slow' 
  | 'slow' 
  | 'normal' 
  | 'fast' 
  | 'very-fast';

let speedMode: SpeedMode = 'normal';

/** Volume API */
const audioListeners = new Set<(v: number) => void>();
export function subscribeVolume(fn: (v: number) => void) {
  audioListeners.add(fn);
  return () => { audioListeners.delete(fn); };
}

export function getVolume(): number { return volume; }
export function setVolume(v: number) {
  volume = Math.min(1, Math.max(0, v));
  audioListeners.forEach(fn => fn(volume));
}

/** Speed API */
const speedListeners = new Set<(m: SpeedMode) => void>();
export function subscribeSpeed(fn: (m: SpeedMode) => void) {
  speedListeners.add(fn);
  return () => { speedListeners.delete(fn); };
}

export function getSpeedMode(): SpeedMode { return speedMode; }
export function setSpeedMode(m: SpeedMode) {
  speedMode = m;
  speedListeners.forEach(fn => fn(speedMode));
}
