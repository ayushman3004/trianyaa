// src/app/terms/page.tsx
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function TermsPage() {
  return (
    <main style={{ background: '#FFF8EF', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Navbar />

      <section style={{ padding: '80px 0 100px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-eyebrow">LEGAL & TERMS</span>
          <h1 className="serif" style={{ fontSize: '38px', color: '#292522', margin: '12px 0 24px' }}>
            Terms & Conditions
          </h1>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid rgba(234,216,200,0.6)', lineHeight: '1.8', color: '#4A4540' }}>
            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>1. Overview</h2>
            <p style={{ marginBottom: '20px' }}>
              Welcome to TRIANYAA. By accessing our website or placing an order, you agree to be bound by these Terms & Conditions.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>2. Handmade Uniqueness</h2>
            <p style={{ marginBottom: '20px' }}>
              Because each TRIANYAA item is individually crocheted by hand, slight variations in color tone or stitch texture make every piece uniquely beautiful.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>3. Pricing & Intellectual Property</h2>
            <p style={{ marginBottom: '20px' }}>
              All prices listed are in INR (₹). Product photography, branding assets, and designs belong exclusively to TRIANYAA.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>4. Governance</h2>
            <p>
              These terms are governed by the laws of India. For questions, email us at <strong>hello@trianyaa.com</strong>.
            </p>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </main>
  );
}
