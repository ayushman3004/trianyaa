// src/app/shipping/page.tsx
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function ShippingPolicyPage() {
  return (
    <main style={{ background: '#FFF8EF', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Navbar />

      <section style={{ padding: '80px 0 100px' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="section-eyebrow">HELP & INFORMATION</span>
          <h1 className="serif" style={{ fontSize: '38px', color: '#292522', margin: '12px 0 24px' }}>
            Shipping & Delivery Policy
          </h1>

          <div style={{ background: '#fff', padding: '40px', borderRadius: '24px', border: '1px solid rgba(234,216,200,0.6)', lineHeight: '1.8', color: '#4A4540' }}>
            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>1. Order Processing</h2>
            <p style={{ marginBottom: '20px' }}>
              Every TRIANYAA creation is lovingly handcrafted. Ready-to-ship items are dispatched within 24 to 48 hours. Custom bouquet and personalized gift orders take 2 to 4 business days to prepare before shipping.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>2. Shipping Charges & Delivery Timeline</h2>
            <p style={{ marginBottom: '12px' }}>
              • <strong>Free Express Shipping:</strong> Available on all prepaid orders above ₹499 across India.
            </p>
            <p style={{ marginBottom: '12px' }}>
              • <strong>Standard Shipping:</strong> Flat ₹50 shipping fee on orders below ₹499.
            </p>
            <p style={{ marginBottom: '20px' }}>
              • <strong>Delivery Timelines:</strong> Metro cities: 2–4 business days. Other states and pin codes: 4–7 business days.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>3. Order Tracking</h2>
            <p style={{ marginBottom: '20px' }}>
              Once your parcel is dispatched, you will receive an SMS and email notification with your tracking link and courier details.
            </p>

            <h2 className="serif" style={{ fontSize: '20px', color: '#563820', marginBottom: '12px' }}>4. Need Assistance?</h2>
            <p>
              For urgent shipping queries or custom delivery dates, reach out to us at <strong>hello@trianyaa.com</strong> or WhatsApp <strong>+91 98765 43210</strong>.
            </p>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </main>
  );
}
