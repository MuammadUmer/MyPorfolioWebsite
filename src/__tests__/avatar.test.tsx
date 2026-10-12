import { render, screen, act, fireEvent } from '@testing-library/react';
import AvatarMark from '@/components/atoms/AvatarMark';
import Avatar3D from '@/components/objects/Avatar3D';
import HeroSection from '@/components/organisms/HeroSection';
import AboutSection from '@/components/organisms/AboutSection';
import { canRunInteractiveAvatar, getAvatarBlockReason } from '@/lib/avatar/capabilities';
import { approach, clamp, orbitFor, pointerFromEvent, BASE_POLAR_DEG, MAX_AZIMUTH_DEG } from '@/lib/avatar/orbit';
import { getAboutCopy, getEducation, getProfile } from '@/lib/services/content';
import type { ProfileAvatar } from '@/lib/types/content';

jest.mock('@/lib/analytics', () => ({ trackEvent: jest.fn() }));
jest.mock('@google/model-viewer', () => ({}));

const avatar: ProfileAvatar = {
  model: '/avatar/muhammad-umer.glb',
  poster: '/avatar/poster.webp',
  logo: '/avatar/logo.webp',
  portrait: '/avatar/portrait.webp',
  alt: '3D avatar of Muhammad Umer',
  framing: { target: '0m 0.93m 0m', radius: '3m' },
};

function fakeWindow(overrides: {
  desktop?: boolean;
  reduced?: boolean;
  connection?: { saveData?: boolean; effectiveType?: string };
  cores?: number;
  memory?: number;
  webgl?: boolean;
}): Window {
  const { desktop = true, reduced = false, connection, cores = 8, memory = 8, webgl = true } = overrides;
  return {
    matchMedia: (query: string) => ({
      matches: query.includes('min-width') ? desktop : query.includes('reduced-motion') ? reduced : false,
    }),
    navigator: { connection, hardwareConcurrency: cores, deviceMemory: memory },
    document: {
      createElement: () => ({ getContext: () => (webgl ? {} : null) }),
    },
  } as unknown as Window;
}

describe('canRunInteractiveAvatar', () => {
  it('runs on capable desktops', () => {
    expect(canRunInteractiveAvatar(fakeWindow({}))).toBe(true);
  });

  it.each([
    ['small screens', { desktop: false }, 'small-screen'],
    ['reduced motion', { reduced: true }, 'reduced-motion'],
    ['data saver', { connection: { saveData: true } }, 'data-saver'],
    ['2g connections', { connection: { effectiveType: '2g' } }, 'slow-connection'],
    ['missing WebGL', { webgl: false }, 'no-webgl'],
  ])('stays on the poster for %s and reports why', (_label, overrides, reason) => {
    expect(canRunInteractiveAvatar(fakeWindow(overrides))).toBe(false);
    expect(getAvatarBlockReason(fakeWindow(overrides))).toBe(reason);
  });

  it.each([
    ['a "3g" reading (very common on normal broadband)', { connection: { effectiveType: '3g' } }],
    ['few CPU cores', { cores: 2 }],
    ['low reported memory', { memory: 2 }],
  ])('still runs with %s', (_label, overrides) => {
    expect(getAvatarBlockReason(fakeWindow(overrides))).toBeNull();
    expect(canRunInteractiveAvatar(fakeWindow(overrides))).toBe(true);
  });

  it('is false without matchMedia', () => {
    expect(canRunInteractiveAvatar({} as Window)).toBe(false);
  });
});

describe('orbit helpers', () => {
  it('clamps pointer positions to -1..1', () => {
    expect(pointerFromEvent(-50, 2000, 1000, 800)).toEqual({ x: -1, y: 1 });
    expect(pointerFromEvent(500, 400, 1000, 800)).toEqual({ x: 0, y: 0 });
    expect(pointerFromEvent(1, 1, 0, 0)).toEqual({ x: 0, y: 0 });
    expect(clamp(5, 0, 1)).toBe(1);
  });

  it('turns the avatar toward the pointer within safe limits', () => {
    const right = orbitFor({ x: 1, y: 0 }, 0, 0);
    expect(right).toBe(`${(-MAX_AZIMUTH_DEG).toFixed(2)}deg ${BASE_POLAR_DEG.toFixed(2)}deg auto`);
    const left = orbitFor({ x: -1, y: 0 }, 0, 0);
    expect(left.startsWith(`${MAX_AZIMUTH_DEG.toFixed(2)}deg`)).toBe(true);
  });

  it('adds a slow sway only after the pointer has been idle', () => {
    const active = orbitFor({ x: 0, y: 0 }, 100, 1000);
    const idle = orbitFor({ x: 0, y: 0 }, 5000, 1000);
    expect(active).toBe(`0.00deg ${BASE_POLAR_DEG.toFixed(2)}deg auto`);
    expect(idle).not.toBe(active);
  });

  it('can disable the idle sway and shrink the follow range for animated models', () => {
    const gentle = orbitFor({ x: 1, y: 0 }, 10_000, 1000, '3m', { sway: false, maxAzimuth: 9, maxPolar: 3 });
    expect(gentle).toBe(`-9.00deg ${BASE_POLAR_DEG.toFixed(2)}deg 3m`);
  });

  it('keeps the configured camera radius in the orbit', () => {
    expect(orbitFor({ x: 0, y: 0 }, 0, 0, '2.6m')).toBe(`0.00deg ${BASE_POLAR_DEG.toFixed(2)}deg 2.6m`);
  });

  it('eases toward the target', () => {
    expect(approach(0, 1, 0.5)).toBe(0.5);
  });
});

describe('AvatarMark', () => {
  it('falls back to the initials without a logo', () => {
    render(<AvatarMark initials="MU" />);
    expect(screen.getByText('MU')).toBeInTheDocument();
  });

  it('renders the logo as a decorative image', () => {
    const { container } = render(<AvatarMark logo="/avatar/logo.webp" initials="MU" />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('alt', '');
    expect(screen.queryByText('MU')).not.toBeInTheDocument();
  });

  it('returns to the initials if the image fails to load', () => {
    const { container } = render(<AvatarMark logo="/avatar/missing.webp" initials="MU" />);
    fireEvent.error(container.querySelector('img') as HTMLImageElement);
    expect(screen.getByText('MU')).toBeInTheDocument();
  });
});

describe('Avatar3D', () => {
  const originalObserver = global.IntersectionObserver;

  afterEach(() => {
    global.IntersectionObserver = originalObserver;
    // @ts-expect-error jsdom has no matchMedia; remove the stub added by the test
    delete window.matchMedia;
    jest.restoreAllMocks();
  });

  it('shows the poster with alt text and stays on it when 3D is unavailable', () => {
    render(<Avatar3D model={avatar.model} poster={avatar.poster} alt={avatar.alt} />);
    expect(screen.getByRole('img', { name: avatar.alt })).toBeInTheDocument();
    expect(document.querySelector('model-viewer')).toBeNull();
    expect(document.querySelector('[data-avatar-state]')).toHaveAttribute('data-avatar-state', 'poster');
    expect(document.querySelector('[data-avatar-state]')).toHaveAttribute('data-avatar-reason', 'no-media-queries');
  });

  it('upgrades to the viewer when visible on a capable device, then reveals it on load', async () => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      writable: true,
      value: (query: string) => ({ matches: query.includes('min-width') }),
    });
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({} as RenderingContext);
    window.requestIdleCallback = ((callback: IdleRequestCallback) => {
      callback({ didTimeout: false, timeRemaining: () => 50 });
      return 1;
    }) as typeof window.requestIdleCallback;
    window.cancelIdleCallback = jest.fn();

    class VisibleObserver {
      private callback: IntersectionObserverCallback;
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
      }
      observe(target: Element) {
        this.callback([{ isIntersecting: true, target } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
      }
      unobserve() {}
      disconnect() {}
    }
    global.IntersectionObserver = VisibleObserver as unknown as typeof IntersectionObserver;

    render(
      <Avatar3D
        model={avatar.model}
        poster={avatar.poster}
        alt={avatar.alt}
        framing={{ target: '0m 1.45m 0m', radius: '2.6m' }}
        animated
      />
    );

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    const element = document.querySelector('model-viewer') as HTMLElement;
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('src', avatar.model);
    expect(element).toHaveAttribute('aria-hidden', 'true');
    expect(element).toHaveAttribute('camera-target', '0m 1.45m 0m');
    expect(element).toHaveAttribute('camera-orbit', '0deg 84deg 2.6m');
    expect(element).toHaveAttribute('autoplay');

    act(() => {
      element.dispatchEvent(new Event('load'));
    });
    expect(document.querySelector('[data-avatar-state]')).toHaveAttribute('data-avatar-state', 'model');
  });
});

describe('avatar placement', () => {
  const profile = { ...getProfile(), avatar: undefined };

  it('ships with the avatar configured in profile.json', () => {
    expect(getProfile().avatar).toMatchObject({
            model: expect.stringMatching(/^\/avatar\/muhammad-umer\.[0-9a-f]{8}\.glb$/),
      poster: expect.stringMatching(/^\/avatar\/poster\.[0-9a-f]{8}\.webp$/),
      logo: expect.stringMatching(/^\/avatar\/logo\.[0-9a-f]{8}\.webp$/),
    });
  });

  it('does not render the avatar when no assets are configured', () => {
    const { container } = render(<HeroSection profile={profile} />);
    expect(container.querySelector('[data-avatar-state]')).toBeNull();
  });

  it('renders the hero avatar (desktop + mobile poster) when configured', () => {
    const { container } = render(<HeroSection profile={{ ...profile, avatar }} />);
    expect(container.querySelectorAll('[data-avatar-state]')).toHaveLength(2);
    expect(screen.getAllByRole('img', { name: avatar.alt })).toHaveLength(2);
  });

  it('uses the avatar in the ID badge and keeps the monogram otherwise', () => {
    const { container, rerender } = render(
      <AboutSection
        profile={profile}
        copy={getAboutCopy()}
        education={getEducation()}
        projectCount={19}
      />
    );
    expect(container.querySelector('.badge-scene img')).toBeNull();
    expect(container.querySelector('.badge-scene')?.textContent).toContain('MU');

    rerender(
      <AboutSection
        profile={{ ...profile, avatar }}
        copy={getAboutCopy()}
        education={getEducation()}
        projectCount={19}
      />
    );
    expect(container.querySelectorAll('.badge-scene img')).toHaveLength(1);
  });
});
