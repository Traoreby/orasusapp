import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts/lib/index';
import { formatNumber } from '../../utils/formatters';

interface Props {
  data: any[];
  width: number;
  height: number;
  isLg: boolean;
}

export function BarChart({ data, height }: Props) {
  const { colors } = useTheme();
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="region" stroke="#9ca3af" fontSize={10} angle={-20} textAnchor="end" height={60} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{ background: '#1c1917', border: '1px solid #22c55e33', borderRadius: '12px', color: colors.background }}
          formatter={(value: any) => [formatNumber(value) + ' kg', 'Production']}
        />
        <Bar dataKey="production" fill="#22c55e" radius={[6, 6, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
