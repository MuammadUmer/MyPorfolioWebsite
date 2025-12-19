import { render, screen } from '@testing-library/react';
import SkillsSection from '@/components/organisms/SkillsSection';
import type { SkillCategory } from '@/lib/types/content';

const categories: SkillCategory[] = [
  {
    category: 'Backend & APIs',
    items: ['Node.js', 'Express'],
  },
  {
    category: 'Frontend & Mobile',
    items: ['React'],
  },
];

describe('SkillsSection', () => {
  it('renders skills heading and categories', () => {
    render(<SkillsSection categories={categories} />);

    expect(screen.getByRole('heading', { name: /skills/i })).toBeInTheDocument();
    expect(screen.getByText('Backend & APIs')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });
});
