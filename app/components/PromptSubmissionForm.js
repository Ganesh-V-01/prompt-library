'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { compressPromptImage, MODEL_OPTIONS, STYLE_OPTIONS, normalizeExternalUrl } from '@/utils/promptTools';

const initialForm = {
  title: '',
  prompt_text: '',
  prompt_type: 'image',
  model: MODEL_OPTIONS[0],
  style: STYLE_OPTIONS[0],
  creator_name: '',
  source_url: '',
  aspect_ratio: '',
  negative_prompt: '',
  notes: '',
};

export default function PromptSubmissionForm({ user, publishDirect = false, onComplete }) {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const update = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!user || !file || !form.title.trim() || !form.prompt_text.trim()) {
      setMessage('Image, title, and prompt are required.');
      return;
    }

    setSubmitting(true);
    setMessage('Optimizing image...');
    let uploadedPath = null;

    try {
      const optimized = await compressPromptImage(file);
      uploadedPath = `${user.id}/${optimized.name}`;
      setMessage('Uploading image...');

      const { error: uploadError } = await supabase.storage
        .from('prompt-images')
        .upload(uploadedPath, optimized, { contentType: 'image/webp', upsert: false });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('prompt-images').getPublicUrl(uploadedPath);
      const payload = {
        ...form,
        title: form.title.trim(),
        prompt_text: form.prompt_text.trim(),
        creator_name: form.creator_name.trim() || null,
        source_url: normalizeExternalUrl(form.source_url),
        aspect_ratio: form.aspect_ratio.trim() || null,
        negative_prompt: form.negative_prompt.trim() || null,
        notes: form.notes.trim() || null,
        image_url: urlData.publicUrl,
        image_path: uploadedPath,
        user_id: user.id,
        status: publishDirect ? 'published' : 'pending',
        rights_confirmed_at: new Date().toISOString(),
      };

      setMessage(publishDirect ? 'Publishing prompt...' : 'Submitting for review...');
      const { data, error: insertError } = await supabase
        .from('prompts')
        .insert(payload)
        .select()
        .single();
      if (insertError) throw insertError;

      setForm(initialForm);
      setFile(null);
      formElement.reset();
      setMessage(publishDirect ? 'Prompt published successfully.' : 'Submission sent for review.');
      onComplete?.(data);
    } catch (error) {
      if (uploadedPath) {
        await supabase.storage.from('prompt-images').remove([uploadedPath]);
      }
      setMessage(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 12px', border: '1px solid var(--border)',
    borderRadius: '8px', background: 'var(--background)', color: 'var(--text-primary)'
  };

  return (
    <form onSubmit={handleSubmit} className="submission-form">
      <div className="form-grid">
        <label>Title<input name="title" value={form.title} onChange={update} maxLength={120} required style={inputStyle} /></label>
        <label>Preview image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setFile(e.target.files?.[0] || null)} required style={inputStyle} /></label>
        <label>Prompt type<select name="prompt_type" value={form.prompt_type} onChange={update} style={inputStyle}><option value="image">Image prompt</option><option value="video">Video prompt</option></select></label>
        <label>AI model<select name="model" value={form.model} onChange={update} style={inputStyle}>{MODEL_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Style<select name="style" value={form.style} onChange={update} style={inputStyle}>{STYLE_OPTIONS.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Aspect ratio<input name="aspect_ratio" value={form.aspect_ratio} onChange={update} placeholder="16:9, 1:1..." style={inputStyle} /></label>
        <label>Creator name<input name="creator_name" value={form.creator_name} onChange={update} style={inputStyle} /></label>
        <label>Original source URL<input name="source_url" type="url" value={form.source_url} onChange={update} placeholder="https://..." style={inputStyle} /></label>
      </div>
      <label>Complete prompt<textarea name="prompt_text" value={form.prompt_text} onChange={update} rows={7} required style={inputStyle} /></label>
      <label>Negative prompt (optional)<textarea name="negative_prompt" value={form.negative_prompt} onChange={update} rows={3} style={inputStyle} /></label>
      <label>Usage notes (optional)<textarea name="notes" value={form.notes} onChange={update} rows={3} style={inputStyle} /></label>
      <label className="rights-confirmation"><input type="checkbox" required /> I created this content or have permission to submit and display it.</label>
      {message && <p className={message.startsWith('Error') ? 'form-error' : 'form-message'}>{message}</p>}
      <button type="submit" className="primary-button" disabled={submitting}>{submitting ? 'Working...' : publishDirect ? 'Publish prompt' : 'Submit for review'}</button>
    </form>
  );
}
