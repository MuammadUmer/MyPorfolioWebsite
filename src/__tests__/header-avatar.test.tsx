import { render, screen } from '@testing-library/react';

jest.mock('next/navigation', () => ({ usePathname: () => '/' }));
jest.mock('@/data/profile.json', () => ({
  ...jest.requireActual('@/data/profile.json'),
  avatar: {
    model: '/avatar/muhammad-umer.glb',
    poster: '/avatar/poster.webp',
    logo: '/avatar/logo.webp',
    alt: '3D avatar of Muhammad Umer',
  },
}));

import Header from '@/components/organisms/Header';

describe('Header brand with an avatar', () => {
  it('shows the avatar logo instead of the MU text while keeping the link contract', () => {
    render(<Header />);
    const brand = screen.getByRole('link', { name: /go to home/i });
    expect(brand).toHaveAttribute('id', 'mu-global__header__link--brand');
    expect(brand).toHaveAttribute('href', '/');
    expect(brand.querySelector('img')).toBeInTheDocument();
    expect(brand).not.toHaveTextContent('MU');
  });
});
