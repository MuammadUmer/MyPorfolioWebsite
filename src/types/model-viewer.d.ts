import type * as React from 'react';

type ModelViewerAttributes = {
  src?: string;
  alt?: string;
  loading?: 'auto' | 'lazy' | 'eager';
  reveal?: 'auto' | 'manual';
  'camera-orbit'?: string;
  'camera-target'?: string;
  'field-of-view'?: string;
  'min-camera-orbit'?: string;
  'max-camera-orbit'?: string;
  'interaction-prompt'?: 'auto' | 'none';
  'shadow-intensity'?: string;
  'environment-image'?: string;
  exposure?: string;
  'disable-zoom'?: boolean;
  'disable-pan'?: boolean;
  'disable-tap'?: boolean;
  autoplay?: boolean;
  'animation-name'?: string;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
        ModelViewerAttributes;
    }
  }
}

export {};
