'use client';

import { useEffect, useState, Suspense } from 'react';
import PromptCard from './PromptCard';
import { useSearchParams } from 'next/navigation';

function safelyRead(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function GridContent({ initialPrompts }) {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter') || 'All';
  const [localPrompts, setLocalPrompts] = useState(null);

  useEffect(() => {
    const refresh = () => {
      if (filter === 'Favorites') setLocalPrompts(safelyRead('favorite-prompts'));
      else if (filter === 'History') setLocalPrompts(safelyRead('prompt-history'));
      else setLocalPrompts(null);
    };
    refresh();
    window.addEventListener('favoritesUpdated', refresh);
    window.addEventListener('historyUpdated', refresh);
    return () => {
      window.removeEventListener('favoritesUpdated', refresh);
      window.removeEventListener('historyUpdated', refresh);
    };
  }, [filter]);

  const displayPrompts = localPrompts ?? initialPrompts;

  if (displayPrompts.length === 0) {
    return (
      <div className="state-panel">
        <h2>{filter === 'Favorites' ? 'No favourites yet' : filter === 'History' ? 'No viewing history yet' : 'No prompts found'}</h2>
        <p>{filter === 'Favorites' ? 'Use the heart button to save prompts on this device.' : filter === 'History' ? 'Open a prompt and it will appear here.' : 'Try another search or filter.'}</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {displayPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          id={prompt.id}
          image={prompt.image_url}
          prompt={prompt.prompt_text}
          model={prompt.model}
          title={prompt.title || 'Untitled Prompt'}
          style={prompt.style}
          promptType={prompt.prompt_type}
        />
      ))}
    </div>
  );
}

export default function PromptGrid({ initialPrompts }) {
  return <Suspense fallback={<div className="state-panel">Loading prompts...</div>}><GridContent initialPrompts={initialPrompts} /></Suspense>;
}
