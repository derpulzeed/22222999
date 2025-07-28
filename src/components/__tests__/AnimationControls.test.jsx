import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AnimationControls from '../AnimationControls';

describe('AnimationControls', () => {
  const mockOnAnimationChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders animation controls', () => {
    render(<AnimationControls onAnimationChange={mockOnAnimationChange} />);
    expect(screen.getByText('Animation Controls')).toBeInTheDocument();
    expect(screen.getByText(/Start Animation/i)).toBeInTheDocument();
  });

  it('toggles animation state when button is clicked', () => {
    render(<AnimationControls onAnimationChange={mockOnAnimationChange} />);
    const button = screen.getByText(/Start Animation/i);
    
    fireEvent.click(button);
    
    expect(mockOnAnimationChange).toHaveBeenCalledWith({
      enabled: true,
      speed: 1,
      type: 'rotate'
    });
    expect(screen.getByText(/Stop Animation/i)).toBeInTheDocument();
  });

  it('changes animation type', () => {
    render(<AnimationControls onAnimationChange={mockOnAnimationChange} />);
    const select = screen.getByDisplayValue('Rotate');
    
    fireEvent.change(select, { target: { value: 'bounce' } });
    
    expect(mockOnAnimationChange).toHaveBeenCalledWith({
      enabled: false,
      speed: 1,
      type: 'bounce'
    });
  });

  it('adjusts animation speed', () => {
    render(<AnimationControls onAnimationChange={mockOnAnimationChange} />);
    const slider = screen.getByRole('slider');
    
    fireEvent.change(slider, { target: { value: '2' } });
    
    expect(mockOnAnimationChange).toHaveBeenCalledWith({
      enabled: false,
      speed: 2,
      type: 'rotate'
    });
  });

  it('displays current speed value', () => {
    render(<AnimationControls onAnimationChange={mockOnAnimationChange} />);
    expect(screen.getByText('Speed: 1.0x')).toBeInTheDocument();
  });
});