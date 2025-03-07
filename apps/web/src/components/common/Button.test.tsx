import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import Button from './Button';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies different variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    let button = screen.getByRole('button', { name: /primary/i });
    expect(button).toHaveStyle('background-color: var(--colors-primary)');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button', { name: /secondary/i });
    expect(button).toHaveStyle('background-color: var(--colors-secondary)');

    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole('button', { name: /danger/i });
    expect(button).toHaveStyle('background-color: var(--colors-error)');
  });

  it('applies different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    let button = screen.getByRole('button', { name: /small/i });
    expect(button).toHaveStyle('font-size: 0.875rem');

    rerender(<Button size="medium">Medium</Button>);
    button = screen.getByRole('button', { name: /medium/i });
    expect(button).toHaveStyle('font-size: 1rem');

    rerender(<Button size="large">Large</Button>);
    button = screen.getByRole('button', { name: /large/i });
    expect(button).toHaveStyle('font-size: 1.125rem');
  });

  it('can be full width', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button', { name: /full width/i });
    expect(button).toHaveStyle('width: 100%');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it('can show loading state', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toHaveStyle('color: transparent');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with left icon', () => {
    render(
      <Button leftIcon={<span data-testid="left-icon" />}>
        With Icon
      </Button>
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
  });

  it('renders with right icon', () => {
    render(
      <Button rightIcon={<span data-testid="right-icon" />}>
        With Icon
      </Button>
    );
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
  });
});
