'use client';

import * as React from 'react';

/**
 * Returns the id of the section currently crossing the middle of the viewport.
 * `ids` are element ids; unknown ids are ignored. Without IntersectionObserver the first id stays active.
 */
export function useScrollSpy(ids: string[], enabled = true): string {
  const [active, setActive] = React.useState<string>(ids[0] ?? '');
  const key = ids.join('|');

  React.useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;

    const list = key.split('|').filter(Boolean);
    const elements = list
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [key, enabled]);

  return active;
}
