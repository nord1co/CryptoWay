import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Market } from './components/Market';
import { TransactionForm } from './components/TransactionForm';
import { Dashboard } from './components/Dashboard';
import { INITIAL_COINS } from './constants';
import { Coin, Transaction, PortfolioItem, TransactionType } from './types';
import { simulateMarketUpdate } from './services/marketService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [coins, setCoins] = useState<Coin[]>(INITIAL_COINS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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
        // Reduces amount, realizes profit/loss proportionally, but keeps avg buy price same for remaining?
        // Simple approach: reduce quantity and invested amount proportionally
        const ratio = tx.amount / item.totalAmount;
        item.totalAmount -= tx.amount;
        item.totalInvested -= (item.totalInvested * ratio); 
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
    setActiveTab('dashboard'); // Redirect to dashboard after adding
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'market':
        return <Market coins={coins} />;
      case 'new-operation':
        return <TransactionForm coins={coins} onAddTransaction={handleAddTransaction} />;
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