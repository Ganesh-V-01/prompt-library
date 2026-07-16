export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicy() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  return (
    <article className="legal-page">
      <h1>Privacy Policy</h1>
      <p className="legal-date">Last updated: July 15, 2026</p>
      <section><h2>Information we process</h2><p>Visitors can browse without an account. If you apply to contribute, we process your email address, display name, authentication information, and submitted content. Security services may process technical information such as IP address and request metadata.</p></section>
      <section><h2>How information is used</h2><p>We use information to operate MedhaOne, authenticate approved contributors, review submissions, prevent abuse, understand consented usage, and maintain security. We do not sell personal information.</p></section>
      <section><h2>Storage and service providers</h2><p>The service uses Supabase for authentication, database, and file storage; Vercel for hosting; Sentry for error monitoring; and PostHog for consented analytics.</p></section>
      <section><h2>Analytics choice</h2><p>Non-essential analytics starts only after you accept analytics in the consent notice. Favourites and history are stored locally in your browser and can be removed by clearing site data.</p></section>
      <section><h2>Content and removal requests</h2><p>Contributors should submit only content they created or are authorized to share. Creators can request correction or removal through the Report Content page.</p></section>
      <section><h2>Contact</h2><p>{contactEmail ? <>Privacy questions may be sent to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.</> : 'A public privacy contact will be added before launch.'}</p></section>
    </article>
  );
}
