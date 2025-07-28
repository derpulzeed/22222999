import { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'regenerator-runtime/runtime';

interface VoiceControlsProps {
  setAnimationType: (type: 'float' | 'rotate' | 'none') => void;
  setAnimationSpeed: (speed: number) => void;
  animationSpeed: number;
  setGhostMode: (enabled: boolean) => void;
}

export default function VoiceControls({
  setAnimationType,
  setAnimationSpeed,
  animationSpeed,
  setGhostMode
}: VoiceControlsProps) {
  // Create a local state to track ghost mode status
  const [ghostModeEnabled, setGhostModeEnabled] = useState(false);
  
  // Function to get current ghost mode state
  const isGhostModeEnabled = () => ghostModeEnabled;
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<string[]>([]);
  const [supported, setSupported] = useState(true);
  
  // Check if browser supports SpeechRecognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);
  
  const toggleListening = () => {
    if (!supported) return;
    
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript.toLowerCase();
      setTranscript(speechResult);
      
      // Process the command
      handleVoiceCommand(speechResult);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
    
    // Store recognition instance in window to stop it later
    (window as any).recognition = recognition;
  };
  
  const stopListening = () => {
    if ((window as any).recognition) {
      (window as any).recognition.stop();
    }
    setIsListening(false);
  };
  
  const handleVoiceCommand = (command: string) => {
    const newFeedback = [`Command: "${command}"`];
    
    // Animation type commands
    if (command.includes('float')) {
      setAnimationType('float');
      newFeedback.push('✓ Set animation: Float');
    } else if (command.includes('rotate')) {
      setAnimationType('rotate');
      newFeedback.push('✓ Set animation: Rotate');
    } else if (command.includes('stop') || command.includes('none')) {
      setAnimationType('none');
      newFeedback.push('✓ Stopped animation');
    }
    
    // Speed commands
    if (command.includes('faster')) {
      const newSpeed = Math.min(2.0, animationSpeed + 0.2);
      setAnimationSpeed(parseFloat(newSpeed.toFixed(1)));
      newFeedback.push(`✓ Increased speed to ${newSpeed.toFixed(1)}x`);
    } else if (command.includes('slower')) {
      const newSpeed = Math.max(0.5, animationSpeed - 0.2);
      setAnimationSpeed(parseFloat(newSpeed.toFixed(1)));
      newFeedback.push(`✓ Decreased speed to ${newSpeed.toFixed(1)}x`);
    } else if (command.includes('normal speed') || command.includes('reset speed')) {
      setAnimationSpeed(1.0);
      newFeedback.push('✓ Reset speed to 1.0x');
    }
    
    // Ghost mode commands
    if (command.includes('ghost on') || command.includes('enable ghost')) {
      setGhostMode(true);
      setGhostModeEnabled(true);
      newFeedback.push('✓ Ghost mode enabled');
    } else if (command.includes('ghost off') || command.includes('disable ghost')) {
      setGhostMode(false);
      setGhostModeEnabled(false);
      newFeedback.push('✓ Ghost mode disabled');
    } else if (command.includes('toggle ghost')) {
      const newGhostMode = !ghostModeEnabled;
      setGhostMode(newGhostMode);
      setGhostModeEnabled(newGhostMode);
      newFeedback.push('✓ Toggled ghost mode');
    }
    
    // Reset command
    if (command.includes('reset') || command.includes('default')) {
      setAnimationType('none');
      setAnimationSpeed(1.0);
      setGhostMode(false);
      setGhostModeEnabled(false);
      newFeedback.push('✓ Reset to default settings');
    }
    
    // Update feedback history
    setFeedback(prev => {
      const combined = [...newFeedback, ...prev];
      return combined.slice(0, 5); // Keep only the 5 most recent items
    });
  };
  
  return (
    <div className="control-panel">
      <h2 className="text-lg font-medium mb-4">Voice Controls</h2>
      
      {!supported ? (
        <div className="text-destructive text-sm mb-4">
          Voice recognition is not supported in your browser.
        </div>
      ) : (
        <>
          <div className="flex items-center justify-center mb-6">
            <Button
              variant={isListening ? 'default' : 'outline'}
              size="lg"
              className={`rounded-full p-6 ${isListening ? 'voice-listening' : 'ghost-button'}`}
              onClick={toggleListening}
            >
              {isListening ? (
                <Mic className="h-6 w-6 text-primary-foreground" />
              ) : (
                <MicOff className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          <div className="text-center mb-4 text-sm">
            {isListening ? (
              <span className="text-primary font-medium">Listening for commands...</span>
            ) : (
              <span>Click the microphone to use voice commands</span>
            )}
          </div>
          
          <div className="border border-border rounded-md p-3 bg-background/50 min-h-[100px] text-sm overflow-y-auto">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Command History</p>
            {feedback.length > 0 ? (
              <ul className="space-y-1.5">
                {feedback.map((item, index) => (
                  <li key={index} className="text-xs">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground italic">No commands yet</p>
            )}
          </div>
          
          <div className="mt-4 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Try saying:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>"float" / "rotate" / "stop"</li>
              <li>"faster" / "slower" / "normal speed"</li>
              <li>"ghost on" / "ghost off" / "toggle ghost"</li>
              <li>"reset" - to restore defaults</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}