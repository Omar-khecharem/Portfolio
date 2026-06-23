import { useEffect } from 'react';

const AWAY_TITLE = 'Omar Khecharem — Portfolio';

export default function TabTitle() {
  useEffect(() => {
    const og = document.title;

    const handle = () => {
      document.title = document.hidden ? AWAY_TITLE : og;
    };

    document.addEventListener('visibilitychange', handle);
    return () => {
      document.removeEventListener('visibilitychange', handle);
      document.title = og;
    };
  }, []);

  return null;
}
