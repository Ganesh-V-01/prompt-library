'use client';

import { ExternalLink } from 'lucide-react';
import { getModelUrl } from '@/utils/promptTools';

export default function OpenModelButton({ prompt, model, className = '', compact = false }) {
  const destination = getModelUrl(model);
  if (!destination) return null;

  const handleOpen = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // Opening the selected model is still useful if clipboard access is unavailable.
    }
    window.open(destination, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={className}
      title={`Copy prompt and open ${model}`}
      aria-label={`Copy prompt and open ${model}`}
    >
      <ExternalLink size={16} />
      {!compact && 'Open'}
    </button>
  );
}
