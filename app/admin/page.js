'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [promptText, setPromptText] = useState('');
  const [model, setModel] = useState('NanoBanana');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkUser();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !promptText) {
      setMessage('Please select a file and enter a prompt.');
      return;
    }
    
    setUploading(true);
    setMessage('Uploading image...');

    try {
      // 1. Upload Image to Storage Bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('prompt-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('prompt-images')
        .getPublicUrl(filePath);

      setMessage('Saving to database...');

      // 3. Insert into Prompts Table
      const { error: dbError } = await supabase
        .from('prompts')
        .insert([
          {
            prompt_text: promptText,
            model: model,
            image_url: publicUrl,
            user_id: user.id
          }
        ]);

      if (dbError) throw dbError;

      setMessage('Success! Prompt published to feed.');
      setPromptText('');
      setFile(null);
      document.getElementById('file-upload').value = '';
      
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>Loading...</div>;
  if (!user) return <div style={{ color: 'white', padding: '50px', textAlign: 'center' }}>Access Denied. You must be logged in.</div>;

  return (
    <div style={{ padding: 'var(--space-lg)', maxWidth: '600px', margin: '0 auto', minHeight: '100vh' }}>
      <div className="glass" style={{ padding: 'var(--space-lg)', borderRadius: '16px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>Upload new AI prompts to the global feed.</p>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Select Image</label>
            <input 
              id="file-upload"
              type="file" 
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ color: 'white' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>AI Model</label>
            <select 
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="NanoBanana">NanoBanana</option>
              <option value="ChatGPT / DALL-E">ChatGPT / DALL-E</option>
              <option value="Midjourney v6">Midjourney v6</option>
              <option value="Stable Diffusion">Stable Diffusion</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Prompt Text (Hidden on Feed)</label>
            <textarea 
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>

          {message && (
            <div style={{ color: message.includes('Success') ? '#10B981' : 'var(--accent)', fontWeight: 'bold' }}>
              {message}
            </div>
          )}

          <button 
            type="submit" 
            disabled={uploading}
            style={{
              padding: '16px',
              backgroundColor: 'var(--accent)',
              color: '#121212',
              fontWeight: 'bold',
              borderRadius: '10px',
              fontSize: '1rem',
              textTransform: 'uppercase',
              opacity: uploading ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 16px rgba(129,140,248,0.2)'
            }}>
            {uploading ? 'Publishing...' : 'Publish to Feed'}
          </button>
        </form>
      </div>
    </div>
  );
}
