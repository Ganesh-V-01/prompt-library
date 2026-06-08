'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

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
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-base)' }}>
      
      {/* Left Panel - Editorial Branding */}
      <div style={{
        flex: 1,
        backgroundColor: '#050505',
        borderRight: '1px solid var(--border)',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
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

        {/* Quote */}
        <div style={{ maxWidth: '400px' }}>
          <h2 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '36px', 
            lineHeight: '1.2', 
            marginBottom: '16px',
            color: 'var(--text-primary)'
          }}>
            "The right words<br/>can create worlds."
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', fontFamily: 'var(--font-body)' }}>
            Join the definitive library of prompts for next-generation AI models.
          </p>
        </div>
        <div /> {/* Spacer */}
      </div>

      {/* Right Panel - Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <h1 style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '32px', 
            marginBottom: '8px',
            color: 'var(--text-primary)' 
          }}>
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '32px' }}>
            {isSignUp ? 'Enter your details below to create your account.' : 'Enter your details below to log into your account.'}
          </p>

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  color: 'var(--text-primary)',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                  fontFamily: 'var(--font-body)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-gold)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {message && (
              <div style={{ 
                color: message.includes('Success') || message.includes('Check') ? '#10A37F' : '#EF4444', 
                fontSize: '13px',
                marginTop: '-8px'
              }}>
                {message}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--accent-gold)',
                color: 'var(--bg-base)',
                fontWeight: '600',
                borderRadius: '4px',
                fontSize: '14px',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.2s ease',
                marginTop: '8px'
              }}>
              {loading ? 'Processing...' : (isSignUp ? 'Continue' : 'Continue')}
            </button>
            
            <button 
              type="button"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
                fontWeight: '500',
                borderRadius: '4px',
                fontSize: '14px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              Or continue with Google
            </button>
          </form>

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setMessage(''); }}
              style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
