'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  if (totalPages <= 1) return null;

  const go = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="pagination" aria-label="Prompt pages">
      <button onClick={() => go(currentPage - 1)} disabled={currentPage <= 1}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => go(currentPage + 1)} disabled={currentPage >= totalPages}>Next</button>
    </nav>
  );
}
