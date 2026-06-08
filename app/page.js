import PromptCard from './components/PromptCard';
import TopFilterBar from './components/TopFilterBar';
import PromptGrid from './components/PromptGrid';
import { supabase } from '@/utils/supabase';

export const revalidate = 10;

export default async function Home({ searchParams }) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams?.filter || 'All';
  const query = resolvedParams?.q || '';
  const styleQuery = resolvedParams?.style || '';

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching prompts:", error);
  }

  const placeholders = [
    { id: 1, image_url: 'https://placehold.co/600x800/eeeeee/999999?text=Placeholder+1', prompt_text: 'A high fashion editorial, stark lighting, black and white.', model: 'Midjourney' },
    { id: 2, image_url: 'https://placehold.co/600x600/eeeeee/999999?text=Placeholder+2', prompt_text: 'Cinematic lighting, brutalist architecture.', model: 'ChatGPT' },
    { id: 3, image_url: 'https://placehold.co/400x600/eeeeee/999999?text=Placeholder+3', prompt_text: 'Cyberpunk street, rain, neon reflections.', model: 'Nanobanana' },
    { id: 4, image_url: 'https://placehold.co/600x400/eeeeee/999999?text=Placeholder+4', prompt_text: 'Minimalist product photography, soft shadows.', model: 'Seedance' },
  ];

  let displayPrompts = (prompts && prompts.length > 0) ? prompts : placeholders;

  if (filter !== 'All' && filter !== 'Favorites' && filter !== 'History') {
    displayPrompts = displayPrompts.filter(p => p.model === filter);
  }
  
  if (query) {
    displayPrompts = displayPrompts.filter(p => 
      p.prompt_text.toLowerCase().includes(query.toLowerCase()) || 
      p.model.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (styleQuery) {
    displayPrompts = displayPrompts.filter(p => 
      p.prompt_text.toLowerCase().includes(styleQuery.toLowerCase()) || 
      (p.title && p.title.toLowerCase().includes(styleQuery.toLowerCase()))
    );
  }

  return (
    <>
      <div className="desktop-only-filter">
        <TopFilterBar />
      </div>
      <PromptGrid initialPrompts={displayPrompts} />
    </>
  );
}
