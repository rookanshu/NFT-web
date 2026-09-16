'use client';

import './globals.css';
import { MarketplaceProvider, useMarketplace } from './marketplace-provider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import WalletConnector from './components/WalletConnector';
import WalletExtensionModal from './components/WalletExtensionModal';

function HeaderNav() {
  const pathname = usePathname();
  const { profile } = useMarketplace();

  const navItems = [
    { label: 'Discover', href: '/' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Activity', href: '/activity' },
  ];

  return (
    <header className="site-header">
      <Link href="/" className="brand">NFT<span>.com</span></Link>
      <nav className="main-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'active' : ''}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="header-actions">
        <WalletConnector />
        {profile ? (
          <Link href="/profile" className="text-link profile-link">
            👤 {profile.name.split(' ')[0]}
          </Link>
        ) : (
          <Link href="/login" className="text-link login-link">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

function GlobalFooter() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="brand">NFT<span>.com</span></Link>
        <p>Curating the next chapter of digital culture & Web3 decentralized assets.</p>
      </div>
      <div className="footer-links">
        <div>
          <b>Marketplace</b>
          <Link href="/">Discover</Link>
          <Link href="/gallery">Gallery</Link>
          <Link href="/activity">Live Activity</Link>
        </div>
        <div>
          <b>Platform</b>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact Support</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div>
          <b>Account</b>
          <Link href="/profile">Collector Profile</Link>
          <Link href="/login">Sign In / Register</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 NFT.com Platform Inc. All rights reserved.</span>
        <span>Made for collectors & creators worldwide.</span>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>NFT.com | Discover Digital Art & Crypto Wallet Extension</title>
        <meta name="description" content="Discover, collect, and trade extraordinary NFTs with Web3 Crypto Wallet Extension integration." />
      </head>
      <body>
        <MarketplaceProvider>
          <div className="site-shell">
            <div className="ticker-bar">
              <span>🔥 ETH/USD $2,650 (+3.4%)</span>
              <span>⚡ Web3 Wallet Chrome Extension Integration Active</span>
              <span>💎 0% Platform Gas Surcharge</span>
            </div>
            <HeaderNav />
            <main className="page-content">{children}</main>
            <WalletExtensionModal />
            <GlobalFooter />
          </div>
        </MarketplaceProvider>
      </body>
    </html>
  );
}
