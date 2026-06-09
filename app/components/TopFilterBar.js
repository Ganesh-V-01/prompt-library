'use client';
import { Suspense, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import openaiSvg from '@/app/icons/openai.svg';
import midjourneySvg from '@/app/icons/midjourney.svg';
import { Banana, Sparkles, Filter, X, PenTool, Camera, Wand2, Leaf, Layout, Film, Shapes, Paintbrush, Square } from 'lucide-react';

const STYLES_LIST = [
  { name: 'Logo Design', icon: PenTool },
  { name: 'Portrait Shots', icon: Camera },
  { name: 'Fantasy', icon: Wand2 },
  { name: 'Floral', icon: Leaf },
  { name: 'UI/UX', icon: Layout },
  { name: 'Cinematic', icon: Film },
  { name: 'Abstract', icon: Shapes },
  { name: 'Oil Paint', icon: Paintbrush },
  { name: 'Minimalist', icon: Square }
];

function FilterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFilter = searchParams.get('filter') || 'All';
  const currentSort = searchParams.get('sort') || 'Featured';
  const currentStyle = searchParams.get('style') || '';
  
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const stylesBtnRef = useRef(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });

  const toggleStyleMenu = useCallback(() => {
    if (!isStyleMenuOpen && stylesBtnRef.current) {
      const rect = stylesBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 348))
      });
    }
    setIsStyleMenuOpen(!isStyleMenuOpen);
  }, [isStyleMenuOpen]);

  const setFilter = (f) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('filter', f);
    router.push(`/?${params.toString()}`);
  };

  const setSort = (s) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', s);
    router.push(`/?${params.toString()}`);
  };

  const setStyle = (s) => {
    const params = new URLSearchParams(searchParams.toString());
    if (s) {
      params.set('style', s);
    } else {
      params.delete('style');
    }
    router.push(`/?${params.toString()}`);
    setIsStyleMenuOpen(false);
  };

  return (
    <div className="desktop-filter-bar">
      
      {/* Left: All Filters */}
      <div className="filters">
        <button className={`filter-pill ${currentFilter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
          All
        </button>
        
        {/* Dropdown for Styles */}
        <div className="desktop-styles-dropdown" style={{ position: 'relative' }}>
          <button 
            ref={stylesBtnRef}
            className={`filter-pill ${currentStyle ? 'active' : ''}`}
            onClick={toggleStyleMenu} 
            style={{ borderColor: isStyleMenuOpen ? 'var(--text-primary)' : undefined }}
          >
            <Filter size={16} /> Styles
          </button>
          
          {isStyleMenuOpen && (
             <>
               <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9998 }} onClick={() => setIsStyleMenuOpen(false)} />
               <div className="styles-dropdown" style={{ 
                 position: 'fixed',
                 top: dropdownPos.top,
                 left: dropdownPos.left,
                 zIndex: 9999, 
                 background: 'var(--surface)', border: '1px solid var(--border)', 
                 borderRadius: '12px', padding: '12px',
                 width: '340px', maxWidth: '90vw',
                 boxShadow: '0 12px 32px rgba(0,0,0,0.12)' 
               }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {STYLES_LIST.map(s => {
                      const Icon = s.icon;
                      const isActive = currentStyle === s.name;
                      return (
                        <button 
                          key={s.name} 
                          onClick={() => setStyle(s.name)} 
                          className={`filter-pill ${isActive ? 'active' : ''}`}
                          style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                        >
                          <Icon size={14} />
                          <span>{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
               </div>
             </>
          )}
        </div>

        {/* Active Style Pill with X */}
        {currentStyle && (
          <button className="filter-pill active" onClick={() => setStyle('')}>
            {currentStyle} <X size={14} />
          </button>
        )}

        {/* Main Filters */}
        <button className={`filter-pill ${currentFilter === 'ChatGPT' ? 'active' : ''}`} onClick={() => setFilter('ChatGPT')}>
          <Image src={openaiSvg} alt="OpenAI" width={16} height={16} /> ChatGPT
        </button>
        <button className={`filter-pill ${currentFilter === 'Midjourney' ? 'active' : ''}`} onClick={() => setFilter('Midjourney')}>
          <Image src={midjourneySvg} alt="Midjourney" width={16} height={16} /> Midjourney
        </button>
        <button className={`filter-pill ${currentFilter === 'Nanobanana' ? 'active' : ''}`} onClick={() => setFilter('Nanobanana')}>
          <Banana size={16} /> Nanobanana
        </button>
        <button className={`filter-pill ${currentFilter === 'Seedance 2.0' ? 'active' : ''}`} onClick={() => setFilter('Seedance 2.0')}>
          <Sparkles size={16} /> Seedance 2.0
        </button>
      </div>

      {/* Right: Sorts */}
      <div className="sorts">
        <button className={`sort-btn ${currentSort === 'Featured' ? 'active' : ''}`} onClick={() => setSort('Featured')}>Featured</button>
        <button className={`sort-btn ${currentSort === 'Newest' ? 'active' : ''}`} onClick={() => setSort('Newest')}>Newest</button>
        <button className={`sort-btn ${currentSort === 'Popular' ? 'active' : ''}`} onClick={() => setSort('Popular')}>Popular</button>
      </div>

    </div>
  );
}

export default function TopFilterBar() {
  return (
    <Suspense fallback={<div className="desktop-filter-bar">Loading filters...</div>}>
      <FilterContent />
    </Suspense>
  );
}
