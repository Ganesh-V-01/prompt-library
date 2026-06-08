'use client';
import { useState } from 'react';

export default function PromptCard({ image, prompt, model }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'relative',
      borderRadius: '16px', // Golden ratio base spacing
      overflow: 'hidden',
      aspectRatio: '1 / 1.618', // Golden Ratio aspect
      backgroundColor: 'var(--surface)',
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      border: '1px solid var(--border)',
      boxShadow: '0 4px 26px rgba(0,0,0,0.5)', // Golden ratio spacing
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 10px 42px rgba(129, 140, 248, 0.2)'; /* Indigo Glow */
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 26px rgba(0,0,0,0.5)';
    }}>
      
      {/* Top Model Badge */}
      <div style={{
        position: 'absolute',
        top: '16px',
        left: '16px',
        backgroundColor: 'rgba(18, 18, 18, 0.7)',
        backdropFilter: 'blur(8px)',
        color: 'var(--text-primary)',
        padding: '6px 10px',
        borderRadius: '8px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        border: '1px solid var(--border)'
      }}>
        {model}
      </div>

      {/* Bottom Copy Button Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '0',
        width: '100%',
        padding: '26px', // Golden ratio spacing
        background: 'linear-gradient(to top, rgba(18, 18, 18, 0.95) 0%, rgba(18, 18, 18, 0) 100%)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <button 
          onClick={handleCopy}
          style={{
            width: '100%',
            padding: '16px', // Golden ratio spacing
            backgroundColor: copied ? '#10B981' : 'var(--accent)',
            color: copied ? '#FFFFFF' : '#121212', // Dark text on bright accent
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            border: 'none',
            boxShadow: copied ? '0 0 26px rgba(16,185,129,0.4)' : '0 0 26px rgba(129,140,248,0.4)',
            transition: 'all 0.3s ease'
          }}>
          {copied ? 'Copied to Clipboard!' : 'Copy Prompt'}
        </button>
      </div>
    </div>
  );
}
