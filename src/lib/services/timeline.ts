import type { Education, Experience, TimelineEntry } from '@/lib/types/content';
import { slugify } from '@/lib/services/slug';

const YEAR_PATTERN = /\b(?:19|20)\d{2}\b/g;
const ONGOING_PATTERN = /\b(?:present|current|now)\b/i;

function years(period: string): string[] {
  return period.match(YEAR_PATTERN) ?? [];
}

/** The year a period ends in ("Aug 2023 – Feb 2026" -> "2026"); open-ended periods read "Present". */
export function endYearOf(period: string): string {
  if (ONGOING_PATTERN.test(period)) return 'Present';
  const found = years(period);
  return found[found.length - 1] ?? '';
}

const sortKey = (year: string) => (year === 'Present' ? Number.POSITIVE_INFINITY : Number(year) || 0);

/**
 * Merges experience (already most-recent-first) with education into one timeline, newest first.
 * Each entry is labelled with the year it ENDED, parsed from the existing period string; nothing is inferred.
 * An education entry goes before the first experience that ended earlier than it did, so on a tie the
 * experience stays above the degree.
 */
export function buildTimeline(experience: Experience[], education: Education[]): TimelineEntry[] {
  const entries: TimelineEntry[] = experience.map((item) => {
    const [startYear = ''] = years(item.period);
    return {
      id: `${slugify(item.company)}-${slugify(item.role)}-${startYear}`,
      kind: 'experience',
      year: endYearOf(item.period),
      period: item.period,
      title: item.role,
      organisation: item.company,
      location: item.location,
      description: item.description,
      bullets: item.responsibilities,
    };
  });

  for (const item of education) {
    const startYear = years(item.period)[0] ?? '';
    const endYear = endYearOf(item.period);
    const entry: TimelineEntry = {
      id: `education-${slugify(item.institution)}-${startYear}`,
      kind: 'education',
      year: endYear,
      period: item.period,
      title: item.degree,
      organisation: item.institution,
      bullets: item.details ?? [],
    };

    const insertAt = entries.findIndex(
      (existing) => existing.kind === 'experience' && existing.year !== '' && sortKey(existing.year) < sortKey(endYear)
    );
    if (insertAt === -1) {
      entries.push(entry);
    } else {
      entries.splice(insertAt, 0, entry);
    }
  }

  return entries;
}
