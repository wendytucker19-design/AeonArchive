'use client';

import { useEffect, useState } from 'react';

let cachedSupport: boolean | null = null;

export default function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(cachedSupport);

  useEffect(() => {
    if (cachedSupport === null) {
      try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl2');
        cachedSupport = Boolean(context);
        context?.getExtension('WEBGL_lose_context')?.loseContext();
      } catch {
        cachedSupport = false;
      }
    }
    setSupported(cachedSupport);
  }, []);

  return supported;
}
