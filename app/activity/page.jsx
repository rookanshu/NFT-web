'use client';

import Link from 'next/link';
import { activity, marketplaceItems } from '../data';
import { useMarketplace } from '../marketplace-provider';

export default function ActivityPage() {
  const { openWalletModal } = useMarketplace();

  return (
    <div className="activity-page-container fade-in">
      <section className="activity-page">
        <p className="eyebrow">On-chain telemetry & live trades</p>
        <h1>Market Activity Log</h1>
        <p className="page-intro">
          A real-time ledger of verified NFT sales, active bids, and new listings across Ethereum and multi-chain networks.
        </p>

        <div className="activity-table">
          {[...activity, ...activity].map((event, index) => {
            const item = marketplaceItems.find((entry) => entry.title === event.title);
            return (
              <div key={`${event.title}-${index}`} className="activity-row">
                <img src={event.image} alt={event.title} />
                <div>
                  <b>
                    <span className={`event-badge ${event.type.toLowerCase()}`}>{event.type}</span>{' '}
                    <span>{event.title}</span>
                  </b>
                  <p>{event.detail} · {event.time}</p>
                </div>
                <strong>{event.price}</strong>
                {item && (
                  <button
                    className="outline-button small-btn"
                    onClick={() => openWalletModal('trade', item)}
                  >
                    ⚡ Trade via Extension
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
