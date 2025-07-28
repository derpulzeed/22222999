import React, { useState } from 'react';

const AnimationControls = ({ onAnimationChange }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [animationType, setAnimationType] = useState('rotate');

  const toggleAnimation = () => {
    const newState = !isAnimating;
    setIsAnimating(newState);
    onAnimationChange({
      enabled: newState,
      speed: speed,
      type: animationType
    });
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    onAnimationChange({
      enabled: isAnimating,
      speed: newSpeed,
      type: animationType
    });
  };

  const handleTypeChange = (newType) => {
    setAnimationType(newType);
    onAnimationChange({
      enabled: isAnimating,
      speed: speed,
      type: newType
    });
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      right: '20px',
      background: 'rgba(255,255,255,0.1)',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
      minWidth: '200px'
    }}>
      <h4 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>Animation Controls</h4>
      
      <button
        onClick={toggleAnimation}
        style={{
          background: isAnimating ? '#ff4444' : '#44ff44',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '10px'
        }}
      >
        {isAnimating ? '⏸️ Stop Animation' : '▶️ Start Animation'}
      </button>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>
          Animation Type:
        </label>
        <select
          value={animationType}
          onChange={(e) => handleTypeChange(e.target.value)}
          style={{
            width: '100%',
            padding: '5px',
            borderRadius: '3px',
            border: 'none',
            background: 'rgba(255,255,255,0.2)',
            color: 'white'
          }}
        >
          <option value="rotate">Rotate</option>
          <option value="bounce">Bounce</option>
          <option value="float">Float</option>
          <option value="pulse">Pulse</option>
        </select>
      </div>
      
      <div>
        <label style={{ fontSize: '12px', display: 'block', marginBottom: '5px' }}>
          Speed: {speed.toFixed(1)}x
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={speed}
          onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
};

export default AnimationControls;