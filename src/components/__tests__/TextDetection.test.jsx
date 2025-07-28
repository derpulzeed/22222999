import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TextDetection from '../TextDetection';

describe('TextDetection', () => {
  const mockOnTextDetected = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders text detection controls', () => {
    render(<TextDetection onTextDetected={mockOnTextDetected} />);
    expect(screen.getByText('Text Detection')).toBeInTheDocument();
    expect(screen.getByText(/Upload Image/i)).toBeInTheDocument();
    expect(screen.getByText(/Live Camera/i)).toBeInTheDocument();
  });

  it('handles image upload', () => {
    render(<TextDetection onTextDetected={mockOnTextDetected} />);
    const uploadButton = screen.getByText(/Upload Image/i);
    
    expect(uploadButton).toBeInTheDocument();
    expect(uploadButton).not.toBeDisabled();
  });

  it('handles live camera detection', () => {
    render(<TextDetection onTextDetected={mockOnTextDetected} />);
    const cameraButton = screen.getByText(/Live Camera/i);
    
    fireEvent.click(cameraButton);
    expect(screen.getByText(/Detecting text.../i)).toBeInTheDocument();
  });

  it('disables buttons when detecting', () => {
    render(<TextDetection onTextDetected={mockOnTextDetected} />);
    const cameraButton = screen.getByText(/Live Camera/i);
    
    fireEvent.click(cameraButton);
    
    expect(screen.getByText(/Upload Image/i)).toBeDisabled();
    expect(screen.getByText(/Live Camera/i)).toBeDisabled();
  });
});