'use client';

import { useState } from 'react';
import { firmInfo } from '@/lib/data/team';
import styles from './page.module.css';

export default function ContactPage() {
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          ...formData,
          from_name: 'STNP Website Contact Form',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const address = firmInfo.address;

  return (
    <>
      {/* Hero */}
      <section className={styles.pageHero}>
        <div className={styles.heroOverlay} />
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.breadcrumb}>Home / Contact</span>
            <h1 className={styles.heroTitle}>Contact Us</h1>
            <p className={styles.heroSubtitle}>
              Get in touch with our legal team for a consultation.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            {/* Form */}
            <div className={styles.formWrapper}>
              <h2 className={styles.formHeading}>Send Us a Message</h2>
              <hr className="divider divider--left" />

              {status === 'success' && (
                <div className={styles.successMsg}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
                    <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p>Thank you! Your message has been sent successfully. We&apos;ll get back to you soon.</p>
                </div>
              )}

              {status === 'error' && (
                <div className={styles.errorMsg}>
                  <p>Something went wrong. Please try again or email us directly.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-name" className={styles.label}>Full Name *</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-email" className={styles.label}>Email *</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-phone" className={styles.label}>Phone</label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="+62 xxx xxxx xxxx"
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-subject" className={styles.label}>Subject *</label>
                    <input
                      id="contact-subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className={styles.input}
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="contact-message" className={styles.label}>Message *</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className={styles.textarea}
                    placeholder="Please describe your legal matter..."
                  />
                </div>
                <button
                  type="submit"
                  className={`btn btn--primary ${styles.submitBtn}`}
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Info Sidebar */}
            <div className={styles.infoSidebar}>
              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Office Address</h3>
                <address className={styles.infoAddress}>
                  {address.line1}<br />
                  {address.line2}<br />
                  {address.city}, {address.postal}<br />
                  {address.country}
                </address>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Phone</h3>
                {firmInfo.phone.map((p, i) => (
                  <p key={i} className={styles.infoValue}>{p}</p>
                ))}
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Email</h3>
                <a href={`mailto:${firmInfo.email}`} className={styles.infoEmail}>
                  {firmInfo.email}
                </a>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.infoTitle}>Office Hours</h3>
                <p className={styles.infoValue}>Monday — Friday</p>
                <p className={styles.infoValue}>09:00 — 17:00 WIB</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
