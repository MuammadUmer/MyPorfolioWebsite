import { render, screen } from '@testing-library/react';
import ProjectCard from '@/components/molecules/ProjectCard';
import type { Project } from '@/lib/types/content';

const mockProject: Project = {
  slug: 'innova-care',
  title: 'Innova Care – Home Care System',
  role: 'Lead Backend & Architecture',
  company: 'F3 Technologies',
  period: '2021–Present',
  domain: 'Healthcare',
  summary: 'Upgraded a legacy home care system to a modern, event-driven, cloud-native platform.',
  techStack: ['Node.js', 'Google Cloud Functions'],
  highlights: ['Designed event-driven synchronization between SQL and Firestore'],
};

describe('ProjectCard', () => {
  it('renders a project card with deterministic ID and link', () => {
    const { container } = render(<ProjectCard project={mockProject} />);

    const card = container.querySelector('#mu-projects__projects-grid__card--innova-care');
    expect(card).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /innova care/i });
    expect(link).toHaveAttribute('href', '/projects/innova-care');
  });
});
