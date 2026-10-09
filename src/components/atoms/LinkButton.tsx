import * as React from 'react';
import NextLink from 'next/link';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/atoms/Button';

export interface LinkButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  actionId?: string;
  external?: boolean;
}

/** An anchor styled as a button — use for navigation, `Button` for actions. */
const LinkButton: React.FC<LinkButtonProps> = ({
  href,
  variant = 'primary',
  size = 'md',
  actionId,
  external,
  className,
  children,
  ...rest
}) => {
  const classes = buttonClasses({ variant, size, className });
  const isInternal = href.startsWith('/') && !rest.download && !external;

  if (isInternal) {
    return (
      <NextLink href={href} className={classes} data-action-id={actionId} {...rest}>
        {children}
      </NextLink>
    );
  }

  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  return (
    <a href={href} className={classes} data-action-id={actionId} {...externalProps} {...rest}>
      {children}
    </a>
  );
};

export default LinkButton;
