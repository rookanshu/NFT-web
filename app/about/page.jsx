'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="about-page-container fade-in">
      {/* Hero */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Pioneering Web3 Digital Culture</p>
          <h1>Democratizing <em>ownership</em> for everyone.</h1>
          <p className="hero-description">
            NFT.com is built at the intersection of cryptography, fine art, and decentralized finance. We empower digital creators with non-custodial trading, extension-level wallet integration, and automated currency swaps.
          </p>
          <div className="hero-actions">
            <Link href="/gallery" className="primary-button">
              Explore Gallery Drops ↗
            </Link>
            <Link href="/contact" className="secondary-button">
              Get in Touch
            </Link>
          </div>
        </div>
        <div className="about-hero-graphic">
          <img src="/assets/planetfall.avif" alt="Digital Art Architecture" />
        </div>
      </section>

      {/* Metrics Counter */}
      <section className="profile-metrics section-block" style={{ marginTop: '0' }}>
        <div>
          <span>Trading Volume</span>
          <strong>$480M+</strong>
        </div>
        <div>
          <span>Active Collectors</span>
          <strong>240,000+</strong>
        </div>
        <div>
          <span>On-Chain Artists</span>
          <strong>18,500+</strong>
        </div>
      </section>

      {/* Mission */}
      <section className="learn-section">
        <div>
          <p className="eyebrow">Our Core Principles</p>
          <h2>Architecting the next era of digital art.</h2>
        </div>
        <div className="learn-steps">
          <div>
            <b>01</b>
            <h3>True Ownership</h3>
            <p>Every piece listed on NFT.com resides securely on non-custodial smart contracts verified on-chain.</p>
          </div>
          <div>
            <b>02</b>
            <h3>Extension Native</h3>
            <p>Seamlessly interact with smart contracts directly through your Web3 Chrome extension with 0% extra surcharge fees.</p>
          </div>
          <div>
            <b>03</b>
            <h3>Artist First Royalties</h3>
            <p>Enforcing perpetual 5% creator royalties directly in transaction logic on secondary sales.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
