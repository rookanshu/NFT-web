'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { activity, categories, marketplaceItems } from './data';
import { useMarketplace } from './marketplace-provider';

function ArrowIcon() { return <span aria-hidden="true">↗</span>; }

function Countdown({ seconds }) {
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    const timer = window.setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  return <span>{hours}h {String(minutes).padStart(2, '0')}m left</span>;
}

function ArtCard({ item, auction = false }) {
  const { favorites, toggleFavorite, openWalletModal } = useMarketplace();
  const liked = favorites.includes(item.id);

  return (
    <article className="art-card fade-in">
      <div className="art-image-wrap">
        <Link href={`/item/${item.id}`}>
          <img src={item.image} alt={item.title} className="art-image" />
        </Link>
        <button
          className={liked ? 'heart-button is-liked' : 'heart-button'}
          onClick={() => toggleFavorite(item.id)}
          aria-label={`${liked ? 'Remove' : 'Like'} ${item.title}`}
        >
          {liked ? '♥' : '♡'}
        </button>
        <div className="art-card-overlay">
          <button
            className="card-quick-buy-btn"
            onClick={() => openWalletModal('trade', item)}
          >
            ⚡ Buy / Trade via Extension
          </button>
        </div>
      </div>
      <div className="card-details">
        <div>
          <h3><Link href={`/item/${item.id}`}>{item.title}</Link></h3>
          <p>{item.creator} {item.verified && <span className="verified">✓</span>}</p>
        </div>
        <strong>{item.displayPrice}</strong>
      </div>
      {auction && <p className="card-date"><Countdown seconds={item.endsIn} /></p>}
    </article>
  );
}

export default function Home() {
  const { openWalletModal } = useMarketplace();
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [query, setQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(8);

  const filteredCollection = useMemo(() => {
    const queryMatch = (item) => `${item.title} ${item.creator} ${item.collection}`.toLowerCase().includes(query.toLowerCase());
    const filtered = marketplaceItems.filter((item) => (category === 'All' || item.category === category) && queryMatch(item));
    return [...filtered].sort((a, b) => sort === 'Cheapest' ? a.price - b.price : sort === 'Highest' ? b.price - a.price : 0);
  }, [category, sort, query]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero fade-in">
        <div className="hero-copy">
          <p className="eyebrow">The future of Web3 digital ownership</p>
          <h1>Collect what <em>moves</em> you.</h1>
          <p className="hero-description">
            Discover, collect, and swap extraordinary digital assets seamlessly with Chrome Extension wallet integration.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#discover">
              Explore Collection <ArrowIcon />
            </a>
            <button className="outline-button ext-hero-btn" onClick={() => openWalletModal('swap')}>
              🔄 Swap Currency via Extension
            </button>
          </div>
          <div className="hero-proof">
            <span>●</span> 240,000+ active Web3 collectors exploring on-chain drops
          </div>
        </div>

        <div className="feature-art-container">
          <Link href="/item/bored-ape" className="feature-art">
            <img src="/assets/bored-ape-yacht-club-banner.webp" alt="Bored Ape digital artwork" />
            <div className="feature-caption">
              <div>
                <p>Featured Drop</p>
                <h2>Bored Ape Yacht Club #8817</h2>
              </div>
              <span className="price-pill">28 ETH ↗</span>
            </div>
            <div className="art-index">01 <span>/ 04</span></div>
          </Link>
          <button className="feature-trade-overlay-btn" onClick={() => openWalletModal('trade', marketplaceItems[0])}>
            ⚡ Buy / Trade via Extension
          </button>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="auction-section section-block" id="activity">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Curated weekly drops</p>
            <h2>Hot Auctions</h2>
          </div>
          <Link href="/gallery" className="view-link">View all in Gallery <ArrowIcon /></Link>
        </div>
        <div className="auction-grid">
          {marketplaceItems.filter((item) => item.auction).map((item) => (
            <ArtCard key={item.id} item={item} auction />
          ))}
        </div>
      </section>

      {/* Live Activity Strip */}
      <section className="activity-strip section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow">On-chain telemetry</p>
            <h2>Recent Market Activity</h2>
          </div>
          <Link href="/activity" className="view-link">Open Activity Log <ArrowIcon /></Link>
        </div>
        <div className="activity-list">
          {activity.map((event) => {
            const matchedItem = marketplaceItems.find((item) => item.title === event.title);
            return (
              <div key={`${event.title}-${event.time}`} className="activity-row">
                <img src={event.image} alt="" />
                <div>
                  <b>{event.type} <span>{event.title}</span></b>
                  <p>{event.detail} · {event.time}</p>
                </div>
                <strong>{event.price}</strong>
                {matchedItem && (
                  <button
                    className="outline-button small-btn"
                    onClick={() => openWalletModal('trade', matchedItem)}
                  >
                    Trade
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* How it Works / Web3 Chrome Extension Info */}
      <section className="learn-section" id="how-it-works">
        <div>
          <p className="eyebrow">Web3 Extension Trading</p>
          <h2>Direct NFT trades & currency swaps.</h2>
        </div>
        <div className="learn-steps">
          <div>
            <b>01</b>
            <h3>Connect Extension Wallet</h3>
            <p>Use your Chrome Extension to connect your multi-chain Web3 wallet with zero setup friction.</p>
          </div>
          <div>
            <b>02</b>
            <h3>Instant Buy & Sell</h3>
            <p>Directly buy high-tier digital collectibles or list items for sale through the Chrome Extension popup.</p>
          </div>
          <div>
            <b>03</b>
            <h3>Swap Tokens On The Fly</h3>
            <p>Exchange ETH, USDC, SOL, and USDT directly with automated market maker pricing.</p>
          </div>
        </div>
      </section>

      {/* Discover / Browse Market */}
      <section className="discover-section section-block" id="discover">
        <div className="section-heading discover-heading">
          <div>
            <p className="eyebrow">Browse the marketplace</p>
            <h2>Discover Fine NFTs</h2>
          </div>
          <div className="filters">
            <label>
              Search
              <input
                value={query}
                onChange={(event) => { setQuery(event.target.value); setVisibleCount(8); }}
                placeholder="Artist, collection, work"
              />
            </label>
            <label>
              Category
              <select
                value={category}
                onChange={(event) => { setCategory(event.target.value); setVisibleCount(8); }}
              >
                {categories.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>
              Sort By
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option>Newest</option>
                <option>Cheapest</option>
                <option>Highest</option>
              </select>
            </label>
          </div>
        </div>
        <div className="discover-grid">
          {filteredCollection.slice(0, visibleCount).map((item) => (
            <ArtCard key={item.id} item={item} />
          ))}
        </div>
        {!filteredCollection.length && <p className="empty-state">No works match your search criteria.</p>}
        {visibleCount < filteredCollection.length && (
          <button className="load-button" onClick={() => setVisibleCount((count) => count + 4)}>
            Load More Digital Works
          </button>
        )}
      </section>
    </div>
  );
}
