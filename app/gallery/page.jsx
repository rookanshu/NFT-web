'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { categories, marketplaceItems } from '../data';
import { useMarketplace } from '../marketplace-provider';

export default function GalleryPage() {
  const { favorites, toggleFavorite, openWalletModal } = useMarketplace();
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Newest');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const filteredCollection = useMemo(() => {
    const queryMatch = (item) => `${item.title} ${item.creator} ${item.collection}`.toLowerCase().includes(query.toLowerCase());
    const filtered = marketplaceItems.filter((item) => (category === 'All' || item.category === category) && queryMatch(item));
    return [...filtered].sort((a, b) => sort === 'Cheapest' ? a.price - b.price : sort === 'Highest' ? b.price - a.price : 0);
  }, [category, sort, query]);

  return (
    <div className="gallery-page-container fade-in">
      <section className="section-block">
        <div className="section-heading discover-heading" style={{ marginTop: '20px' }}>
          <div>
            <p className="eyebrow">Complete Exhibition</p>
            <h1>Digital Art Gallery</h1>
            <p className="page-intro">
              Explore our full curation of rare digital assets, digital sculptures, and generative drops.
            </p>
          </div>

          <div className="filters">
            <label>
              Search Gallery
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Title, artist, collection"
              />
            </label>
            <label>
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Sort
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="Newest">Newest Drops</option>
                <option value="Cheapest">Price: Low to High</option>
                <option value="Highest">Price: High to Low</option>
              </select>
            </label>
            <div className="view-mode-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ≡
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="discover-grid">
            {filteredCollection.map((item) => {
              const liked = favorites.includes(item.id);
              return (
                <article className="art-card fade-in" key={item.id}>
                  <div className="art-image-wrap">
                    <Link href={`/item/${item.id}`}>
                      <img src={item.image} alt={item.title} className="art-image" />
                    </Link>
                    <button
                      className={liked ? 'heart-button is-liked' : 'heart-button'}
                      onClick={() => toggleFavorite(item.id)}
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
                </article>
              );
            })}
          </div>
        ) : (
          <div className="activity-list">
            {filteredCollection.map((item) => (
              <div key={item.id} className="activity-row">
                <img src={item.image} alt={item.title} />
                <div>
                  <b><Link href={`/item/${item.id}`}>{item.title}</Link></b>
                  <p>{item.creator} · {item.category} · {item.chain}</p>
                </div>
                <strong>{item.displayPrice}</strong>
                <button
                  className="primary-button small-btn"
                  onClick={() => openWalletModal('trade', item)}
                >
                  ⚡ Trade via Extension
                </button>
              </div>
            ))}
          </div>
        )}

        {!filteredCollection.length && (
          <p className="empty-state">No artwork matches your search filters.</p>
        )}
      </section>
    </div>
  );
}

