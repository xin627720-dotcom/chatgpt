'use client';

import { useEffect, useRef, useState } from 'react';

export default function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const start = prevRef.current;
    const target = value;
    if (start === target) return;

    const duration = 320;
    const startTs = performance.now();
    let raf = 0;

    const tick = (ts: number) => {
      const progress = Math.min((ts - startTs) / duration, 1);
      const current = Math.round(start + (target - start) * progress);
      setDisplay(current);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prevRef.current = target;
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{display}</>;
}
