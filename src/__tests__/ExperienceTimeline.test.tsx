import { render, screen } from '@testing-library/react';
import ExperienceTimeline from '@/components/organisms/ExperienceTimeline';
import type { Experience } from '@/lib/types/content';

const experienceItems: Experience[] = [
  {
    company: 'F3 Technologies',
    role: 'Software Engineer / Lead',
    location: 'Sharjah – Remote',
    period: 'Oct 2020 – Present',
    responsibilities: ['Focused on RESTful API development using Node.js'],
  },
];

describe('ExperienceTimeline', () => {
  it('renders experience heading and items', () => {
    render(<ExperienceTimeline items={experienceItems} />);

    expect(
      screen.getByRole('heading', { name: /experience/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/F3 Technologies/)).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer/)).toBeInTheDocument();
  });
});
