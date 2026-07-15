'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import PromptSubmissionForm from '../components/PromptSubmissionForm';

export default function ContributePage() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');

  const loadAccount = useCallback(async (currentSession) => {
    setSession(currentSession);
    if (!currentSession?.user) {
      setProfile(null);
      setSubmissions([]);
      setLoading(false);
      return;
    }
    const [{ data: profileData }, { data: promptData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', currentSession.user.id).single(),
      supabase.from('prompts').select('*').eq('user_id', currentSession.user.id).order('created_at', { ascending: false }),
    ]);
    setProfile(profileData || null);
    setSubmissions(promptData || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => loadAccount(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => loadAccount(nextSession));
    return () => listener.subscription.unsubscribe();
  }, [loadAccount]);

  const handleAuth = async (event) => {
    event.preventDefault();
    setMessage('');
    if (authMode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName.trim() } } });
      setMessage(error ? `Error: ${error.message}` : 'Account created. Check your email, then wait for administrator approval.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(`Error: ${error.message}`);
    }
  };

  const deleteSubmission = async (item) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    const { error } = await supabase.from('prompts').delete().eq('id', item.id);
    if (!error && item.image_path) await supabase.storage.from('prompt-images').remove([item.image_path]);
    setMessage(error ? `Error: ${error.message}` : 'Submission deleted.');
    if (!error) setSubmissions((current) => current.filter((entry) => entry.id !== item.id));
  };

  if (loading) return <div className="state-panel">Loading contributor access...</div>;

  if (!session) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h1>{authMode === 'signup' ? 'Apply to contribute' : 'Contributor sign in'}</h1>
          <p>Approved contributors can submit original prompts for review. Submissions are never published automatically.</p>
          <form onSubmit={handleAuth}>
            {authMode === 'signup' && <label>Display name<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} required /></label>}
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
            <label>Password<input type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
            {message && <div className={message.startsWith('Error') ? 'form-error' : 'form-message'}>{message}</div>}
            <button className="primary-button">{authMode === 'signup' ? 'Create application' : 'Sign in'}</button>
          </form>
          <button className="text-button" onClick={() => { setAuthMode(authMode === 'signup' ? 'signin' : 'signup'); setMessage(''); }}>{authMode === 'signup' ? 'Already registered? Sign in' : 'New contributor? Apply here'}</button>
          <div className="auth-links"><Link href="/">Back to library</Link></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="state-panel"><h2>Contributor setup is not active yet.</h2><p>The administrator must run the launch SQL migration.</p><button onClick={() => supabase.auth.signOut()}>Sign out</button></div>;
  }

  if (!['contributor', 'admin'].includes(profile.role)) {
    return <div className="state-panel"><h2>Application awaiting approval</h2><p>You are signed in as {profile.email}. An administrator must approve this account before uploads are enabled.</p><button className="secondary-button" onClick={() => supabase.auth.signOut()}>Sign out</button></div>;
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-heading"><div><p className="eyebrow">Contributor workspace</p><h1>Submit a prompt</h1><p>Every submission is reviewed before publication.</p></div><button className="secondary-button" onClick={() => supabase.auth.signOut()}>Sign out</button></div>
      <section className="dashboard-card"><PromptSubmissionForm user={session.user} onComplete={(item) => setSubmissions((current) => [item, ...current])} /></section>
      <section className="dashboard-card"><h2>Your submissions</h2>{submissions.length === 0 ? <p>No submissions yet.</p> : <div className="management-list">{submissions.map((item) => <article key={item.id}><div><strong>{item.title}</strong><p>{item.model} · {item.status}</p>{item.rejection_reason && <p className="form-error">{item.rejection_reason}</p>}</div><div className="row-actions"><span className={`status-badge status-${item.status}`}>{item.status}</span>{['pending', 'rejected'].includes(item.status) && <><Link className="secondary-button small" href={`/contribute/edit/${item.id}`}>Edit</Link><button className="danger-button" onClick={() => deleteSubmission(item)}>Delete</button></>}</div></article>)}</div>}</section>
    </div>
  );
}
