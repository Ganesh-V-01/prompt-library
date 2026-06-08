'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function PromptCard({ image, prompt, model, index = 0 }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getModelColor = () => {
    if (model?.toLowerCase() === 'nanobanana') return 'var(--model-nano)';
    if (model?.toLowerCase() === 'chatgpt') return 'var(--model-gpt)';
    if (model?.toLowerCase() === 'midjourney') return 'var(--model-mj)';
    return 'var(--text-secondary)';
  };

  return (
    <Link href={`/prompt/${index}`}>
      <div 
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          overflow: 'hidden',
          cursor: 'pointer',
          opacity: 0,
          animation: 'staggerFadeIn 0.6s ease forwards',
          animationDelay: `${index * 0.05}s`,
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent-gold)';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.backgroundColor = 'var(--bg-elevated)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.backgroundColor = 'var(--bg-surface)';
        }}
      >
        
        {/* Image Section */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          backgroundColor: '#050505',
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid var(--border)'
        }}>
          {/* Top Model Badge */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            backgroundColor: 'rgba(10, 10, 10, 0.85)',
            color: 'var(--text-primary)',
            padding: '4px 10px',
            borderRadius: '100px',
            fontSize: '11px',
            fontWeight: '500',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ 
              width: '6px', 
              height: '6px', 
              borderRadius: '50%', 
              backgroundColor: getModelColor() 
            }} />
            {model || 'Model'}
          </div>
        </div>

        {/* Text Section */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.5',
            color: 'var(--text-primary)',
            marginBottom: '24px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {prompt}
          </p>

          <div style={{ 
            marginTop: 'auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
              Photography
            </span>
            
            <button 
              onClick={handleCopy}
              style={{
                padding: '6px 12px',
                backgroundColor: 'transparent',
                color: 'var(--accent-gold)',
                border: '1px solid var(--accent-gold-dim)',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                transform: copied ? 'scale(0.96)' : 'scale(1)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold)';
                e.currentTarget.style.backgroundColor = 'rgba(201, 168, 76, 0.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-gold-dim)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
}
