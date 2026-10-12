import { render, screen, fireEvent, within } from '@testing-library/react';
import ProjectsShowcase from '@/components/organisms/ProjectsShowcase';
import { getProjects } from '@/lib/services/content';

describe('ProjectsShowcase', () => {
  const projects = getProjects();
  const expandButton = (title: string) => screen.getByRole('button', { name: title });
  const slugsOf = (container: HTMLElement) =>
    Array.from(container.querySelectorAll('article')).map((article) =>
      article.id.replace(/.*__card--/, '')
    );

  it('opens the first project and links to its case study', () => {
    render(<ProjectsShowcase projects={projects} />);
    expect(screen.getByRole('heading', { level: 2, name: /selected projects/i })).toBeInTheDocument();

    expect(expandButton('Innova Care')).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: /view case study/i })).toHaveAttribute(
      'href',
      '/projects/innova-care'
    );
  });

  it('shows three panels at a time', () => {
    const { container } = render(<ProjectsShowcase projects={projects} />);
    expect(container.querySelectorAll('article')).toHaveLength(3);
  });

  it('switches the open panel on click and keyboard navigation', () => {
    render(<ProjectsShowcase projects={projects} />);

    fireEvent.click(expandButton('Eizhar'));
    expect(expandButton('Eizhar')).toHaveAttribute('aria-expanded', 'true');
    expect(expandButton('Innova Care')).toHaveAttribute('aria-expanded', 'false');

    fireEvent.keyDown(expandButton('Eizhar'), { key: 'ArrowRight' });
    expect(expandButton('Local LLM Inference Stack')).toHaveAttribute('aria-expanded', 'true');
  });

  it('shows the stack only once, inside the dark panel', () => {
    const { container } = render(<ProjectsShowcase projects={projects} />);
    expect(container.querySelectorAll('.tech-chip')).toHaveLength(0);

    const open = container.querySelector('#mu-home__featured-projects__panel--innova-care') as HTMLElement;
    const dark = open.querySelector('.surface-deep') as HTMLElement;
    projects[0].techStack.forEach((tech) => {
      expect(within(dark).getByText(tech)).toBeInTheDocument();
      expect(within(open).getAllByText(tech)).toHaveLength(1);
    });
  });

  it('replaces a panel with the next project when its cross is pressed', () => {
    const { container } = render(<ProjectsShowcase projects={projects} />);
    expect(slugsOf(container)).toEqual(['innova-care', 'eizhar', 'llm-inference-stack']);

    fireEvent.click(
      screen.getByRole('button', { name: /remove innova care and show the next project/i })
    );

    expect(slugsOf(container)).toEqual(['eizhar', 'llm-inference-stack', 'bio-scan']);
    expect(screen.queryByRole('button', { name: 'Innova Care' })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Innova Care removed. Bio Scan added.');
    expect(expandButton('Eizhar')).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps the open panel when a different panel is removed', () => {
    const { container } = render(<ProjectsShowcase projects={projects} />);
    fireEvent.click(
      screen.getByRole('button', {
        name: /remove local llm inference stack and show the next project/i,
      })
    );
    expect(expandButton('Innova Care')).toHaveAttribute('aria-expanded', 'true');
    expect(slugsOf(container)).toEqual(['innova-care', 'eizhar', 'bio-scan']);
  });

  it('cycles through every project and brings the first one back on its turn', () => {
    const { container } = render(<ProjectsShowcase projects={projects} />);
    const seen = new Set<string>(slugsOf(container));

    for (let step = 0; step < projects.length; step += 1) {
      const [first] = screen.getAllByRole('button', { name: /^remove .* and show the next project$/i });
      fireEvent.click(first);
      slugsOf(container).forEach((slug) => seen.add(slug));
    }

    projects.forEach((project) => expect(seen.has(project.slug)).toBe(true));
    const visible = slugsOf(container);
    expect(visible).toHaveLength(3);
    expect(new Set(visible).size).toBe(3);
  });

  it('hides the cross buttons when there is nothing to rotate in', () => {
    render(<ProjectsShowcase projects={projects.slice(0, 3)} />);
    expect(screen.queryByRole('button', { name: /show the next project/i })).not.toBeInTheDocument();
  });

  it('links to the full project list with the derived count', () => {
    render(<ProjectsShowcase projects={projects} />);
    const link = screen.getByRole('link', { name: `All ${projects.length} projects` });
    expect(link).toHaveAttribute('href', '/projects');
  });
});
