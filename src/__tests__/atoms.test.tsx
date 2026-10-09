import { render, screen, fireEvent } from '@testing-library/react';
import SectionHeading from '@/components/atoms/SectionHeading';
import Eyebrow from '@/components/atoms/Eyebrow';
import Reveal from '@/components/atoms/Reveal';
import ScrambleText from '@/components/atoms/ScrambleText';
import ProjectsGrid from '@/components/organisms/ProjectsGrid';
import { getProjects } from '@/lib/services/content';

describe('SectionHeading', () => {
  it('keeps a single accessible heading name made of both phrases', () => {
    render(<SectionHeading bold="Skills" italic="& tools." />);
    expect(screen.getByRole('heading', { level: 2, name: 'Skills & tools.' })).toBeInTheDocument();
  });

  it('supports a custom semantic level and id without changing visual classes', () => {
    render(<SectionHeading as="h1" id="title" bold="About" italic="me." />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveAttribute('id', 'title');
    expect(heading.className).toContain('t-h2');
    expect(heading.className).toContain('reveal-words');
  });

  it('wraps every word for the staggered reveal', () => {
    const { container } = render(<SectionHeading bold="Experience" italic="& education." />);
    const words = Array.from(container.querySelectorAll('.word')).map((word) => word.textContent);
    expect(words).toEqual(['Experience', '&', 'education.']);
  });
});

describe('Eyebrow', () => {
  it('renders as a paragraph with a hidden index prefix', () => {
    const { container } = render(<Eyebrow index="01">About</Eyebrow>);
    expect(container.querySelector('p')).toHaveClass('eyebrow');
    expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent('01 /');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });
});

describe('Reveal', () => {
  it('renders the requested tag with the reveal class and delay variable', () => {
    const { container } = render(
      <Reveal as="p" delay={120} className="extra">
        Hello
      </Reveal>
    );
    const element = container.querySelector('p') as HTMLElement;
    expect(element).toHaveClass('reveal', 'extra');
    expect(element.style.getPropertyValue('--reveal-delay')).toBe('120ms');
  });

  it('marks elements in view immediately when IntersectionObserver is unavailable', async () => {
    const original = global.IntersectionObserver;
    (global as { IntersectionObserver?: unknown }).IntersectionObserver = undefined;
    jest.resetModules();
    const { observeReveal } = await import('@/lib/hooks/reveal');
    const element = document.createElement('div');
    const cleanup = observeReveal(element);
    expect(element.classList.contains('is-inview')).toBe(true);
    cleanup();
    global.IntersectionObserver = original;
  });
});

describe('ScrambleText', () => {
  it('keeps the real text in the accessibility tree exactly once', () => {
    render(
      <button type="button">
        <ScrambleText text="Download CV" />
      </button>
    );
    expect(screen.getByRole('button', { name: 'Download CV' })).toBeInTheDocument();
  });
});

describe('ProjectsGrid', () => {
  const projects = getProjects();

  it('renders every project card and keeps the three filters', () => {
    const { container } = render(<ProjectsGrid projects={projects} />);
    expect(container.querySelectorAll('article')).toHaveLength(projects.length);
    expect(screen.getByLabelText('Domain')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort by')).toBeInTheDocument();
  });

  it('filters by domain and shows the empty state when nothing matches', () => {
    const { container } = render(<ProjectsGrid projects={projects} />);
    fireEvent.change(screen.getByLabelText('Domain'), { target: { value: 'Real Estate' } });
    expect(container.querySelectorAll('article')).toHaveLength(
      projects.filter((project) => project.domain === 'Real Estate').length
    );

    fireEvent.change(screen.getByLabelText('Role'), { target: { value: 'Android Developer' } });
    expect(screen.getByText('No projects found matching your filters.')).toBeInTheDocument();
  });

  it('sorts titles A–Z', () => {
    const { container } = render(<ProjectsGrid projects={projects} />);
    fireEvent.change(screen.getByLabelText('Sort by'), { target: { value: 'az' } });
    const titles = Array.from(container.querySelectorAll('article h3')).map((node) => node.textContent ?? '');
    expect(titles).toEqual([...titles].sort((a, b) => a.localeCompare(b)));
  });
});
