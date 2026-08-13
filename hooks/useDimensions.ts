import { useState, useEffect, RefObject } from 'react';

export const useDimensions = (ref: RefObject<HTMLElement>) => {
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const w = Math.max(rect.width, element.clientWidth, element.offsetWidth || 0);
      const h = Math.max(rect.height, element.clientHeight, element.offsetHeight || 0);
      if (w > 0 && h > 0) {
        setDimensions(prev => (prev.width === w && prev.height === h ? prev : { width: w, height: h }));
      }
    };

    measure();

    const resizeObserver = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          setDimensions({ width, height });
        } else {
          measure();
        }
      }
    });

    resizeObserver.observe(element);

    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
    };
  }, [ref]);

  return dimensions;
};

