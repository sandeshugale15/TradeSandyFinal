import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface StockChartProps {
  data: Array<{ time: string; value: number }>;
  isPositive: boolean;
}

export const StockChart: React.FC<StockChartProps> = ({ data, isPositive }) => {
  const color = isPositive ? '#10b981' : '#ef4444'; // emerald-500 or red-500

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            minTickGap={30}
          />
          <YAxis 
            domain={['auto', 'auto']}
            orientation="right"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            tickFormatter={(val) => `$${val.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1e293b',
              borderColor: '#334155',
              borderRadius: '8px',
              color: '#f8fafc',
            }}
            itemStyle={{ color: color }}
            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
