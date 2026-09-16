'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page-container fade-in">
      <section className="section-block" style={{ marginTop: '40px' }}>
        <div className="contact-grid">
          <div className="contact-info">
            <p className="eyebrow">Direct Line to Support</p>
            <h1>We're here to <em>help</em> you build & collect.</h1>
            <p className="page-intro">
              Have questions about your Chrome Extension connection, NFT trades, currency swaps, or creator verification? Reach out to our dedicated support team.
            </p>

            <div className="contact-meta-box">
              <div className="contact-meta-item">
                <span>⚡ Support Status</span>
                <strong>24/7 Active Web3 Desk</strong>
              </div>
              <div className="contact-meta-item">
                <span>✉️ Official Email</span>
                <strong>support@nft.com</strong>
              </div>
              <div className="contact-meta-item">
                <span>💬 Community</span>
                <strong>Discord & Telegram Verified</strong>
              </div>
            </div>
          </div>

          <div className="contact-form-wrap">
            {submitted ? (
              <div className="contact-success-card fade-in">
                <h2>Message Received! ✓</h2>
                <p>Thank you for reaching out, {formData.name || 'Collector'}. A support specialist will respond within 2 hours.</p>
                <button className="outline-button" onClick={() => setSubmitted(false)}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <label>
                  Your Name
                  <input
                    type="text"
                    required
                    placeholder="e.g. Satoshi Nakamoto"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </label>

                <label>
                  Email Address
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </label>

                <label>
                  Inquiry Topic
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Chrome Extension Wallet">Chrome Extension Wallet</option>
                    <option value="NFT Buy/Sell Issue">NFT Buy / Sell Issue</option>
                    <option value="Currency Swap">Currency Swap Assistance</option>
                    <option value="Artist Verification">Artist Verification Application</option>
                  </select>
                </label>

                <label>
                  Message
                  <textarea
                    rows="5"
                    required
                    placeholder="Describe your issue or feedback in detail..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </label>

                <button className="primary-button" type="submit">
                  Submit Inquiry <span>↗</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

