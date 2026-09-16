'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { marketplaceItems } from '../data';
import { useMarketplace } from '../marketplace-provider';

export default function ProfilePage() {
  const router = useRouter();
  const { wallet, balances, profile, favorites, collected, openWalletModal, signOut } = useMarketplace();
  const saved = marketplaceItems.filter((item) => favorites.includes(item.id));

  if (!profile) {
    return (
      <div className="simple-page fade-in">
        <p className="eyebrow">Members only</p>
        <h1>Your collector profile is private.</h1>
        <p className="page-intro">Sign in to view favorites, collected NFTs, and Chrome Extension wallet holdings.</p>
        <button className="primary-button" onClick={() => router.push('/login')}>
          Sign In Now <span>↗</span>
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page-container fade-in">
      <section className="profile-page">
        <div className="profile-heading">
          <div>
            <p className="eyebrow">Collector Profile</p>
            <h1>{profile.name}</h1>
            <p>{profile.email} · Member since {profile.joined}</p>
          </div>
          <div className="profile-actions">
            <button
              className="outline-button"
              onClick={() => openWalletModal('wallet')}
            >
              ⚡ Extension: {wallet ? wallet.address : 'Connect Wallet'}
            </button>
            <button
              className="outline-button"
              onClick={() => openWalletModal('swap')}
            >
              🔄 Swap Currency
            </button>
            <button className="secondary-button" onClick={() => { signOut(); router.push('/'); }}>
              Sign Out
            </button>
          </div>
        </div>

        <div className="profile-metrics">
          <div>
            <span>Saved Favorites</span>
            <strong>{saved.length}</strong>
          </div>
          <div>
            <span>Collected NFTs</span>
            <strong>{collected.length}</strong>
          </div>
          <div>
            <span>Extension ETH Balance</span>
            <strong>{balances.ETH} ETH</strong>
          </div>
        </div>

        <div className="profile-callout">
          <h2>Web3 Wallet Extension Controls.</h2>
          <p>
            Your account is authenticated. Use the Chrome Extension popup to execute instant NFT buys/sells or token currency swaps across Ethereum, USDC, and Solana.
          </p>
          <span className="security-badge">✓ Chrome Extension Connected & Secured</span>
        </div>

        {/* Collected Items */}
        <div className="profile-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your Collection</p>
              <h2>Collected On-Chain NFTs</h2>
            </div>
          </div>
          {collected.length ? (
            <div className="discover-grid">
              {collected.map((item, idx) => (
                <div className="art-card" key={`${item.id}-${idx}`}>
                  <div className="art-image-wrap">
                    <img src={item.image} alt={item.title} className="art-image" />
                    <div className="art-card-overlay">
                      <button
                        className="card-quick-buy-btn"
                        onClick={() => openWalletModal('trade', item)}
                      >
                        Sell via Extension
                      </button>
                    </div>
                  </div>
                  <div className="card-details">
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.creator}</p>
                    </div>
                    <strong>{item.displayPrice}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No collected NFTs yet. Use the Chrome Extension to buy your first drop!</p>
          )}
        </div>

        {/* Shortlist Items */}
        <div className="profile-section" style={{ marginTop: '60px' }}>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Your Shortlist</p>
              <h2>Saved Works</h2>
            </div>
          </div>
          {saved.length ? (
            <div className="discover-grid">
              {saved.map((item) => (
                <div className="art-card" key={item.id}>
                  <div className="art-image-wrap">
                    <Link href={`/item/${item.id}`}>
                      <img src={item.image} alt={item.title} className="art-image" />
                    </Link>
                    <div className="art-card-overlay">
                      <button
                        className="card-quick-buy-btn"
                        onClick={() => openWalletModal('trade', item)}
                      >
                        ⚡ Buy via Extension
                      </button>
                    </div>
                  </div>
                  <div className="card-details">
                    <div>
                      <h3><Link href={`/item/${item.id}`}>{item.title}</Link></h3>
                      <p>{item.creator}</p>
                    </div>
                    <strong>{item.displayPrice}</strong>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">Your saved works will appear here.</p>
          )}
        </div>
      </section>
    </div>
  );
}
