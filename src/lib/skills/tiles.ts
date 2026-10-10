import type { Project, SkillCategory } from '@/lib/types/content';
import { slugify } from '@/lib/services/slug';

export const WIDE_LABEL_THRESHOLD = 16;
export const FAMILY_COUNT = 10;

export interface SkillTile {
  id: string;
  number: number;
  label: string;
  category: string;
  family: number;
  symbol: string | null;
  wide: boolean;
}

function tokens(label: string): string[] {
  return label
    .replace(/\([^)]*\)/g, ' ')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

function cap(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function candidates(label: string): string[] {
  const parts = tokens(label);
  if (parts.length === 0) return [];
  const [first, second] = parts;
  const letters = parts.join('');
  const list: string[] = [];

  const compact = label.replace(/\s+/g, '');

  if (compact.length <= 2) list.push(compact.charAt(0).toUpperCase() + compact.slice(1));
  if (first.length >= 2) list.push(cap(first.slice(0, 2)));
  if (second) list.push(first.charAt(0).toUpperCase() + second.charAt(0).toLowerCase());
  for (let i = 1; i < letters.length; i += 1) {
    list.push(letters.charAt(0).toUpperCase() + letters.charAt(i).toLowerCase());
  }
  for (let i = 1; i < letters.length; i += 1) {
    for (let j = i + 1; j < letters.length; j += 1) {
      list.push(letters.charAt(i).toUpperCase() + letters.charAt(j).toLowerCase());
    }
  }
  for (let digit = 1; digit <= 9; digit += 1) {
    list.push(`${letters.charAt(0).toUpperCase()}${digit}`);
  }
  return list;
}

/** Deterministic two-letter symbols (decorative only; the full label is always rendered). */
export function assignSymbols(labels: string[]): Array<string | null> {
  const used = new Set<string>();
  return labels.map((label) => {
    const options = candidates(label);
    const pick = options.find((option) => !used.has(option));
    if (!pick) return null;
    used.add(pick);
    return pick;
  });
}

export function buildSkillTiles(categories: SkillCategory[]): SkillTile[] {
  const flat = categories.flatMap((category, categoryIndex) =>
    category.items.map((label) => ({ label, category: category.category, categoryIndex }))
  );

  const standard = flat.filter((item) => item.label.length <= WIDE_LABEL_THRESHOLD);
  const symbols = assignSymbols(standard.map((item) => item.label));
  const symbolByLabel = new Map<string, string | null>();
  standard.forEach((item, index) => symbolByLabel.set(`${item.category}::${item.label}`, symbols[index]));

  return flat.map((item, index) => {
    const wide = item.label.length > WIDE_LABEL_THRESHOLD;
    return {
      id: `${slugify(item.category)}--${slugify(item.label)}`,
      number: index + 1,
      label: item.label,
      category: item.category,
      family: (item.categoryIndex % FAMILY_COUNT) + 1,
      symbol: wide ? null : (symbolByLabel.get(`${item.category}::${item.label}`) ?? null),
      wide,
    };
  });
}

/** Projects whose techStack contains this exact label (case-insensitive). */
export function projectsUsing(label: string, projects: Project[]): Project[] {
  const needle = label.trim().toLowerCase();
  return projects.filter((project) =>
    project.techStack.some((tech) => tech.trim().toLowerCase() === needle)
  );
}
