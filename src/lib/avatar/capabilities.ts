interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

type NavigatorLike = Navigator & {
  connection?: NetworkInformationLike;
};

export const DESKTOP_QUERY = '(min-width: 1024px)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
/** Only truly unusable connections keep the still image; "3g" is common on ordinary broadband readings. */
const UNUSABLE_CONNECTIONS = ['slow-2g', '2g'];

export type AvatarBlockReason =
  | 'no-media-queries'
  | 'small-screen'
  | 'reduced-motion'
  | 'data-saver'
  | 'slow-connection'
  | 'no-webgl';

export function hasWebGL(doc: Document = document): boolean {
  try {
    const canvas = doc.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Why the interactive avatar should stay a still image, or `null` when it can run. The 3D avatar is a
 * progressive enhancement: it needs a desktop-width screen, WebGL, no reduced-motion / data-saver
 * preference and a usable connection. (CPU/memory/connection-type heuristics were removed: they
 * misclassified normal machines and left the avatar permanently static.)
 */
export function getAvatarBlockReason(win: Window = window): AvatarBlockReason | null {
  if (typeof win.matchMedia !== 'function') return 'no-media-queries';
  if (!win.matchMedia(DESKTOP_QUERY).matches) return 'small-screen';
  if (win.matchMedia(REDUCED_MOTION_QUERY).matches) return 'reduced-motion';

  const nav = win.navigator as NavigatorLike;
  if (nav.connection?.saveData) return 'data-saver';
  if (nav.connection?.effectiveType && UNUSABLE_CONNECTIONS.includes(nav.connection.effectiveType)) {
    return 'slow-connection';
  }

  return hasWebGL(win.document) ? null : 'no-webgl';
}

export function canRunInteractiveAvatar(win: Window = window): boolean {
  return getAvatarBlockReason(win) === null;
}
