import * as React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  muted?: boolean;
}

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
  muted,
  className,
  children,
  ...rest
}) => {
  const base = 'text-sm md:text-base';
  const color = muted ? 'text-foreground/70' : 'text-foreground';
  const classes = [base, color, className].filter(Boolean).join(' ');

  return (
    <p className={classes} {...rest}>
      {children}
    </p>
  );
};

export default Text;
