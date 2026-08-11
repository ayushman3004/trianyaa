// src/app/privacy/page.tsx
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function PrivacyPolicyPage() {
  return (
    <main style={{ background: '#FFF8EF', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Navbar />

      <section style={{ padding: '80px 0 100px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-eyebrow">LEGAL & PRIVACY</span>
          <h1 className="serif" style={{ fontSize: '38px', color: '#292522', margin: '12px 0 24px' }}>
            Privacy Policy
          </h1>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid rgba(234,216,200,0.6)', lineHeight: '1.8', color: '#4A4540' }}>
            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '20px' }}>
              At TRIANYAA, we respect your privacy. When you browse or place an order, we collect essential shipping information such as your name, delivery address, phone number, and email address to fulfill your order.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>2. Payment Security</h2>
            <p style={{ marginBottom: '20px' }}>
              We do not store your credit card or banking details. All transactions are securely processed through encrypted, PCI-compliant payment gateways (Razorpay / UPI / Cards).
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>3. How We Use Your Data</h2>
            <p style={{ marginBottom: '20px' }}>
              Your personal information is strictly used to deliver your orders, provide tracking updates, and send newsletter updates if subscribed. We never sell or share your data with third parties.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>4. Contact Us</h2>
            <p>
              If you have questions regarding our privacy practices, please write to us at <strong>hello@trianyaa.com</strong>.
            </p>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </main>
  );
}
