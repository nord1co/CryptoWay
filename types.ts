export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange24h: number; // Percentage
  image: string;
}

export interface Transaction {
  id: string;
  coinId: string;
  exchange: string;
  type: TransactionType;
  amount: number; // Quantity of coins
  pricePerCoin: number;
  fee: number;
  date: string;
  notes?: string;
}

export interface PortfolioItem {
  coinId: string;
  totalAmount: number;
  averageBuyPrice: number;
  currentValue: number;
  totalInvested: number;
  profit: number;
  profitPercent: number;
}

export interface WatchlistItem {
  id: string;
  coinId: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW'; // Alert when price is above or below target
  notes?: string;
}

export interface MarketState {
  coins: Coin[];
  lastUpdated: Date;
}