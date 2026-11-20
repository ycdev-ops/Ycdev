import { useEffect, useState } from 'react';
import { motion, useReducedMotion, useSpring } from 'motion/react';
import { calculateScrollProgress } from '../utils/scrollProgress';

export function ScrollProgressBar() {
  const [percent, setPercent] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const scaleX = useSpring(0, {
    stiffness: prefersReducedMotion ? 1000 : 280,
    damping: prefersReducedMotion ? 100 : 32,
    restDelta: 0.0005,
  });

  useEffect(() => {
    const updateProgress = () => {
      const next = calculateScrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
      if (prefersReducedMotion) {
        scaleX.jump(next);
      } else {
        scaleX.set(next);
      }
      setPercent(Math.round(next * 100));
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [prefersReducedMotion, scaleX]);

  return (
    <div
      role="progressbar"
      aria-label="Progres gulir halaman"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      data-testid="scroll-progress-bar"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px] bg-white/5"
    >
      <motion.div
        style={{ scaleX }}
        className="h-full w-full origin-left bg-gradient-to-r from-[#2563EB] to-[#38BDF8]"
      />
    </div>
  );
}
