import React, { useRef, useEffect, useState } from 'react';

const HeadTracking = ({ onHeadMove }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let animationFrame;
    let faceDetector;

    const startTracking = async () => {
      try {
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 320, height: 240 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        // Simple face detection using basic computer vision
        const detectFace = () => {
          if (!videoRef.current || !canvasRef.current) return;
          
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          ctx.drawImage(video, 0, 0);
          
          // Simple center-of-mass tracking
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          
          let totalX = 0, totalY = 0, count = 0;
          
          // Look for face-like regions (simplified)
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Simple skin tone detection
            if (r > 95 && g > 40 && b > 20 && 
                Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                Math.abs(r - g) > 15 && r > g && r > b) {
              const pixelIndex = i / 4;
              const x = pixelIndex % canvas.width;
              const y = Math.floor(pixelIndex / canvas.width);
              totalX += x;
              totalY += y;
              count++;
            }
          }
          
          if (count > 100) { // Minimum threshold for face detection
            const centerX = totalX / count;
            const centerY = totalY / count;
            
            // Normalize to -1 to 1 range
            const normalizedX = Math.max(-1, Math.min(1, (centerX / canvas.width - 0.5) * 2));
            const normalizedY = Math.max(-1, Math.min(1, (centerY / canvas.height - 0.5) * 2));
            
            if (onHeadMove && typeof onHeadMove === 'function') {
              onHeadMove({ x: normalizedX, y: -normalizedY });
            }
          }
          
          animationFrame = requestAnimationFrame(detectFace);
        };
        
        video.addEventListener('loadedmetadata', () => {
          setIsTracking(true);
          detectFace();
        });
        
      } catch (err) {
        setError('Camera access denied or not available');
        console.error('Head tracking error:', err);
      }
    };

    if (isTracking) {
      startTracking();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isTracking, onHeadMove]);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    setError(null);
  };

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      background: 'rgba(255,255,255,0.1)',
      padding: '15px',
      borderRadius: '8px',
      color: 'white'
    }}>
      <button
        onClick={toggleTracking}
        style={{
          background: isTracking ? '#ff4444' : '#4444ff',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        {isTracking ? '📹 Stop Head Tracking' : '📹 Start Head Tracking'}
      </button>
      
      {error && (
        <div style={{ fontSize: '12px', color: '#ff6666' }}>
          {error}
        </div>
      )}
      
      {isTracking && (
        <div style={{ display: 'none' }}>
          <video ref={videoRef} style={{ width: '160px', height: '120px' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
      )}
    </div>
  );
};

export default HeadTracking;