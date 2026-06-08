'use client';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ textToCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="card-btn" 
      style={{ 
        flex: 1, 
        backgroundColor: copied ? '#10B981' : '#000000', 
        color: '#FFFFFF',
        display: 'flex',
        gap: '8px'
      }}>
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? 'Copied to Clipboard' : 'Copy Prompt'}
    </button>
  );
}
