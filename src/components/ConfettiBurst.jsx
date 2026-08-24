import { useRef, useEffect } from "react";

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
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.scale(dpr, dpr);

    const colors = ["#2563EB", "#10B981", "#F59E0B", "#1A1A2E", "#93C5FD"];
    const pieces = Array.from({ length: 80 }, () => ({
      x: w / 2 + (Math.random() - 0.5) * 120,
      y: h * 0.32,
      vx: (Math.random() - 0.5) * 9,
      vy: Math.random() * -9 - 4,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 12,
      gravity: 0.28 + Math.random() * 0.1,
    }));

    let frame = 0;
    let animId;
    function tick() {
      frame++;
      ctx.clearRect(0, 0, w, h);
      let stillAlive = false;
      pieces.forEach((p) => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (p.y < h + 40) stillAlive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, 1 - frame / 90);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (stillAlive && frame < 95) {
        animId = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, w, h);
      }
    }
    tick();
    return () => cancelAnimationFrame(animId);
  }, [fireKey]);

  return <canvas ref={canvasRef} className="hb-confetti-canvas" />;
}
