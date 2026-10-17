import { render, screen } from '@testing-library/react';
import ExperienceTimeline from '@/components/organisms/ExperienceTimeline';
import type { TimelineEntry } from '@/lib/types/content';

const manyBullets = Array.from({ length: 8 }, (_, index) => `Responsibility number ${index + 1}`);

const entries: TimelineEntry[] = [
  {
    id: 'f3-technologies-senior-software-engineer-2020',
    kind: 'experience',
    year: '2020',
    period: 'Oct 2020 – Jul 2023',
    title: 'Senior Software Engineer',
    organisation: 'F3 Technologies',
    location: 'Onsite – Pakistan',
    description: 'Joined as a full-stack engineer.',
    bullets: manyBullets,
  },
  {
    id: 'education-comsats-2015',
    kind: 'education',
    year: '2015',
    period: '2015 – 2019',
    title: 'B.S. Software Engineering',
    organisation: 'COMSATS University Islamabad',
    bullets: ['CGPA: 3.2 / 4.0'],
  },
];

describe('ExperienceTimeline', () => {
  it('renders the Experience & education heading as h2 on the home page', () => {
    render(<ExperienceTimeline entries={entries} />);
    expect(screen.getByRole('heading', { level: 2, name: /experience & education/i })).toBeInTheDocument();
  });

  it('renders an h1 on the standalone route', () => {
    render(<ExperienceTimeline entries={entries} page="experience" density="full" />);
    expect(screen.getByRole('heading', { level: 1, name: /experience & education/i })).toBeInTheDocument();
  });

  it('renders experience and education entries with their tags and details', () => {
    render(<ExperienceTimeline entries={entries} />);
    expect(screen.getByText('F3 Technologies · Onsite – Pakistan')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Senior Software Engineer' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'B.S. Software Engineering' })).toBeInTheDocument();
    expect(screen.getByText('COMSATS University Islamabad')).toBeInTheDocument();
    expect(screen.getByText('CGPA: 3.2 / 4.0')).toBeInTheDocument();
    const tags = Array.from(document.querySelectorAll('.bg-deep')).map((node) => node.textContent);
    expect(tags).toEqual(['Experience', 'Education']);
  });

  it('draws a single spine and alternates the cards left and right', () => {
    const { container } = render(<ExperienceTimeline entries={[...entries, { ...entries[1], id: 'third' }]} />);
    expect(container.querySelectorAll('.timeline-rail')).toHaveLength(1);
    expect(container.querySelectorAll('.timeline-fill')).toHaveLength(1);
    const sides = Array.from(container.querySelectorAll('.tl-item')).map((item) => item.getAttribute('data-side'));
    expect(sides).toEqual(['left', 'right', 'left']);
  });

  it('collapses long bullet lists in summary density but keeps every bullet in the DOM', () => {
    render(<ExperienceTimeline entries={entries} density="summary" />);
    expect(screen.getByText('Show 4 more responsibilities')).toBeInTheDocument();
    manyBullets.forEach((bullet) => expect(screen.getByText(bullet)).toBeInTheDocument());
  });

  it('shows everything without a disclosure in full density', () => {
    render(<ExperienceTimeline entries={entries} density="full" />);
    expect(screen.queryByText(/more responsibilities/i)).not.toBeInTheDocument();
    manyBullets.forEach((bullet) => expect(screen.getByText(bullet)).toBeInTheDocument());
  });
});
