import Navbar from './components/Navbar';
import PromptCard from './components/PromptCard';
import { supabase } from '@/utils/supabase';

// Revalidate the page every 10 seconds to show new prompts
export const revalidate = 10;

export default async function Home() {
  // Fetch real data from Supabase
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching prompts:", error);
  }

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '60px', paddingBottom: '100px' }}>
        
        {/* Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px', maxWidth: '800px', margin: '0 auto 80px auto' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', lineHeight: 1.2 }}>
            Find the Perfect <span style={{ color: 'var(--accent)' }}>AI Prompt</span> Instantly
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '40px' }}>
            Browse a curated library of high-quality prompts for NanoBanana, ChatGPT, and Midjourney. Copy, paste, and generate masterpiece images.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button style={{ 
              padding: '14px 28px', 
              fontSize: '1.1rem', 
              backgroundColor: 'var(--accent)', 
              color: '#121212', 
              borderRadius: '8px', 
              fontWeight: 'bold',
              boxShadow: '0 4px 14px 0 rgba(129, 140, 248, 0.39)'
            }}>
              Start Exploring
            </button>
          </div>
        </div>

        {/* Prompt Feed */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '2rem' }}>Latest Prompts</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select className="glass" style={{ padding: '8px 16px', borderRadius: '6px', color: 'white', border: '1px solid var(--border)' }}>
                <option value="all">All Models</option>
                <option value="nanobanana">NanoBanana</option>
                <option value="chatgpt">ChatGPT</option>
                <option value="midjourney">Midjourney</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {!prompts || prompts.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No prompts found. Be the first to upload one!</p>
            ) : (
              prompts.map(prompt => (
                <PromptCard 
                  key={prompt.id}
                  image={prompt.image_url}
                  prompt={prompt.prompt_text}
                  model={prompt.model}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
