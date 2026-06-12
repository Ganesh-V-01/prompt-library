export default function TermsOfService() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-lg)', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Terms of Service</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.6 }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using the Prompt Library, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
        </section>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>2. User Content</h2>
          <p>You retain all rights to any AI prompts you submit, but by submitting them, you grant us a license to display them publicly on the platform. Do not submit harmful, illegal, or offensive content.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>3. Service Availability</h2>
          <p>We strive to keep the Prompt Library running 24/7, but we do not guarantee uninterrupted access. We reserve the right to modify or discontinue the service at any time.</p>
        </section>
      </div>
    </div>
  );
}
