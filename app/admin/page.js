'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import PromptSubmissionForm from '../components/PromptSubmissionForm';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState([]);
  const [published, setPublished] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadDashboard = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      router.replace('/login?next=/admin');
      return;
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
    if (profile?.role !== 'admin') {
      router.replace('/');
      return;
    }
    setUser(session.user);
    const [pendingResult, publishedResult, applicantsResult, contributorsResult] = await Promise.all([
      supabase.from('prompts').select('*').eq('status', 'pending').order('created_at'),
      supabase.from('prompts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(50),
      supabase.from('profiles').select('*').eq('role', 'viewer').order('created_at'),
      supabase.from('profiles').select('*').eq('role', 'contributor').order('display_name'),
    ]);
    setPending(pendingResult.data || []);
    setPublished(publishedResult.data || []);
    setApplicants(applicantsResult.data || []);
    setContributors(contributorsResult.data || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  const reviewPrompt = async (id, status) => {
    const rejectionReason = status === 'rejected' ? window.prompt('Reason for rejection:') : null;
    if (status === 'rejected' && !rejectionReason?.trim()) return;
    const { error } = await supabase.from('prompts').update({ status, rejection_reason: rejectionReason || null }).eq('id', id);
    setMessage(error ? `Error: ${error.message}` : `Submission ${status}.`);
    if (!error) loadDashboard();
  };

  const approveContributor = async (id) => {
    const { error } = await supabase.from('profiles').update({ role: 'contributor' }).eq('id', id);
    setMessage(error ? `Error: ${error.message}` : 'Contributor approved.');
    if (!error) loadDashboard();
  };

  const revokeContributor = async (id) => {
    if (!window.confirm('Remove contributor upload access?')) return;
    const { error } = await supabase.from('profiles').update({ role: 'viewer' }).eq('id', id);
    setMessage(error ? `Error: ${error.message}` : 'Contributor access removed.');
    if (!error) loadDashboard();
  };

  const toggleFeatured = async (item) => {
    const { error } = await supabase.from('prompts').update({ featured: !item.featured }).eq('id', item.id);
    setMessage(error ? `Error: ${error.message}` : 'Featured status updated.');
    if (!error) loadDashboard();
  };

  const deletePrompt = async (item) => {
    if (!window.confirm(`Delete “${item.title}” permanently?`)) return;
    const marker = '/prompt-images/';
    const imagePath = item.image_path || (item.image_url?.includes(marker) ? decodeURIComponent(item.image_url.split(marker)[1]) : null);
    const { error } = await supabase.from('prompts').delete().eq('id', item.id);
    if (!error && imagePath) await supabase.storage.from('prompt-images').remove([imagePath]);
    setMessage(error ? `Error: ${error.message}` : 'Prompt deleted.');
    if (!error) loadDashboard();
  };

  if (loading) return <div className="state-panel">Verifying administrator access...</div>;

  return (
    <div className="dashboard-shell">
      <div className="dashboard-heading"><div><p className="eyebrow">Administration</p><h1>Prompt Library control room</h1><p>Publish directly, review submissions, and approve contributors.</p></div><button className="secondary-button" onClick={() => supabase.auth.signOut().then(() => router.push('/'))}>Sign out</button></div>
      {message && <div className={message.startsWith('Error') ? 'form-error' : 'form-message'}>{message}</div>}

      <section className="dashboard-card"><h2>Publish a prompt</h2><PromptSubmissionForm user={user} publishDirect onComplete={loadDashboard} /></section>

      <section className="dashboard-card"><h2>Contributor applications</h2>{applicants.length === 0 ? <p>No applications waiting.</p> : <div className="management-list">{applicants.map((item) => <article key={item.id}><div><strong>{item.display_name || item.email}</strong><p>{item.email}</p></div><button className="primary-button small" onClick={() => approveContributor(item.id)}>Approve</button></article>)}</div>}</section>

      <section className="dashboard-card"><h2>Approved contributors</h2>{contributors.length === 0 ? <p>No contributors approved yet.</p> : <div className="management-list">{contributors.map((item) => <article key={item.id}><div><strong>{item.display_name || item.email}</strong><p>{item.email}</p></div><button className="danger-button" onClick={() => revokeContributor(item.id)}>Remove access</button></article>)}</div>}</section>

      <section className="dashboard-card"><h2>Pending submissions</h2>{pending.length === 0 ? <p>No submissions waiting.</p> : <div className="management-list">{pending.map((item) => <article key={item.id}><div><strong>{item.title}</strong><p>{item.model} · {item.creator_name || 'Uncredited'}</p></div><div className="row-actions"><button className="primary-button small" onClick={() => reviewPrompt(item.id, 'published')}>Publish</button><button className="danger-button" onClick={() => reviewPrompt(item.id, 'rejected')}>Reject</button></div></article>)}</div>}</section>

      <section className="dashboard-card"><h2>Published prompts</h2><div className="management-list">{published.map((item) => <article key={item.id}><div><strong>{item.title}</strong><p>{item.model} · {item.featured ? 'Featured' : 'Standard'}</p></div><div className="row-actions"><Link className="secondary-button small" href={`/admin/edit/${item.id}`}>Edit</Link><button className="secondary-button small" onClick={() => toggleFeatured(item)}>{item.featured ? 'Unfeature' : 'Feature'}</button><button className="danger-button" onClick={() => deletePrompt(item)}>Delete</button></div></article>)}</div></section>
    </div>
  );
}
