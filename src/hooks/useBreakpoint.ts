'use client';

import { useState, useEffect } from 'react';

import type { Breakpoints } from '../types/styles';

const breakpoints: Breakpoints = {
  mobile: '320px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1280px',
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('');
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const width = window.innerWidth;

      if (width < parseInt(breakpoints.tablet)) {
        setBreakpoint('mobile');
      } else if (width < parseInt(breakpoints.laptop)) {
        setBreakpoint('tablet');
      } else if (width < parseInt(breakpoints.desktop)) {
        setBreakpoint('laptop');
      } else {
        setBreakpoint('desktop');
      }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { breakpoint, dimensions };
};
