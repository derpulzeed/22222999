import React, { useState, useEffect, useRef } from 'react';

const VoiceControls = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        
        if (finalTranscript) {
          setTranscript(finalTranscript);
          onCommand(finalTranscript.trim());
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setTranscript('');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onCommand]);

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  if (!isSupported) {
    return (
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(255,255,255,0.1)',
        padding: '10px',
        borderRadius: '8px',
        color: 'white'
      }}>
        Voice commands not supported in this browser
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: 'rgba(255,255,255,0.1)',
      padding: '15px',
      borderRadius: '8px',
      color: 'white',
      minWidth: '200px'
    }}>
      <button
        onClick={toggleListening}
        style={{
          background: isListening ? '#ff4444' : '#44ff44',
          border: 'none',
          padding: '10px 15px',
          borderRadius: '5px',
          color: 'white',
          cursor: 'pointer',
          marginBottom: '10px',
          width: '100%'
        }}
      >
        {isListening ? '🎤 Stop Listening' : '🎤 Start Voice Control'}
      </button>
      
      {transcript && (
        <div style={{ fontSize: '12px', opacity: 0.8 }}>
          Last command: "{transcript}"
        </div>
      )}
      
      <div style={{ fontSize: '10px', marginTop: '10px', opacity: 0.6 }}>
        Commands: "rotate", "stop", "faster", "slower", "reset"
      </div>
    </div>
  );
};

export default VoiceControls;