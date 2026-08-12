import React from 'react';
import { View, StyleSheet, ViewProps, Platform, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { radius, spacing } from '../../theme';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
  onPress?: () => void;
}

export function Card({ children, variant = 'default', style, onPress, ...props }: CardProps) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value }
    ]
  }));

  const handlePressIn = () => { if (onPress) scale.value = withSpring(0.98, { damping: 15, stiffness: 300 }); };
  const handlePressOut = () => { if (onPress) scale.value = withSpring(1, { damping: 15, stiffness: 300 }); };
  
  const handleHoverIn = () => {
    if (onPress && Platform.OS === 'web') {
      translateY.value = withSpring(-2, { damping: 15, stiffness: 300 });
    }
  };
  const handleHoverOut = () => {
    if (onPress && Platform.OS === 'web') {
      translateY.value = withSpring(0, { damping: 15, stiffness: 300 });
    }
  };

  const defaultStyle = {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  };
  
  const glassStyle = {
    backgroundColor: isDark ? 'rgba(28, 25, 23, 0.7)' : 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.25)',
  };

  const baseStyle = [
    styles.card,
    variant === 'glass' ? glassStyle : defaultStyle,
    onPress && styles.interactive,
    !onPress && styles.paddingBase,
    style
  ];

  if (onPress) {
    return (
      <Animated.View style={[baseStyle, animatedStyle]}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          //@ts-ignore
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          style={styles.paddingBase}
          {...(props as any)}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={baseStyle} {...(props as any)}>
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  paddingBase: {
    padding: 12,
  },
  interactive: {
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
});
