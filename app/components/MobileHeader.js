'use client';
import { useScrollDirection } from '@/utils/useScrollDirection';
import MobileNav from './MobileNav';
import TopFilterBar from './TopFilterBar';
import { usePathname } from 'next/navigation';

export default function MobileHeader() {
  const scrollDirection = useScrollDirection();
  const pathname = usePathname();
  
  return (
    <div className={`mobile-nav-container ${scrollDirection === 'down' ? 'hidden' : ''}`}>
      <MobileNav />
      {pathname === '/' && (
        <div className="mobile-only-filter">
          <TopFilterBar />
        </div>
      )}
    </div>
  );
}
