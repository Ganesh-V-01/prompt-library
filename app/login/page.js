'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) setError(authError.message);
    else {
      const next = new URLSearchParams(window.location.search).get('next');
      router.push(next || '/admin');
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <BookOpen size={44} />
        <h1>Team sign in</h1>
        <p>For approved administrators and contributors.</p>
        {error && <div className="form-error">{error}</div>}
        <form onSubmit={handleAuth}>
          <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <div className="auth-links"><Link href="/reset-password">Forgot password?</Link></div>
          <button className="primary-button" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <div className="auth-links"><a href="https://forms.gle/yzY4CSvBCjGbjoEE6" target="_blank" rel="noopener noreferrer">Apply to contribute</a><Link href="/">Back to library</Link></div>
      </div>
    </div>
  );
}
