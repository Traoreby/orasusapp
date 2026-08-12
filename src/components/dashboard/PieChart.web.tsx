import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts/lib/index';

interface Props {
  data: any[];
  radius: number;
  innerRadius: number;
}

export function PieChart({ data, radius, innerRadius }: Props) {
  const { colors } = useTheme();
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height={radius * 2 + 40}>
      <RechartsPieChart>
        <Pie 
          data={data} 
          cx="50%" 
          cy="50%" 
          innerRadius={innerRadius} 
          outerRadius={radius} 
          paddingAngle={5} 
          dataKey="value" 
          label={({ name, value }: any) => `${name} (${value})`} 
          labelLine={true}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#1c1917', border: '1px solid #22c55e33', borderRadius: '12px', color: colors.background }} />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
