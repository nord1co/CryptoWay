import { Coin } from '../types';

// Simulate realistic market movement
export const simulateMarketUpdate = (currentCoins: Coin[]): Coin[] => {
  return currentCoins.map(coin => {
    // Random fluctuation between -0.5% and +0.5% per tick
    const volatility = 0.005;
    const change = 1 + (Math.random() * volatility * 2 - volatility);
    
    // Update price
    const newPrice = coin.currentPrice * change;
    
    // Update 24h change slightly to reflect the new move
    const newChange24h = coin.priceChange24h + (change - 1) * 100;

    return {
      ...coin,
      currentPrice: newPrice,
      priceChange24h: parseFloat(newChange24h.toFixed(2))
    };
  });
};