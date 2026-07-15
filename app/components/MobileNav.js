'use client';
import { useState, Suspense } from 'react';
import { Search, MoreVertical, BookOpen, X, Upload, Clock, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function MobileNavContent() {
  const [isSearching, setIsSearching] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value;
    setIsSearching(false);
    router.push(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="mobile-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', height: '64px', background: 'transparent' }}>
      {isSearching ? (
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '8px', background: 'var(--surface-hover)', borderRadius: '8px', padding: '0 12px', height: '40px' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input 
            name="search" 
            autoFocus 
            placeholder="Search prompts..." 
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: '0.95rem', color: 'var(--text-primary)' }} 
          />
          <button type="button" onClick={() => setIsSearching(false)} style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <X size={18} color="var(--text-secondary)" />
          </button>
        </form>
      ) : (
        <>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-primary)' }}>
            <BookOpen size={24} />
            <span className="mobile-logo" style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>Prompt Library</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setIsSearching(true)} style={{ background: 'transparent', border: 'none', display: 'flex', cursor: 'pointer' }}>
              <Search size={22} color="var(--text-primary)" />
            </button>
            
            <div style={{ position: 'relative', display: 'flex' }}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'transparent', border: 'none', display: 'flex', cursor: 'pointer' }}>
                <MoreVertical size={22} color="var(--text-primary)" />
              </button>
              {isMenuOpen && (
                <>
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 90 }} onClick={() => setIsMenuOpen(false)} />
                  <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '16px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', flexDirection: 'column', width: '200px', overflow: 'hidden' }}>
                    <Link href="/contribute" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', fontWeight: 500, textDecoration: 'none' }}><Upload size={18} /> Contribute</Link>
                    <Link href="/?filter=History" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', fontSize: '0.95rem', color: 'var(--text-primary)', borderBottom: '1px solid var(--border)', fontWeight: 500, textDecoration: 'none' }}><Clock size={18} /> History</Link>
                    <Link href="/?filter=Favorites" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: 500, textDecoration: 'none' }}><Heart size={18} /> Favorites</Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function MobileNav() {
  return (
    <Suspense fallback={<div className="mobile-topbar" style={{ height: '64px' }} />}>
      <MobileNavContent />
    </Suspense>
  );
}
