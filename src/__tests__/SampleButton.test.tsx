import { render, screen } from '@testing-library/react';
import SampleButton from '@/components/atoms/SampleButton';

describe('SampleButton', () => {
  it('renders the label', () => {
    render(<SampleButton label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
