'use client';
 
import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
 
export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);
 
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Something went wrong!</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
        We couldn't load this part of the page. The issue has been reported.
      </p>
      <button
        onClick={() => reset()}
        style={{ padding: '10px 20px', backgroundColor: 'var(--text-primary)', color: 'var(--background)', borderRadius: '6px', fontWeight: 'bold' }}
      >
        Try again
      </button>
    </div>
  );
}
