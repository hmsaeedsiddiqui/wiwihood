import Link from "next/link";

export default function NotFound() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#222' }}>404</h1>
            <p style={{ fontSize: '1.25rem', color: '#666', marginBottom: 24 }}>Sorry, the page you are looking for does not exist.</p>
            <Link href="/" style={{ color: '#10b981', fontWeight: 700, textDecoration: 'underline' }}>Go back home</Link>
        </div>
    );
}
