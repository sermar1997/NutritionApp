import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import Modal from './Modal';
import { createPortal } from 'react-dom';

// Mock createPortal to render the children directly
vi.mock('react-dom', async () => {
  return {
    createPortal: vi.fn((children) => children),
  };
});

describe('Modal Component', () => {
  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    const closeButton = screen.getByLabelText(/close/i);
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} title="Small Modal" size="small">
        <p>Small modal content</p>
      </Modal>
    );
    
    let modalContainer = screen.getByText('Small Modal').closest('div[role="dialog"]');
    expect(modalContainer).toHaveStyle('max-width: 400px');
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Medium Modal" size="medium">
        <p>Medium modal content</p>
      </Modal>
    );
    
    modalContainer = screen.getByText('Medium Modal').closest('div[role="dialog"]');
    expect(modalContainer).toHaveStyle('max-width: 600px');
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} title="Large Modal" size="large">
        <p>Large modal content</p>
      </Modal>
    );
    
    modalContainer = screen.getByText('Large Modal').closest('div[role="dialog"]');
    expect(modalContainer).toHaveStyle('max-width: 800px');
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
