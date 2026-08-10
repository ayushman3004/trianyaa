// src/app/contact/page.tsx
'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import AnnouncementBar from '@/components/AnnouncementBar';
import Navbar from '@/components/Navbar';
import NewsletterFooter from '@/components/NewsletterFooter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMsg) setErrorMsg('');
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields (Name, Email, and Message).');
      return;
    }
    
    setIsSubmitting(true);
    // Pure frontend simulation state
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  }

  return (
    <main style={{ background: '#FFF8EF', minHeight: '100vh' }}>
      <AnnouncementBar />
      <Navbar />

      <section className="contact-hero-section">
        <div className="container">
          <motion.div
            className="contact-header center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="section-eyebrow">GET IN TOUCH</span>
            <h1 className="contact-main-title serif">We'd Love to Hear From You.</h1>
            <p className="contact-main-sub">
              Have a question about an order, a handmade piece, or anything Trianyaa? We'd be happy to hear from you.
            </p>
          </motion.div>

          <div className="contact-grid">
            {/* Left Column: Contact Cards */}
            <motion.div
              className="contact-info-col"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="contact-card">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h3>Email Us</h3>
                  <p>hello@trianyaa.com</p>
                  <span>We usually respond within 24 hours</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h3>Call or WhatsApp</h3>
                  <p>+91 98765 43210</p>
                  <span>Mon – Sat, 10:00 AM – 6:00 PM IST</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📸</div>
                <div className="contact-details">
                  <h3>Instagram</h3>
                  <p>@trianyaa_creations</p>
                  <span>Follow us for daily crochet process & updates</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h3>Studio Location</h3>
                  <p>Trianyaa Handmade Studio, India</p>
                  <span>Crafted with love in small artisanal batches</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div
              className="contact-form-col"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="contact-form-wrapper">
                {submitted ? (
                  <motion.div
                    className="contact-success-state center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="success-icon">✨</div>
                    <h3 className="serif">Message Received!</h3>
                    <p>
                      Thank you for reaching out to Trianyaa. We have received your note and will get back to you shortly.
                    </p>
                    <button
                      className="btn-primary"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', subject: '', message: '' });
                      }}
                      style={{ marginTop: '20px' }}
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <h2 className="form-heading serif">Send Us a Message</h2>
                    
                    {errorMsg && (
                      <div className="form-error-banner">{errorMsg}</div>
                    )}

                    <div className="form-group">
                      <label htmlFor="name">Your Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="e.g. Ananya Sharma"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="e.g. ananya@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="e.g. Custom Order Query / Craft Kit Question"
                        value={formData.subject}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="message">Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <motion.button
                      type="submit"
                      className="btn-primary submit-btn"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? 'Sending Message...' : 'Send Message →'}
                    </motion.button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <NewsletterFooter />
    </main>
  );
}
