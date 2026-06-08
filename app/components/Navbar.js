'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      style={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(10, 10, 10, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px' }}>
        
        {/* Logo */}
        <Link href="/">
          <div style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.75rem', 
            fontWeight: '600', 
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)' 
          }}>
            Prompt<span style={{ color: 'var(--accent-gold)' }}>Gram</span>
          </div>
        </Link>

        {/* Center Links */}
        <div style={{ display: 'flex', gap: '32px' }}>
          <Link href="/"><span style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 500, opacity: 0.9 }}>Explore</span></Link>
          <Link href="/"><span style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500, transition: 'color 0.2s' }}>Models</span></Link>
          <Link href="/admin"><span style={{ color: 'var(--text-secondary)', fontSize: '15px', fontWeight: 500, transition: 'color 0.2s' }}>Submit</span></Link>
        </div>

        {/* Right Action */}
        <div>
          <Link href="/login">
            <button style={{ 
              background: 'transparent',
              color: 'var(--accent-gold)', 
              border: '1px solid var(--accent-gold-dim)',
              padding: '10px 24px', 
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-gold)';
              e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-gold-dim)';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            >
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
