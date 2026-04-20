'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * ScrollReset component ensures that the window scroll position is reset to the top
 * whenever the pathname changes. This reinforces Next.js's default behavior,
 * which can sometimes be interfered with by View Transitions or Scroll Snapping.
 */
export default function ScrollReset() {
  const pathname = usePathname();

  useIsomorphicLayoutEffect(() => {
    // We use an instant scroll for page changes to avoid seeing the previous page scroll.
    // The same-page smooth scroll is handled by the Navbar component itself.
    const originalStyle = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto'; // Force instant behavior
    
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Restore original smooth scroll behavior immediately after
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = originalStyle;
      // Fallback reset in case browser restores scroll after paint
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }, [pathname]);

  return null;
}
