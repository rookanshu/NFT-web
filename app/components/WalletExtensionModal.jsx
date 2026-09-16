'use client';

import { useState } from 'react';
import { useMarketplace } from '../marketplace-provider';
import { marketplaceItems } from '../data';

export default function WalletExtensionModal() {
  const {
    wallet,
    balances,
    collected,
    isWalletModalOpen,
    walletModalTab,
    activeTradeItem,
    connectWallet,
    closeWalletModal,
    buyNFT,
    sellNFT,
    swapCurrency
  } = useMarketplace();

  const [tab, setTab] = useState('trade'); // 'wallet' | 'trade' | 'swap'
  const activeTab = walletModalTab || tab;

  // Trade state
  const [selectedItemId, setSelectedItemId] = useState(activeTradeItem?.id || marketplaceItems[0].id);
  const [tradeMode, setTradeMode] = useState('buy'); // 'buy' | 'sell'
  const [sellPrice, setSellPrice] = useState('1.5');
  const [tradeStatus, setTradeStatus] = useState({ error: '', success: '' });

  // Swap state
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [swapAmount, setSwapAmount] = useState('0.5');
  const [slippage, setSlippage] = useState('0.5%');
  const [swapStatus, setSwapStatus] = useState({ error: '', success: '' });

  if (!isWalletModalOpen) return null;

  const currentItem = activeTradeItem || marketplaceItems.find((i) => i.id === selectedItemId) || marketplaceItems[0];

  const handleBuy = () => {
    setTradeStatus({ error: '', success: '' });
    const res = buyNFT(currentItem);
    if (!res.ok) {
      setTradeStatus({ error: res.error, success: '' });
    } else {
      setTradeStatus({ error: '', success: res.message });
    }
  };

  const handleSell = () => {
    setTradeStatus({ error: '', success: '' });
    const res = sellNFT(currentItem, sellPrice);
    if (!res.ok) {
      setTradeStatus({ error: res.error, success: '' });
    } else {
      setTradeStatus({ error: '', success: res.message });
    }
  };

  const handleSwap = () => {
    setSwapStatus({ error: '', success: '' });
    if (fromToken === toToken) {
      setSwapStatus({ error: 'Please choose two different currencies to swap.', success: '' });
      return;
    }
    const res = swapCurrency(fromToken, toToken, swapAmount);
    if (!res.ok) {
      setSwapStatus({ error: res.error, success: '' });
    } else {
      setSwapStatus({ error: '', success: res.message });
    }
  };

  // Rates for preview
  const ratesInEth = { ETH: 1.0, USDC: 0.00038, SOL: 0.054, USDT: 0.00038 };
  const numVal = parseFloat(swapAmount) || 0;
  const fromInEth = numVal * ratesInEth[fromToken];
  const estimatedOutput = (fromInEth / ratesInEth[toToken]).toFixed(4);

  return (
    <div className="ext-modal-overlay" onClick={closeWalletModal}>
      <div className="ext-modal-container fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header extension banner */}
        <div className="ext-header">
          <div className="ext-brand">
            <span className="ext-icon">⚡</span>
            <div>
              <div className="ext-title">Crypto Wallet Chrome Extension</div>
              <div className="ext-subtitle">Direct Web3 Trading & Swap v2.4</div>
            </div>
          </div>
          <button className="ext-close-btn" onClick={closeWalletModal} aria-label="Close Extension Modal">×</button>
        </div>

        {/* Tab navigation */}
        <div className="ext-tabs">
          <button
            className={activeTab === 'trade' ? 'active' : ''}
            onClick={() => setTab('trade')}
          >
            Buy / Sell NFT
          </button>
          <button
            className={activeTab === 'swap' ? 'active' : ''}
            onClick={() => setTab('swap')}
          >
            Currency Swap
          </button>
          <button
            className={activeTab === 'wallet' ? 'active' : ''}
            onClick={() => setTab('wallet')}
          >
            Wallet Balances
          </button>
        </div>

        {/* Tab Content */}
        <div className="ext-body">
          {!wallet && (
            <div className="ext-connect-banner">
              <p>Connect your extension to perform on-chain actions.</p>
              <button className="primary-button" onClick={connectWallet}>
                Connect Chrome Extension
              </button>
            </div>
          )}

          {/* TAB: TRADE (BUY / SELL) */}
          {activeTab === 'trade' && (
            <div className="ext-section">
              <div className="ext-trade-mode">
                <button
                  className={tradeMode === 'buy' ? 'active' : ''}
                  onClick={() => { setTradeMode('buy'); setTradeStatus({ error: '', success: '' }); }}
                >
                  Buy NFT
                </button>
                <button
                  className={tradeMode === 'sell' ? 'active' : ''}
                  onClick={() => { setTradeMode('sell'); setTradeStatus({ error: '', success: '' }); }}
                >
                  Sell NFT
                </button>
              </div>

              {!activeTradeItem && (
                <div className="ext-field-group">
                  <label>Select NFT Item</label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => setSelectedItemId(e.target.value)}
                    className="ext-select"
                  >
                    {marketplaceItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} — {item.displayPrice}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Item Card Preview */}
              <div className="ext-item-preview">
                <img src={currentItem.image} alt={currentItem.title} className="ext-item-thumb" />
                <div className="ext-item-info">
                  <h4>{currentItem.title}</h4>
                  <p>{currentItem.creator} • {currentItem.chain}</p>
                  <div className="ext-item-price">
                    <span>Listed Price:</span>
                    <strong>{currentItem.displayPrice}</strong>
                  </div>
                </div>
              </div>

              {tradeMode === 'buy' ? (
                <div className="ext-trade-details">
                  <div className="ext-row">
                    <span>Item Price</span>
                    <span>{currentItem.displayPrice}</span>
                  </div>
                  <div className="ext-row">
                    <span>Est. Gas Fee</span>
                    <span>0.0021 ETH</span>
                  </div>
                  <div className="ext-row total">
                    <span>Your Balance</span>
                    <span>{balances.ETH} ETH</span>
                  </div>

                  {tradeStatus.error && <p className="ext-error">{tradeStatus.error}</p>}
                  {tradeStatus.success && <p className="ext-success">{tradeStatus.success}</p>}

                  <button
                    className="primary-button ext-action-btn"
                    onClick={handleBuy}
                    disabled={!wallet}
                  >
                    Confirm Instant Buy via Extension ↗
                  </button>
                </div>
              ) : (
                <div className="ext-trade-details">
                  <div className="ext-field-group">
                    <label>Set Listing Price (ETH)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.01"
                      value={sellPrice}
                      onChange={(e) => setSellPrice(e.target.value)}
                      className="ext-input"
                    />
                  </div>
                  <div className="ext-row">
                    <span>Creator Royalty</span>
                    <span>5.0%</span>
                  </div>
                  <div className="ext-row">
                    <span>Marketplace Fee</span>
                    <span>1.5%</span>
                  </div>

                  {tradeStatus.error && <p className="ext-error">{tradeStatus.error}</p>}
                  {tradeStatus.success && <p className="ext-success">{tradeStatus.success}</p>}

                  <button
                    className="primary-button ext-action-btn"
                    onClick={handleSell}
                    disabled={!wallet}
                  >
                    List NFT for Sale via Extension ↗
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: SWAP CURRENCY */}
          {activeTab === 'swap' && (
            <div className="ext-section">
              <div className="ext-swap-container">
                <div className="ext-swap-card">
                  <div className="ext-swap-label">You Pay</div>
                  <div className="ext-swap-input-row">
                    <input
                      type="number"
                      step="0.1"
                      value={swapAmount}
                      onChange={(e) => setSwapAmount(e.target.value)}
                      className="ext-swap-input"
                      placeholder="0.0"
                    />
                    <select
                      value={fromToken}
                      onChange={(e) => setFromToken(e.target.value)}
                      className="ext-token-select"
                    >
                      <option value="ETH">ETH</option>
                      <option value="USDC">USDC</option>
                      <option value="SOL">SOL</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                  <div className="ext-swap-subtext">
                    Balance: {balances[fromToken] || 0} {fromToken}
                  </div>
                </div>

                <div className="ext-swap-divider">
                  <button
                    className="ext-swap-flip"
                    onClick={() => {
                      const temp = fromToken;
                      setFromToken(toToken);
                      setToToken(temp);
                    }}
                    title="Flip Token Selection"
                  >
                    ↓
                  </button>
                </div>

                <div className="ext-swap-card">
                  <div className="ext-swap-label">You Receive (Est.)</div>
                  <div className="ext-swap-input-row">
                    <input
                      type="text"
                      readOnly
                      value={isNaN(estimatedOutput) ? '0.00' : estimatedOutput}
                      className="ext-swap-input"
                    />
                    <select
                      value={toToken}
                      onChange={(e) => setToToken(e.target.value)}
                      className="ext-token-select"
                    >
                      <option value="USDC">USDC</option>
                      <option value="ETH">ETH</option>
                      <option value="SOL">SOL</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                  <div className="ext-swap-subtext">
                    Balance: {balances[toToken] || 0} {toToken}
                  </div>
                </div>

                <div className="ext-row ext-slippage-row">
                  <span>Slippage Tolerance</span>
                  <div className="ext-slippage-options">
                    {['0.1%', '0.5%', '1.0%'].map((val) => (
                      <button
                        key={val}
                        className={slippage === val ? 'active' : ''}
                        onClick={() => setSlippage(val)}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {swapStatus.error && <p className="ext-error">{swapStatus.error}</p>}
                {swapStatus.success && <p className="ext-success">{swapStatus.success}</p>}

                <button
                  className="primary-button ext-action-btn"
                  onClick={handleSwap}
                  disabled={!wallet}
                >
                  Swap Currency via Extension ↗
                </button>
              </div>
            </div>
          )}

          {/* TAB: WALLET BALANCES & STATUS */}
          {activeTab === 'wallet' && (
            <div className="ext-section">
              <div className="ext-wallet-status-box">
                <div className="ext-status-header">
                  <span className={`ext-status-dot ${wallet ? 'online' : 'offline'}`} />
                  <strong>{wallet ? 'Extension Connected' : 'Extension Disconnected'}</strong>
                </div>
                {wallet && (
                  <div className="ext-wallet-address-meta">
                    <p>Address: <code>{wallet.address}</code></p>
                    <p>Network: <span>{wallet.network}</span></p>
                  </div>
                )}
              </div>

              <h4 className="ext-balances-title">Multi-Chain Balances</h4>
              <div className="ext-balances-grid">
                <div className="ext-balance-card">
                  <span>Ethereum</span>
                  <strong>{balances.ETH} ETH</strong>
                  <small>≈ ${(balances.ETH * 2650).toLocaleString()} USD</small>
                </div>
                <div className="ext-balance-card">
                  <span>USD Coin</span>
                  <strong>{balances.USDC.toLocaleString()} USDC</strong>
                  <small>≈ ${balances.USDC.toLocaleString()} USD</small>
                </div>
                <div className="ext-balance-card">
                  <span>Solana</span>
                  <strong>{balances.SOL} SOL</strong>
                  <small>≈ ${(balances.SOL * 145).toLocaleString()} USD</small>
                </div>
                <div className="ext-balance-card">
                  <span>Tether USD</span>
                  <strong>{balances.USDT.toLocaleString()} USDT</strong>
                  <small>≈ ${balances.USDT.toLocaleString()} USD</small>
                </div>
              </div>

              <div className="ext-wallet-actions">
                <button
                  className={wallet ? 'secondary-button' : 'primary-button'}
                  onClick={connectWallet}
                >
                  {wallet ? 'Disconnect Extension' : 'Connect Chrome Extension'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

