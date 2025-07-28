import { useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useFBX } from '@react-three/drei';
import * as THREE from 'three';

interface HologramViewportProps {
  modelUrl: string | null;
  cameraPosition: [number, number, number];
  animationType: 'float' | 'rotate' | 'none';
  animationSpeed: number;
  ghostMode: boolean;
}

const Model = ({ 
  url, 
  animationType, 
  animationSpeed, 
  ghostMode 
}: { 
  url: string; 
  animationType: 'float' | 'rotate' | 'none';
  animationSpeed: number;
  ghostMode: boolean;
}) => {
  const modelRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    if (!modelRef.current) return;
    
    // Apply ghost material effect if ghostMode is enabled
    if (ghostMode) {
      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.Material;
            material.transparent = true;
            material.opacity = 0.7;
          }
        }
      });
    } else {
      // Reset materials if ghost mode is disabled
      modelRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          if (mesh.material) {
            const material = mesh.material as THREE.Material;
            material.transparent = false;
            material.opacity = 1.0;
          }
        }
      });
    }
  }, [ghostMode]);

  useEffect(() => {
    // Cleanup function
    return () => {
      // Dispose of the geometry and materials when component unmounts
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          mesh.geometry.dispose();
          
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(material => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    };
  }, [scene]);

  // Animation loop
  useEffect(() => {
    if (!modelRef.current) return;
    
    let frameId: number;
    
    const animate = () => {
      if (!modelRef.current) return;
      
      if (animationType === 'float') {
        // Floating animation - gentle up and down motion
        modelRef.current.position.y = Math.sin(Date.now() * 0.001 * animationSpeed) * 0.2;
      }
      
      if (animationType === 'rotate') {
        // Rotation animation - slow rotation around Y axis
        modelRef.current.rotation.y += 0.01 * animationSpeed;
      }
      
      frameId = requestAnimationFrame(animate);
    };
    
    if (animationType !== 'none') {
      frameId = requestAnimationFrame(animate);
    }
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [animationType, animationSpeed]);

  return (
    <primitive ref={modelRef} object={scene} scale={1} position={[0, 0, 0]} />
  );
};

export default function HologramViewport({ 
  modelUrl, 
  cameraPosition, 
  animationType, 
  animationSpeed,
  ghostMode 
}: HologramViewportProps) {
  return (
    <div className="hologram-viewport h-full w-full">
      {modelUrl ? (
        <Canvas camera={{ position: cameraPosition, fov: 50 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          <pointLight position={[-10, -10, -10]} color="#a0c8ff" intensity={0.2} />
          <Model 
            url={modelUrl} 
            animationType={animationType} 
            animationSpeed={animationSpeed}
            ghostMode={ghostMode}
          />
          <OrbitControls />
        </Canvas>
      ) : (
        <div className="flex h-full items-center justify-center text-muted-foreground">
          No model loaded
        </div>
      )}
      {ghostMode && <div className="ghost-effect"></div>}
    </div>
  );
}