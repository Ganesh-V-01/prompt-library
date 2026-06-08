'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Clock, Heart, BookOpen } from 'lucide-react';

export default function FloatingActionBar() {
  const pathname = usePathname();

  return (
    <nav className="mobile-nav" style={{ 
      display: 'flex', justifyContent: 'space-around', alignItems: 'center', 
      background: 'var(--surface)', borderTop: '1px solid var(--border)', 
      padding: '12px 0', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 
    }}>
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: pathname === '/' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
        <Home size={22} />
        <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Home</span>
      </Link>
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--text-secondary)' }}>
        <BookOpen size={22} />
        <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Explore</span>
      </Link>
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--text-secondary)' }}>
        <Clock size={22} />
        <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>History</span>
      </Link>
      <Link href="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'var(--text-secondary)' }}>
        <Heart size={22} />
        <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Favorites</span>
      </Link>
    </nav>
  );
}
