'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './HeroScrollButton.module.css';

export default function HeroScrollButton() {
  const { scrollYProgress } = useScroll();
  
  // Fade out early as the user starts scrolling down
  const opacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.08], [0, 20]);

  const scrollToNextSection = () => {
    // Find the next section after the hero
    const heroSection = document.querySelector('[class*="hero"]');
    if (heroSection && heroSection.nextElementSibling) {
      heroSection.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <motion.button 
      style={{ opacity, y }}
      className={styles.heroScrollBtn} 
      onClick={scrollToNextSection}
      aria-label="Scroll to next section"
    >
      <span className={styles.scrollText}>Scroll</span>
      <svg 
        className={styles.scrollChevron} 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </motion.button>
  );
}
