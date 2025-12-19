import * as React from 'react';
import NextLink from 'next/link';

export interface AppLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: 'default' | 'nav' | 'muted';
}

const AppLink: React.FC<React.PropsWithChildren<AppLinkProps>> = ({
  href,
  variant = 'default',
  className,
  children,
  ...rest
}) => {
  const base =
    'inline-flex items-center gap-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background';

  const variantClass =
    variant === 'nav'
      ? 'text-sm text-foreground/70 hover:text-foreground'
      : variant === 'muted'
      ? 'text-sm text-foreground/70 hover:text-foreground'
      : 'text-sm text-accent hover:text-accent/90';

  const classes = [base, variantClass, className].filter(Boolean).join(' ');

  return (
    <NextLink href={href} className={classes} {...rest}>
      {children}
    </NextLink>
  );
};

export default AppLink;
