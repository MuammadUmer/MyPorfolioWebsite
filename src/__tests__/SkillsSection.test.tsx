import { render, screen, fireEvent, within } from '@testing-library/react';
import SkillsSection from '@/components/organisms/SkillsSection';
import type { Project, SkillCategory } from '@/lib/types/content';

const categories: SkillCategory[] = [
  {
    category: 'Backend & APIs',
    items: ['Node.js', 'Express', 'Request validation'],
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
    expect(screen.getByRole('button', { name: 'Request validation' })).toBeInTheDocument();
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

  it('selects the first tile by default so the details panel is never empty', () => {
    render(<SkillsSection categories={categories} projects={projects} />);
    const details = screen.getByRole('complementary', { name: /skill details/i });
    expect(within(details).getByText('Node.js')).toBeInTheDocument();
    expect(within(details).getByText('Backend & APIs')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Node.js' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText(/hover or focus a tile/i)).not.toBeInTheDocument();
  });

  it('shows the projects using the selected tile', () => {
    render(<SkillsSection categories={categories} projects={projects} />);
    const details = screen.getByRole('complementary', { name: /skill details/i });
    expect(within(details).getByRole('link', { name: 'Innova Care' })).toHaveAttribute(
      'href',
      '/projects/innova-care'
    );
  });

  it('changes the selection on hover or focus and keeps it after the pointer leaves', () => {
    render(<SkillsSection categories={categories} projects={projects} />);
    const details = screen.getByRole('complementary', { name: /skill details/i });
    const react = screen.getByRole('button', { name: 'React' });

    fireEvent.mouseEnter(react);
    expect(within(details).getByText('Frontend & Mobile')).toBeInTheDocument();
    expect(react).toHaveAttribute('aria-pressed', 'true');

    fireEvent.mouseLeave(react);
    expect(within(details).getByText('Frontend & Mobile')).toBeInTheDocument();
    expect(react).toHaveAttribute('aria-pressed', 'true');

    fireEvent.focus(screen.getByRole('button', { name: 'Express' }));
    expect(within(details).getByText('Backend & APIs')).toBeInTheDocument();
    expect(react).toHaveAttribute('aria-pressed', 'false');
  });

  it('moves the selection into the family when a filter is chosen', () => {
    render(<SkillsSection categories={categories} projects={projects} />);
    const group = screen.getByRole('group', { name: /filter skills by category/i });
    fireEvent.click(within(group).getByRole('button', { name: 'Frontend & Mobile' }));
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(within(group).getByRole('button', { name: 'All' }));
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('uses an h1 on the standalone page', () => {
    render(<SkillsSection page="skills" categories={categories} projects={projects} />);
    expect(screen.getByRole('heading', { level: 1, name: /skills & tools/i })).toBeInTheDocument();
  });
});
