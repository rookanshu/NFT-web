'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const MarketplaceContext = createContext(null);

const DEFAULT_BALANCES = {
  ETH: 4.82,
  USDC: 12450.00,
  SOL: 85.40,
  USDT: 3200.00
};

export function MarketplaceProvider({ children }) {
  const [wallet, setWallet] = useState(null);
  const [balances, setBalances] = useState(DEFAULT_BALANCES);
  const [favorites, setFavorites] = useState([]);
  const [collected, setCollected] = useState([]);
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletModalTab, setWalletModalTab] = useState('wallet'); // 'wallet' | 'trade' | 'swap'
  const [activeTradeItem, setActiveTradeItem] = useState(null);

  useEffect(() => {
    try {
      setWallet(JSON.parse(localStorage.getItem('nft-wallet')));
      setFavorites(JSON.parse(localStorage.getItem('nft-favorites')) || []);
      setCollected(JSON.parse(localStorage.getItem('nft-collected')) || []);
      const savedBalances = JSON.parse(localStorage.getItem('nft-balances'));
      if (savedBalances) setBalances(savedBalances);
      setProfile(JSON.parse(sessionStorage.getItem('nft-profile') || localStorage.getItem('nft-profile')));
    } catch (e) {
      console.error(e);
    } finally {
      setReady(true);
    }
  }, []);

  function saveBalances(newBalances) {
    setBalances(newBalances);
    localStorage.setItem('nft-balances', JSON.stringify(newBalances));
  }

  function connectWallet() {
    const nextWallet = wallet ? null : {
      address: '0x7A3f...91c4',
      network: 'Ethereum Mainnet',
      connectedAt: new Date().toISOString()
    };
    setWallet(nextWallet);
    if (nextWallet) {
      localStorage.setItem('nft-wallet', JSON.stringify(nextWallet));
    } else {
      localStorage.removeItem('nft-wallet');
    }
    return nextWallet;
  }

  function openWalletModal(tab = 'wallet', item = null) {
    if (tab) setWalletModalTab(tab);
    if (item) setActiveTradeItem(item);
    setIsWalletModalOpen(true);
  }

  function closeWalletModal() {
    setIsWalletModalOpen(false);
    setActiveTradeItem(null);
  }

  function toggleFavorite(id) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('nft-favorites', JSON.stringify(next));
      return next;
    });
  }

  function buyNFT(item) {
    if (!wallet) {
      connectWallet();
    }
    if (balances.ETH < item.price) {
      return { ok: false, error: `Insufficient ETH balance. You need ${item.price} ETH.` };
    }
    const newBalances = { ...balances, ETH: +(balances.ETH - item.price).toFixed(3) };
    saveBalances(newBalances);

    const nextCollected = [...collected, { ...item, boughtAt: new Date().toISOString() }];
    setCollected(nextCollected);
    localStorage.setItem('nft-collected', JSON.stringify(nextCollected));
    return { ok: true, message: `Successfully purchased ${item.title} via Extension!` };
  }

  function sellNFT(item, priceInEth) {
    if (!wallet) {
      connectWallet();
    }
    const price = parseFloat(priceInEth) || item.price;
    const newBalances = { ...balances, ETH: +(balances.ETH + price).toFixed(3) };
    saveBalances(newBalances);

    const nextCollected = collected.filter((i) => i.id !== item.id);
    setCollected(nextCollected);
    localStorage.setItem('nft-collected', JSON.stringify(nextCollected));
    return { ok: true, message: `Listed & Sold ${item.title} for ${price} ETH!` };
  }

  function swapCurrency(fromCurrency, toCurrency, amount) {
    if (!wallet) {
      connectWallet();
    }
    const val = parseFloat(amount);
    if (isNaN(val) || val <= 0) return { ok: false, error: 'Enter a valid amount to swap.' };
    if ((balances[fromCurrency] || 0) < val) {
      return { ok: false, error: `Insufficient ${fromCurrency} balance.` };
    }

    // Exchange rates relative to ETH
    const ratesInEth = { ETH: 1.0, USDC: 0.00038, SOL: 0.054, USDT: 0.00038 };
    const fromInEth = val * ratesInEth[fromCurrency];
    const receivedAmount = +(fromInEth / ratesInEth[toCurrency]).toFixed(4);

    const newBalances = {
      ...balances,
      [fromCurrency]: +(balances[fromCurrency] - val).toFixed(2),
      [toCurrency]: +((balances[toCurrency] || 0) + receivedAmount).toFixed(2)
    };
    saveBalances(newBalances);

    return {
      ok: true,
      message: `Swapped ${val} ${fromCurrency} for ${receivedAmount} ${toCurrency} via Wallet Extension!`
    };
  }

  async function hashPassword(password) {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  async function register({ name, email, password, remember }) {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = JSON.parse(localStorage.getItem('nft-accounts') || '{}');
    if (accounts[normalizedEmail]) return { ok: false, error: 'An account already exists for that email.' };
    accounts[normalizedEmail] = { name: name.trim(), passwordHash: await hashPassword(password), createdAt: new Date().toISOString(), attempts: 0, lockedUntil: 0 };
    localStorage.setItem('nft-accounts', JSON.stringify(accounts));
    return authenticate(normalizedEmail, password, remember);
  }

  async function authenticate(email, password, remember = false) {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = JSON.parse(localStorage.getItem('nft-accounts') || '{}');
    const account = accounts[normalizedEmail];
    if (!account) return { ok: false, error: 'No account found. Create one to continue.' };
    if (account.lockedUntil > Date.now()) return { ok: false, error: 'Too many attempts. Try again in a few minutes.' };
    if (account.passwordHash !== await hashPassword(password)) {
      account.attempts = (account.attempts || 0) + 1;
      if (account.attempts >= 5) { account.lockedUntil = Date.now() + 5 * 60 * 1000; account.attempts = 0; }
      localStorage.setItem('nft-accounts', JSON.stringify(accounts));
      return { ok: false, error: account.lockedUntil ? 'Too many attempts. Try again in a few minutes.' : `Incorrect password. ${5 - account.attempts} attempts left.` };
    }
    account.attempts = 0;
    localStorage.setItem('nft-accounts', JSON.stringify(accounts));
    const nextProfile = { email: normalizedEmail, name: account.name, joined: new Date(account.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), lastLogin: new Date().toISOString() };
    setProfile(nextProfile);
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('nft-profile', JSON.stringify(nextProfile));
    return { ok: true };
  }

  async function signIn(email, password, remember) {
    setAuthError('');
    const result = await authenticate(email, password, remember);
    if (!result.ok) setAuthError(result.error);
    return result;
  }

  async function resetPassword(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const accounts = JSON.parse(localStorage.getItem('nft-accounts') || '{}');
    if (!accounts[normalizedEmail]) return { ok: false, error: 'No account found for that email.' };
    accounts[normalizedEmail].passwordHash = await hashPassword(password);
    accounts[normalizedEmail].attempts = 0;
    accounts[normalizedEmail].lockedUntil = 0;
    localStorage.setItem('nft-accounts', JSON.stringify(accounts));
    return { ok: true };
  }

  function signOut() {
    setProfile(null);
    setWallet(null);
    setBalances(DEFAULT_BALANCES);
    setFavorites([]);
    setCollected([]);
    setIsWalletModalOpen(false);
    setActiveTradeItem(null);
    setAuthError('');

    localStorage.removeItem('nft-profile');
    sessionStorage.removeItem('nft-profile');
    localStorage.removeItem('nft-wallet');
    localStorage.removeItem('nft-balances');
    localStorage.removeItem('nft-favorites');
    localStorage.removeItem('nft-collected');
  }

  const value = useMemo(() => ({
    wallet,
    balances,
    favorites,
    collected,
    profile,
    ready,
    authError,
    isWalletModalOpen,
    walletModalTab,
    activeTradeItem,
    connectWallet,
    openWalletModal,
    closeWalletModal,
    toggleFavorite,
    buyNFT,
    sellNFT,
    swapCurrency,
    signIn,
    register,
    resetPassword,
    signOut
  }), [
    wallet,
    balances,
    favorites,
    collected,
    profile,
    ready,
    authError,
    isWalletModalOpen,
    walletModalTab,
    activeTradeItem
  ]);

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  return useContext(MarketplaceContext);
}
