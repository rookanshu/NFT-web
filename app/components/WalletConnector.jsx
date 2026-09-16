'use client';

import { useMarketplace } from '../marketplace-provider';

export default function WalletConnector() {
  const { wallet, balances, openWalletModal } = useMarketplace();

  return (
    <div className="wallet-connector-wrapper">
      {wallet ? (
        <div className="connected-wallet-btn-group">
          <button
            className="outline-button connected-badge"
            onClick={() => openWalletModal('wallet')}
            title="Open Crypto Wallet Extension"
          >
            <span className="live-dot" />
            <span className="wallet-addr">{wallet.address}</span>
            <span className="wallet-bal">({balances.ETH} ETH)</span>
          </button>
          <button
            className="ext-quick-trade-btn"
            onClick={() => openWalletModal('swap')}
            title="Swap Currency via Extension"
          >
            🔄 Swap
          </button>
        </div>
      ) : (
        <button
          className="outline-button connect-ext-btn"
          onClick={() => openWalletModal('trade')}
        >
          <span className="ext-icon">⚡</span> Connect Wallet Extension
        </button>
      )}
    </div>
  );
}
