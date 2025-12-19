import { render, screen, fireEvent, within } from '@testing-library/react';
import Header from '@/components/organisms/Header';

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renders primary navigation links', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: /primary navigation/i });
    expect(nav).toBeInTheDocument();
    const homeLink = within(nav).getByRole('link', { name: /home/i });
    expect(homeLink).toBeInTheDocument();
    // active route highlighting via aria-current
    expect(homeLink).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: /projects/i })).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    fireEvent.click(toggle);
    expect(
      screen.getByRole('navigation', { name: /mobile primary navigation/i })
    ).toBeInTheDocument();
  });
});
