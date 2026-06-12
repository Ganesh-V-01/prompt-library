'use client';
import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const accept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '16px',
      left: '16px',
      right: '16px',
      backgroundColor: 'var(--surface)',
      color: 'var(--text-primary)',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      zIndex: 9999,
      border: '1px solid var(--border)'
    }}>
      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.5 }}>
        We use essential cookies to make our site work. With your consent, we may also use non-essential cookies to improve user experience and analyze website traffic.
      </p>
      <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-end' }}>
        <button 
          onClick={accept}
          style={{ padding: '8px 16px', backgroundColor: 'var(--text-primary)', color: 'var(--background)', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem' }}>
          Accept All
        </button>
      </div>
    </div>
  );
}
