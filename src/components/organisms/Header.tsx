"use client";

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
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

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <header
      id="mu-global__header__section--primary"
      className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <AppLink
            href="/"
            className="text-base font-semibold text-foreground"
            aria-label="Go to home"
            id="mu-global__header__link--brand"
          >
            MU
          </AppLink>
        </div>

        <nav
          id="mu-global__header__nav--primary"
          className="hidden items-center gap-6 md:flex"
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
                className={isActive ? 'text-foreground' : undefined}
                id={`mu-global__header__link--${item.id}`}
              >
                {item.label}
              </AppLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
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
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-2" aria-label="Mobile primary navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <AppLink
                  key={item.href}
                  href={item.href}
                  variant="nav"
                  aria-current={isActive ? 'page' : undefined}
                  className={isActive ? 'text-foreground' : undefined}
                  id={`mu-global__header__link--mobile-${item.id}`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </AppLink>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
