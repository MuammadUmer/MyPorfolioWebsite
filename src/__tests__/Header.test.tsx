import { render, screen, fireEvent, within } from '@testing-library/react';
import Header from '@/components/organisms/Header';

let mockPathname = '/';

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
}));

describe('Header', () => {
  beforeEach(() => {
    mockPathname = '/';
    document.documentElement.classList.remove('dark');
    window.localStorage.clear();
  });

  it('renders the six primary links in section order', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: /primary navigation/i });
    const links = within(nav).getAllByRole('link');
    const expected = ['Home', 'About', 'Skills', 'Projects', 'Experience', 'Contact'];
    expect(links).toHaveLength(expected.length);
    expected.forEach((name, index) => expect(links[index]).toHaveAccessibleName(name));
  });

  it('marks Home as the current page and uses in-page anchors on the home route', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: /primary navigation/i });
    const home = within(nav).getByRole('link', { name: /home/i });
    expect(home).toHaveAttribute('aria-current', 'page');
    expect(home).toHaveAttribute('href', '/');
    expect(within(nav).getByRole('link', { name: /about/i })).toHaveAttribute('href', '/#about');
    expect(within(nav).getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/#contact');
  });

  it('uses real routes and highlights Projects on a project detail page', () => {
    mockPathname = '/projects/innova-care';
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: /primary navigation/i });
    const projects = within(nav).getByRole('link', { name: /projects/i });
    expect(projects).toHaveAttribute('href', '/projects');
    expect(projects).toHaveAttribute('aria-current', 'page');
    expect(within(nav).getByRole('link', { name: /home/i })).not.toHaveAttribute('aria-current');
  });

  it('keeps the brand link and ids stable', () => {
    render(<Header />);
    const brand = screen.getByRole('link', { name: /go to home/i });
    expect(brand).toHaveAttribute('id', 'mu-global__header__link--brand');
    expect(brand).toHaveAttribute('href', '/');
  });

  it('opens and closes the mobile menu overlay', () => {
    render(<Header />);
    const toggle = screen.getByRole('button', { name: /open navigation menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(toggle);
    expect(screen.getByRole('navigation', { name: /mobile primary navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(
      screen.queryByRole('navigation', { name: /mobile primary navigation/i })
    ).not.toBeInTheDocument();
  });

  it('toggles the theme class and persists the choice', () => {
    render(<Header />);
    const [toggle] = screen.getAllByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(window.localStorage.getItem('theme')).toBe('dark');

    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(window.localStorage.getItem('theme')).toBe('light');
  });
});
