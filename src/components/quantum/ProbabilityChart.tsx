
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '@/components/ui/card';

interface ProbabilityChartProps {
  probabilities: number[];
}

export const ProbabilityChart: React.FC<ProbabilityChartProps> = ({ probabilities }) => {
  const data = probabilities.map((prob, index) => ({
    state: `|${index.toString(2).padStart(3, '0')}⟩`,
    probability: (prob * 100).toFixed(1),
    value: prob,
    description: `${(prob * 100).toFixed(1)}% chance of measuring ${index.toString(2).padStart(3, '0')}`
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-700 border border-purple-500/30 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium">{`State: ${label}`}</p>
          <p className="text-purple-300">{`Probability: ${payload[0].value}%`}</p>
          <p className="text-xs text-gray-300 mt-1">
            This means if you measured right now, there's a {payload[0].value}% chance you'd get this result.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-3 md:p-4 bg-slate-800/50 backdrop-blur-sm border-purple-500/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-300">Measurement Probabilities</h4>
        <div className="text-xs text-gray-400">Higher bars = more likely outcomes</div>
      </div>
      
      <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-200">
        <strong>What am I seeing?</strong> Each bar shows how likely you are to measure that specific combination of 0s and 1s.
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="state" 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            axisLine={{ stroke: '#6B7280' }}
            interval={0}
          />
          <YAxis 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
            axisLine={{ stroke: '#6B7280' }}
            label={{ 
              value: 'Probability (%)', 
              angle: -90, 
              position: 'insideLeft', 
              style: { textAnchor: 'middle', fill: '#9CA3AF', fontSize: '10px' } 
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="probability" 
            fill="#8B5CF6" 
            stroke="#A855F7"
            strokeWidth={1}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-3 text-xs text-gray-400 space-y-1">
        <p><strong>Remember:</strong> These are probabilities, not certainties!</p>
        <p><strong>|000⟩</strong> means all qubits measured as 0, <strong>|111⟩</strong> means all as 1, etc.</p>
      </div>
    </Card>
  );
};
