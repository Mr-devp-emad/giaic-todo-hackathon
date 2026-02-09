'use client';

import { useEffect, useState } from 'react';

interface GSAPInstance {
  gsap: any;
  ScrollTrigger: any;
}

/**
 * Custom hook to dynamically load GSAP and ScrollTrigger from CDN
 * Ensures compatibility and prevents SSR issues
 */
export function useGSAP(): GSAPInstance | null {
  const [gsapInstance, setGsapInstance] = useState<GSAPInstance | null>(null);

  useEffect(() => {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const windowAny = window as any;
    // Check if already loaded
    if (typeof window !== 'undefined' && windowAny.gsap) {
      const gsap = windowAny.gsap;
      const ScrollTrigger = windowAny.ScrollTrigger;
      // Defer to avoid synchronous setState during render
      setTimeout(() => {
        setGsapInstance({ gsap, ScrollTrigger });
      }, 0);
      return;
    }

    // Load GSAP
    const gsapScript = document.createElement('script');
    gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    gsapScript.async = true;

    // Load ScrollTrigger
    const scrollTriggerScript = document.createElement('script');
    scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
    scrollTriggerScript.async = true;

    let gsapLoaded = false;
    let scrollTriggerLoaded = false;

    const checkBothLoaded = () => {
      if (gsapLoaded && scrollTriggerLoaded && windowAny.gsap) {
        const gsap = windowAny.gsap;
        const ScrollTrigger = windowAny.ScrollTrigger;
        
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        setGsapInstance({ gsap, ScrollTrigger });
      }
    };

    gsapScript.onload = () => {
      gsapLoaded = true;
      checkBothLoaded();
    };

    scrollTriggerScript.onload = () => {
      scrollTriggerLoaded = true;
      checkBothLoaded();
    };

    document.body.appendChild(gsapScript);
    document.body.appendChild(scrollTriggerScript);

    return () => {
      // Cleanup if needed
      if (gsapScript.parentNode) {
        gsapScript.parentNode.removeChild(gsapScript);
      }
      if (scrollTriggerScript.parentNode) {
        scrollTriggerScript.parentNode.removeChild(scrollTriggerScript);
      }
    };
  }, []);

  return gsapInstance;
}
