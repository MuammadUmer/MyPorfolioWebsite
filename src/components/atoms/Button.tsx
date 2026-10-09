import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  actionId?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

const baseClasses =
  'btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary bg-transparent',
  ghost: 'btn-ghost',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-5',
  lg: 'h-12 px-6 text-base',
};

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}): string {
  return [baseClasses, variantClasses[variant], sizeClasses[size], className]
    .filter(Boolean)
    .join(' ');
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  actionId,
  className,
  ...props
}) => {
  return (
    <button
      type={props.type ?? 'button'}
      data-action-id={actionId}
      className={buttonClasses({ variant, size, className })}
      {...props}
    />
  );
};

export default Button;
