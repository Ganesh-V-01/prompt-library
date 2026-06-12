import { supabase } from '@/utils/supabase';
import { Copy, Heart, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PromptCard from '../../components/PromptCard';

// This is a simple client component wrapper for the copy button logic
// Since the main page is a server component, we inline the interactivity.
import CopyButton from './CopyButton'; 

export default async function PromptDetail({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  // Try fetching the prompt
  const { data: prompt, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single();

  // If we don't have real DB data, use placeholder based on ID
  const item = prompt || {
    id: id,
    image_url: 'https://placehold.co/600x800/eeeeee/999999?text=Placeholder',
    prompt_text: 'A high fashion editorial, stark lighting, black and white. Captured on 35mm film.',
    model: 'Midjourney',
    title: `Prompt Entry #${id}`
  };

  const similarPlaceholders = [
    { id: 10, image_url: 'https://placehold.co/600x400/eeeeee/999999?text=Similar+1', prompt_text: 'Cinematic lighting, brutalist architecture.', model: 'ChatGPT' },
    { id: 11, image_url: 'https://placehold.co/400x600/eeeeee/999999?text=Similar+2', prompt_text: 'Cyberpunk street, rain, neon reflections.', model: 'Nanobanana' },
    { id: 12, image_url: 'https://placehold.co/600x600/eeeeee/999999?text=Similar+3', prompt_text: 'Minimalist product photography, soft shadows.', model: 'Seedance' },
  ];

  return (
    <>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '32px', color: 'var(--text-secondary)', fontWeight: 500 }}>
        <ArrowLeft size={16} /> Back to Library
      </Link>

      <div className="detail-container" style={{ display: 'flex', height: 'calc(100vh - 120px)', minHeight: '600px', gap: '40px', marginBottom: '64px' }}>
        
        {/* Left Side: Image (Strict bounds, object-fit contain) */}
        <div className="detail-image-wrapper" style={{ position: 'relative', flex: '1 1 60%', height: '100%', background: 'var(--surface-hover)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '16px', border: '1px solid var(--border)' }}>
          <Image 
            src={item.image_url} 
            alt={item.title} 
            fill
            style={{ objectFit: 'contain' }} 
            priority
          />
        </div>

        {/* Right Side: Prompt Details */}
        <div className="detail-right" style={{ flex: '1 1 40%', display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingRight: '16px' }}>
          <div style={{ alignSelf: 'flex-start', padding: '4px 8px', background: 'var(--text-primary)', color: 'var(--background)', fontSize: '0.75rem', fontWeight: 700, borderRadius: '4px', marginBottom: '16px', textTransform: 'uppercase' }}>
            {item.model}
          </div>
          
          <h1 className="detail-title">{item.title || `Entry #${id}`}</h1>
          
          <div className="detail-prompt" style={{ flexGrow: 1 }}>
            {item.prompt_text}
          </div>
          
          <div className="detail-actions" style={{ marginTop: 'auto', paddingTop: '24px' }}>
            <CopyButton textToCopy={item.prompt_text} />
            <button className="card-btn btn-heart" style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <Heart size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Similar Images Section */}
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        Similar Entries
      </h3>
      
      <div className="masonry-grid">
        {similarPlaceholders.map((p) => (
          <PromptCard 
            key={p.id}
            id={p.id}
            image={p.image_url}
            prompt={p.prompt_text}
            model={p.model}
            title={`Entry #${p.id}`}
          />
        ))}
      </div>
    </>
  );
}
