'use client';
 
import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
 
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
 
  return (
    <html>
      <body style={{ backgroundColor: '#0A0A0A', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Critical System Failure</h2>
        <p style={{ color: '#A1A1AA', marginBottom: '24px' }}>We have been notified and are looking into it.</p>
        <button
          onClick={() => reset()}
          style={{ padding: '12px 24px', backgroundColor: '#FFFFFF', color: '#000000', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
