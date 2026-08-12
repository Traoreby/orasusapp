import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts/lib/index';
import { formatNumber } from '../../utils/formatters';

interface Props {
  data: any[];
  width: number;
  height: number;
}

export function LineChart({ data, height }: Props) {
  const { colors } = useTheme();
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="annee" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{ background: '#1c1917', border: '1px solid #22c55e33', borderRadius: '12px', color: colors.background }}
          formatter={(value: any) => [formatNumber(value), '']}
        />
        <Legend />
        <Line type="monotone" dataKey="production" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 5 }} name="Production (kg)" />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
