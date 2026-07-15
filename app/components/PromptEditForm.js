'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { MODEL_OPTIONS, STYLE_OPTIONS, normalizeExternalUrl } from '@/utils/promptTools';

export default function PromptEditForm({ item, admin = false }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: item.title || '',
    prompt_text: item.prompt_text || '',
    prompt_type: item.prompt_type || 'image',
    model: item.model || MODEL_OPTIONS[0],
    style: item.style || STYLE_OPTIONS[0],
    creator_name: item.creator_name || '',
    source_url: item.source_url || '',
    aspect_ratio: item.aspect_ratio || '',
    negative_prompt: item.negative_prompt || '',
    notes: item.notes || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const inputStyle = { width: '100%', padding: '11px 12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'var(--background)', color: 'var(--text-primary)' };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        prompt_text: form.prompt_text.trim(),
        creator_name: form.creator_name.trim() || null,
        source_url: normalizeExternalUrl(form.source_url),
        aspect_ratio: form.aspect_ratio.trim() || null,
        negative_prompt: form.negative_prompt.trim() || null,
        notes: form.notes.trim() || null,
        ...(!admin ? { status: 'pending', rejection_reason: null } : {}),
      };
      const { error } = await supabase.from('prompts').update(payload).eq('id', item.id);
      if (error) throw error;
      setMessage(admin ? 'Prompt updated.' : 'Changes submitted for review.');
      setTimeout(() => router.push(admin ? '/admin' : '/contribute'), 800);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="submission-form">
      <div className="form-grid">
        <label>Title<input name="title" value={form.title} onChange={update} required style={inputStyle} /></label>
        <label>Prompt type<select name="prompt_type" value={form.prompt_type} onChange={update} style={inputStyle}><option value="image">Image prompt</option><option value="video">Video prompt</option></select></label>
        <label>AI model<select name="model" value={form.model} onChange={update} style={inputStyle}>{MODEL_OPTIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Style<select name="style" value={form.style} onChange={update} style={inputStyle}>{STYLE_OPTIONS.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label>Creator name<input name="creator_name" value={form.creator_name} onChange={update} style={inputStyle} /></label>
        <label>Source URL<input type="url" name="source_url" value={form.source_url} onChange={update} style={inputStyle} /></label>
        <label>Aspect ratio<input name="aspect_ratio" value={form.aspect_ratio} onChange={update} style={inputStyle} /></label>
      </div>
      <label>Complete prompt<textarea name="prompt_text" value={form.prompt_text} onChange={update} rows={7} required style={inputStyle} /></label>
      <label>Negative prompt<textarea name="negative_prompt" value={form.negative_prompt} onChange={update} rows={3} style={inputStyle} /></label>
      <label>Usage notes<textarea name="notes" value={form.notes} onChange={update} rows={3} style={inputStyle} /></label>
      {message && <div className={message.startsWith('Error') ? 'form-error' : 'form-message'}>{message}</div>}
      <div className="row-actions"><button className="primary-button" disabled={saving}>{saving ? 'Saving...' : admin ? 'Save changes' : 'Resubmit changes'}</button><button type="button" className="secondary-button" onClick={() => router.back()}>Cancel</button></div>
    </form>
  );
}
