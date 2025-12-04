import React from 'react';
import { Coin } from '../types';
import { TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';

interface MarketProps {
  coins: Coin[];
}

export const Market: React.FC<MarketProps> = ({ coins }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-luxury-border pb-6">
        <div>
            <h2 className="text-3xl font-light text-white flex items-center gap-3 tracking-wide">
            <Globe className="text-luxury-gold" />
            Mercado Global
            </h2>
            <p className="text-luxury-muted mt-2 text-sm">Monitoramento em tempo real dos principais ativos.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/20">
            <span className="w-2 h-2 rounded-full bg-luxury-gold animate-pulse"></span>
            <span className="text-xs text-luxury-gold font-bold tracking-wider uppercase">Ao Vivo</span>
        </div>
      </div>

      {/* Ticker Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coins.slice(0, 4).map((coin) => (
          <div key={coin.id} className="glass-panel p-6 rounded-xl hover:bg-white/5 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <img src={coin.image} className="w-16 h-16 grayscale" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <img src={coin.image} alt={coin.name} className="w-10 h-10 rounded-full shadow-lg" />
              <div>
                <h3 className="font-bold text-white text-lg leading-none">{coin.symbol}</h3>
                <span className="text-xs text-luxury-muted">{coin.name}</span>
              </div>
            </div>
            <div>
              <p className="text-2xl font-mono text-white tracking-tight">{formatCurrency(coin.currentPrice)}</p>
              <div className={`flex items-center text-sm mt-2 font-medium ${coin.priceChange24h >= 0 ? 'text-luxury-success' : 'text-luxury-danger'}`}>
                {coin.priceChange24h >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                {coin.priceChange24h > 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/40 text-luxury-muted text-xs uppercase tracking-wider font-medium">
                <th className="p-6">Ativo</th>
                <th className="p-6 text-right">Preço</th>
                <th className="p-6 text-right">Variação 24h</th>
                <th className="p-6 text-right hidden md:table-cell">Volume (24h)</th>
                <th className="p-6 text-right">Tendência</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-border">
              {coins.map((coin) => (
                <tr key={coin.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-luxury-border to-transparent">
                         <img src={coin.image} alt={coin.name} className="w-full h-full rounded-full bg-luxury-black" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-base">{coin.name}</div>
                        <div className="text-xs text-luxury-muted font-mono">{coin.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-right font-mono text-white text-base">
                    {formatCurrency(coin.currentPrice)}
                  </td>
                  <td className="p-6 text-right">
                    <span className={`inline-flex items-center gap-1 font-bold ${
                      coin.priceChange24h >= 0 
                        ? 'text-luxury-success' 
                        : 'text-luxury-danger'
                    }`}>
                      {coin.priceChange24h > 0 ? '+' : ''}{coin.priceChange24h.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-6 text-right text-luxury-muted hidden md:table-cell font-mono text-sm">
                    R$ {(Math.random() * 500 + 100).toFixed(2)}M
                  </td>
                  <td className="p-6 text-right">
                    <Activity size={20} className={`ml-auto opacity-50 ${coin.priceChange24h >= 0 ? 'text-luxury-success' : 'text-luxury-danger'}`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};