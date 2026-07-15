import TopFilterBar from './components/TopFilterBar';
import PromptGrid from './components/PromptGrid';
import Pagination from './components/Pagination';
import { supabase } from '@/utils/supabase';

export const revalidate = 60;
const PAGE_SIZE = 24;

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params?.page || '1', 10) || 1);
  const filter = params?.filter || 'All';
  const style = params?.style || '';
  const promptType = params?.type || '';
  const sort = params?.sort || 'Featured';
  const search = (params?.q || '').trim().replace(/[,()%]/g, ' ').slice(0, 100);
  const from = (page - 1) * PAGE_SIZE;

  let query = supabase
    .from('prompts')
    .select('*', { count: 'exact' })
    .eq('status', 'published');

  if (!['All', 'Favorites', 'History'].includes(filter)) query = query.eq('model', filter);
  if (style) query = query.eq('style', style);
  if (promptType) query = query.eq('prompt_type', promptType);
  if (search) {
    query = query.or(`title.ilike.%${search}%,prompt_text.ilike.%${search}%,creator_name.ilike.%${search}%,model.ilike.%${search}%`);
  }

  query = sort === 'Newest'
    ? query.order('created_at', { ascending: false })
    : query.order('featured', { ascending: false }).order('created_at', { ascending: false });

  const { data: prompts, error, count } = await query.range(from, from + PAGE_SIZE - 1);
  const totalPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

  return (
    <>
      <div className="desktop-only-filter"><TopFilterBar /></div>
      {error ? (
        <div className="state-panel" role="alert">
          <h2>We could not load the library.</h2>
          <p>Please refresh in a moment.</p>
        </div>
      ) : (
        <>
          <PromptGrid initialPrompts={prompts || []} />
          {!['Favorites', 'History'].includes(filter) && (
            <Pagination currentPage={page} totalPages={totalPages} />
          )}
        </>
      )}
    </>
  );
}
