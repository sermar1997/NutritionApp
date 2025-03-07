import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders correctly with default props', () => {
    render(<LoadingSpinner data-testid="loading-spinner" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('applies small size when specified', () => {
    render(<LoadingSpinner size="small" data-testid="loading-spinner" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle({
      width: '24px',
      height: '24px'
    });
  });

  it('applies medium size when specified', () => {
    render(<LoadingSpinner size="medium" data-testid="loading-spinner" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle({
      width: '32px', 
      height: '32px'
    });
  });

  it('applies large size when specified', () => {
    render(<LoadingSpinner size="large" data-testid="loading-spinner" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle({
      width: '48px',
      height: '48px'
    });
  });

  it('applies xlarge size when specified', () => {
    render(<LoadingSpinner size="xlarge" data-testid="loading-spinner" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle({
      width: '64px',
      height: '64px'
    });
  });
});
