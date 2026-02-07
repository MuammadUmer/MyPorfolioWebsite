"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Button from '@/components/atoms/Button';
import AppLink from '@/components/atoms/Link';

const navItems = [
  { href: '/', label: 'Home', id: 'home' },
  { href: '/about', label: 'About', id: 'about' },
  { href: '/experience', label: 'Experience', id: 'experience' },
  { href: '/projects', label: 'Projects', id: 'projects' },
  { href: '/skills', label: 'Skills', id: 'skills' },
  { href: '/contact', label: 'Contact', id: 'contact' },
];

const Header: React.FC = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(true);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <header
      id="mu-global__header__section--primary"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-5xl h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <AppLink
            href="/"
            className="text-xl font-bold tracking-tight text-primary hover:text-primary/90"
            aria-label="Go to home"
            id="mu-global__header__link--brand"
          >
            MU
          </AppLink>
        </div>

        <nav
          id="mu-global__header__nav--primary"
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <AppLink
                key={item.href}
                href={item.href}
                variant="nav"
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                id={`mu-global__header__link--${item.id}`}
              >
                {item.label}
              </AppLink>
            );
          })}
          <Button
            aria-label="Toggle theme"
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="ml-2"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            aria-label="Toggle theme"
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            variant="ghost"
            size="sm"
            onClick={toggle}
            id="mu-global__header__btn--menu-toggle"
            actionId="act-global__header__toggle-menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isOpen && (
        <nav
          className="glass border-t border-border/50 md:hidden"
          aria-label="Mobile primary navigation"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  variant="nav"
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-3 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'text-foreground font-medium bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                  id={`mu-global__header__link--mobile-${item.id}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </AppLink>
              );
            })}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
