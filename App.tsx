import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Layout } from './components/Layout';
import { StockCard } from './components/StockCard';
import { analyzeStock } from './services/geminiService';
import { StockData, LoadingState } from './types';

const SUGGESTIONS = ['AAPL', 'GOOGL', 'NVDA', 'TSLA', 'MSFT', 'BTC-USD'];

export default function App() {
  const { isAuthenticated, loginWithRedirect, isLoading: isAuthLoading } = useAuth0();
  
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ status: 'idle' });

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!ticker.trim()) return;

    setLoading({ status: 'loading' });
    setStockData(null);

    try {
      const data = await analyzeStock(ticker);
      setStockData(data);
      setLoading({ status: 'success' });
    } catch (error) {
      setLoading({ status: 'error', message: error instanceof Error ? error.message : "Unknown error" });
    }
  };

  const handleSuggestionClick = (t: string) => {
    setTicker(t);
    autoSearch(t);
  };

  const autoSearch = async (t: string) => {
    setLoading({ status: 'loading' });
    setStockData(null);
    try {
        const data = await analyzeStock(t);
        setStockData(data);
        setLoading({ status: 'success' });
    } catch (error) {
        setLoading({ status: 'error', message: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  // Loading State for Auth0 initialization
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto mb-12 text-center space-y-4">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Market Insight <span className="text-indigo-500">Reimagined</span>
        </h2>
        <p className="text-slate-400 text-lg">
          Real-time pricing and AI-driven analysis powered by Gemini 2.5
        </p>

        {!isAuthenticated ? (
          <div className="mt-12 p-8 bg-slate-800/30 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
             <div className="mb-6 text-slate-300">
               Please log in to access real-time stock analysis, chart trends, and AI-powered market summaries.
             </div>
             <button
                onClick={() => loginWithRedirect()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 font-semibold rounded-xl text-lg transition-all shadow-xl shadow-indigo-500/20 hover:scale-105"
             >
               Get Started
             </button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto mt-8 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
                <input 
                  type="text"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  placeholder="Enter ticker (e.g. AAPL)..."
                  className="flex-grow bg-transparent border-none text-white px-6 py-4 focus:ring-0 focus:outline-none placeholder-slate-500 text-lg"
                />
                <button 
                  type="submit"
                  disabled={loading.status === 'loading'}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading.status === 'loading' ? (
                     <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                     </svg>
                  ) : (
                    'Analyze'
                  )}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap justify-center gap-2 mt-4">
               {SUGGESTIONS.map(s => (
                 <button 
                   key={s}
                   onClick={() => handleSuggestionClick(s)}
                   className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
                 >
                   {s}
                 </button>
               ))}
            </div>
            
            <div className="mt-8 transition-all duration-500 ease-in-out">
              {loading.status === 'error' && (
                <div className="max-w-2xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-center animate-pulse">
                  {loading.message}
                </div>
              )}

              {loading.status === 'idle' && !stockData && (
                 <div className="text-center py-20 opacity-50">
                   <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4">
                     <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                   </div>
                   <p className="text-slate-500">Enter a stock ticker to generate a report.</p>
                 </div>
              )}

              {stockData && (
                <StockCard data={stockData} />
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}