import './globals.css';

import * as Sentry from '@sentry/nextjs';
import { PostHogProvider } from './providers';

export async function generateMetadata() {
  return {
    title: 'PromptGram | The Ultimate AI Prompt Library',
    description: 'Copy, paste, and generate high-quality AI images instantly.',
    other: {
      ...Sentry.getTraceData()
    }
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
