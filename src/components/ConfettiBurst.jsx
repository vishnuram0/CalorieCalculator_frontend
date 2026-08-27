import { useEffect,useRef } from "react";


export function ConfettiBurst({ fireKey }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!fireKey) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.scale(dpr, dpr);

    const colors = [
      "#2563EB",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
    ];

    // Create particles from both bottom corners
    const pieces = [];

    const createBurst = (x, direction) => {
      for (let i = 0; i < 70; i++) {
        pieces.push({
          x,
          y: h - 20,

          // Shoot upward + toward the center
          vx: direction * (Math.random() * 7 + 3),
          vy: -(Math.random() * 10 + 8),

          size: Math.random() * 7 + 4,

          color: colors[Math.floor(Math.random() * colors.length)],

          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 18,

          gravity: 0.35 + Math.random() * 0.08,

          // Slight random horizontal variation
          drift: (Math.random() - 0.5) * 0.15,
        });
      }
    };

    // Left bottom → center
    createBurst(30, 1);

    // Right bottom → center
    createBurst(w - 30, -1);

    let frame = 0;
    let animationId;

    function tick() {
      frame++;

      ctx.clearRect(0, 0, w, h);

      pieces.forEach((p) => {
        // Physics
        p.vy += p.gravity;

        p.vx += p.drift;

        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.rotSpeed;

        // Fade during final part
        const alpha = Math.max(0, 1 - frame / 120);

        ctx.save();

        ctx.translate(p.x, p.y);

        ctx.rotate((p.rotation * Math.PI) / 180);

        ctx.globalAlpha = alpha;

        ctx.fillStyle = p.color;

        // Slightly rectangular paper pieces
        ctx.fillRect(
          -p.size / 2,
          -p.size / 2,
          p.size,
          p.size * 0.65
        );

        ctx.restore();
      });

      // 120 frames ≈ 2 seconds at 60 FPS
      if (frame < 120) {
        animationId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, w, h);
    };
  }, [fireKey]);

  return <canvas ref={canvasRef} className="hb-confetti-canvas" />;
}