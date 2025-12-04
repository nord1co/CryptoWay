import React, { useState } from 'react';
import { PortfolioItem, Coin, Transaction } from '../types';
import { analyzePortfolio } from '../services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, TrendingUp, Sparkles, ArrowUpRight, ArrowDownRight, RefreshCw, Activity, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  portfolio: PortfolioItem[];
  coins: Coin[];
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ portfolio, coins }) => {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Totals
  const totalBalance = portfolio.reduce((sum, item) => sum + item.currentValue, 0);
  const totalInvested = portfolio.reduce((sum, item) => sum + item.totalInvested, 0);
  const totalProfit = totalBalance - totalInvested;
  const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  // Chart Data
  const chartData = portfolio
    .filter(item => item.currentValue > 0)
    .map(item => {
      const coin = coins.find(c => c.id === item.coinId);
      return {
        name: coin?.symbol || item.coinId,
        value: item.currentValue,
      };
    });
  
  // Luxury Palette for Chart
  const COLORS = ['#D4AF37', '#FCD34D', '#FFFFFF', '#525252', '#262626', '#A1A1AA'];

  const handleAiAnalysis = async () => {
    setLoadingAi(true);
    const result = await analyzePortfolio(portfolio, coins);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-luxury-border pb-6">
        <div>
            <h1 className="text-3xl font-light text-white tracking-wide">Visão Geral</h1>
            <p className="text-luxury-muted mt-1">Bem-vindo de volta ao seu portfólio.</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-luxury-muted uppercase tracking-widest mb-1">Patrimônio Líquido</p>
            <p className="text-4xl font-bold text-white tracking-tighter">{formatCurrency(totalBalance)}</p>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group hover:border-luxury-gold/30 transition-all">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-luxury-gold/10 rounded-full blur-2xl group-hover:bg-luxury-gold/20 transition-all"></div>
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-luxury-card rounded-lg border border-luxury-border text-luxury-gold">
                    <Wallet size={24} />
                </div>
                {totalProfitPercent !== 0 && (
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${totalProfit >= 0 ? 'bg-green-900/20 border-green-900 text-green-400' : 'bg-red-900/20 border-red-900 text-red-400'}`}>
                        {totalProfit >= 0 ? '+' : ''}{totalProfitPercent.toFixed(2)}%
                    </span>
                )}
            </div>
            <h3 className="text-luxury-muted text-sm font-medium uppercase tracking-wider mb-1">Lucro Total</h3>
            <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-luxury-success' : 'text-luxury-danger'}`}>
                {formatCurrency(totalProfit)}
            </p>
        </div>

        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden hover:border-luxury-gold/30 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-luxury-card rounded-lg border border-luxury-border text-white">
                    <Activity size={24} />
                </div>
            </div>
            <h3 className="text-luxury-muted text-sm font-medium uppercase tracking-wider mb-1">Total Investido</h3>
            <p className="text-2xl font-bold text-white">{formatCurrency(totalInvested)}</p>
        </div>

        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden hover:border-luxury-gold/30 transition-all">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-luxury-card rounded-lg border border-luxury-border text-luxury-gold">
                    <ShieldCheck size={24} />
                </div>
            </div>
            <h3 className="text-luxury-muted text-sm font-medium uppercase tracking-wider mb-1">Ativos</h3>
            <p className="text-2xl font-bold text-white">{portfolio.length} <span className="text-base font-normal text-luxury-muted">Moedas</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 glass-panel p-8 rounded-2xl">
            <h3 className="text-lg font-medium text-white mb-8 flex items-center gap-2">
                <span className="w-1 h-6 bg-luxury-gold rounded-full"></span>
                Distribuição de Ativos
            </h3>
            {chartData.length > 0 ? (
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={80}
                                outerRadius={120}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#f8fafc', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                                itemStyle={{ color: '#D4AF37' }}
                            />
                            <Legend iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-[300px] flex items-center justify-center text-luxury-muted border border-dashed border-luxury-border rounded-xl">
                    Carteira vazia
                </div>
            )}
        </div>

        {/* AI Insight Section */}
        <div className="relative p-[1px] rounded-2xl bg-gold-gradient shadow-lg shadow-luxury-gold/10">
            <div className="bg-luxury-black h-full w-full rounded-2xl p-6 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="flex items-center justify-between mb-6 z-10">
                    <div className="flex items-center gap-2">
                        <Sparkles className="text-luxury-gold animate-pulse" size={20} />
                        <h3 className="text-lg font-bold text-white tracking-wide">AI Advisor</h3>
                    </div>
                    <button 
                        onClick={handleAiAnalysis}
                        disabled={loadingAi}
                        className="p-2 bg-luxury-gold/10 hover:bg-luxury-gold/20 text-luxury-gold rounded-lg transition-colors border border-luxury-gold/20"
                    >
                        {loadingAi ? <RefreshCw className="animate-spin" size={18} /> : 'Analisar'}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar z-10">
                    {!aiAnalysis ? (
                        <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-luxury-card flex items-center justify-center border border-luxury-border">
                                <Sparkles className="text-luxury-muted" size={20} />
                            </div>
                            <p className="text-luxury-muted text-sm max-w-[200px]">
                                Obtenha análises premium do seu portfólio usando inteligência artificial.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-fade-in">
                            <div className="flex items-center justify-between pb-4 border-b border-luxury-border/50">
                                <span className="text-luxury-muted text-xs uppercase tracking-widest">Sentimento</span>
                                <span className={`font-bold px-3 py-1 rounded-full text-xs border ${
                                    aiAnalysis.sentiment === 'Bullish' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 
                                    aiAnalysis.sentiment === 'Bearish' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
                                }`}>{aiAnalysis.sentiment}</span>
                            </div>
                            
                            <div>
                                <span className="text-luxury-gold text-xs font-bold uppercase tracking-widest mb-2 block">Insight</span>
                                <p className="text-slate-200 text-sm leading-relaxed italic border-l-2 border-luxury-gold pl-3">"{aiAnalysis.mainInsight}"</p>
                            </div>

                            <div>
                                <span className="text-luxury-muted text-xs uppercase tracking-widest mb-3 block">Estratégia</span>
                                <ul className="space-y-3">
                                    {aiAnalysis.tips.map((tip: string, idx: number) => (
                                        <li key={idx} className="text-sm text-slate-400 flex items-start gap-3">
                                            <div className="min-w-[4px] h-[4px] rounded-full bg-luxury-gold mt-2 shadow-[0_0_8px_rgba(212,175,55,0.8)]"></div>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-luxury-border flex justify-between items-center">
             <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <span className="w-1 h-6 bg-white rounded-full"></span>
                Composição da Carteira
            </h3>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-black/40 text-luxury-muted text-xs uppercase tracking-wider font-medium">
                    <tr>
                        <th className="p-6">Ativo</th>
                        <th className="p-6 text-right">Qtd.</th>
                        <th className="p-6 text-right">Preço Médio</th>
                        <th className="p-6 text-right">Preço Atual</th>
                        <th className="p-6 text-right">Valor Total</th>
                        <th className="p-6 text-right">Performance</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-luxury-border">
                    {portfolio.map(item => {
                        const coin = coins.find(c => c.id === item.coinId);
                        if(!coin) return null;
                        return (
                            <tr key={item.coinId} className="hover:bg-white/5 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={coin.image} alt="" className="w-10 h-10 rounded-full bg-luxury-dark ring-2 ring-black grayscale group-hover:grayscale-0 transition-all" />
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-luxury-card rounded-full flex items-center justify-center border border-luxury-border">
                                                <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold"></div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-white text-base">{coin.name}</span>
                                            <span className="text-xs text-luxury-muted">{coin.symbol}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-right text-slate-300 font-mono text-sm">{item.totalAmount.toFixed(4)}</td>
                                <td className="p-6 text-right text-slate-400 text-sm">{formatCurrency(item.averageBuyPrice)}</td>
                                <td className="p-6 text-right text-white font-medium">{formatCurrency(coin.currentPrice)}</td>
                                <td className="p-6 text-right">
                                    <span className="text-white font-bold text-lg">{formatCurrency(item.currentValue)}</span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className={`flex flex-col items-end ${item.profit >= 0 ? 'text-luxury-success' : 'text-luxury-danger'}`}>
                                        <div className="flex items-center gap-1 font-bold">
                                            {item.profit >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                            {item.profitPercent.toFixed(2)}%
                                        </div>
                                        <span className="text-xs opacity-70">{formatCurrency(item.profit)}</span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                    {portfolio.length === 0 && (
                        <tr>
                            <td colSpan={6} className="p-12 text-center text-luxury-muted">
                                <Wallet size={48} className="mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-light">Seu portfólio está vazio.</p>
                                <p className="text-sm">Inicie sua jornada registrando uma nova operação.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};