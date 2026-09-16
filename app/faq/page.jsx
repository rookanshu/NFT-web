'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqList = [
  {
    q: 'How does the Crypto Wallet Chrome Extension work on NFT.com?',
    a: 'The Chrome Extension integrates directly into your browser header. Clicking "Connect Extension Wallet" unlocks non-custodial trading, instant NFT purchases, listing items for sale, and currency swapping directly from your multi-chain wallet balances.'
  },
  {
    q: 'Can I directly buy or sell NFTs using the Chrome Extension interface?',
    a: 'Yes! The extension popup features a dedicated "Buy / Sell NFT" tab. You can select any NFT drop from the marketplace, view live gas estimations, set listing prices, and confirm transactions instantly.'
  },
  {
    q: 'How does the Currency Swap feature work?',
    a: 'Our built-in automated market maker (AMM) router lets you swap ETH, USDC, SOL, and USDT directly inside the Chrome Extension popup. Select your input and target currency, adjust slippage tolerance, and execute the swap with instant output estimations.'
  },
  {
    q: 'Are there any hidden platform fees for extension transactions?',
    a: 'NFT.com imposes 0% additional platform surcharge fees on wallet extension trades. Standard network gas fees and 5% perpetual creator royalties apply to secondary sales.'
  },
  {
    q: 'Is my wallet private key stored on NFT.com servers?',
    a: 'Never. NFT.com operates on a strictly non-custodial architecture. All smart contract signing occurs locally inside your browser extension environment. Your seed phrase and private keys never leave your machine.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="faq-page-container fade-in">
      <section className="section-block" style={{ marginTop: '40px' }}>
        <p className="eyebrow">Knowledge Base & Web3 Guides</p>
        <h1>Frequently Asked Questions</h1>
        <p className="page-intro">
          Everything you need to know about wallet extension integration, NFT trading mechanics, currency swapping, and account security.
        </p>

        <div className="faq-list">
          {faqList.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-question-btn"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="faq-answer fade-in">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="profile-callout" style={{ marginTop: '80px' }}>
          <h2>Still have questions?</h2>
          <p>Our Web3 support engineers are ready to assist you with any extension or on-chain transaction inquiries.</p>
          <Link href="/contact" className="primary-button">
            Contact Support Desk ↗
          </Link>
        </div>
      </section>
    </div>
  );
}

