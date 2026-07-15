'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Heart } from 'lucide-react';
import OpenModelButton from '../../components/OpenModelButton';

function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

export default function PromptDetailActions({ item }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(read('favorites').includes(item.id));
    const snapshot = item;
    const history = [snapshot, ...read('prompt-history').filter((entry) => entry.id !== item.id)].slice(0, 50);
    localStorage.setItem('prompt-history', JSON.stringify(history));
    window.dispatchEvent(new Event('historyUpdated'));
  }, [item]);

  const copy = async () => {
    await navigator.clipboard.writeText(item.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFavourite = () => {
    let ids = read('favorites');
    let prompts = read('favorite-prompts');
    if (liked) {
      ids = ids.filter((id) => id !== item.id);
      prompts = prompts.filter((entry) => entry.id !== item.id);
    } else {
      ids = [item.id, ...ids.filter((id) => id !== item.id)];
      prompts = [item, ...prompts.filter((entry) => entry.id !== item.id)].slice(0, 100);
    }
    localStorage.setItem('favorites', JSON.stringify(ids));
    localStorage.setItem('favorite-prompts', JSON.stringify(prompts));
    setLiked(!liked);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <div className="detail-actions">
      <button onClick={copy} className={`primary-button detail-copy ${copied ? 'success' : ''}`}>{copied ? <Check size={18} /> : <Copy size={18} />}{copied ? 'Copied' : 'Copy prompt'}</button>
      <OpenModelButton prompt={item.prompt_text} model={item.model} className="secondary-button detail-open" />
      <button onClick={toggleFavourite} className="secondary-button icon-only" aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}><Heart size={18} fill={liked ? 'currentColor' : 'none'} color={liked ? '#ef4444' : 'currentColor'} /></button>
    </div>
  );
}
