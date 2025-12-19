export interface AnalyticsEventPayload {
  actionId?: string;
  [key: string]: unknown;
}

export function trackEvent(eventName: string, payload?: AnalyticsEventPayload): void {
  if (typeof window === 'undefined') {
    return;
  }

  const enhancedPayload = {
    eventName,
    ...payload,
  };

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.info('[analytics]', enhancedPayload);
  }

  const anyWindow = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof anyWindow.gtag === 'function') {
    anyWindow.gtag('event', eventName, payload ?? {});
  }
}
