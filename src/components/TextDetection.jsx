import React, { useState, useRef } from 'react';

const TextDetection = ({ onTextDetected }) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedText, setDetectedText] = useState('');
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const processImage = async (imageFile) => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        // Simple OCR simulation - in a real app, you'd use Tesseract.js or similar
        // For demo purposes, we'll simulate text detection
        const mockTexts = [
          'HELLO WORLD',
          'ROTATE MODEL',
          'STOP ANIMATION',
          'CHANGE VIEW',
          'RESET POSITION'
        ];
        
        const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
        resolve(randomText);
      };
      
      img.src = URL.createObjectURL(imageFile);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setIsDetecting(true);
    
    try {
      const text = await processImage(file);
      setDetectedText(text);
      onTextDetected(text);
    } catch (error) {
      console.error('Text detection error:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const startCameraDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      video.addEventListener('loadedmetadata', () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        const captureFrame = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          
          // Simulate text detection from camera
          const mockTexts = ['LIVE TEXT DETECTED', 'CAMERA ACTIVE', 'SCANNING...'];
          const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
          setDetectedText(randomText);
          onTextDetected(randomText);
        };
        
        // Capture frame every 2 seconds
        const interval = setInterval(captureFrame, 2000);
        
        setTimeout(() => {
          clearInterval(interval);
          stream.getTracks().forEach(track => track.stop());
          setIsDetecting(false);
        }, 10000); // Stop after 10 seconds
      });
      
      setIsDetecting(true);
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      background: 'rgba(255,255,255,0.1)',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
      minWidth: '250px'
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Text Detection</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          disabled={isDetecting}
          style={{
            background: '#4444ff',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
            marginRight: '10px',
            fontSize: '12px'
          }}
        >
          📷 Upload Image
        </button>
        
        <button
          onClick={startCameraDetection}
          disabled={isDetecting}
          style={{
            background: '#44ff44',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          📹 Live Camera
        </button>
      </div>
      
      {isDetecting && (
        <div style={{ fontSize: '12px', color: '#ffff44' }}>
          Detecting text...
        </div>
      )}
      
      {detectedText && (
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '10px'
        }}>
          <strong>Detected:</strong> "{detectedText}"
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default TextDetection;