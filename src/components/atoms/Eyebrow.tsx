import * as React from 'react';

export interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  index?: string;
}

/** Mono, wide-tracked section label, e.g. `01 / ABOUT`. A paragraph, never a heading. */
const Eyebrow: React.FC<React.PropsWithChildren<EyebrowProps>> = ({
  index,
  className,
  children,
  ...rest
}) => (
  <p className={['eyebrow', className].filter(Boolean).join(' ')} {...rest}>
    {index ? <span aria-hidden="true">{index} / </span> : null}
    {children}
  </p>
);

export default Eyebrow;
