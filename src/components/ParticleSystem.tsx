import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  element: HTMLDivElement;
}

interface ParticleSystemProps {
  count?: number;
}

export default function ParticleSystem({ count = 20 }: ParticleSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    
    // Remove any existing particles
    container.innerHTML = '';
    particlesRef.current = [];
    
    // Create new particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      
      // Style the particle
      particle.style.position = 'absolute';
      particle.style.borderRadius = '50%';
      particle.style.background = 'rgba(165, 210, 255, 0.3)';
      particle.style.boxShadow = '0 0 10px rgba(165, 210, 255, 0.5)';
      particle.style.pointerEvents = 'none';
      
      // Add to container
      container.appendChild(particle);
      
      // Random initial values
      const size = Math.random() * 10 + 3;
      const x = Math.random() * containerWidth;
      const y = Math.random() * containerHeight;
      const speedX = (Math.random() - 0.5) * 0.5;
      const speedY = (Math.random() - 0.5) * 0.5;
      const opacity = Math.random() * 0.4 + 0.1;
      
      // Apply initial position and size
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.opacity = opacity.toString();
      
      // Store particle data
      particlesRef.current.push({
        x,
        y,
        size,
        speedX,
        speedY,
        opacity,
        element: particle
      });
    }
    
    // Animation loop
    let lastTime = 0;
    let animationFrameId: number;
    
    const animate = (time: number) => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      // Calculate delta time
      const deltaTime = time - lastTime;
      lastTime = time;
      
      // Update each particle
      particlesRef.current.forEach(particle => {
        // Move particle
        particle.x += particle.speedX * deltaTime * 0.1;
        particle.y += particle.speedY * deltaTime * 0.1;
        
        // Wrap around if particle goes off screen
        if (particle.x < -particle.size) particle.x = containerWidth;
        if (particle.x > containerWidth) particle.x = -particle.size;
        if (particle.y < -particle.size) particle.y = containerHeight;
        if (particle.y > containerHeight) particle.y = -particle.size;
        
        // Update DOM element position
        particle.element.style.left = `${particle.x}px`;
        particle.element.style.top = `${particle.y}px`;
        
        // Slowly pulsate opacity
        const opacityDelta = Math.sin(time * 0.001) * 0.1;
        const newOpacity = Math.max(0.05, Math.min(0.5, particle.opacity + opacityDelta));
        particle.element.style.opacity = newOpacity.toString();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.innerHTML = '';
    };
  }, [count]);
  
  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      
      particlesRef.current.forEach(particle => {
        // Keep particles within bounds after resize
        particle.x = Math.min(particle.x, containerWidth);
        particle.y = Math.min(particle.y, containerHeight);
        
        particle.element.style.left = `${particle.x}px`;
        particle.element.style.top = `${particle.y}px`;
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return <div ref={containerRef} className="particles-container"></div>;
}