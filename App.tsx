import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Market } from './components/Market';
import { TransactionForm } from './components/TransactionForm';
import { Dashboard } from './components/Dashboard';
import { Operations } from './components/Operations';
import { INITIAL_COINS } from './constants';
import { Coin, Transaction, PortfolioItem, TransactionType, WatchlistItem } from './types';
import { simulateMarketUpdate } from './services/marketService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [coins, setCoins] = useState<Coin[]>(INITIAL_COINS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Simulate Live Market Data
  useEffect(() => {
    const interval = setInterval(() => {
      setCoins(currentCoins => simulateMarketUpdate(currentCoins));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Calculate Portfolio State based on transactions and current prices
  const portfolio = useMemo(() => {
    const holdings: { [key: string]: PortfolioItem } = {};

    transactions.forEach(tx => {
      if (!holdings[tx.coinId]) {
        holdings[tx.coinId] = {
          coinId: tx.coinId,
          totalAmount: 0,
          averageBuyPrice: 0,
          currentValue: 0,
          totalInvested: 0,
          profit: 0,
          profitPercent: 0
        };
      }

      const item = holdings[tx.coinId];
      
      if (tx.type === TransactionType.BUY) {
        // Weighted Average Price Calculation
        const totalCost = item.totalInvested + (tx.amount * tx.pricePerCoin) + tx.fee;
        const totalAmount = item.totalAmount + tx.amount;
        item.totalAmount = totalAmount;
        item.totalInvested = totalCost;
        item.averageBuyPrice = totalAmount > 0 ? totalCost / totalAmount : 0;
      } else {
        // SELL logic (simplified FIFO/Average for this demo)
        // Reduces amount, realizes profit/loss proportionally
        const ratio = tx.amount / item.totalAmount;
        item.totalAmount -= tx.amount;
        // Reduce invested capital proportionally to amount sold to maintain average price on remaining
        item.totalInvested -= (item.totalInvested * (tx.amount / (item.totalAmount + tx.amount))); 
      }
    });

    // Update with current market prices
    return Object.values(holdings)
      .filter(item => item.totalAmount > 0.000001) // Remove dust
      .map(item => {
        const currentCoin = coins.find(c => c.id === item.coinId);
        const currentPrice = currentCoin ? currentCoin.currentPrice : 0;
        const currentValue = item.totalAmount * currentPrice;
        const profit = currentValue - item.totalInvested;
        const profitPercent = item.totalInvested > 0 ? (profit / item.totalInvested) * 100 : 0;

        return {
          ...item,
          currentValue,
          profit,
          profitPercent
        };
      })
      .sort((a, b) => b.currentValue - a.currentValue);
  }, [transactions, coins]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID()
    };
    setTransactions(prev => [...prev, transaction]);
    setActiveTab('operations'); // Redirect to operations to see the change
  };

  const handleClosePosition = (item: PortfolioItem) => {
    const coin = coins.find(c => c.id === item.coinId);
    if (!coin) return;

    if (window.confirm(`Tem certeza que deseja vender toda sua posição de ${coin.name}?`)) {
        handleAddTransaction({
            coinId: item.coinId,
            exchange: 'System', // Default for auto-close
            type: TransactionType.SELL,
            amount: item.totalAmount,
            pricePerCoin: coin.currentPrice,
            fee: 0,
            date: new Date().toISOString().split('T')[0],
            notes: 'Posição encerrada automaticamente via Dashboard de Operações.'
        });
    }
  };

  const handleAddToWatchlist = (item: WatchlistItem) => {
    setWatchlist(prev => [...prev, item]);
  };

  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(i => i.id !== id));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'market':
        return <Market coins={coins} />;
      case 'new-operation':
        return <TransactionForm coins={coins} onAddTransaction={handleAddTransaction} />;
      case 'operations':
        return (
            <Operations 
                transactions={transactions} 
                portfolio={portfolio} 
                coins={coins} 
                watchlist={watchlist}
                onClosePosition={handleClosePosition}
                onAddToWatchlist={handleAddToWatchlist}
                onRemoveFromWatchlist={handleRemoveFromWatchlist}
            />
        );
      case 'dashboard':
      default:
        return <Dashboard portfolio={portfolio} coins={coins} transactions={transactions} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;