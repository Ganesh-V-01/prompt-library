'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, Image as ImageIcon, Video } from 'lucide-react';
import { STYLE_OPTIONS } from '@/utils/promptTools';

const MODEL_FILTERS = ['All', 'ChatGPT / DALL-E', 'Gemini / Nano Banana', 'Midjourney', 'Google Flow', 'Seedance'];

function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'All';
  const currentSort = searchParams.get('sort') || 'Featured';
  const currentStyle = searchParams.get('style') || '';
  const currentType = searchParams.get('type') || '';
  const [stylesOpen, setStylesOpen] = useState(false);

  const setParam = (name, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value); else params.delete(name);
    params.delete('page');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="desktop-filter-bar">
      <div className="filters">
        <button className={`filter-pill ${!currentType ? 'active' : ''}`} onClick={() => setParam('type', '')}>All types</button>
        <button className={`filter-pill ${currentType === 'image' ? 'active' : ''}`} onClick={() => setParam('type', 'image')}><ImageIcon size={16} /> Images</button>
        <button className={`filter-pill ${currentType === 'video' ? 'active' : ''}`} onClick={() => setParam('type', 'video')}><Video size={16} /> Videos</button>

        <div className="desktop-styles-dropdown">
          <button className={`filter-pill ${currentStyle ? 'active' : ''}`} onClick={() => setStylesOpen(!stylesOpen)}><Filter size={16} /> Styles</button>
          {stylesOpen && (
            <>
              <button className="menu-backdrop" aria-label="Close styles" onClick={() => setStylesOpen(false)} />
              <div className="styles-dropdown">
                {STYLE_OPTIONS.map((style) => <button key={style} className={`filter-pill ${currentStyle === style ? 'active' : ''}`} onClick={() => { setParam('style', style); setStylesOpen(false); }}>{style}</button>)}
              </div>
            </>
          )}
        </div>
        {currentStyle && <button className="filter-pill active" onClick={() => setParam('style', '')}>{currentStyle}<X size={14} /></button>}

        {MODEL_FILTERS.map((model) => (
          <button key={model} className={`filter-pill ${currentFilter === model ? 'active' : ''}`} onClick={() => setParam('filter', model)}>{model}</button>
        ))}
      </div>

      <div className="sorts">
        {['Featured', 'Newest'].map((sort) => <button key={sort} className={`sort-btn ${currentSort === sort ? 'active' : ''}`} onClick={() => setParam('sort', sort)}>{sort}</button>)}
      </div>
    </div>
  );
}

export default function TopFilterBar() {
  return <Suspense fallback={<div className="desktop-filter-bar" />}><FilterContent /></Suspense>;
}
