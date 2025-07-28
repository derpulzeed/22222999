import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import HeadTracking from '../HeadTracking';

describe('HeadTracking', () => {
  const mockOnHeadMove = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders head tracking button', () => {
    render(<HeadTracking onHeadMove={mockOnHeadMove} />);
    expect(screen.getByText(/Start Head Tracking/i)).toBeInTheDocument();
  });

  it('toggles tracking state when button is clicked', () => {
    render(<HeadTracking onHeadMove={mockOnHeadMove} />);
    const button = screen.getByText(/Start Head Tracking/i);
    
    fireEvent.click(button);
    expect(screen.getByText(/Stop Head Tracking/i)).toBeInTheDocument();
  });

  it('shows error message when camera access fails', async () => {
    // Mock getUserMedia to reject
    navigator.mediaDevices.getUserMedia = vi.fn(() => 
      Promise.reject(new Error('Camera access denied'))
    );

    render(<HeadTracking onHeadMove={mockOnHeadMove} />);
    const button = screen.getByText(/Start Head Tracking/i);
    
    fireEvent.click(button);
    
    // Wait for error to appear
    await screen.findByText(/Camera access denied or not available/i);
  });
});