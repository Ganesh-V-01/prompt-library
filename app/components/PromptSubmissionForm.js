'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import {
  ACCEPTED_IMAGE_TYPES,
  compressPromptImage,
  IMAGE_FILE_ACCEPT,
  MODEL_OPTIONS,
  STYLE_OPTIONS,
  normalizeExternalUrl,
  validatePromptImage,
} from '@/utils/promptTools';

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

  const rejectFileSelection = (input, reason) => {
    input.value = '';
    setFile(null);
    setMessage(`Error: ${reason}`);
  };

  const handleFileChange = (event) => {
    const input = event.currentTarget;
    const selectedFiles = Array.from(input.files || []);
    if (selectedFiles.length === 0) {
      setFile(null);
      return;
    }
    if (selectedFiles.length !== 1) {
      rejectFileSelection(input, 'Choose exactly one image. Folders are not supported.');
      return;
    }

    const selectedFile = selectedFiles[0];
    const validationError = validatePromptImage(selectedFile);
    if (validationError) {
      rejectFileSelection(input, validationError);
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleFileDrop = (event) => {
    const input = event.currentTarget;
    const droppedItems = Array.from(event.dataTransfer?.items || []);
    const fileItems = droppedItems.filter((item) => item.kind === 'file');
    const containsDirectory = fileItems.some((item) => item.webkitGetAsEntry?.()?.isDirectory);
    const containsUnsupportedFile = fileItems.some(
      (item) => item.type && !ACCEPTED_IMAGE_TYPES.includes(item.type),
    );

    if (containsDirectory || fileItems.length !== 1) {
      event.preventDefault();
      rejectFileSelection(input, 'Choose exactly one image. Folders are not supported.');
    } else if (containsUnsupportedFile) {
      event.preventDefault();
      rejectFileSelection(input, 'Only JPG, PNG, or WebP images are allowed. Videos are not supported.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!user || !file || !form.title.trim() || !form.prompt_text.trim()) {
      setMessage('Image, title, and prompt are required.');
      return;
    }
    const validationError = validatePromptImage(file);
    if (validationError) {
      setFile(null);
      setMessage(`Error: ${validationError}`);
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
        <label>
          Preview image
          <input
            type="file"
            accept={IMAGE_FILE_ACCEPT}
            multiple={false}
            onChange={handleFileChange}
            onDrop={handleFileDrop}
            required
            style={inputStyle}
          />
          <small>JPG, PNG, or WebP only. Videos and folders are rejected. Images are optimized before upload.</small>
        </label>
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
