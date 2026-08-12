import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from './Card';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography } from '../../theme';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColors?: [string, string];
  variation?: string;
  variationColor?: string;
  onPress?: () => void;
}

export function StatCard({ title, value, icon, iconColors, variation, variationColor, onPress }: StatCardProps) {
  const { colors } = useTheme();
  const vc = variationColor ?? colors.success;

  return (
    <Card variant="glass" style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.textSecondary }]} numberOfLines={1}>{title}</Text>
          <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
        </View>
        {icon && (
          iconColors ? (
            <LinearGradient
              colors={iconColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconContainer}
            >
              {icon}
            </LinearGradient>
          ) : (
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(34, 197, 94, 0.1)' }]}>
              {icon}
            </View>
          )
        )}
      </View>
      {variation && (
        <View style={styles.footer}>
          <Text style={[styles.variation, { color: vc }]}>{variation}</Text>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 150,
    ...Platform.select({
      web: {
        transition: 'transform 0.3s ease',
      }
    })
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 10,
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  variation: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  }
});
