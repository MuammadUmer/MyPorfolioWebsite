"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import Button from '@/components/atoms/Button';
import AppLink from '@/components/atoms/Link';
import LinkButton from '@/components/atoms/LinkButton';
import profile from '@/data/profile.json';
import { useScrollSpy } from '@/lib/hooks/useScrollSpy';
import { applyTheme, readIsDark } from '@/lib/theme';
import { translate } from '@/lib/i18n/translate';

export interface NavItem {
  key: string;
  label: string;
  route: string;
  /** DOM id of the Home-page section this item scrolls to. */
  sectionId: string;
}

const navKeys = ['home', 'about', 'skills', 'projects', 'experience', 'contact'] as const;

export const navItems: NavItem[] = navKeys.map((key) => ({
  key,
  label: translate(`nav.${key}`),
  route: key === 'home' ? '/' : `/${key}`,
  sectionId: key === 'home' ? 'mu-home__hero__section--primary' : `mu-home__${key}__section--primary`,
}));

const CERTIFICATIONS_SECTION_ID = 'mu-home__certifications__section--primary';
const sectionIds = [...navItems.map((item) => item.sectionId), CERTIFICATIONS_SECTION_ID];

function isRouteActive(pathname: string, route: string): boolean {
  if (route === '/') return pathname === '/';
  return pathname === route || pathname.startsWith(`${route}/`);
}

const Header: React.FC = () => {
  const pathname = usePathname() ?? '/';
  const isHome = pathname === '/';
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [indicator, setIndicator] = React.useState<{ x: number; w: number } | null>(null);

  const spiedId = useScrollSpy(sectionIds, isHome);
  const activeKey = isHome
    ? spiedId === CERTIFICATIONS_SECTION_ID
      ? 'experience'
      : (navItems.find((item) => item.sectionId === spiedId)?.key ?? 'home')
    : (navItems.find((item) => item.key !== 'home' && isRouteActive(pathname, item.route))?.key ?? '');

  const navRef = React.useRef<HTMLElement | null>(null);
  const linkRefs = React.useRef<Record<string, HTMLAnchorElement | null>>({});
  const overlayRef = React.useRef<HTMLDivElement | null>(null);
  const toggleRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    setIsDark(readIsDark());
  }, []);

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    const measure = () => {
      const element = linkRefs.current[activeKey];
      if (!element) {
        setIndicator(null);
        return;
      }
      setIndicator({ x: element.offsetLeft, w: element.offsetWidth });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [activeKey, scrolled]);

  React.useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const overlay = overlayRef.current;
    overlay?.querySelector<HTMLElement>('a[href]')?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !overlay) return;

      const focusable = [
        ...Array.from(overlay.querySelectorAll<HTMLElement>('a[href], button')),
        ...(toggleRef.current ? [toggleRef.current] : []),
      ];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const toggleTheme = () => {
    const next = !readIsDark();
    applyTheme(next);
    setIsDark(next);
  };

  const hrefFor = (item: NavItem): string => {
    if (!isHome || item.key === 'home') return item.route;
    return `/#${item.key}`;
  };

  const ariaCurrentFor = (item: NavItem): 'page' | 'location' | undefined => {
    if (item.key !== activeKey) return undefined;
    return isHome && item.key !== 'home' ? 'location' : 'page';
  };

  const themeButton = (
    <Button
      aria-label="Toggle theme"
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-11 w-11 px-0"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );

  return (
    <>
    <header
      id="mu-global__header__section--primary"
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'max-md:border-b max-md:bg-background/85 max-md:backdrop-blur-md' : ''
      }`}
    >
      <div className="container-page flex h-[var(--header-h)] items-center justify-between">
        <AppLink
          href="/"
          className={`pointer-events-auto inline-flex h-11 items-center text-xl font-bold tracking-tight text-primary hover:text-primary-hover transition-opacity duration-300 ${
            scrolled ? 'md:invisible md:opacity-0' : ''
          }`}
          aria-label="Go to home"
          id="mu-global__header__link--brand"
        >
          MU
        </AppLink>

        <nav
          ref={navRef}
          id="mu-global__header__nav--primary"
          className={`pointer-events-auto relative hidden items-center gap-1 rounded-full p-1 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-300 md:flex ${
            scrolled
              ? 'border border-border bg-surface shadow-[var(--shadow-float)] backdrop-blur-lg'
              : 'border border-transparent'
          }`}
          aria-label="Primary navigation"
        >
          {indicator ? (
            <span
              aria-hidden="true"
              className={`absolute left-0 top-1 h-11 rounded-full transition-[transform,width,background-color] duration-300 ease-(--ease-soft) ${
                scrolled ? 'bg-inverse' : 'bg-muted'
              }`}
              style={{ width: indicator.w, transform: `translateX(${indicator.x}px)` }}
            />
          ) : null}
          {navItems.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <AppLink
                key={item.key}
                ref={(node: HTMLAnchorElement | null) => {
                  linkRefs.current[item.key] = node;
                }}
                href={hrefFor(item)}
                variant="nav"
                aria-current={ariaCurrentFor(item)}
                className={`relative z-10 inline-flex h-11 items-center rounded-full px-4 text-sm ${
                  isActive
                    ? scrolled
                      ? 'text-inverse-foreground hover:text-inverse-foreground'
                      : 'text-foreground'
                    : ''
                }`}
                id={`mu-global__header__link--${item.key}`}
              >
                {item.label}
              </AppLink>
            );
          })}
          {themeButton}
        </nav>

        <div className="pointer-events-auto flex items-center gap-1 md:hidden">
          {themeButton}
          <Button
            ref={toggleRef}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            variant="secondary"
            size="md"
            onClick={() => setIsOpen((prev) => !prev)}
            id="mu-global__header__btn--menu-toggle"
            actionId="act-global__header__toggle-menu"
          >
            {isOpen ? translate('nav.close') : translate('nav.menu')}
          </Button>
        </div>
      </div>

    </header>
      {isOpen && (
        <div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="pointer-events-auto fixed inset-0 z-40 overflow-y-auto bg-background pt-[var(--header-h)] md:hidden"
        >
          <nav
            aria-label="Mobile primary navigation"
            className="container-page flex min-h-full flex-col gap-2 py-8"
          >
            {navItems.map((item, index) => {
              const isActive = item.key === activeKey;
              return (
                <AppLink
                  key={item.key}
                  href={hrefFor(item)}
                  variant="nav"
                  aria-current={ariaCurrentFor(item)}
                  className={`flex items-baseline gap-4 border-b py-4 t-h3 ${
                    isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                  id={`mu-global__header__link--mobile-${item.key}`}
                  onClick={() => setIsOpen(false)}
                >
                  <span className="eyebrow" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {item.label}
                </AppLink>
              );
            })}
            <div className="mt-auto flex flex-col gap-3 pt-8">
              <LinkButton href="/contact" size="lg" onClick={() => setIsOpen(false)}>
                {translate('home.hero.cta.contact')}
              </LinkButton>
              <LinkButton
                href={profile.links.cv}
                download={profile.links.cvDownloadName}
                variant="secondary"
                size="lg"
              >
                {translate('home.hero.cta.downloadCv')}
              </LinkButton>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;
