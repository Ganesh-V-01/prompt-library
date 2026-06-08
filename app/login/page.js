'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('Successfully logged in!');
        // Redirect logic will go here
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: 'var(--space-md)' 
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '400px',
        padding: 'var(--space-lg)',
        borderRadius: '16px',
        boxShadow: '0 10px 42px rgba(0,0,0,0.5)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          marginBottom: 'var(--space-md)', 
          textAlign: 'center' 
        }}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h1>
        
        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
            />
          </div>

          {message && (
            <div style={{ 
              color: message.includes('Success') || message.includes('Check') ? '#10B981' : '#EF4444', 
              fontSize: '0.9rem',
              marginTop: '8px'
            }}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              marginTop: 'var(--space-sm)',
              padding: '14px',
              backgroundColor: 'var(--accent)',
              color: '#121212',
              fontWeight: 'bold',
              borderRadius: '8px',
              fontSize: '1rem',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(129,140,248,0.2)'
            }}>
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-md)', textAlign: 'center' }}>
          <button 
            onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
            style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}
