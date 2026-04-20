'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * HeroParallax component
 * 
 * Provides scroll-driven parallax and fade effects for Hero content.
 * It expects to be placed inside a container that defines the scroll height.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The content to animate
 * @param {string} props.className - Additional classes
 */
export default function HeroParallax({ children, className }) {
  const containerRef = useRef(null);
  
  // Track scroll progress of this container
  // We use the parent or a custom target if needed, but here we'll assume 
  // it's measuring against the viewport.
  const { scrollYProgress } = useScroll();

  // Animations specifically for the Hero (0 to ~0.4 scroll progress of the whole page)
  // We can refine this to be more local if we pass a target.
  // Given the Hero is at the top, scrollYProgress starting at 0 is correct.
  
  // Narrative moves slightly faster/slower for parallax feel
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -60]);
  
  // Fade out as we approach the snap point
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  
  // Scale down slightly for a "receding" feel
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <motion.div 
      style={{ y, opacity, scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
