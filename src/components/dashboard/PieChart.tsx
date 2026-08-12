import React from 'react';
import { PieChart as GiftedPieChart } from 'react-native-gifted-charts';

interface Props {
  data: any[];
  radius: number;
  innerRadius: number;
}

export function PieChart({ data, radius, innerRadius }: Props) {
  if (!data || data.length === 0) return null;

  return (
    <GiftedPieChart
      data={data}
      donut
      radius={radius}
      innerRadius={innerRadius}
      innerCircleColor="transparent"
      textColor="#fff"
      textSize={10}
      showText
    />
  );
}
