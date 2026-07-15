'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import OpenModelButton from './OpenModelButton';

function readArray(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
}

export default function PromptCard({ id, image, prompt, model, title = 'Untitled Prompt', style, promptType = 'image' }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);
  const snapshot = { id, image_url: image, prompt_text: prompt, model, title, style, prompt_type: promptType };

  useEffect(() => {
    setLiked(readArray('favorites').includes(id));
  }, [id]);

  const handleCopy = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (event) => {
    event.preventDefault();
    event.stopPropagation();
    let ids = readArray('favorites');
    let items = readArray('favorite-prompts');
    if (liked) {
      ids = ids.filter((value) => value !== id);
      items = items.filter((item) => item.id !== id);
    } else {
      ids = [id, ...ids.filter((value) => value !== id)];
      items = [snapshot, ...items.filter((item) => item.id !== id)].slice(0, 100);
    }
    localStorage.setItem('favorites', JSON.stringify(ids));
    localStorage.setItem('favorite-prompts', JSON.stringify(items));
    setLiked(!liked);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const recordHistory = () => {
    const history = [snapshot, ...readArray('prompt-history').filter((item) => item.id !== id)].slice(0, 50);
    localStorage.setItem('prompt-history', JSON.stringify(history));
    window.dispatchEvent(new Event('historyUpdated'));
  };

  return (
    <article className="prompt-card">
      <Link href={`/prompt/${id}`} onClick={recordHistory} className="card-image-link">
        <Image src={image} alt={title} width={600} height={800} sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" style={{ width: '100%', height: 'auto', display: 'block' }} />
        <div className="model-badge">{model}</div>
        {promptType === 'video' && <div className="type-badge">Video prompt</div>}
      </Link>

      <div className="card-overlay">
        <div className="card-title">{title}</div>
        <div className="card-actions">
          <button onClick={handleCopy} className={`card-action-main ${copied ? 'success' : ''}`}><span>{copied ? <Check size={16} /> : <Copy size={16} />}</span>{copied ? 'Copied' : 'Copy'}</button>
          <OpenModelButton prompt={prompt} model={model} className="card-action-icon" compact />
          <button onClick={handleLike} className="card-action-icon" aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}><Heart size={16} fill={liked ? 'currentColor' : 'none'} color={liked ? '#ef4444' : 'currentColor'} /></button>
        </div>
      </div>

      <div className="card-actions-mobile">
        <div className="card-title-mobile">{title}</div>
        <div className="mobile-card-buttons">
          <button onClick={handleCopy} className={`mobile-action-btn ${copied ? 'success' : ''}`}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Copied' : 'Copy'}</button>
          <OpenModelButton prompt={prompt} model={model} className="mobile-action-btn-icon" compact />
          <button onClick={handleLike} className="mobile-action-btn-icon" aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}><Heart size={16} fill={liked ? 'currentColor' : 'none'} color={liked ? '#ef4444' : 'currentColor'} /></button>
        </div>
      </div>
    </article>
  );
}
