import PromptCard from './components/PromptCard';
import TopFilterBar from './components/TopFilterBar';
import PromptGrid from './components/PromptGrid';
import { supabase } from '@/utils/supabase';

// Revalidate every 60 seconds (Incremental Static Regeneration)
// This is the key to scaling on the free tier: 1000 users = 1 DB read per minute.
export const revalidate = 60;

export default async function Home() {
  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500); // Fetch max 500 for the client grid

  if (error) {
    console.error("Error fetching prompts:", error);
  }

  const placeholders = [
    { id: 1, image_url: 'https://placehold.co/600x800/eeeeee/999999?text=Placeholder+1', prompt_text: 'A high fashion editorial, stark lighting, black and white.', model: 'Midjourney' },
    { id: 2, image_url: 'https://placehold.co/600x600/eeeeee/999999?text=Placeholder+2', prompt_text: 'Cinematic lighting, brutalist architecture.', model: 'ChatGPT' },
    { id: 3, image_url: 'https://placehold.co/400x600/eeeeee/999999?text=Placeholder+3', prompt_text: 'Cyberpunk street, rain, neon reflections.', model: 'Nanobanana' },
    { id: 4, image_url: 'https://placehold.co/600x400/eeeeee/999999?text=Placeholder+4', prompt_text: 'Minimalist product photography, soft shadows.', model: 'Seedance' },
  ];

  const initialPrompts = (prompts && prompts.length > 0) ? prompts : placeholders;

  return (
    <>
      <div className="desktop-only-filter">
        <TopFilterBar />
      </div>
      <PromptGrid initialPrompts={initialPrompts} />
    </>
  );
}
