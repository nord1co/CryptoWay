import React, { useState } from 'react';
import { Coin, Transaction, TransactionType, PortfolioItem, WatchlistItem } from '../types';
import { ArrowUpRight, ArrowDownRight, Trash2, Target, AlertCircle, PlayCircle, History, Briefcase, Plus } from 'lucide-react';

interface OperationsProps {
  transactions: Transaction[];
  portfolio: PortfolioItem[];
  coins: Coin[];
  watchlist: WatchlistItem[];
  onClosePosition: (item: PortfolioItem) => void;
  onAddToWatchlist: (item: WatchlistItem) => void;
  onRemoveFromWatchlist: (id: string) => void;
}

export const Operations: React.FC<OperationsProps> = ({ 
  transactions, 
  portfolio, 
  coins, 
  watchlist,
  onClosePosition,
  onAddToWatchlist,
  onRemoveFromWatchlist
}) => {
  const [newWatchItem, setNewWatchItem] = useState({
    coinId: coins[0]?.id || '',
    targetPrice: '',
    condition: 'ABOVE' as 'ABOVE' | 'BELOW'
  });

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR');

  const handleWatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWatchItem.targetPrice) return;

    onAddToWatchlist({
      id: crypto.randomUUID(),
      coinId: newWatchItem.coinId,
      targetPrice: parseFloat(newWatchItem.targetPrice),
      condition: newWatchItem.condition
    });
    setNewWatchItem(prev => ({ ...prev, targetPrice: '' }));
  };

  const inputClasses = "bg-luxury-black border border-luxury-border text-white rounded-lg p-2 text-sm focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold focus:outline-none transition-all placeholder-luxury-muted/50 w-full";

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-luxury-border pb-6">
        <div>
            <h2 className="text-3xl font-light text-white tracking-wide flex items-center gap-3">
                <Briefcase className="text-luxury-gold" />
                Central de Operações
            </h2>
            <p className="text-luxury-muted mt-2 text-sm">Gerencie posições, monitore oportunidades e revise seu histórico.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Positions Column */}
        <div className="lg:col-span-2 space-y-8">
            {/* Active Positions Card */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-luxury-border flex justify-between items-center bg-luxury-gold/5">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <PlayCircle size={18} className="text-luxury-gold" />
                        Posições Ativas
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-luxury-muted text-xs uppercase tracking-wider font-medium border-b border-luxury-border">
                            <tr>
                                <th className="p-4">Ativo</th>
                                <th className="p-4 text-right">Qtd</th>
                                <th className="p-4 text-right">Valor Atual</th>
                                <th className="p-4 text-right">PnL</th>
                                <th className="p-4 text-center">Ação</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-luxury-border/30">
                            {portfolio.map(item => {
                                const coin = coins.find(c => c.id === item.coinId);
                                if (!coin) return null;
                                return (
                                    <tr key={item.coinId} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium text-white">
                                            {coin.name} <span className="text-luxury-muted text-xs ml-1">{coin.symbol}</span>
                                        </td>
                                        <td className="p-4 text-right text-slate-300 font-mono text-sm">{item.totalAmount.toFixed(4)}</td>
                                        <td className="p-4 text-right text-white font-mono">{formatCurrency(item.currentValue)}</td>
                                        <td className="p-4 text-right">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${item.profit >= 0 ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                                                {item.profitPercent.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => onClosePosition(item)}
                                                className="text-xs bg-luxury-danger/10 hover:bg-luxury-danger/20 text-luxury-danger border border-luxury-danger/30 px-3 py-1.5 rounded transition-all uppercase tracking-wider font-bold"
                                                title="Vender tudo a preço de mercado"
                                            >
                                                Zerar
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {portfolio.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-luxury-muted italic text-sm">
                                        Nenhuma posição aberta no momento.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction History */}
            <div className="glass-panel rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-luxury-border flex justify-between items-center">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <History size={18} className="text-luxury-muted" />
                        Histórico de Transações
                    </h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-luxury-muted text-xs uppercase tracking-wider font-medium sticky top-0 backdrop-blur-md">
                            <tr>
                                <th className="p-4">Data</th>
                                <th className="p-4">Tipo</th>
                                <th className="p-4">Ativo</th>
                                <th className="p-4 text-right">Preço</th>
                                <th className="p-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-luxury-border/30">
                            {[...transactions].reverse().map(tx => {
                                const coin = coins.find(c => c.id === tx.coinId);
                                const total = (tx.amount * tx.pricePerCoin);
                                return (
                                    <tr key={tx.id} className="hover:bg-white/5 transition-colors text-sm">
                                        <td className="p-4 text-luxury-muted">{formatDate(tx.date)}</td>
                                        <td className="p-4">
                                            <span className={`font-bold text-[10px] uppercase px-2 py-0.5 rounded border ${
                                                tx.type === TransactionType.BUY 
                                                ? 'border-luxury-success/30 text-luxury-success bg-luxury-success/10' 
                                                : 'border-luxury-danger/30 text-luxury-danger bg-luxury-danger/10'
                                            }`}>
                                                {tx.type === TransactionType.BUY ? 'Compra' : 'Venda'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-white">
                                            {coin?.symbol || tx.coinId} <span className="text-luxury-muted text-xs ml-1">x{tx.amount}</span>
                                        </td>
                                        <td className="p-4 text-right text-slate-400 font-mono">{formatCurrency(tx.pricePerCoin)}</td>
                                        <td className="p-4 text-right text-white font-mono">{formatCurrency(total)}</td>
                                    </tr>
                                );
                            })}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-luxury-muted italic text-sm">
                                        Histórico vazio.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Watchlist Column */}
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl sticky top-6">
                <div className="flex items-center gap-2 mb-6">
                    <Target className="text-luxury-gold" />
                    <h3 className="text-lg font-bold text-white">Radar de Preços</h3>
                </div>

                {/* Add Watch Item Form */}
                <form onSubmit={handleWatchSubmit} className="space-y-4 mb-8 bg-black/20 p-4 rounded-xl border border-luxury-border/50">
                    <p className="text-xs text-luxury-muted uppercase tracking-wider font-bold mb-2">Novo Alerta</p>
                    <div>
                        <select 
                            value={newWatchItem.coinId}
                            onChange={(e) => setNewWatchItem({...newWatchItem, coinId: e.target.value})}
                            className={inputClasses}
                        >
                            {coins.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <select 
                            value={newWatchItem.condition}
                            onChange={(e) => setNewWatchItem({...newWatchItem, condition: e.target.value as 'ABOVE' | 'BELOW'})}
                            className={`${inputClasses} w-1/3 text-xs px-1`}
                        >
                            <option value="ABOVE">Acima de</option>
                            <option value="BELOW">Abaixo de</option>
                        </select>
                        <input 
                            type="number" 
                            step="any"
                            placeholder="Preço Alvo"
                            value={newWatchItem.targetPrice}
                            onChange={(e) => setNewWatchItem({...newWatchItem, targetPrice: e.target.value})}
                            className={`${inputClasses} flex-1`}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-luxury-gold/20 hover:bg-luxury-gold/30 text-luxury-gold border border-luxury-gold/50 rounded-lg py-2 text-sm font-bold transition-all flex items-center justify-center gap-2">
                        <Plus size={16} /> Adicionar ao Radar
                    </button>
                </form>

                {/* Watch List */}
                <div className="space-y-3">
                    {watchlist.length === 0 && (
                        <p className="text-center text-luxury-muted text-sm py-4">Nenhum ativo monitorado.</p>
                    )}
                    {watchlist.map(item => {
                        const coin = coins.find(c => c.id === item.coinId);
                        if (!coin) return null;
                        
                        const isHit = item.condition === 'ABOVE' 
                            ? coin.currentPrice >= item.targetPrice 
                            : coin.currentPrice <= item.targetPrice;

                        return (
                            <div key={item.id} className={`p-4 rounded-xl border transition-all relative overflow-hidden group ${
                                isHit 
                                ? 'bg-luxury-gold/10 border-luxury-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                                : 'bg-luxury-black border-luxury-border hover:border-luxury-border/80'
                            }`}>
                                {isHit && <div className="absolute top-0 right-0 p-1"><span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-luxury-gold opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-luxury-gold"></span></span></div>}
                                
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <img src={coin.image} className="w-6 h-6 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                                        <span className="font-bold text-white text-sm">{coin.symbol}</span>
                                    </div>
                                    <button onClick={() => onRemoveFromWatchlist(item.id)} className="text-luxury-muted hover:text-luxury-danger transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-luxury-muted uppercase">Alvo ({item.condition === 'ABOVE' ? '>' : '<'})</p>
                                        <p className={`font-mono font-medium ${isHit ? 'text-luxury-gold' : 'text-slate-300'}`}>
                                            {formatCurrency(item.targetPrice)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-luxury-muted uppercase">Atual</p>
                                        <p className="text-white font-mono text-sm">{formatCurrency(coin.currentPrice)}</p>
                                    </div>
                                </div>

                                {isHit && (
                                    <div className="mt-3 pt-3 border-t border-luxury-gold/30 flex items-center gap-2 text-luxury-gold text-xs font-bold animate-pulse">
                                        <AlertCircle size={14} />
                                        Alvo Atingido! Abrir Posição?
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};