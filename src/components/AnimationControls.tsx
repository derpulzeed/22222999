import { Repeat, Disc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface AnimationControlsProps {
  animationType: 'float' | 'rotate' | 'none';
  setAnimationType: (type: 'float' | 'rotate' | 'none') => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  ghostMode: boolean;
  setGhostMode: (enabled: boolean) => void;
}

export default function AnimationControls({
  animationType,
  setAnimationType,
  animationSpeed,
  setAnimationSpeed,
  ghostMode,
  setGhostMode
}: AnimationControlsProps) {
  return (
    <div className="control-panel">
      <h2 className="text-lg font-medium mb-4">Ghost Animation Controls</h2>
      
      <div className="space-y-6">
        {/* Animation Type Selection */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Animation Type</p>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={animationType === 'none' ? 'default' : 'outline'}
              size="sm"
              className="ghost-button"
              onClick={() => setAnimationType('none')}
            >
              None
            </Button>
            
            <Button
              variant={animationType === 'float' ? 'default' : 'outline'}
              size="sm"
              className="ghost-button"
              onClick={() => setAnimationType('float')}
            >
              <Disc className="mr-1 h-3.5 w-3.5" />
              Float
            </Button>
            
            <Button
              variant={animationType === 'rotate' ? 'default' : 'outline'}
              size="sm"
              className="ghost-button"
              onClick={() => setAnimationType('rotate')}
            >
              <Repeat className="mr-1 h-3.5 w-3.5" />
              Rotate
            </Button>
          </div>
        </div>
        
        {/* Speed Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="speed" className="text-sm font-medium">Speed</Label>
            <span className="text-sm text-muted-foreground">{animationSpeed.toFixed(1)}x</span>
          </div>
          
          <Slider
            id="speed"
            min={0.5}
            max={2}
            step={0.1}
            defaultValue={[1.0]}
            value={[animationSpeed]}
            onValueChange={(vals) => setAnimationSpeed(vals[0])}
          />
        </div>
        
        {/* Ghost Mode Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="ghost-mode" className="text-sm font-medium">Ghost Mode</Label>
          
          <Switch
            id="ghost-mode"
            checked={ghostMode}
            onCheckedChange={setGhostMode}
          />
        </div>
      </div>
    </div>
  );
}