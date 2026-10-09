import { useRef, useState, useEffect } from "react";

/**
 * Whether the element is in view. By default it latches: true from the first
 * time it enters, for one-shot entrances. `once: false` tracks it both ways,
 * for things that should stop when scrolled away.
 */
export function useInView(threshold = 0.3, rootMargin = "0px", once = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}
