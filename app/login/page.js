'use client';
import { useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Sign up successful! You are now logged in.');
        router.push('/admin');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      } else {
        router.push('/admin');
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-hover)' }}>
      <div style={{ background: 'var(--background)', padding: '48px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid var(--border)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <BookOpen size={48} />
        </div>
        
        <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
          {isSignUp ? 'Create an Account' : 'Welcome back'}
        </h1>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
          {isSignUp ? 'Sign up for Prompt Library' : 'Sign in to Prompt Library'}
        </p>

        {error && <div style={{ color: '#EF4444', textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
        {message && <div style={{ color: '#10B981', textAlign: 'center', marginBottom: '16px', fontSize: '0.9rem' }}>{message}</div>}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none', background: 'transparent' }} 
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.95rem', outline: 'none', background: 'transparent' }} 
              required
            />
          </div>
          
          <button type="submit" disabled={loading} style={{ background: 'var(--text-primary)', color: 'var(--background)', padding: '12px', borderRadius: '6px', fontWeight: 600, fontSize: '1rem', marginTop: '8px', cursor: 'pointer', border: 'none', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setError(null); setMessage(null); }} 
            style={{ color: 'var(--text-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginLeft: '4px' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
