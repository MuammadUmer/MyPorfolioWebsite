import * as React from 'react';
import NextLink from 'next/link';

export interface AppLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: 'default' | 'nav' | 'muted';
  ref?: React.Ref<HTMLAnchorElement>;
}

const AppLink: React.FC<React.PropsWithChildren<AppLinkProps>> = ({
  href,
  variant = 'default',
  className,
  children,
  ...rest
}) => {
  const base =
    'font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring';

  const variantClass =
    variant === 'nav' || variant === 'muted'
      ? 'text-sm text-muted-foreground hover:text-foreground'
      : 'text-sm text-primary hover:text-primary-hover';

  const classes = [base, variantClass, className].filter(Boolean).join(' ');

  return (
    <NextLink href={href} className={classes} {...rest}>
      {children}
    </NextLink>
  );
};

export default AppLink;
