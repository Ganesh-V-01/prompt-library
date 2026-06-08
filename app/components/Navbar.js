import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="glass" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          Prompt<span style={{ color: 'var(--accent)' }}>Gram</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Explore</button>
          <button style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Models</button>
        </div>
        <div>
          <Link href="/login">
            <button style={{ 
              background: 'var(--accent)', 
              color: '#121212', 
              padding: '8px 16px', 
              borderRadius: '6px',
              fontWeight: 'bold',
              transition: 'background 0.2s',
              boxShadow: '0 4px 16px rgba(129,140,248,0.2)'
            }}>
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
