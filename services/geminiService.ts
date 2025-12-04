import { GoogleGenAI } from "@google/genai";
import { PortfolioItem, Coin } from '../types';

export const analyzePortfolio = async (portfolio: PortfolioItem[], coins: Coin[]) => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API Key not found");
    }

    const ai = new GoogleGenAI({ apiKey });

    const portfolioSummary = portfolio.map(p => {
      const coinName = coins.find(c => c.id === p.coinId)?.name || p.coinId;
      return `${coinName}: ${p.totalAmount.toFixed(4)} unidades. Valor Atual: R$ ${p.currentValue.toFixed(2)}. Lucro/Prejuízo: ${p.profitPercent.toFixed(2)}%`;
    }).join('\n');

    const prompt = `
      Atue como um especialista sênior em criptomoedas. Analise o seguinte portfólio de investimentos:
      
      ${portfolioSummary}

      Forneça uma análise concisa em formato JSON com a seguinte estrutura:
      {
        "sentiment": "Bullish" | "Bearish" | "Neutral",
        "riskLevel": "Baixo" | "Médio" | "Alto",
        "mainInsight": "Uma frase de impacto sobre o estado atual.",
        "tips": ["Dica 1", "Dica 2", "Dica 3"]
      }
      
      Se o portfólio estiver vazio, dê dicas gerais para iniciantes.
      Responda apenas com o JSON limpo, sem markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    return JSON.parse(response.text);

  } catch (error) {
    console.error("Error analyzing portfolio:", error);
    return {
      sentiment: "Neutral",
      riskLevel: "Desconhecido",
      mainInsight: "Não foi possível conectar à IA no momento.",
      tips: ["Verifique sua conexão", "Tente novamente mais tarde"]
    };
  }
};