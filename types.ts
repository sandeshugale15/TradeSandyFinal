export interface StockData {
  ticker: string;
  price: string;
  change: string; // e.g., "+1.25%"
  changeValue: number; // numerical representation for logic
  analysis: string;
  sources: Array<{
    title: string;
    url: string;
  }>;
  lastUpdated: Date;
  // Synthetic chart data generated based on the retrieved price trend
  chartData: Array<{ time: string; value: number }>;
}

export interface LoadingState {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

export enum Trend {
  UP = 'UP',
  DOWN = 'DOWN',
  NEUTRAL = 'NEUTRAL'
}