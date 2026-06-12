import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 800, margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', marginTop: '8px', marginBottom: '24px' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '400px' }}>
        The prompt or page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/" style={{ padding: '12px 24px', backgroundColor: 'var(--text-primary)', color: 'var(--background)', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none' }}>
        Return Home
      </Link>
    </div>
  );
}
