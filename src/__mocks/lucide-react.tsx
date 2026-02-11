import * as React from 'react';

const Icon: React.FC<React.SVGProps<SVGSVGElement> & { 'data-testid'?: string }> = (
  props
) => <svg {...props} />;

export const Menu: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-menu" />
);

export const X: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-x" />
);

export const Sun: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-sun" />
);

export const Moon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-moon" />
);

export const ArrowRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-arrow-right" />
);

export const ArrowLeft: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-arrow-left" />
);

export const Download: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-download" />
);

export const Mail: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-mail" />
);

export const Send: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-send" />
);

export const Linkedin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-linkedin" />
);

export const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-chevron-down" />
);
