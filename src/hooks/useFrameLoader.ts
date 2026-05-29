import { useEffect, useState } from 'react';

export const TOTAL_FRAMES = 180;

interface LoaderState {
  images: HTMLImageElement[] | null;
  loaded: number;
  progress: number;
  ready: boolean;
  total: number;
}

export function useFrameLoader(): LoaderState {
  const [images, setImages] = useState<HTMLImageElement[] | null>(null);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const imgs: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let count = 0;

    const handleDone = () => {
      if (cancelled) return;
      count++;
      setLoaded(count);
      if (count === TOTAL_FRAMES) setImages(imgs);
    };

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.decoding = 'async';
      const num = String(i + 1).padStart(3, '0');
      img.src = `/frames/frame-${num}.jpg`;
      img.onload = handleDone;
      img.onerror = handleDone;
      imgs[i] = img;
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    images,
    loaded,
    progress: loaded / TOTAL_FRAMES,
    ready: images !== null,
    total: TOTAL_FRAMES,
  };
}
