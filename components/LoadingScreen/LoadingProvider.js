'use client';

import { useState } from 'react';
import LoadingScreen from '@/components/LoadingScreen/LoadingScreen';

export default function LoadingProvider({ children }) {
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      {!isReady && <LoadingScreen onComplete={() => setIsReady(true)} />}
      {children}
    </>
  );
}
