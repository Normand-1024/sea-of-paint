/** globals.tsx */

let musicVolume = 1.0;
let sfxVolume = 1.0;

export type SpeedMode = 
  | 'very-slow' 
  | 'slow' 
  | 'normal' 
  | 'fast' 
  | 'very-fast';

let speedMode: SpeedMode = 'normal';

/** Volume API */
const musicListeners = new Set<(v: number) => void>();
export function subscribeMusicVolume(fn: (v: number) => void) {
  musicListeners.add(fn);
  return () => { musicListeners.delete(fn); };
}
export function getMusicVolume(): number { return musicVolume; }
export function setMusicVolume(v: number) {
  musicVolume = Math.min(1, Math.max(0, v));
  musicListeners.forEach(fn => fn(musicVolume));
}

const sfxListeners = new Set<(v: number) => void>();
export function subscribeSfxVolume(fn: (v: number) => void) {
  sfxListeners.add(fn);
  return () => { sfxListeners.delete(fn); };
}
export function getSfxVolume(): number { return sfxVolume; }
export function setSfxVolume(v: number) {
  sfxVolume = Math.min(1, Math.max(0, v));
  sfxListeners.forEach(fn => fn(sfxVolume));
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
