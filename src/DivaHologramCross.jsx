// DivaHologramCross.jsx
import React, { Suspense, useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useProgress, Html } from '@react-three/drei';
import { useDropzone } from 'react-dropzone';
import VoiceControls from './components/VoiceControls';
import HeadTracking from './components/HeadTracking';
import TextDetection from './components/TextDetection';
import AnimationControls from './components/AnimationControls';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const DEFAULT_MODEL_PATH = null; // No default model until user provides one

const Loader = () => {
  const { progress } = useProgress();
  return <Html center style={{ color: 'white' }}>{progress.toFixed(0)} %</Html>;
};

const DivaModel = ({ rotation = [0, 0, 0], modelUrl, animation, headPosition }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current || !animation.enabled) return;
    
    const time = state.clock.getElapsedTime() * animation.speed;
    
    switch (animation.type) {
      case 'rotate':
        meshRef.current.rotation.y = time;
        break;
      case 'bounce':
        meshRef.current.position.y = Math.sin(time * 2) * 0.5 - 1.2;
        break;
      case 'float':
        meshRef.current.position.y = Math.sin(time) * 0.3 - 1.2;
        meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.2;
        break;
      case 'pulse':
        const scale = 1 + Math.sin(time * 3) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
        break;
      default:
        break;
    }
    
    // Apply head tracking offset
    if (headPosition && meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + headPosition.y * 0.3;
      meshRef.current.rotation.y = rotation[1] + headPosition.x * 0.3;
    }
  });
  
  if (!modelUrl) {
    return (
      <Html center style={{ color: 'white', textAlign: 'center' }}>
        <div>
          <p>No model loaded</p>
          <p style={{ fontSize: '0.8em', opacity: 0.7 }}>
            Drag and drop a .glb file to view
          </p>
        </div>
      </Html>
    );
  }
  
  try {
    const { scene } = useGLTF(modelUrl);
    return (
      <primitive
        ref={meshRef}
        object={scene}
        rotation={rotation}
        position={[0, -1.2, 0]}
        scale={1.5}
      />
    );
  } catch (error) {
    console.error('Error loading model:', error);
    return (
      <Html center style={{ color: 'red', textAlign: 'center' }}>
        <div>
          <p>Error loading model</p>
          <p style={{ fontSize: '0.8em', opacity: 0.7 }}>
            Please try a different .glb file
          </p>
        </div>
      </Html>
    );
  }
};

const Viewport = ({ cameraPosition, rotation, style, modelUrl, animation, headPosition }) => (
  <div style={style}>
    <Canvas camera={{ position: cameraPosition, fov: 35 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={<Loader />}>
        <DivaModel 
          rotation={rotation} 
          modelUrl={modelUrl} 
          animation={animation}
          headPosition={headPosition}
        />
      </Suspense>
      {modelUrl && <OrbitControls enableZoom={false} />}
    </Canvas>
  </div>
);

export default function DivaHologramCross() {
  const [modelUrl, setModelUrl] = useState(DEFAULT_MODEL_PATH);
  const [animation, setAnimation] = useState({ enabled: false, speed: 1, type: 'rotate' });
  const [headPosition, setHeadPosition] = useState({ x: 0, y: 0 });

  const handleVoiceCommand = useCallback((command) => {
    console.log('Voice command:', command);
    
    if (!command || typeof command !== 'string') return;
    
    const lowerCommand = command.toLowerCase().trim();
    
    if (lowerCommand.includes('rotate') || lowerCommand.includes('spin')) {
      setAnimation(prev => ({ ...prev, enabled: true, type: 'rotate' }));
    } else if (lowerCommand.includes('stop')) {
      setAnimation(prev => ({ ...prev, enabled: false }));
    } else if (lowerCommand.includes('bounce')) {
      setAnimation(prev => ({ ...prev, enabled: true, type: 'bounce' }));
    } else if (lowerCommand.includes('float')) {
      setAnimation(prev => ({ ...prev, enabled: true, type: 'float' }));
    } else if (lowerCommand.includes('pulse')) {
      setAnimation(prev => ({ ...prev, enabled: true, type: 'pulse' }));
    } else if (lowerCommand.includes('faster')) {
      setAnimation(prev => ({ ...prev, speed: Math.min(prev.speed + 0.5, 3) }));
    } else if (lowerCommand.includes('slower')) {
      setAnimation(prev => ({ ...prev, speed: Math.max(prev.speed - 0.5, 0.1) }));
    } else if (lowerCommand.includes('reset')) {
      setAnimation({ enabled: false, speed: 1, type: 'rotate' });
      setHeadPosition({ x: 0, y: 0 });
    }
  }, []);

  const handleTextDetected = useCallback((text) => {
    console.log('Text detected:', text);
    handleVoiceCommand(text);
  }, [handleVoiceCommand]);

  const handleHeadMove = useCallback((position) => {
    if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') return;
    setHeadPosition(position);
  }, []);

  const handleAnimationChange = useCallback((newAnimation) => {
    if (!newAnimation || typeof newAnimation !== 'object') return;
    setAnimation(newAnimation);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.glb')) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
    } else {
      console.warn('Please upload a .glb file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'model/gltf-binary': ['.glb'] },
    maxFiles: 1
  });

  useEffect(() => {
    if (modelUrl) {
      try {
        useGLTF.preload(modelUrl);
      } catch (e) {
        console.warn(`Preload failed: ${modelUrl} not found`, e);
      }
    }
  }, [modelUrl]);

  useEffect(() => {
    // Cleanup object URLs to prevent memory leaks
    return () => {
      if (modelUrl && modelUrl.startsWith('blob:')) {
        URL.revokeObjectURL(modelUrl);
      }
    };
  }, [modelUrl]);
  return (
    <div
      {...getRootProps()}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        width: '100vw',
        height: '100vh',
        background: 'black',
        position: 'relative',
        border: isDragActive ? '2px dashed white' : 'none'
      }}
    >
      <input {...getInputProps()} />
      <div></div>

      {/* Top (Front View) */}
      <Viewport
        cameraPosition={[0, 0, 5]}
        rotation={[0, 0, 0]}
        style={{ gridColumn: 2, gridRow: 1 }}
        modelUrl={modelUrl}
        animation={animation}
        headPosition={headPosition}
      />

      <div></div>

      {/* Left (Left View) */}
      <Viewport
        cameraPosition={[-5, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        style={{ gridColumn: 1, gridRow: 2 }}
        modelUrl={modelUrl}
        animation={animation}
        headPosition={headPosition}
      />

      <div></div>

      {/* Right (Right View) */}
      <Viewport
        cameraPosition={[5, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        style={{ gridColumn: 3, gridRow: 2 }}
        modelUrl={modelUrl}
        animation={animation}
        headPosition={headPosition}
      />

      <div></div>

      {/* Bottom (Back View) */}
      <Viewport
        cameraPosition={[0, 0, -5]}
        rotation={[0, Math.PI, 0]}
        style={{ gridColumn: 2, gridRow: 3 }}
        modelUrl={modelUrl}
        animation={animation}
        headPosition={headPosition}
      />

      <div></div>

      {isDragActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.1)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          pointerEvents: 'none'
        }}>
          Drop your .glb file here
        </div>
      )}
      
      {!modelUrl && !isDragActive && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <h2>3D Model Viewer</h2>
          <p>Drag and drop a .glb file to get started</p>
        </div>
      )}
      
      <VoiceControls onCommand={handleVoiceCommand} />
      <HeadTracking onHeadMove={handleHeadMove} />
      <TextDetection onTextDetected={handleTextDetected} />
      <AnimationControls onAnimationChange={handleAnimationChange} />
    </div>
  );
}
