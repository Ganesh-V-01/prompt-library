import Navbar from './components/Navbar';
import PromptCard from './components/PromptCard';
import { supabase } from '@/utils/supabase';

export const revalidate = 10;

export default async function Home() {
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching prompts:", error);
  }

  const noiseTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`;

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        paddingTop: '120px', 
        paddingBottom: '80px',
        borderBottom: '1px solid var(--border)'
      }}>
        {/* Noise Overlay */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: noiseTexture,
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '72px', 
            lineHeight: '1.1', 
            letterSpacing: '-0.03em',
            marginBottom: '16px'
          }}>
            The Prompt<br />Library.
          </h1>
          <p style={{ 
            fontSize: '15px', 
            color: 'var(--text-secondary)', 
            marginBottom: '48px',
            letterSpacing: '0.02em'
          }}>
            Copy. Paste. Create.
          </p>

          {/* Search Bar */}
          <div style={{ maxWidth: '600px', margin: '0 auto 32px auto', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search cinematic portraits..."
              className="search-input"
            />
          </div>

          {/* Model Filter Pills */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            {['All', 'NanoBanana', 'ChatGPT', 'Midjourney'].map((model, idx) => (
              <button key={model} style={{
                padding: '6px 16px',
                borderRadius: '100px',
                fontSize: '13px',
                fontWeight: '500',
                border: idx === 0 ? '1px solid var(--accent-gold)' : '1px solid var(--border)',
                backgroundColor: idx === 0 ? 'var(--accent-gold)' : 'transparent',
                color: idx === 0 ? 'var(--bg-base)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}>
                {model}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tag Filter Bar (Sticky) */}
      <div style={{ 
        position: 'sticky', 
        top: '80px', 
        zIndex: 90, 
        backgroundColor: 'rgba(10, 10, 10, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid var(--border)',
        padding: '16px 0'
      }}>
        <div className="container" style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['Cinematic', 'Product', 'Portrait', 'Architecture', 'Fantasy', 'Abstract', 'UI/UX', 'Logo Design'].map((tag, idx) => (
            <button key={tag} style={{
              whiteSpace: 'nowrap',
              padding: '6px 16px',
              fontSize: '13px',
              color: idx === 0 ? '#111' : 'var(--text-secondary)',
              backgroundColor: idx === 0 ? 'var(--accent-gold)' : 'transparent',
              border: 'none',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}>
              {tag}
            </button>
          ))}
        </div>
      </div>

      <main className="container" style={{ paddingTop: '40px', paddingBottom: '100px' }}>
        {/* Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '24px' 
        }}>
          {!prompts || prompts.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center', marginTop: '40px' }}>No prompts found. Be the first to upload one!</p>
          ) : (
            prompts.map((prompt, index) => (
              <PromptCard 
                key={prompt.id}
                image={prompt.image_url}
                prompt={prompt.prompt_text}
                model={prompt.model}
                index={index}
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}
