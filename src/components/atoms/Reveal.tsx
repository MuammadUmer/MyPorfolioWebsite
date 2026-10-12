'use client';

import * as React from 'react';
import { observeReveal } from '@/lib/hooks/reveal';

type RevealTag = 'div' | 'p' | 'li' | 'section' | 'article' | 'ul' | 'span';

export interface RevealProps extends React.HTMLAttributes<HTMLElement> {
  as?: RevealTag;
  delay?: number;
}

/** Fades + lifts its content into view once; reduced motion is handled in CSS. */
const Reveal: React.FC<React.PropsWithChildren<RevealProps>> = ({
  as = 'div',
  delay = 0,
  className,
  style,
  children,
  ...rest
}) => {
  const setRef = React.useCallback((node: HTMLElement | null) => {
    if (!node) return undefined;
    return observeReveal(node);
  }, []);

  return React.createElement(
    as,
    {
      ref: setRef,
      className: ['reveal', className].filter(Boolean).join(' '),
      style: { ...style, '--reveal-delay': `${delay}ms` } as React.CSSProperties,
      ...rest,
    },
    children
  );
};

export default Reveal;
