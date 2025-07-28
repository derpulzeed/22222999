import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VoiceControls from '../VoiceControls';

describe('VoiceControls', () => {
  const mockOnCommand = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders voice control button', () => {
    render(<VoiceControls onCommand={mockOnCommand} />);
    expect(screen.getByText(/Start Voice Control/i)).toBeInTheDocument();
  });

  it('shows unsupported message when speech recognition is not available', () => {
    // Temporarily remove speech recognition
    const originalSpeechRecognition = global.webkitSpeechRecognition;
    delete global.webkitSpeechRecognition;
    delete global.SpeechRecognition;

    render(<VoiceControls onCommand={mockOnCommand} />);
    expect(screen.getByText(/Voice commands not supported/i)).toBeInTheDocument();

    // Restore speech recognition
    global.webkitSpeechRecognition = originalSpeechRecognition;
    global.SpeechRecognition = originalSpeechRecognition;
  });

  it('toggles listening state when button is clicked', () => {
    render(<VoiceControls onCommand={mockOnCommand} />);
    const button = screen.getByText(/Start Voice Control/i);
    
    fireEvent.click(button);
    expect(screen.getByText(/Stop Listening/i)).toBeInTheDocument();
  });

  it('displays available commands', () => {
    render(<VoiceControls onCommand={mockOnCommand} />);
    expect(screen.getByText(/Commands: "rotate", "stop", "faster", "slower", "reset"/i)).toBeInTheDocument();
  });
});