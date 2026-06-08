import Navbar from '@/app/components/Navbar';
import PromptCard from '@/app/components/PromptCard';
import { supabase } from '@/utils/supabase';
import Link from 'next/link';

export const revalidate = 10;

export default async function PromptPage({ params }) {
  const { id } = params;
  
  // To avoid errors if 'id' isn't an integer UUID, we'll fetch all prompts and pick one 
  // (In a real scenario, you'd fetch by ID directly)
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });

  // Fallback if not found (using index as ID for now since we mapped indices in the grid)
  const promptData = prompts?.[parseInt(id) || 0] || prompts?.[0];

  const getModelColor = (model) => {
    if (model?.toLowerCase() === 'nanobanana') return 'var(--model-nano)';
    if (model?.toLowerCase() === 'chatgpt') return 'var(--model-gpt)';
    if (model?.toLowerCase() === 'midjourney') return 'var(--model-mj)';
    return 'var(--text-secondary)';
  };

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingTop: '60px', paddingBottom: '120px' }}>
        
        {/* Back Button */}
        <Link href="/">
          <div style={{ 
            display: 'inline-block',
            marginBottom: '40px', 
            color: 'var(--text-secondary)',
            fontSize: '13px',
            textDecoration: 'none',
            borderBottom: '1px solid transparent',
            transition: 'all 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            ← Back to Explore
          </div>
        </Link>

        {!promptData ? (
          <h1 style={{ color: 'var(--text-secondary)' }}>Prompt not found.</h1>
        ) : (
          <div style={{ display: 'flex', gap: '60px', flexWrap: 'wrap' }}>
            
            {/* Main Column */}
            <div style={{ flex: '1 1 600px' }}>
              
              {/* Header Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '12px',
                  fontWeight: '500',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: getModelColor(promptData.model) 
                  }} />
                  {promptData.model || 'Model'}
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Photography</span>
              </div>

              <h1 style={{ fontSize: '42px', marginBottom: '40px', lineHeight: '1.2' }}>
                Cinematic Portrait <br/>Lighting Setup
              </h1>

              {/* Terminal Block */}
              <div style={{
                backgroundColor: '#0D0D0D',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '60px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--border)',
                  backgroundColor: 'var(--bg-surface)'
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    prompt.txt
                  </span>
                  <button style={{
                    color: 'var(--accent-gold)',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Copy Raw
                  </button>
                </div>
                
                <div style={{ display: 'flex', padding: '24px 0', fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.6' }}>
                  <div style={{ 
                    padding: '0 20px', 
                    color: 'var(--text-dim)', 
                    textAlign: 'right',
                    userSelect: 'none',
                    borderRight: '1px solid var(--border)'
                  }}>
                    1<br/>2<br/>3<br/>4
                  </div>
                  <div style={{ padding: '0 20px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                    {promptData.prompt_text}
                  </div>
                </div>
              </div>

              {/* Variations */}
              <div>
                <h3 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                  Variations
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                  {prompts && prompts.slice(0, 3).map((p, idx) => (
                    <PromptCard key={p.id} image={p.image_url} prompt={p.prompt_text} model={p.model} index={idx} />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Column (Image) */}
            <div style={{ flex: '0 1 400px' }}>
              <div style={{
                position: 'sticky',
                top: '120px',
                width: '100%',
                aspectRatio: '1 / 1.2',
                backgroundColor: 'var(--bg-surface)',
                backgroundImage: `url(${promptData.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }} />
            </div>

          </div>
        )}
      </div>
    </>
  );
}
