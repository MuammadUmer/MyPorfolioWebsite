import { render, screen } from '@testing-library/react';
import HeroSection from '@/components/organisms/HeroSection';
import { getProfile } from '@/lib/services/content';

const trackEventMock = jest.fn();

jest.mock('@/lib/analytics', () => ({
  trackEvent: (...args: unknown[]) => trackEventMock(...args),
}));

describe('HeroSection', () => {
  const profile = getProfile();

  beforeEach(() => trackEventMock.mockClear());

  it('renders the name and role inside a single h1', () => {
    render(<HeroSection profile={profile} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Muhammad Umer');
    expect(heading).toHaveTextContent('Lead Software Engineer.');
  });

  it('keeps the existing subtitle and status chip text', () => {
    render(<HeroSection profile={profile} />);
    expect(
      screen.getByText(/Senior Full Stack Engineer with 7\+ years building scalable cloud-native APIs/)
    ).toBeInTheDocument();
    expect(screen.getByText(/muhammad-umer --status "Open to opportunities"/)).toBeInTheDocument();
  });

  it('keeps the three CTAs with their ids, destinations and download attribute', () => {
    render(<HeroSection profile={profile} />);

    const primary = screen.getByRole('link', { name: /view projects/i });
    expect(primary).toHaveAttribute('id', 'mu-home__hero__btn--primary-cta');
    expect(primary).toHaveAttribute('href', '/projects');
    expect(primary).toHaveAttribute('data-action-id', 'act-home__hero__click-primary-cta');

    const contact = screen.getByRole('link', { name: /contact me/i });
    expect(contact).toHaveAttribute('id', 'mu-home__hero__btn--secondary-contact');
    expect(contact).toHaveAttribute('href', '/contact');

    const cv = screen.getByRole('link', { name: /download cv/i });
    expect(cv).toHaveAttribute('id', 'mu-home__hero__link--download-cv');
    expect(cv).toHaveAttribute('href', '/CV.pdf');
    expect(cv).toHaveAttribute('download', 'Muhammad-Umer-CV.pdf');
  });

  it('tracks the contact CTA click', () => {
    render(<HeroSection profile={profile} />);
    screen.getByRole('link', { name: /contact me/i }).click();
    expect(trackEventMock).toHaveBeenCalledWith('hero_contact_cta_click', {
      actionId: 'act-home__hero__click-contact',
    });
  });

  it('hides the decorative ghost name from assistive technology', () => {
    const { container } = render(<HeroSection profile={profile} />);
    const ghost = container.querySelector('.ghost-name');
    expect(ghost).toHaveAttribute('aria-hidden', 'true');
  });
});
