interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

type NavigatorLike = Navigator & {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
};

export const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SLOW_CONNECTIONS = ['slow-2g', '2g', '3g'];

export function hasWebGL(doc: Document = document): boolean {
  try {
    const canvas = doc.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * The interactive 3D avatar is a progressive enhancement. It only runs on desktop-sized screens with
 * WebGL, no reduced-motion/data-saver preference, a decent connection and a reasonably capable device.
 * Everywhere else the still poster stays in place.
 */
export function canRunInteractiveAvatar(win: Window = window): boolean {
  if (typeof win.matchMedia !== 'function') return false;
  if (!win.matchMedia(DESKTOP_QUERY).matches) return false;
  if (win.matchMedia(REDUCED_MOTION_QUERY).matches) return false;

  const nav = win.navigator as NavigatorLike;
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && SLOW_CONNECTIONS.includes(nav.connection.effectiveType)) return false;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false;

  return hasWebGL(win.document);
}
