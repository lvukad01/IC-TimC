import { useEffect, useRef } from 'react';

const useHorizontalScroll = () => {
  const ref = useRef<HTMLDivElement>(null);

  const onWheel = (e: WheelEvent) => {
    if (ref.current) {
      ref.current.scrollLeft += e.deltaY;
      e.preventDefault();
    }
  };

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
  }, []);

  return ref;
};

export default useHorizontalScroll;
