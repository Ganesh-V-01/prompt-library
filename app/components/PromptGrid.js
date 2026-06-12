'use client';
import { useEffect, useState, Suspense } from 'react';
import PromptCard from './PromptCard';
import { useSearchParams } from 'next/navigation';

function GridContent({ initialPrompts }) {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'All';
  const query = searchParams.get('q') || '';
  const styleQuery = searchParams.get('style') || '';
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    const fetchFavs = () => {
      const saved = localStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
    };
    fetchFavs();
    window.addEventListener('favoritesUpdated', fetchFavs);
    return () => window.removeEventListener('favoritesUpdated', fetchFavs);
  }, []);

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) return <div className="masonry-grid"></div>;

  let displayPrompts = initialPrompts;

  if (filter === 'Favorites') {
    displayPrompts = displayPrompts.filter(p => favorites.includes(p.id));
  } else if (filter !== 'All' && filter !== 'History') {
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
    <div className="masonry-grid">
      {displayPrompts.length === 0 && filter === 'Favorites' && (
        <div style={{ width: '100%', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No favorites yet. Heart some prompts!
        </div>
      )}
      {displayPrompts.map(prompt => (
        <PromptCard 
          key={prompt.id} 
          id={prompt.id} 
          image={prompt.image_url} 
          prompt={prompt.prompt_text} 
          model={prompt.model} 
          title={prompt.title || 'Untitled Prompt'} 
        />
      ))}
    </div>
  );
}

export default function PromptGrid({ initialPrompts }) {
  return (
    <Suspense fallback={<div className="masonry-grid"></div>}>
      <GridContent initialPrompts={initialPrompts} />
    </Suspense>
  );
}
