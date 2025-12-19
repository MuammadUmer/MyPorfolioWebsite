import * as React from 'react';

export interface SampleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

const SampleButton: React.FC<SampleButtonProps> = ({ label, ...props }) => {
  return (
    <button type="button" {...props}>
      {label}
    </button>
  );
};

export default SampleButton;
