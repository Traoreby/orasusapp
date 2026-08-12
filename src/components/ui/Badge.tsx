import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, radius, spacing, typography } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return { bg: 'rgba(34, 197, 94, 0.2)', text: colors.success };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.2)', text: colors.warning };
      case 'error':
        return { bg: 'rgba(239, 68, 68, 0.2)', text: colors.error };
      case 'info':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: colors.info };
      case 'default':
      default:
        return { bg: colors.surfaceLight, text: colors.textSecondary };
    }
  };

  const { bg, text } = getVariantStyles();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
});
