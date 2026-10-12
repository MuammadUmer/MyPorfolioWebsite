import { render, screen, fireEvent } from '@testing-library/react';
import AvatarMark from '@/components/atoms/AvatarMark';
import Grommet from '@/components/atoms/Grommet';
import Lanyard from '@/components/atoms/Lanyard';
import IdBadge, { HOLE_Y, STRAP_LENGTH } from '@/components/objects/IdBadge';

const baseProps = {
  name: 'Muhammad Umer',
  initials: 'MU',
  role: 'Lead Software Engineer',
  location: 'Riyadh, Saudi Arabia',
  glanceTitle: 'At a glance',
  glanceItems: ['Lead Software Engineer', '7+ years of experience'],
  flipLabel: 'Flip card',
  idPrefix: 'mu-home__about',
};

describe('ID card on a lanyard', () => {
  it('renders a chrome grommet on both faces and a woven strap through the hole', () => {
    const { container } = render(<IdBadge {...baseProps} />);
    expect(container.querySelectorAll('.badge-face svg[viewBox="0 0 32 32"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-lanyard="strap"]')).toHaveLength(1);
    expect(container.querySelector('.lanyard-shadow')).toBeInTheDocument();
  });

  it('hangs from a pivot: the swing group is decorative and starts un-rotated', () => {
    const { container } = render(<IdBadge {...baseProps} />);
    const swing = container.querySelector('.badge-swing') as HTMLElement;
    expect(swing).toHaveAttribute('aria-hidden', 'true');
    expect(swing.style.paddingTop).toBe(`${STRAP_LENGTH}px`);
  });

  it('keeps the strap reaching the hole centre', () => {
    render(<Lanyard length={STRAP_LENGTH} holeY={HOLE_Y} />);
    const strap = document.querySelector('[data-lanyard="strap"]') as HTMLElement;
    expect(parseInt(strap.style.height, 10)).toBeGreaterThanOrEqual(STRAP_LENGTH + HOLE_Y);
  });

  it('shows the photo in the portrait frame when provided, otherwise the monogram', () => {
    const { container, rerender } = render(<IdBadge {...baseProps} />);
    expect(container.querySelector('#mu-home__about__badge--front img')).toBeNull();
    expect(container.querySelector('#mu-home__about__badge--front')?.textContent).toContain('MU');

    rerender(<IdBadge {...baseProps} avatar={{ portrait: '/avatar/portrait.abcdef12.webp', logo: '/avatar/logo.abcdef12.webp' }} />);
    const images = container.querySelectorAll('#mu-home__about__badge--front img');
    expect(images).toHaveLength(1);
    expect(Array.from(images).some((img) => (img.getAttribute('src') ?? '').includes('portrait'))).toBe(true);
  });

  it('shows the head logo without a circle', () => {
    const { container } = render(<AvatarMark logo="/avatar/logo.abcdef12.webp" initials="MU" size={56} />);
    const mark = container.querySelector('[data-avatar-mark="head"]') as HTMLElement;
    expect(mark).toBeInTheDocument();
    expect(mark.className).toContain('avatar-head');
    expect(mark.className).not.toContain('rounded-full');
    expect(mark.className).not.toContain('ring');
  });

  it('flips with the accessible button and keeps the "At a glance" back', () => {
    render(<IdBadge {...baseProps} />);
    const flip = screen.getByRole('button', { name: /flip card/i });
    expect(flip).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(flip);
    expect(flip).toHaveAttribute('aria-pressed', 'true');
    expect(document.querySelector('.badge-flip')).toHaveAttribute('data-flipped', 'true');
    expect(screen.getByText('7+ years of experience', { exact: false })).toBeInTheDocument();
  });

  it('does not start a physics loop under reduced motion', () => {
    const raf = jest.spyOn(window, 'requestAnimationFrame');
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => ({
        matches: query.includes('reduced-motion'),
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
      }),
    });
    render(<IdBadge {...baseProps} />);
    expect(raf).not.toHaveBeenCalled();
    // @ts-expect-error jsdom has no matchMedia; remove the stub added by the test
    delete window.matchMedia;
    raf.mockRestore();
  });

  it('renders a standalone grommet as a decorative svg', () => {
    const { container } = render(<Grommet size={40} />);
    const svg = container.querySelector('svg') as SVGElement;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('width', '40');
  });
});
