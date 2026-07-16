export default async function ReportContent({ searchParams }) {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const { prompt } = await searchParams;
  const subject = prompt ? `Content removal request: prompt ${prompt}` : 'Content removal request';
  return (
    <div className="state-panel">
      <h1>Report or remove content</h1>
      <p>If you created content displayed in this library and want it corrected or removed, send the prompt URL, the original source, and a short explanation.</p>
      {email ? <a className="primary-button" href={`mailto:${email}?subject=${encodeURIComponent(subject)}`}>Email a removal request</a> : <p className="form-message">The public removal email will be added before launch.</p>}
    </div>
  );
}
