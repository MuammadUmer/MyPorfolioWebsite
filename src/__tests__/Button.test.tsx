import { render, screen, fireEvent } from '@testing-library/react';
import Button from '@/components/atoms/Button';

describe('Button', () => {
  it('renders with label and default styles', () => {
    render(<Button>Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn).toBeInTheDocument();
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="secondary" size="lg">
        Secondary
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Secondary' });
    expect(btn.className).toContain('bg-transparent');
    expect(btn.className).toContain('h-11');
  });

  it('applies actionId as data attribute', () => {
    render(<Button actionId="act-home__hero__click-primary-cta">Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn).toHaveAttribute('data-action-id', 'act-home__hero__click-primary-cta');
  });

  it('fires onClick when pressed', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Disabled' });
    fireEvent.click(btn);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
