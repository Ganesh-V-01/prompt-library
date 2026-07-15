import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/utils/supabase';
import PromptCard from '../../components/PromptCard';
import PromptDetailActions from './PromptDetailActions';

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { id } = await params;
  const { data } = await supabase.from('prompts').select('title, prompt_text, image_url').eq('id', id).eq('status', 'published').single();
  if (!data) return { title: 'Prompt not found' };
  return {
    title: data.title,
    description: data.prompt_text.slice(0, 155),
    openGraph: { title: data.title, description: data.prompt_text.slice(0, 155), images: [data.image_url] },
  };
}

export default async function PromptDetail({ params }) {
  const { id } = await params;
  const { data: item, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error || !item) notFound();

  const { data: similar } = await supabase
    .from('prompts')
    .select('*')
    .eq('status', 'published')
    .eq('model', item.model)
    .neq('id', item.id)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(6);

  return (
    <>
      <Link href="/" className="back-link"><ArrowLeft size={16} /> Back to library</Link>
      <article className="detail-container">
        <div className="detail-image-wrapper"><Image src={item.image_url} alt={item.title} fill sizes="(max-width: 768px) 100vw, 60vw" priority style={{ objectFit: 'contain' }} /></div>
        <div className="detail-right">
          <div className="detail-badges"><span>{item.model}</span><span>{item.prompt_type || 'image'} prompt</span>{item.style && <span>{item.style}</span>}</div>
          <h1 className="detail-title">{item.title}</h1>
          <dl className="prompt-meta">
            {item.creator_name && <><dt>Creator</dt><dd>{item.creator_name}</dd></>}
            {item.aspect_ratio && <><dt>Aspect ratio</dt><dd>{item.aspect_ratio}</dd></>}
          </dl>
          <h2>Prompt</h2>
          <div className="detail-prompt">{item.prompt_text}</div>
          {item.negative_prompt && <><h2>Negative prompt</h2><div className="detail-prompt secondary">{item.negative_prompt}</div></>}
          {item.notes && <><h2>Usage notes</h2><p className="detail-notes">{item.notes}</p></>}
          {item.source_url && <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="source-link">Original source <ExternalLink size={15} /></a>}
          <PromptDetailActions item={item} />
          <Link href={`/report?prompt=${item.id}`} className="report-link">Report this content</Link>
        </div>
      </article>

      {similar?.length > 0 && <section className="similar-section"><h2>Similar prompts</h2><div className="masonry-grid">{similar.map((prompt) => <PromptCard key={prompt.id} id={prompt.id} image={prompt.image_url} prompt={prompt.prompt_text} model={prompt.model} title={prompt.title} style={prompt.style} promptType={prompt.prompt_type} />)}</div></section>}
    </>
  );
}
