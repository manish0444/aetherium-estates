import { useEffect, useRef } from 'react';

export default function GridBackground({ children }) {
  const canvasRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const clickPos = useRef(null);
  const particlesRef = useRef([]);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let time = 0;

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = Array.from({ length: 30 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        life: 1
      }));
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initParticles();
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };

      // Add new particles on mouse move
      if (Date.now() - lastTimeRef.current > 50) { // Limit particle creation
        particlesRef.current.push({
          x: mousePos.current.x,
          y: mousePos.current.y,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          life: 1
        });
        lastTimeRef.current = Date.now();
      }
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      clickPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        time: Date.now()
      };

      // Add burst of particles on click
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        particlesRef.current.push({
          x: clickPos.current.x,
          y: clickPos.current.y,
          size: Math.random() * 3 + 2,
          speedX: Math.cos(angle) * 2,
          speedY: Math.sin(angle) * 2,
          life: 1
        });
      }

      setTimeout(() => {
        if (clickPos.current?.time === Date.now()) {
          clickPos.current = null;
        }
      }, 1000);
    };

    const drawGrid = () => {
      const now = Date.now() / 1000;
      const deltaTime = now - time;
      time = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create deep gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f172a');
      gradient.addColorStop(0.5, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Grid settings
      const cellSize = 80;
      const rows = Math.ceil(canvas.height / cellSize);
      const cols = Math.ceil(canvas.width / cellSize);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.life -= deltaTime * 0.5;
        
        if (particle.life > 0) {
          const alpha = particle.life * 0.3;
          const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
          );
          gradient.addColorStop(0, `rgba(56, 189, 248, ${alpha})`);
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          return true;
        }
        return false;
      });

      // Draw grid with glow effect
      ctx.shadowBlur = 0;
      for (let i = 0; i <= cols; i++) {
        const x = i * cellSize + Math.sin(time + i * 0.1) * 2;
        const distanceFromMouse = Math.abs(x - mousePos.current.x);
        const isNearClick = clickPos.current && Math.abs(x - clickPos.current.x) < 100;
        let alpha = Math.max(0.03, Math.min(0.15, 50 / distanceFromMouse));
        
        if (isNearClick) {
          alpha = 0.5;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
          ctx.shadowBlur = 10;
        }
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
        ctx.lineWidth = distanceFromMouse < 50 || isNearClick ? 2 : 0.5;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let i = 0; i <= rows; i++) {
        const y = i * cellSize + Math.sin(time + i * 0.1) * 2;
        const distanceFromMouse = Math.abs(y - mousePos.current.y);
        const isNearClick = clickPos.current && Math.abs(y - clickPos.current.y) < 100;
        let alpha = Math.max(0.03, Math.min(0.15, 50 / distanceFromMouse));
        
        if (isNearClick) {
          alpha = 0.5;
          ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
          ctx.shadowBlur = 10;
        }
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(148, 163, 184, ${alpha})`;
        ctx.lineWidth = distanceFromMouse < 50 || isNearClick ? 2 : 0.5;
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw intersections with enhanced effects
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * cellSize + Math.sin(time + i * 0.1) * 2;
          const y = j * cellSize + Math.sin(time + j * 0.1) * 2;
          const distanceFromMouse = Math.sqrt(
            Math.pow(x - mousePos.current.x, 2) + 
            Math.pow(y - mousePos.current.y, 2)
          );
          const isNearClick = clickPos.current && 
            Math.sqrt(Math.pow(x - clickPos.current.x, 2) + Math.pow(y - clickPos.current.y, 2)) < 150;
          
          if (distanceFromMouse < 100 || isNearClick) {
            const size = isNearClick ? 12 : 8;
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
            gradient.addColorStop(0, `rgba(56, 189, 248, ${isNearClick ? 0.6 : 0.4})`);
            gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();

            if (isNearClick) {
              const sparkCount = 4;
              for (let k = 0; k < sparkCount; k++) {
                const angle = (k / sparkCount) * Math.PI * 2 + time;
                const sparkLength = 20;
                const endX = x + Math.cos(angle) * sparkLength;
                const endY = y + Math.sin(angle) * sparkLength;
                
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.lineTo(endX, endY);
                ctx.stroke();
              }
            }
          } else {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, 4);
            gradient.addColorStop(0, 'rgba(56, 189, 248, 0.1)');
            gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameId = requestAnimationFrame(drawGrid);
    };

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    resize();
    drawGrid();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-900">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/25 to-slate-900/50 pointer-events-none z-10" />
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-0"
      />
      <div className="relative z-20">
        {children}
      </div>
    </div>
  );
} 
