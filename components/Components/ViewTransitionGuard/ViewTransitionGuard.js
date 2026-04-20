'use client';

import { ViewTransition } from 'react';
import { useEffect, useState } from 'react';

/**
 * Wraps <ViewTransition> and suppresses the "document hidden" InvalidStateError
 * by checking document.visibilityState before allowing the transition to mount.
 * The children always render — only the animation is suppressed when hidden.
 */
export default function ViewTransitionGuard({ children, ...props }) {
  const [visible, setVisible] = useState(
    () => typeof document !== 'undefined' && document.visibilityState === 'visible'
  );

  useEffect(() => {
    const handleVisibility = () => {
      setVisible(document.visibilityState === 'visible');
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  // If not visible, we skip the ViewTransition wrapper entirely.
  // This prevents React from calling startViewTransition() which would fail.
  if (!visible) {
    return <>{children}</>;
  }

  return <ViewTransition {...props}>{children}</ViewTransition>;
}
