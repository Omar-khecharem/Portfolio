import { useEffect, useRef } from 'react';

export default function TabTitle() {
  const originalRef = useRef('');

  useEffect(() => {
    const og = document.title;
    originalRef.current = og;

    const handle = () => {
      document.title = document.hidden ? '👋 Come to our website' : og;
    };

    document.addEventListener('visibilitychange', handle);
    return () => {
      document.removeEventListener('visibilitychange', handle);
      document.title = og;
    };
  }, []);

  return null;
}
