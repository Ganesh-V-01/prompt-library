'use client';
import posthog from 'posthog-js';
import { PostHogProvider as CSPostHogProvider } from 'posthog-js/react';
import { useEffect } from 'react';

export function PostHogProvider({ children }) {
  useEffect(() => {
    const initialize = () => {
      const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      if (
        typeof window === 'undefined' ||
        !key ||
        localStorage.getItem('analytics-consent') !== 'accepted' ||
        posthog.__loaded
      ) return;

      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
        persistence: 'localStorage+cookie',
      });
    };

    initialize();
    window.addEventListener('analyticsConsentUpdated', initialize);
    return () => window.removeEventListener('analyticsConsentUpdated', initialize);
  }, []);

  return <CSPostHogProvider client={posthog}>{children}</CSPostHogProvider>;
}
