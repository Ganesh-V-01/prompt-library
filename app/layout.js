import './globals.css';

import * as Sentry from '@sentry/nextjs';
import { PostHogProvider } from './providers';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

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
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${jetbrains.variable}`}>
      <body>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
