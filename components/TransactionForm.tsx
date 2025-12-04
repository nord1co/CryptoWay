import React, { useState } from 'react';
import { EXCHANGES } from '../constants';
import { Coin, TransactionType, Transaction } from '../types';
import { PlusCircle, Save, Calendar, DollarSign, Hash } from 'lucide-react';

interface TransactionFormProps {
  coins: Coin[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ coins, onAddTransaction }) => {
  const [formData, setFormData] = useState({
    coinId: coins[0]?.id || '',
    exchange: EXCHANGES[0],
    type: TransactionType.BUY,
    amount: '',
    pricePerCoin: '',
    fee: '0',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      coinId: formData.coinId,
      exchange: formData.exchange,
      type: formData.type,
      amount: parseFloat(formData.amount),
      pricePerCoin: parseFloat(formData.pricePerCoin),
      fee: parseFloat(formData.fee),
      date: formData.date,
      notes: formData.notes
    });
    
    // Reset basic fields
    setFormData(prev => ({ ...prev, amount: '', pricePerCoin: '', fee: '0', notes: '' }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const inputClasses = "w-full bg-luxury-black border border-luxury-border text-white rounded-lg p-3 focus:ring-1 focus:ring-luxury-gold focus:border-luxury-gold focus:outline-none transition-all placeholder-luxury-muted/50";
  const labelClasses = "block text-xs font-bold text-luxury-muted uppercase tracking-wider mb-2";

  return (
    <div className="max-w-3xl mx-auto glass-panel p-8 rounded-2xl animate-fade-in relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gold-gradient"></div>

      <div className="mb-8 flex items-center gap-3 border-b border-luxury-border pb-6">
        <div className="p-3 bg-luxury-gold/10 rounded-full">
            <PlusCircle className="text-luxury-gold" size={24} />
        </div>
        <div>
            <h2 className="text-2xl font-light text-white">Nova Operação</h2>
            <p className="text-sm text-luxury-muted">Registre seus movimentos financeiros.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Ativo</label>
            <select
              name="coinId"
              value={formData.coinId}
              onChange={handleChange}
              className={inputClasses}
            >
              {coins.map(coin => (
                <option key={coin.id} value={coin.id}>{coin.name} ({coin.symbol})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Exchange</label>
            <select
              name="exchange"
              value={formData.exchange}
              onChange={handleChange}
              className={inputClasses}
            >
              {EXCHANGES.map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 space-y-1">
            <label className={labelClasses}>Tipo de Operação</label>
            <div className="flex bg-luxury-black p-1 rounded-lg border border-luxury-border">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: TransactionType.BUY }))}
                className={`flex-1 py-3 text-sm font-bold tracking-wide rounded-md transition-all ${
                  formData.type === TransactionType.BUY
                    ? 'bg-luxury-success/20 text-luxury-success shadow-lg'
                    : 'text-luxury-muted hover:text-white hover:bg-white/5'
                }`}
              >
                COMPRA
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: TransactionType.SELL }))}
                className={`flex-1 py-3 text-sm font-bold tracking-wide rounded-md transition-all ${
                  formData.type === TransactionType.SELL
                    ? 'bg-luxury-danger/20 text-luxury-danger shadow-lg'
                    : 'text-luxury-muted hover:text-white hover:bg-white/5'
                }`}
              >
                VENDA
              </button>
            </div>
          </div>

          <div className="space-y-1 relative">
            <label className={labelClasses}>Data</label>
            <div className="relative">
                <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={inputClasses}
                required
                />
                <Calendar className="absolute right-3 top-3 text-luxury-muted pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Quantidade</label>
            <div className="relative">
                <input
                type="number"
                name="amount"
                step="any"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClasses}
                required
                />
                <Hash className="absolute right-3 top-3 text-luxury-muted pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Preço Unitário (R$)</label>
            <div className="relative">
                <input
                type="number"
                name="pricePerCoin"
                step="any"
                value={formData.pricePerCoin}
                onChange={handleChange}
                placeholder="0.00"
                className={inputClasses}
                required
                />
                <DollarSign className="absolute right-3 top-3 text-luxury-muted pointer-events-none" size={18} />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Taxas (R$)</label>
            <input
              type="number"
              name="fee"
              step="any"
              value={formData.fee}
              onChange={handleChange}
              placeholder="0.00"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className={labelClasses}>Notas</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Detalhes adicionais sobre a operação..."
            className={inputClasses}
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-gold-gradient text-black font-bold py-4 px-4 rounded-lg flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)]"
        >
          <Save size={20} />
          REGISTRAR OPERAÇÃO
        </button>
      </form>
    </div>
  );
};