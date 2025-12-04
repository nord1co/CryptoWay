import { Coin } from './types';

export const INITIAL_COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', currentPrice: 350000, priceChange24h: 2.5, image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', currentPrice: 18500, priceChange24h: -1.2, image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'solana', symbol: 'SOL', name: 'Solana', currentPrice: 850, priceChange24h: 5.8, image: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { id: 'cardano', symbol: 'ADA', name: 'Cardano', currentPrice: 2.50, priceChange24h: 0.5, image: 'https://cryptologos.cc/logos/cardano-ada-logo.png' },
  { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', currentPrice: 35.00, priceChange24h: -3.4, image: 'https://cryptologos.cc/logos/polkadot-new-dot-logo.png' },
  { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', currentPrice: 85.00, priceChange24h: 1.1, image: 'https://cryptologos.cc/logos/chainlink-link-logo.png' },
  { id: 'matic', symbol: 'MATIC', name: 'Polygon', currentPrice: 4.20, priceChange24h: -0.8, image: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', currentPrice: 0.65, priceChange24h: 12.5, image: 'https://cryptologos.cc/logos/dogecoin-doge-logo.png' },
];

export const EXCHANGES = [
  'Binance',
  'Coinbase',
  'Kraken',
  'KuCoin',
  'Mercado Bitcoin',
  'Foxbit',
  'NovaDAX',
  'DeFi Wallet'
];