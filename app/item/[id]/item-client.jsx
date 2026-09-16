'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getItem } from '../../data';
import { useMarketplace } from '../../marketplace-provider';

export default function ItemClient({ id }) {
  const item = getItem(id);
  const { wallet, favorites, toggleFavorite, openWalletModal } = useMarketplace();
  const [bid, setBid] = useState('');

  if (!item) {
    return (
      <div className="simple-page fade-in">
        <p className="eyebrow">404 Error</p>
        <h1>Work Not Found.</h1>
        <p className="page-intro">The requested NFT drop does not exist or has been unlisted.</p>
        <Link href="/" className="primary-button">
          Back to Marketplace Discover <span>↗</span>
        </Link>
      </div>
    );
  }

  const liked = favorites.includes(item.id);

  return (
    <div className="detail-page-container fade-in">
      <section className="detail-page">
        <div className="detail-art">
          <img src={item.image} alt={item.title} />
        </div>

        <div className="detail-copy">
          <p className="eyebrow">{item.collection} · Token ID {item.tokenId}</p>
          <h1>{item.title}</h1>
          <p className="detail-creator">
            Created by <strong>{item.creator}</strong> ({item.creatorHandle}){' '}
            {item.verified && <span className="verified">✓ Verified Creator</span>}
          </p>
          <p className="detail-description">{item.description}</p>

          <div className="detail-stats">
            <div>
              <span>Current List Price</span>
              <strong>{item.displayPrice}</strong>
              <small>≈ ${(item.price * 2650).toLocaleString()} USD</small>
            </div>
            <div>
              <span>Owners / Editions</span>
              <strong>{item.owners.toLocaleString()}</strong>
              <small>of {item.editions.toLocaleString()} total editions</small>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className="primary-button ext-buy-btn"
              onClick={() => openWalletModal('trade', item)}
            >
              ⚡ {item.auction ? 'Place Bid via Extension' : 'Buy Now via Extension'} <span>↗</span>
            </button>

            <button
              className="outline-button ext-swap-btn"
              onClick={() => openWalletModal('swap', item)}
            >
              🔄 Swap Currency
            </button>

            <button
              className={liked ? 'secondary-button is-liked' : 'secondary-button'}
              onClick={() => toggleFavorite(item.id)}
            >
              {liked ? '♥ Saved to Favorites' : '♡ Save to Favorites'}
            </button>
          </div>

          {item.auction && (
            <form
              className="bid-form"
              onSubmit={(e) => {
                e.preventDefault();
                openWalletModal('trade', item);
              }}
            >
              <label>
                Your On-Chain Bid (ETH)
                <input
                  type="number"
                  min={item.price}
                  step="0.01"
                  placeholder={`${item.price.toFixed(2)} ETH minimum`}
                  value={bid}
                  onChange={(event) => setBid(event.target.value)}
                />
              </label>
              <button className="outline-button" type="submit">
                Submit Bid via Extension
              </button>
            </form>
          )}

          <div className="chain-meta">
            <span>Network <b>{item.chain}</b></span>
            <span>Royalty <b>5.0%</b></span>
            <span>Contract <b>0x495f...7b5e</b></span>
            <span>Extension Ready <b>✓ Active</b></span>
          </div>
        </div>
      </section>
    </div>
  );
}
