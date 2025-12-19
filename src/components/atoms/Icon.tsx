import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  icon: LucideIcon;
  title?: string;
}

const Icon: React.FC<IconProps> = ({ icon: IconComponent, title, ...rest }) => {
  const ariaProps = title
    ? { 'aria-label': title, role: 'img' as const }
    : { 'aria-hidden': true, role: 'presentation' as const };

  return <IconComponent {...ariaProps} {...rest} />;
};

export default Icon;
