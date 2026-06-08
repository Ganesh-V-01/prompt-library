import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-hover)' }}>
      <div style={{ background: 'var(--background)', padding: '48px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid var(--border)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <BookOpen size={48} />
        </div>
        
        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Welcome back</h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>Sign in to Prompt Library</p>

        <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Email</label>
            <input type="email" placeholder="you@example.com" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Password</label>
            <input type="password" placeholder="••••••••" style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none' }} />
          </div>
          
          <button type="submit" style={{ background: 'var(--text-primary)', color: 'var(--background)', padding: '12px', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', marginTop: '8px', cursor: 'pointer', border: 'none' }}>
            Sign In
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link href="/" style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Sign up</Link>
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
