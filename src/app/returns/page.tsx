// src/app/returns/page.tsx
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function ReturnsPolicyPage() {
  return (
    <main style={{ background: '#FFF8EF', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Navbar />

      <section style={{ padding: '80px 0 100px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-eyebrow">HELP & INFORMATION</span>
          <h1 className="serif" style={{ fontSize: '38px', color: '#292522', margin: '12px 0 24px' }}>
            Return & Refund Policy
          </h1>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid rgba(234,216,200,0.6)', lineHeight: '1.8', color: '#4A4540' }}>
            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>1. 7-Day Easy Returns</h2>
            <p style={{ marginBottom: '20px' }}>
              We want you to fall in love with your TRIANYAA creation. If for any reason you are not completely satisfied, you may initiate a return within 7 days of receiving your order.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>2. Return Eligibility</h2>
            <p style={{ marginBottom: '12px' }}>
              • Items must be unused, unwashed, and in their original packaging with tags intact.
            </p>
            <p style={{ marginBottom: '20px' }}>
              • Damaged or transit-defected items will receive a free immediate replacement. Please share an unboxing video/photo within 48 hours of delivery.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>3. Refund Process</h2>
            <p style={{ marginBottom: '20px' }}>
              Once returned items are received and inspected at our studio, refunds will be credited back to your original payment method (UPI / Bank / Card) within 3 to 5 business days.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>4. How to Initiate a Return</h2>
            <p>
              Email us at <strong>hello@trianyaa.com</strong> with your Order ID and reason for return, or contact us directly on WhatsApp.
            </p>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </main>
  );
}
