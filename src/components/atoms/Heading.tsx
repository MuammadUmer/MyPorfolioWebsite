import * as React from 'react';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

const headingClasses: Record<NonNullable<HeadingProps['as']>, string> = {
  h1: 't-h2',
  h2: 't-h2',
  h3: 't-h3',
  h4: 't-h4',
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
