import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';

function getFingerprint() {
  let fp = localStorage.getItem('visitor_fp');
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem('visitor_fp', fp);
  }
  return fp;
}

export default function VisitTracker() {
  const location = useLocation();
  const lastRef = useRef('');

  useEffect(() => {
    const page = location.pathname;
    if (page === lastRef.current) return;
    lastRef.current = page;

    const data = {
      fingerprint: getFingerprint(),
      page,
      referrer: document.referrer || '',
      screenSize: `${window.innerWidth}x${window.innerHeight}`,
      language: navigator.language || '',
    };

    api.post('/visitor/log', data).catch(() => {});
  }, [location]);

  return null;
}
