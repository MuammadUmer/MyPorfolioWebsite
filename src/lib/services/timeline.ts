import type { Education, Experience, TimelineEntry } from '@/lib/types/content';
import { slugify } from '@/lib/services/slug';

const YEAR_PATTERN = /\b(?:19|20)\d{2}\b/g;

function years(period: string): string[] {
  return period.match(YEAR_PATTERN) ?? [];
}

/**
 * Merges experience (already most-recent-first) with education into one timeline.
 * Years are parsed from the existing period strings; nothing is inferred.
 * An education entry is placed after every experience entry that started in or after its end year.
 */
export function buildTimeline(experience: Experience[], education: Education[]): TimelineEntry[] {
  const entries: TimelineEntry[] = experience.map((item) => {
    const [startYear = ''] = years(item.period);
    return {
      id: `${slugify(item.company)}-${slugify(item.role)}-${startYear}`,
      kind: 'experience',
      year: startYear,
      period: item.period,
      title: item.role,
      organisation: item.company,
      location: item.location,
      description: item.description,
      bullets: item.responsibilities,
    };
  });

  for (const item of education) {
    const found = years(item.period);
    const startYear = found[0] ?? '';
    const endYear = found[found.length - 1] ?? startYear;
    const entry: TimelineEntry = {
      id: `education-${slugify(item.institution)}-${startYear}`,
      kind: 'education',
      year: startYear,
      period: item.period,
      title: item.degree,
      organisation: item.institution,
      bullets: item.details ?? [],
    };

    const insertAt = entries.findIndex(
      (existing) => existing.kind === 'experience' && existing.year !== '' && existing.year < endYear
    );
    if (insertAt === -1) {
      entries.push(entry);
    } else {
      entries.splice(insertAt, 0, entry);
    }
  }

  return entries;
}
