import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart as GiftedBarChart } from 'react-native-gifted-charts';
import { useTheme } from '../../hooks/useTheme';
import { formatNumber } from '../../utils/formatters';

interface Props {
  data: any[];
  width: number;
  height: number;
  isLg: boolean;
}

export function BarChart({ data, width, height, isLg }: Props) {
  const { colors } = useTheme();
  if (!data || data.length === 0) return null;

  const chartData = data.map(d => ({ 
    value: d.production, 
    label: d.region.substring(0, 6),
    frontColor: '#22c55e',
    topLabelComponent: () => null
  }));

  return (
    <GiftedBarChart
      data={chartData}
      width={width}
      height={height}
      barWidth={isLg ? 32 : 16}
      spacing={isLg ? Math.max(20, (width - 40) / Math.max(1, chartData.length) - 32) : 20}
      roundedTop
      roundedBottom={false}
      frontColor={colors.primary}
      yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
      xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 10, rotation: isLg ? 0 : -20 }}
      yAxisColor="transparent"
      xAxisColor={colors.border}
      rulesColor={colors.border}
      rulesType="dashed"
      isAnimated
      pointerConfig={{
        pointerStripHeight: 250,
        pointerStripColor: 'rgba(34, 197, 94, 0.2)',
        pointerStripWidth: 2,
        pointerColor: colors.primary,
        radius: 6,
        pointerLabelWidth: 100,
        pointerLabelHeight: 90,
        activatePointersOnLongPress: true,
        autoAdjustPointerLabelPosition: true,
        pointerLabelComponent: (items: any) => {
          return (
            <View style={[styles.tooltipBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.tooltipText, { color: colors.text }]}>{formatNumber(items[0]?.value)} kg</Text>
            </View>
          );
        },
      }}
    />
  );
}

const styles = StyleSheet.create({
  tooltipBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltipText: {
    fontSize: 12,
    fontWeight: 'bold',
  }
});
