'use client';
import { useState, useEffect } from 'react';
import { Copy, Check, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PromptCard({ id, image, prompt, model, title = "Untitled Prompt" }) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      const favs = JSON.parse(saved);
      if (favs.includes(id)) {
        setLiked(true);
      }
    }
  }, [id]);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const saved = localStorage.getItem('favorites');
    let favs = saved ? JSON.parse(saved) : [];
    
    if (liked) {
      favs = favs.filter(f => f !== id);
      setLiked(false);
    } else {
      favs.push(id);
      setLiked(true);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favs));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  return (
    <div className="prompt-card" style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Link href={`/prompt/${id}`} style={{ display: 'block', position: 'relative' }}>
        {/* Clickable Image */}
        <Image 
          src={image || 'https://placehold.co/600x800/eeeeee/999999?text=Placeholder'} 
          alt={title} 
          width={600}
          height={800}
          style={{ width: '100%', height: 'auto', display: 'block' }} 
          unoptimized={!image} // placehold.co sometimes fails optimization
        />
        
        {/* Top Model Badge */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          color: '#000000',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.7rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          border: '1px solid var(--border)'
        }}>
          {model}
        </div>
      </Link>

      {/* Desktop Hover Overlay with Title and Actions */}
      <div className="card-overlay" style={{ pointerEvents: 'none' }}>
        <div className="card-title">{title}</div>
        
        <div className="card-actions" style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
          <button 
            onClick={handleCopy}
            title="Copy Prompt"
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: copied ? '#10B981' : '#FFFFFF',
              color: copied ? '#FFFFFF' : '#000000',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Copy Prompt'}
          </button>
          
          <button 
            onClick={handleLike}
            title="Favorite"
            style={{
              width: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              color: liked ? '#EF4444' : '#000000',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
            <Heart size={16} fill={liked ? '#EF4444' : 'none'} />
          </button>
        </div>
      </div>

      {/* Mobile Permanent Footer (Hidden on Desktop via CSS) */}
      <div className="card-actions-mobile">
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleCopy}
            className="mobile-action-btn"
            style={{ backgroundColor: copied ? '#10B981' : 'var(--surface-hover)', color: copied ? '#FFF' : 'var(--text-primary)' }}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied' : 'Prompt'}
          </button>
          <button 
            onClick={handleLike}
            className="mobile-action-btn-icon"
            style={{ color: liked ? '#EF4444' : 'var(--text-primary)' }}>
            <Heart size={16} fill={liked ? '#EF4444' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
