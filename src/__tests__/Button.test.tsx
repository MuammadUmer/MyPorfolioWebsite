import { render, screen, fireEvent } from '@testing-library/react';
import Button, { buttonClasses } from '@/components/atoms/Button';
import LinkButton from '@/components/atoms/LinkButton';

describe('Button', () => {
  it('renders with label and default pill styles', () => {
    render(<Button>Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('rounded-full');
    expect(btn.className).toContain('btn-primary');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('applies variant and size classes', () => {
    render(
      <Button variant="secondary" size="lg">
        Secondary
      </Button>
    );
    const btn = screen.getByRole('button', { name: 'Secondary' });
    expect(btn.className).toContain('btn-secondary');
    expect(btn.className).toContain('bg-transparent');
    expect(btn.className).toContain('h-12');
  });

  it('keeps a 44px minimum height for the default size', () => {
    expect(buttonClasses({})).toContain('h-11');
  });

  it('applies actionId as data attribute', () => {
    render(<Button actionId="act-home__hero__click-primary-cta">Click</Button>);
    const btn = screen.getByRole('button', { name: 'Click' });
    expect(btn).toHaveAttribute('data-action-id', 'act-home__hero__click-primary-cta');
  });

  it('fires onClick when pressed', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Disabled' }));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('LinkButton', () => {
  it('renders internal links with next/link semantics', () => {
    render(<LinkButton href="/projects">Projects</LinkButton>);
    const link = screen.getByRole('link', { name: 'Projects' });
    expect(link).toHaveAttribute('href', '/projects');
    expect(link).not.toHaveAttribute('target');
  });

  it('opens external links safely in a new tab', () => {
    render(
      <LinkButton href="https://github.com/MuammadUmer" external>
        GitHub
      </LinkButton>
    );
    const link = screen.getByRole('link', { name: 'GitHub' });
    expect(link).toHaveAttribute('href', 'https://github.com/MuammadUmer');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('keeps the download attribute for file links', () => {
    render(
      <LinkButton href="/CV.pdf" download="Muhammad-Umer-CV.pdf">
        CV
      </LinkButton>
    );
    const link = screen.getByRole('link', { name: 'CV' });
    expect(link).toHaveAttribute('href', '/CV.pdf');
    expect(link).toHaveAttribute('download', 'Muhammad-Umer-CV.pdf');
  });
});
