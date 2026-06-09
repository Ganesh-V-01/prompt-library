'use client';

export default function MobileFilter() {
  return (
    <div className="mobile-filterbar">
      <button className="filter-pill active">All</button>
      <button className="filter-pill">ChatGPT</button>
      <button className="filter-pill">Midjourney</button>
      <button className="filter-pill">Nanobanana</button>
      <button className="filter-pill">Seedance</button>
    </div>
  );
}
