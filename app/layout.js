import './globals.css';
import * as Sentry from '@sentry/nextjs';
import { PostHogProvider } from './providers';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';

export async function generateMetadata() {
  return {
    title: 'Prompt Library | Clean & Minimal',
    description: 'Discover and copy high-quality AI prompts.',
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
          <div className="app-layout">
            <MobileHeader />
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}
