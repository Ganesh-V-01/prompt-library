'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Search, Clock, Heart, BookOpen, Upload } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value;
    setIsSearchOpen(false);
    router.push(`/?q=${encodeURIComponent(q)}`);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header" style={{ marginBottom: '32px' }}>
        <Link href="/" className="logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <BookOpen style={{ marginRight: '10px' }} size={24} /> 
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Prompt Library</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link href="/" className="nav-item active">
          <Home className="icon" /> Home
        </Link>
        
        <button onClick={() => setIsSearchOpen(true)} className="nav-item" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer' }}>
          <Search className="icon" /> Search
        </button>

        <Link href="/?filter=History" className="nav-item">
          <Clock className="icon" /> History
        </Link>
        <Link href="/?filter=Favorites" className="nav-item">
          <Heart className="icon" /> Favorites
        </Link>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
        <Link href="/contribute" className="nav-item" style={{ color: 'var(--text-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', background: 'var(--surface-hover)' }}>
          <Upload className="icon" style={{ width: '18px', height: '18px' }} /> Contribute
        </Link>
      </div>

      {isSearchOpen && (
        <div 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 9999, display: 'flex', justifyContent: 'center', paddingTop: '15vh', backdropFilter: 'blur(2px)' }}
          onClick={() => setIsSearchOpen(false)}
        >
          <form 
            onSubmit={handleSearch} 
            onClick={e => e.stopPropagation()} 
            style={{ background: 'var(--background)', width: '90%', maxWidth: '600px', height: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 24px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid var(--border)' }}
          >
            <Search size={24} color="var(--text-secondary)" />
            <input 
              name="search" 
              autoFocus 
              placeholder="Search all prompts..." 
              style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1.1rem', marginLeft: '16px', color: 'var(--text-primary)' }} 
            />
          </form>
        </div>
      )}
    </aside>
  );
}
