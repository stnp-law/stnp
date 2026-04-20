'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('loading'); // 'loading' | 'reveal' | 'exit' | 'done'
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    // Animate progress from 0 → 100 over ~1.6 s with easing
    const duration = 1600;

    const tick = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const raw = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - raw, 3);
      const pct = Math.round(eased * 100);
      setProgress(pct);

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Hold briefly, then transition
        setTimeout(() => setPhase('reveal'), 200);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (phase === 'reveal') {
      // After the curtain panels start splitting, trigger the full exit
      const t = setTimeout(() => setPhase('exit'), 900);
      return () => clearTimeout(t);
    }
    if (phase === 'exit') {
      const t = setTimeout(() => {
        setPhase('done');
        onComplete?.();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className={`${styles.root} ${phase === 'exit' ? styles.exit : ''}`} aria-hidden="true">
      {/* Left curtain panel */}
      <div className={`${styles.panel} ${styles.panelLeft} ${phase === 'reveal' || phase === 'exit' ? styles.panelOpen : ''}`} />
      {/* Right curtain panel */}
      <div className={`${styles.panel} ${styles.panelRight} ${phase === 'reveal' || phase === 'exit' ? styles.panelOpen : ''}`} />

      {/* Content (fades out on reveal) */}
      <div className={`${styles.content} ${phase === 'reveal' || phase === 'exit' ? styles.contentFade : ''}`}>
        {/* Top-left logo mark removed as Navbar sits on top */}
        <div className={styles.topLeft}>
        </div>

        {/* Centre: large decorative logo */}
        <div className={styles.centre}>
          <div className={styles.logoWrap}>
            <Image
              src="/images/logo.png"
              alt="Soaloan Tua Nababan & Partners"
              width={360}
              height={120}
              priority
              className={styles.logoCentre}
            />
            {/* Gold shimmer line beneath logo */}
            <div className={styles.shimmerLine}>
              <div className={styles.shimmerFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* Bottom-right: loading percentage */}
        <div className={styles.bottomRight}>
          <span className={styles.loadingLabel}>Loading</span>
          <span className={styles.percentage}>{progress}%</span>
        </div>

        {/* Bottom-left: firm name */}
        <div className={styles.bottomLeft}>
          <span className={styles.firmName}>Soaloan Tua Nababan &amp; Partners</span>
        </div>
      </div>
    </div>
  );
}
