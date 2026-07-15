'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import PromptEditForm from '../../../components/PromptEditForm';

export default function AdminEditPrompt() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace('/login?next=/admin');
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role !== 'admin') return router.replace('/');
      const { data, error: queryError } = await supabase.from('prompts').select('*').eq('id', id).single();
      if (queryError) setError(queryError.message); else setItem(data);
    };
    load();
  }, [id, router]);

  if (error) return <div className="state-panel"><h2>Prompt could not be loaded</h2><p>{error}</p></div>;
  if (!item) return <div className="state-panel">Loading prompt...</div>;
  return <div className="dashboard-shell"><div className="dashboard-heading"><div><p className="eyebrow">Administration</p><h1>Edit prompt</h1></div></div><section className="dashboard-card"><PromptEditForm item={item} admin /></section></div>;
}
