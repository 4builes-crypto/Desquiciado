import { useState, useEffect } from 'react';

export function useDeviceDetect() {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDevice('mobile');
      } else if (width >= 768 && width < 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    // Also check userAgent as a progressive enhancement
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent = /iphone|ipad|ipod|android/i.test(userAgent);

    if (isMobileUserAgent && window.innerWidth < 1024) {
      handleResize(); // Fallback to resize logic for mobile/tablet differentiation
    } else {
      handleResize();
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile: device === 'mobile', isTablet: device === 'tablet', isDesktop: device === 'desktop', device };
}
