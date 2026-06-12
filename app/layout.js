import './globals.css';
import * as Sentry from '@sentry/nextjs';
import { PostHogProvider } from './providers';
import Sidebar from './components/Sidebar';
import MobileHeader from './components/MobileHeader';
import CookieBanner from './components/CookieBanner';
import Link from 'next/link';
import { Playfair_Display, DM_Sans, JetBrains_Mono } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' });

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
            <main className="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <div style={{ flex: 1 }}>
                {children}
              </div>
              <footer style={{ marginTop: 'auto', paddingTop: '40px', paddingBottom: '20px', borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'center', gap: '24px' }}>
                <Link href="/privacy" style={{ textDecoration: 'underline' }}>Privacy Policy</Link>
                <Link href="/terms" style={{ textDecoration: 'underline' }}>Terms of Service</Link>
                <a href="mailto:support@promptlibrary.com" style={{ textDecoration: 'underline' }}>Contact Us</a>
              </footer>
            </main>
            <CookieBanner />
          </div>
        </PostHogProvider>
      </body>
    </html>
  );
}
