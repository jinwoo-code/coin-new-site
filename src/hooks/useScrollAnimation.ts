import { useEffect, useRef, useState, useCallback } from 'react'; // useCallback 추가

// 화면에 특정 요소가 나타났는지 감지하는 훅
export const useScrollAnimation = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ★ 경고 해결 1: ref.current를 변수에 복사
    const node = ref.current; 
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (node) {
            observer.unobserve(node);
          }
        }
      },
      { threshold }
    );

    if (node) {
      observer.observe(node);
    }

    return () => {
      // ★ 경고 해결 1: 변수를 cleanup 함수에서 사용
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [threshold]);

  return [ref, isVisible] as const;
};

// 숫자가 부드럽게 올라가는 카운트업 효과 훅
export const useCountUp = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [ref, isVisible] = useScrollAnimation();
  
    const animateCount = useCallback(() => {
        let startTime: number;
        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          setCount(Math.floor(progress * end));
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);
    }, [end, duration]);
  
    useEffect(() => {
        if (isVisible) {
            animateCount();
        }
    }, [isVisible, animateCount]);
  
    return [ref, count] as const;
};