export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://medhaone.tech';
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/login', '/contribute'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
