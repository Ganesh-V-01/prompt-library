export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-lg)', minHeight: '80vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '24px' }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Last Updated: {new Date().toLocaleDateString()}</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', lineHeight: 1.6 }}>
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>1. Information We Collect</h2>
          <p>We only collect the information you choose to give us, such as your email address when you sign up for an account. We also automatically collect some technical information (like your IP address) to help prevent spam and keep the platform secure.</p>
        </section>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>2. How We Use Your Information</h2>
          <p>Your information is used strictly to provide you with the Prompt Library services, improve platform performance, and ensure security. We do not sell your personal data to third parties.</p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>3. Cookies and Analytics</h2>
          <p>We use essential cookies to keep you logged in and functional cookies to remember your preferences (like favorite prompts). We use PostHog to analyze website traffic anonymously.</p>
        </section>
        
        <section>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '12px' }}>4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </section>
      </div>
    </div>
  );
}
