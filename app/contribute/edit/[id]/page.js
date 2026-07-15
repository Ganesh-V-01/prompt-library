'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import PromptEditForm from '../../../components/PromptEditForm';

export default function ContributorEditPrompt() {
  const { id } = useParams();
  const router = useRouter();
  const [item, setItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace('/contribute');
      const { data, error: queryError } = await supabase.from('prompts').select('*').eq('id', id).eq('user_id', session.user.id).in('status', ['pending', 'rejected']).single();
      if (queryError) setError(queryError.message); else setItem(data);
    };
    load();
  }, [id, router]);

  if (error) return <div className="state-panel"><h2>Submission cannot be edited</h2><p>{error}</p></div>;
  if (!item) return <div className="state-panel">Loading submission...</div>;
  return <div className="dashboard-shell"><div className="dashboard-heading"><div><p className="eyebrow">Contributor workspace</p><h1>Edit submission</h1></div></div><section className="dashboard-card"><PromptEditForm item={item} /></section></div>;
}
