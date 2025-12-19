import * as React from 'react';

export const Menu: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} data-testid="icon-menu" />
);

export const X: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} data-testid="icon-x" />
);
