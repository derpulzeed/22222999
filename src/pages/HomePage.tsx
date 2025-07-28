import { useState, useEffect } from 'react';
import { Ghost } from 'lucide-react';
import HologramViewport from '@/components/HologramViewport';
import ParticleSystem from '@/components/ParticleSystem';
import ModelLoader from '@/components/ModelLoader';
import AnimationControls from '@/components/AnimationControls';
import VoiceControls from '@/components/VoiceControls';
import GhostStatusPanel from '@/components/GhostStatusPanel';

function HomePage() {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [modelName, setModelName] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<'float' | 'rotate' | 'none'>('none');
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [ghostMode, setGhostMode] = useState(true);
  const [subtitle, setSubtitle] = useState('Upload a 3D model to begin');
  
  // Update subtitle based on application state
  useEffect(() => {
    if (!modelUrl) {
      setSubtitle('Upload a 3D model to begin');
    } else if (animationType === 'none') {
      setSubtitle('Model loaded. Choose an animation type');
    } else {
      setSubtitle(`Viewing in ${ghostMode ? 'ghost' : 'normal'} mode with ${animationType} animation`);
    }
  }, [modelUrl, animationType, ghostMode]);
  
  // Handle model load from ModelLoader component
  const handleModelLoad = (url: string, name?: string) => {
    setModelUrl(url);
    setModelName(name || 'Uploaded Model');
    
    // Set default animation when model loads
    setAnimationType('float');
  };
  
  return (
    <div 
      className="min-h-screen bg-background flex flex-col"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
    >
      {/* Floating particles background */}
      <ParticleSystem count={20} />
      
      {/* Header */}
      <header className="px-4 py-6 border-b border-border flex flex-col items-center">
        <div className="flex items-center gap-3 mb-2">
          <Ghost className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Diva Hologram Ghost Viewer</h1>
        </div>
        <p className="text-muted-foreground text-sm">{subtitle}</p>
      </header>
      
      {/* Main content */}
      <main className="flex-1 p-4 md:p-6 flex flex-col">
        {/* Viewports grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 mb-6">
          <HologramViewport 
            modelUrl={modelUrl} 
            cameraPosition={[0, 0, 5]} 
            animationType={animationType}
            animationSpeed={animationSpeed}
            ghostMode={ghostMode}
          />
          <HologramViewport 
            modelUrl={modelUrl} 
            cameraPosition={[5, 0, 0]} 
            animationType={animationType}
            animationSpeed={animationSpeed}
            ghostMode={ghostMode}
          />
          <HologramViewport 
            modelUrl={modelUrl} 
            cameraPosition={[0, 5, 0]} 
            animationType={animationType}
            animationSpeed={animationSpeed}
            ghostMode={ghostMode}
          />
          <HologramViewport 
            modelUrl={modelUrl} 
            cameraPosition={[-3, 2, 3]} 
            animationType={animationType}
            animationSpeed={animationSpeed}
            ghostMode={ghostMode}
          />
        </div>
        
        {/* Control panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModelLoader 
            onModelLoad={(url) => handleModelLoad(url)} 
          />
          <AnimationControls 
            animationType={animationType}
            setAnimationType={setAnimationType}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            ghostMode={ghostMode}
            setGhostMode={setGhostMode}
          />
          <VoiceControls 
            setAnimationType={setAnimationType}
            setAnimationSpeed={setAnimationSpeed}
            animationSpeed={animationSpeed}
            setGhostMode={setGhostMode}
          />
          <GhostStatusPanel 
            modelLoaded={!!modelUrl}
            modelName={modelName || undefined}
            ghostMode={ghostMode}
            animationType={animationType}
            animationSpeed={animationSpeed}
          />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-3 px-4 border-t border-border text-center text-xs text-muted-foreground">
        Diva Hologram Ghost Viewer &copy; {new Date().getFullYear()} - Use voice commands or controls to manipulate the ghost hologram
      </footer>
    </div>
  );
}

export default HomePage;