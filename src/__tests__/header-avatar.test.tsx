import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({ usePathname: () => '/' }));

import Header from '@/components/organisms/Header';
import Logo from '@/components/atoms/Logo';

describe('Header brand', () => {
  it('shows the MU circuit logo (not text) while keeping the link contract', () => {
    render(<Header />);
    const brand = screen.getByRole('link', { name: /go to home/i });
    expect(brand).toHaveAttribute('id', 'mu-global__header__link--brand');
    expect(brand).toHaveAttribute('href', '/');
    expect(brand.querySelector('svg[data-logo="mu-circuit"]')).toBeInTheDocument();
    expect(brand).not.toHaveTextContent('MU');
  });
});

describe('Logo', () => {
  it('is decorative, has no tagline text and draws every tool badge', () => {
    const { container } = render(<Logo className="h-16" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveClass('h-16');
    expect(svg).not.toHaveTextContent(/cloud architect/i);
    // 7 junction badges: Node, GCP, Docker, Kubernetes, server, AI, React
    expect(container.querySelectorAll('svg > g[transform^="translate("]')).toHaveLength(7);
    expect(container.querySelectorAll('.logo-pulse')).toHaveLength(2);
  });
});
