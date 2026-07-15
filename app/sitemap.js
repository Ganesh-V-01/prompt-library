import { supabase } from '@/utils/supabase';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://prompt-library-vert.vercel.app';
  const staticEntries = ['', '/privacy', '/terms', '/report'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path ? 'monthly' : 'daily',
    priority: path ? 0.5 : 1,
  }));

  const { data } = await supabase
    .from('prompts')
    .select('id, updated_at')
    .eq('status', 'published')
    .order('updated_at', { ascending: false })
    .limit(1000);

  const promptEntries = (data || []).map((item) => ({
    url: `${baseUrl}/prompt/${item.id}`,
    lastModified: item.updated_at ? new Date(item.updated_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...promptEntries];
}
