import type { AboutCopy } from '@/lib/types/content';

/**
 * Splits the existing About paragraphs for the redesigned layout without changing any text:
 * paragraph 1 becomes the lead, the last paragraph's final sentence(s) become the pull-quote,
 * and everything else stays in the body in the original order.
 */
export function splitAboutCopy(paragraphs: string[]): AboutCopy {
  if (paragraphs.length === 0) {
    return { lead: '', body: [], quote: '' };
  }

  const [lead, ...rest] = paragraphs;
  if (rest.length === 0) {
    return { lead, body: [], quote: '' };
  }

  const last = rest[rest.length - 1];
  const middle = rest.slice(0, -1);
  const match = last.match(/^([\s\S]+?[.!?])\s+([\s\S]+)$/);

  if (!match) {
    return { lead, body: rest, quote: '' };
  }

  return { lead, body: [...middle, match[1]], quote: match[2] };
}
