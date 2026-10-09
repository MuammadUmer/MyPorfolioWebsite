export const THEME_STORAGE_KEY = 'theme';

/**
 * Runs before first paint: marks JS as available (enables scroll reveals) and applies the stored
 * theme, falling back to the system preference and finally to light.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement;d.classList.add('js');var s=localStorage.getItem('${THEME_STORAGE_KEY}');var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(s==='dark'||(s!=='light'&&m)){d.classList.add('dark');}}catch(e){}})();`;

export function readIsDark(): boolean {
  if (typeof document === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export function applyTheme(dark: boolean): void {
  document.documentElement.classList.toggle('dark', dark);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
  } catch {
    /* storage unavailable (private mode) — theme still applies for this session */
  }
}
