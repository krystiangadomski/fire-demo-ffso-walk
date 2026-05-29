import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TOTAL_FRAMES } from '../hooks/useFrameLoader';

const ZOOM_FACTOR = 1.0;
const PARALLAX_AMOUNT = 28;
const LERP = 0.05;

interface Props {
  images: HTMLImageElement[] | null;
  ready: boolean;
}

export function ScrollCanvas({ images, ready }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ready || !images) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let target = 0;
    let displayed = 0;
    let lastDrawnIndex = -1;
    let rafId = 0;

    const drawFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete || !img.naturalWidth) return;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, cw, ch);

      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih) * ZOOM_FACTOR;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      lastDrawnIndex = index;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lastDrawnIndex = -1; // force redraw
      drawFrame(Math.round(displayed));
    };

    const computeTarget = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = max > 0 ? window.scrollY / max : 0;
      const clamped = Math.max(0, Math.min(1, fraction));
      target = clamped * (TOTAL_FRAMES - 1);
    };

    const loop = () => {
      const diff = target - displayed;
      if (Math.abs(diff) > 0.01) {
        displayed += diff * LERP;
      } else if (displayed !== target) {
        displayed = target;
      }
      const idx = Math.round(displayed);
      if (idx !== lastDrawnIndex) drawFrame(idx);
      rafId = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      computeTarget();
    };

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(canvas, {
        x: -nx * PARALLAX_AMOUNT,
        y: -ny * PARALLAX_AMOUNT,
        duration: 0.9,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    };

    gsap.set(canvas, { scale: 1.05, x: 0, y: 0 });
    resize();
    computeTarget();
    displayed = target; // start at correct frame without snap
    drawFrame(Math.round(displayed));
    rafId = requestAnimationFrame(loop);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [images, ready]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ background: '#000' }}
    />
  );
}
