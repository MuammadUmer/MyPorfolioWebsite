import * as React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

const headingClasses: Record<NonNullable<HeadingProps['as']>, string> = {
  h1: 'text-3xl md:text-4xl font-semibold tracking-tight',
  h2: 'text-2xl md:text-3xl font-semibold tracking-tight',
  h3: 'text-xl md:text-2xl font-semibold',
  h4: 'text-lg md:text-xl font-semibold',
};

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
  as: Component = 'h2',
  className,
  children,
  ...rest
}) => {
  const classes = [headingClasses[Component], className].filter(Boolean).join(' ');

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};

export default Heading;
