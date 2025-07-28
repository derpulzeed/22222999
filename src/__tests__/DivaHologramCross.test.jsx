import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DivaHologramCross from '../DivaHologramCross';

// Mock Three.js and React Three Fiber
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />,
  useGLTF: vi.fn(() => ({ scene: {} })),
  useProgress: vi.fn(() => ({ progress: 0 })),
  Html: ({ children }) => <div data-testid="html">{children}</div>,
}));

vi.mock('react-dropzone', () => ({
  useDropzone: vi.fn(() => ({
    getRootProps: () => ({ 'data-testid': 'dropzone' }),
    getInputProps: () => ({ 'data-testid': 'file-input' }),
    isDragActive: false
  }))
}));

describe('DivaHologramCross', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the main application', () => {
    render(<DivaHologramCross />);
    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
  });

  it('renders all four viewports', () => {
    render(<DivaHologramCross />);
    const canvases = screen.getAllByTestId('canvas');
    expect(canvases).toHaveLength(4);
  });

  it('shows initial message when no model is loaded', () => {
    render(<DivaHologramCross />);
    expect(screen.getByText('3D Model Viewer')).toBeInTheDocument();
    expect(screen.getByText('Drag and drop a .glb file to get started')).toBeInTheDocument();
  });

  it('renders all control components', () => {
    render(<DivaHologramCross />);
    expect(screen.getByText('Animation Controls')).toBeInTheDocument();
    expect(screen.getByText(/Start Voice Control/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Head Tracking/i)).toBeInTheDocument();
    expect(screen.getByText('Text Detection')).toBeInTheDocument();
  });
});