import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart as GiftedLineChart } from 'react-native-gifted-charts';
import { useTheme } from '../../hooks/useTheme';
import { formatNumber } from '../../utils/formatters';

interface Props {
  data: any[];
  width: number;
  height: number;
  isLg: boolean;
}

export function LineChart({ data, width, height, isLg }: Props) {
  const { colors } = useTheme();
  if (!data || data.length === 0) return null;

  const prodData = data.map(d => ({ 
    value: d.production, 
    label: String(d.annee), 
    dataPointText: formatNumber(d.production),
    customDataPoint: () => <View style={{ width: 8, height: 8, backgroundColor: colors.primary, borderRadius: 4 }} />
  }));

  return (
    <GiftedLineChart
      data={prodData}
      width={width}
      height={height}
      showVerticalLines
      verticalLinesColor={colors.border}
      initialSpacing={20}
      spacing={isLg ? Math.max(40, (width - 40) / Math.max(1, prodData.length)) : 40}
      color1={colors.primary}
      textColor1={colors.primary}
      dataPointsHeight={8}
      dataPointsWidth={8}
      dataPointsRadius={4}
      dataPointsColor1={colors.primary}
      textShiftY={-2}
      textShiftX={-5}
      textFontSize={10}
      yAxisTextStyle={{ color: colors.textMuted, fontSize: 10 }}
      xAxisLabelTextStyle={{ color: colors.textMuted, fontSize: 10 }}
      yAxisColor="transparent"
      xAxisColor={colors.border}
      rulesColor={colors.border}
      rulesType="dashed"
      thickness={3}
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
              <Text style={[styles.tooltipText, { color: colors.text }]}>{items[0]?.dataPointText} kg</Text>
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
  },
});
