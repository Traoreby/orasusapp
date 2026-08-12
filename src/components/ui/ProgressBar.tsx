import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing, typography } from '../../theme';

interface ProgressBarProps {
  label?: string;
  percent?: number;
  progress?: number;
  valueText?: string;
  color?: string;
  style?: ViewStyle;
}

export function ProgressBar({ label, percent, progress, valueText, color, style }: ProgressBarProps) {
  const { colors } = useTheme();
  const barColor = color ?? colors.primary;
  const animatedProgress = useSharedValue(0);
  const targetValue = percent !== undefined ? percent : (progress || 0);

  useEffect(() => {
    animatedProgress.value = withTiming(Math.min(Math.max(targetValue, 0), 100), {
      duration: 1000,
      easing: Easing.out(Easing.exp),
    });
  }, [targetValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${animatedProgress.value}%`,
    };
  });

  return (
    <View style={[styles.container, style]}>
      {(label || valueText) && (
        <View style={styles.header}>
          {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
          {valueText && <Text style={[styles.valueText, { color: colors.text }]}>{valueText}</Text>}
        </View>
      )}
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <Animated.View style={[styles.bar, animatedStyle, { backgroundColor: barColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 11,
  },
  valueText: {
    fontSize: 11,
    fontWeight: typography.weights.semibold,
  },
  track: {
    height: 8,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: radius.full,
  },
});
