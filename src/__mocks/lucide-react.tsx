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

export const ArrowUpRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-arrow-up-right" />
);

export const ArrowDown: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-arrow-down" />
);

export const ArrowUp: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-arrow-up" />
);

export const Github: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-github" />
);

export const Plus: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-plus" />
);

export const RotateCw: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-rotate-cw" />
);

export const Check: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-check" />
);

export const ChevronRight: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <Icon {...props} data-testid="icon-chevron-right" />
);
