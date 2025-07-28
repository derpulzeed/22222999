import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import DivaHologramGhost from '../DivaHologramGhost'

// Mock Three.js Canvas component
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }) => (
    <div data-testid="canvas" {...props}>
      {children}
    </div>
  ),
  useFrame: vi.fn(),
  useLoader: vi.fn(() => ({ scene: { traverse: vi.fn() } }))
}))

// Mock Drei components
vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls" />
}))

// Mock GLTFLoader
vi.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: vi.fn(() => ({
    load: vi.fn((url, onLoad) => {
      onLoad({ scene: { traverse: vi.fn() } })
    })
  }))
}))

describe('DivaHologramGhost', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main application with ghost theme', () => {
    render(<DivaHologramGhost />)
    
    expect(screen.getByText('Diva Hologram Ghost Viewer')).toBeInTheDocument()
    expect(screen.getByText('Drop a .GLB file to begin the spectral experience')).toBeInTheDocument()
  })

  it('displays all control panels', () => {
    render(<DivaHologramGhost />)
    
    expect(screen.getByText('👻 Ghost Animation Controls')).toBeInTheDocument()
    expect(screen.getByText('🎤 Ghost Voice Controls')).toBeInTheDocument()
    expect(screen.getByText('📁 Model Loader')).toBeInTheDocument()
    expect(screen.getByText('👻 Ghost Status')).toBeInTheDocument()
  })

  it('shows four hologram viewports', () => {
    render(<DivaHologramGhost />)
    
    const canvases = screen.getAllByTestId('canvas')
    expect(canvases).toHaveLength(4)
  })

  it('handles animation type changes', () => {
    render(<DivaHologramGhost />)
    
    const rotateButton = screen.getByText('🌀 Rotate')
    fireEvent.click(rotateButton)
    
    expect(screen.getByText('Animation: rotate (1.0x)')).toBeInTheDocument()
  })

  it('handles speed control changes', () => {
    render(<DivaHologramGhost />)
    
    const speedSlider = screen.getByDisplayValue('1')
    fireEvent.change(speedSlider, { target: { value: '2' } })
    
    expect(screen.getByText('Speed: 2.0x')).toBeInTheDocument()
  })

  it('toggles ghost mode', () => {
    render(<DivaHologramGhost />)
    
    const ghostModeCheckbox = screen.getByLabelText('👻 Ghost Mode')
    expect(ghostModeCheckbox).toBeChecked()
    
    fireEvent.click(ghostModeCheckbox)
    expect(ghostModeCheckbox).not.toBeChecked()
    expect(screen.getByText('Ghost Mode: Off')).toBeInTheDocument()
  })

  it('handles file selection', () => {
    render(<DivaHologramGhost />)
    
    const fileInput = screen.getByDisplayValue('')
    const file = new File(['test'], 'test.glb', { type: 'model/gltf-binary' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file)
  })

  it('handles drag and drop', () => {
    render(<DivaHologramGhost />)
    
    const dropZone = screen.getByText('Diva Hologram Ghost Viewer').closest('div')
    const file = new File(['test'], 'test.glb', { type: 'model/gltf-binary' })
    
    fireEvent.dragOver(dropZone, {
      dataTransfer: { files: [file] }
    })
    
    expect(screen.getByText('Drop your .GLB model here to summon the ghost!')).toBeInTheDocument()
    
    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] }
    })
    
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file)
  })

  it('shows status indicators correctly', () => {
    render(<DivaHologramGhost />)
    
    expect(screen.getByText('Model: None')).toBeInTheDocument()
    expect(screen.getByText('Ghost Mode: On')).toBeInTheDocument()
    expect(screen.getByText('Animation: float (1.0x)')).toBeInTheDocument()
  })

  it('displays floating particles in background', () => {
    render(<DivaHologramGhost />)
    
    const particles = document.querySelectorAll('.particle')
    expect(particles.length).toBe(20)
  })

  it('handles voice command processing', async () => {
    render(<DivaHologramGhost />)
    
    const startListeningButton = screen.getByText('🎤 Start Listening')
    fireEvent.click(startListeningButton)
    
    // Simulate voice command
    const mockRecognition = global.SpeechRecognition.mock.results[0].value
    const mockEvent = {
      results: [{
        0: { transcript: 'rotate' }
      }]
    }
    
    if (mockRecognition.onresult) {
      mockRecognition.onresult(mockEvent)
    }
    
    await waitFor(() => {
      expect(screen.getByText('Animation: rotate (1.0x)')).toBeInTheDocument()
    })
  })

  it('resets to default state', () => {
    render(<DivaHologramGhost />)
    
    // Change some settings
    const rotateButton = screen.getByText('🌀 Rotate')
    fireEvent.click(rotateButton)
    
    const speedSlider = screen.getByDisplayValue('1')
    fireEvent.change(speedSlider, { target: { value: '2' } })
    
    // Simulate reset voice command
    const mockRecognition = global.SpeechRecognition.mock.results[0].value
    const mockEvent = {
      results: [{
        0: { transcript: 'reset' }
      }]
    }
    
    if (mockRecognition.onresult) {
      mockRecognition.onresult(mockEvent)
    }
    
    expect(screen.getByText('Animation: float (1.0x)')).toBeInTheDocument()
  })
})