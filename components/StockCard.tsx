import React from 'react';
import ReactMarkdown from 'react-markdown';
import { StockData } from '../types';
import { StockChart } from './StockChart';

interface StockCardProps {
  data: StockData;
}

export const StockCard: React.FC<StockCardProps> = ({ data }) => {
  const isPositive = data.changeValue >= 0;
  const trendColor = isPositive ? 'text-emerald-400' : 'text-red-400';
  const bgColor = isPositive ? 'bg-emerald-500/10' : 'bg-red-500/10';
  const borderColor = isPositive ? 'border-emerald-500/20' : 'border-red-500/20';

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Price Card */}
        <div className={`col-span-1 lg:col-span-2 bg-slate-800/50 backdrop-blur rounded-2xl p-6 border ${borderColor} shadow-xl`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-white">{data.ticker}</h1>
              <p className="text-slate-400 text-sm mt-1">Real-time Market Data</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-white tracking-tighter">
                 {data.price === "N/A" ? "N/A" : `$${data.price}`}
              </div>
              <div className={`text-lg font-medium mt-1 flex items-center justify-end gap-1 ${trendColor} ${bgColor} px-3 py-1 rounded-full inline-flex`}>
                {isPositive ? (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                ) : (
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                )}
                {data.change}
              </div>
            </div>
          </div>
          
          <div className="relative w-full">
            <div className="absolute top-2 left-2 text-xs text-slate-500 bg-slate-900/80 px-2 py-1 rounded border border-slate-700 z-10">
              Simulated Intraday Trend
            </div>
            <StockChart data={data.chartData} isPositive={isPositive} />
          </div>
        </div>

        {/* Quick Stats / Sentiment Card */}
        <div className="col-span-1 bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Market Sentiment
          </h3>
          <div className="flex-grow space-y-4">
             <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
               <span className="text-sm text-slate-400 block mb-1">Observation</span>
               <span className="text-slate-200 font-medium">
                 {isPositive 
                   ? "Bullish momentum detected in recent news coverage." 
                   : "Bearish pressure observed in latest reports."}
               </span>
             </div>
             <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700">
               <span className="text-sm text-slate-400 block mb-1">Data Freshness</span>
               <span className="text-slate-200 font-medium">
                 Updated: {data.lastUpdated.toLocaleTimeString()}
               </span>
             </div>
          </div>
        </div>
      </div>

      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2 bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 shadow-xl">
           <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">AI</span>
            Gemini Analysis
           </h3>
           <div className="prose prose-invert prose-slate max-w-none">
             <ReactMarkdown 
               components={{
                 h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-indigo-300 mt-6 mb-3" {...props} />,
                 ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-2 text-slate-300" {...props} />,
                 li: ({node, ...props}) => <li className="marker:text-indigo-500" {...props} />,
                 p: ({node, ...props}) => <p className="leading-relaxed text-slate-300 mb-4" {...props} />
               }}
             >
               {data.analysis}
             </ReactMarkdown>
           </div>
        </div>

        {/* Sources Section */}
        <div className="col-span-1 bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 shadow-xl h-fit">
          <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
            Sources
          </h3>
          <ul className="space-y-3">
            {data.sources.length > 0 ? (
              data.sources.map((source, index) => (
                <li key={index}>
                  <a 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group block p-3 rounded-lg bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700 transition-all duration-200"
                  >
                    <div className="text-sm font-medium text-indigo-400 group-hover:text-indigo-300 truncate">
                      {source.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 truncate">
                      {new URL(source.url).hostname}
                    </div>
                  </a>
                </li>
              ))
            ) : (
              <li className="text-slate-500 text-sm italic">No specific sources cited.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
