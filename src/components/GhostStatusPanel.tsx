import { Ghost, AlertCircle } from 'lucide-react';

interface GhostStatusPanelProps {
  modelLoaded: boolean;
  modelName?: string;
  ghostMode: boolean;
  animationType: 'float' | 'rotate' | 'none';
  animationSpeed: number;
}

export default function GhostStatusPanel({
  modelLoaded,
  modelName,
  ghostMode,
  animationType,
  animationSpeed
}: GhostStatusPanelProps) {
  return (
    <div className="control-panel">
      <h2 className="text-lg font-medium mb-4">Ghost Status</h2>
      
      <div className="space-y-4">
        {/* Model Status */}
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${modelLoaded ? 'bg-primary' : 'bg-muted'}`}></div>
          <span className="text-sm font-medium">Model Status:</span>
          <span className="text-sm text-muted-foreground">
            {modelLoaded ? 'Loaded' : 'No model loaded'}
          </span>
        </div>
        
        {modelLoaded && modelName && (
          <div className="bg-primary/10 p-2 rounded text-xs">
            <span className="font-medium">Name:</span> {modelName}
          </div>
        )}
        
        {/* Ghost Mode Status */}
        <div className="flex items-center gap-2">
          <Ghost className={`w-4 h-4 ${ghostMode ? 'text-primary' : 'text-muted'}`} />
          <span className="text-sm font-medium">Ghost Mode:</span>
          <span className="text-sm text-muted-foreground">
            {ghostMode ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        {/* Animation Status */}
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Animation:</span>
            <span className="text-sm text-muted-foreground capitalize">
              {animationType === 'none' ? 'None' : animationType}
            </span>
          </div>
          
          {animationType !== 'none' && (
            <div className="ml-6 mt-1.5 text-sm text-muted-foreground">
              Speed: {animationSpeed.toFixed(1)}x
            </div>
          )}
        </div>
        
        {/* Help Text */}
        {!modelLoaded && (
          <div className="text-xs text-muted-foreground mt-4">
            <p>To get started:</p>
            <ol className="list-decimal list-inside mt-1 space-y-1">
              <li>Upload or drag a GLB 3D model file</li>
              <li>Choose animation type and speed</li>
              <li>Toggle ghost mode for ethereal effect</li>
              <li>Try voice commands for hands-free control</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}