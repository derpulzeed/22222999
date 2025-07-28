import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileUp } from 'lucide-react';

interface ModelLoaderProps {
  onModelLoad: (url: string) => void;
}

export default function ModelLoader({ onModelLoad }: ModelLoaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentModelName, setCurrentModelName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handle file selection from file input
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadModel(file);
    }
  };
  
  // Handle file selection from drag and drop
  const loadModel = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.glb')) {
      alert('Please upload a GLB file');
      return;
    }
    
    // Create object URL for the model
    const url = URL.createObjectURL(file);
    setCurrentModelName(file.name);
    onModelLoad(url);
  };
  
  // Handle drag events
  const handleDragEnter = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      loadModel(file);
    }
  }, []);
  
  // Handle file button click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="control-panel">
      <h2 className="text-lg font-medium mb-4">Model Loader</h2>
      
      <div 
        className={`model-drop-zone ${isDragging ? 'active' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-10 w-10 text-primary/50 mb-2" />
        <p className="mb-2">Drag and drop a GLB model</p>
        <p className="text-sm text-muted-foreground">or</p>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".glb"
          onChange={handleFileChange}
        />
        
        <Button 
          variant="outline" 
          className="mt-4 ghost-button"
          onClick={handleButtonClick}
        >
          <FileUp className="mr-2 h-4 w-4" />
          Select Model
        </Button>
      </div>
      
      {currentModelName && (
        <div className="mt-4 p-2 bg-primary/10 rounded text-sm">
          <p className="font-medium">Current Model:</p>
          <p className="truncate">{currentModelName}</p>
        </div>
      )}
    </div>
  );
}