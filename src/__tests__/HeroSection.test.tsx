import { render, screen, fireEvent } from '@testing-library/react';
import HeroSection from '@/components/organisms/HeroSection';
import type { Project } from '@/lib/types/content';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

const sampleProjects: Project[] = [
  {
    slug: 'innova-care',
    title: 'Innova Care – Home Care System',
    role: 'Lead Backend & Architecture',
    company: 'F3 Technologies',
    period: '2021–Present',
    domain: 'Healthcare',
    summary: 'Upgraded a legacy home care system.',
    techStack: ['Node.js', 'Google Cloud Functions'],
    highlights: ['Event-driven sync'],
  },
];

describe('HeroSection', () => {
  it('renders hero title, subtitle and primary CTA', () => {
    render(
      <HeroSection
        featuredProjects={sampleProjects}
        yearsExperience={6}
        totalProjects={20}
        domains={['Healthcare', 'Real Estate']}
      />
    );

    expect(
      screen.getByRole('heading', { name: /muhammad umer/i })
    ).toBeInTheDocument();

    const primaryCta = screen.getByRole('button', {
      name: /view projects/i,
    });
    expect(primaryCta).toBeInTheDocument();
    expect(primaryCta).toHaveAttribute('id', 'mu-home__hero__btn--primary-cta');
  });

  it('shows key stats and featured project', () => {
    render(
      <HeroSection
        featuredProjects={sampleProjects}
        yearsExperience={6}
        totalProjects={20}
        domains={['Healthcare', 'Real Estate']}
      />
    );

    expect(screen.getByText(/years of experience/i)).toBeInTheDocument();
    expect(screen.getByText(/projects delivered/i)).toBeInTheDocument();
    expect(screen.getByText(/innova care/i)).toBeInTheDocument();

    const projectCard = screen.getByRole('article');
    expect(projectCard.id).toContain('innova-care');
  });

  it('fires primary CTA click handler', () => {
    const { getByRole } = render(
      <HeroSection
        featuredProjects={sampleProjects}
        yearsExperience={6}
        totalProjects={20}
        domains={['Healthcare']}
      />
    );

    const button = getByRole('button', { name: /view projects/i });
    fireEvent.click(button);
    // useRouter is mocked, so we just ensure click does not throw
    expect(button).toBeInTheDocument();
  });
});
