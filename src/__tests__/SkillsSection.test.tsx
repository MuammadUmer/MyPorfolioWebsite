import { render, screen, fireEvent, within } from '@testing-library/react';
import SkillsSection from '@/components/organisms/SkillsSection';
import type { Project, SkillCategory } from '@/lib/types/content';

const categories: SkillCategory[] = [
  {
    category: 'Backend & APIs',
    items: ['Node.js', 'Express', 'Rate limiting & request validation'],
  },
  {
    category: 'Frontend & Mobile',
    items: ['React'],
  },
];

const projects: Project[] = [
  {
    slug: 'innova-care',
    title: 'Innova Care – Home Care System',
    role: 'Lead',
    domain: 'Healthcare',
    summary: 'Summary',
    techStack: ['node.js', 'Express'],
    highlights: [],
  },
  {
    slug: 'eizhar',
    title: 'Eizhar – Property Management Platform',
    role: 'Lead',
    domain: 'Real Estate',
    summary: 'Summary',
    techStack: ['React Native'],
    highlights: [],
  },
];

describe('SkillsSection', () => {
  it('renders the heading, a computed summary and every item as a tile', () => {
    render(<SkillsSection categories={categories} projects={projects} />);

    expect(screen.getByRole('heading', { level: 2, name: /skills & tools/i })).toBeInTheDocument();
    expect(screen.getByText('4 items in 2 families')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Node.js' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Express' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Rate limiting & request validation' })).toBeInTheDocument();
  });

  it('exposes a filter chip per category plus All', () => {
    render(<SkillsSection categories={categories} projects={projects} />);
    const group = screen.getByRole('group', { name: /filter skills by category/i });
    expect(within(group).getAllByRole('button')).toHaveLength(3);
    expect(within(group).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('dims tiles outside the selected family without removing them', () => {
    render(<SkillsSection categories={categories} projects={projects} />);
    const group = screen.getByRole('group', { name: /filter skills by category/i });
    fireEvent.click(within(group).getByRole('button', { name: 'Frontend & Mobile' }));

    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('data-dim', 'false');
    expect(screen.getByRole('button', { name: 'Node.js' })).toHaveAttribute('data-dim', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('Showing 1 of 4 — Frontend & Mobile');
  });

  it('shows details and the projects using the tile on hover or focus', () => {
    render(<SkillsSection categories={categories} projects={projects} />);
    expect(screen.getByText('Hover or focus a tile for details')).toBeInTheDocument();

    fireEvent.focus(screen.getByRole('button', { name: 'Node.js' }));
    const details = screen.getByRole('complementary', { name: /skill details/i });
    expect(within(details).getByText('Node.js')).toBeInTheDocument();
    expect(within(details).getByText('Backend & APIs')).toBeInTheDocument();
    expect(within(details).getByRole('link', { name: 'Innova Care' })).toHaveAttribute(
      'href',
      '/projects/innova-care'
    );
  });

  it('clears the details panel with Escape', () => {
    render(<SkillsSection categories={categories} projects={projects} />);
    const tile = screen.getByRole('button', { name: 'React' });
    fireEvent.focus(tile);
    expect(screen.queryByText('Hover or focus a tile for details')).not.toBeInTheDocument();
    fireEvent.keyDown(tile, { key: 'Escape' });
    expect(screen.getByText('Hover or focus a tile for details')).toBeInTheDocument();
  });

  it('uses an h1 on the standalone page', () => {
    render(<SkillsSection page="skills" categories={categories} projects={projects} />);
    expect(screen.getByRole('heading', { level: 1, name: /skills & tools/i })).toBeInTheDocument();
  });
});
