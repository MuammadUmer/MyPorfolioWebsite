'use client';

import * as React from 'react';
import { observeReveal } from '@/lib/hooks/reveal';

export interface SectionHeadingProps {
  bold: string;
  italic?: string;
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
}

function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean);
}

/**
 * Bold grotesque phrase + muted italic-serif phrase. Words blur-slide in once on first view.
 * Visual size is fixed by the type token; the semantic level is chosen with `as`.
 */
const SectionHeading: React.FC<SectionHeadingProps> = ({
  bold,
  italic,
  as: Tag = 'h2',
  id,
  className,
}) => {
  const ref = React.useRef<HTMLHeadingElement | null>(null);

  React.useEffect(() => {
    if (!ref.current) return;
    return observeReveal(ref.current);
  }, []);

  const boldWords = words(bold);
  const italicWords = italic ? words(italic) : [];

  return (
    <Tag
      ref={ref}
      id={id}
      className={['reveal-words t-h2', className].filter(Boolean).join(' ')}
    >
      {boldWords.map((word, index) => (
        <React.Fragment key={`b-${index}`}>
          {index > 0 ? ' ' : null}
          <span className="word" style={{ '--i': index } as React.CSSProperties}>
            {word}
          </span>
        </React.Fragment>
      ))}
      {italicWords.length > 0 ? ' ' : null}
      {italicWords.length > 0 ? (
        <span className="t-serif">
          {italicWords.map((word, index) => (
            <React.Fragment key={`i-${index}`}>
              {index > 0 ? ' ' : null}
              <span
                className="word"
                style={{ '--i': boldWords.length + index } as React.CSSProperties}
              >
                {word}
              </span>
            </React.Fragment>
          ))}
        </span>
      ) : null}
    </Tag>
  );
};

export default SectionHeading;
