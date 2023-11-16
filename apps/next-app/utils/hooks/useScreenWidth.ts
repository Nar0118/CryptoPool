import { useState, useEffect, useCallback } from 'react';

const useScreenWidth = () => {
  const [screenWidth, setScreenWidth] = useState<number>(-1);

  const onScreenResize = useCallback(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if ('undefined' === typeof window) {
      return;
    }

    onScreenResize();

    window.addEventListener('resize', onScreenResize);
    return () => {
      window.removeEventListener('resize', onScreenResize);
    };
  }, []);

  return { screenWidth, isServerSide: 'undefined' === typeof window };
};

export default useScreenWidth;
