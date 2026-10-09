import { assignSymbols, buildSkillTiles, projectsUsing, WIDE_LABEL_THRESHOLD } from '@/lib/skills/tiles';
import { getProjects, getSkillCategories } from '@/lib/services/content';

describe('assignSymbols', () => {
  it('derives a capitalised two-letter symbol from the first word', () => {
    expect(assignSymbols(['Node.js', 'Express', 'Python'])).toEqual(['No', 'Ex', 'Py']);
  });

  it('resolves collisions deterministically with the second word initial', () => {
    expect(assignSymbols(['React.js', 'React Native'])).toEqual(['Re', 'Rn']);
  });

  it('never repeats a symbol', () => {
    const labels = ['Jest', 'Java', 'JavaScript', 'JWT', 'JUnit', 'Jira'];
    const symbols = assignSymbols(labels).filter(Boolean);
    expect(new Set(symbols).size).toBe(symbols.length);
  });
});

describe('buildSkillTiles with the real data', () => {
  const categories = getSkillCategories();
  const tiles = buildSkillTiles(categories);

  it('creates exactly one tile per existing skill item, numbered in order', () => {
    const total = categories.reduce((sum, category) => sum + category.items.length, 0);
    expect(tiles).toHaveLength(total);
    expect(tiles.map((tile) => tile.number)).toEqual(tiles.map((_, index) => index + 1));
    expect(tiles.map((tile) => tile.label)).toEqual(categories.flatMap((category) => category.items));
  });

  it('keeps the original label text and category on every tile', () => {
    categories.forEach((category) => {
      category.items.forEach((item) => {
        expect(tiles.some((tile) => tile.label === item && tile.category === category.category)).toBe(true);
      });
    });
  });

  it('gives long labels a wide, symbol-less tile and short labels a unique symbol', () => {
    tiles.forEach((tile) => {
      if (tile.label.length > WIDE_LABEL_THRESHOLD) {
        expect(tile.wide).toBe(true);
        expect(tile.symbol).toBeNull();
      } else {
        expect(tile.wide).toBe(false);
      }
    });
    const symbols = tiles.map((tile) => tile.symbol).filter((symbol): symbol is string => symbol !== null);
    expect(new Set(symbols).size).toBe(symbols.length);
  });

  it('assigns family numbers 1-10 by category order', () => {
    expect(new Set(tiles.map((tile) => tile.family))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
    expect(tiles[0].family).toBe(1);
  });
});

describe('projectsUsing', () => {
  it('matches exact tech labels case-insensitively', () => {
    const projects = getProjects();
    const users = projectsUsing('node.js', projects);
    expect(users.length).toBeGreaterThan(0);
    users.forEach((project) =>
      expect(project.techStack.map((tech) => tech.toLowerCase())).toContain('node.js')
    );
  });

  it('returns nothing for labels no project uses', () => {
    expect(projectsUsing('Definitely Not A Tech', getProjects())).toEqual([]);
  });
});
