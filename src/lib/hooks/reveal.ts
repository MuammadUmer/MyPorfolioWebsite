let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (observer) return observer;
  if (typeof IntersectionObserver === 'undefined') return null;
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
          observer?.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );
  return observer;
}

/** Adds `.is-inview` once the element enters the viewport (single shared observer). */
export function observeReveal(element: Element): () => void {
  const shared = getObserver();
  if (!shared) {
    element.classList.add('is-inview');
    return () => undefined;
  }
  shared.observe(element);
  return () => shared.unobserve(element);
}
