import * as React from 'react';

export interface VisuallyHiddenProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  as?: React.ElementType;
}

const className =
  'absolute h-px w-px -m-px overflow-hidden whitespace-nowrap border-0 p-0 clip-[rect(0,0,0,0)]';

const VisuallyHidden: React.FC<React.PropsWithChildren<VisuallyHiddenProps>> = ({
  as: Component = 'span',
  children,
  ...rest
}) => {
  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  );
};

export default VisuallyHidden;
