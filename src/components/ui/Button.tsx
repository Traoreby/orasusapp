import React from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  PressableProps,
  ViewStyle,
  TextStyle,
  Platform,
  View
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius, typography } from '../../theme';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export function Button({ 
  title, 
  variant = 'primary', 
  loading = false, 
  disabled, 
  style, 
  textStyle,
  icon,
  ...props 
}: ButtonProps) {
  const { colors, isDark } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = (e: any) => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 300 });
    if (props.onPressIn) props.onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    if (props.onPressOut) props.onPressOut(e);
  };
  
  const handleHoverIn = (e: any) => {
    if (!disabled && !loading) {
      if (Platform.OS === 'web') {
        scale.value = withSpring(1.02, { damping: 15, stiffness: 300 });
      }
      opacity.value = withTiming(0.85, { duration: 150 });
    }
  };
  
  const handleHoverOut = (e: any) => {
    if (!disabled && !loading) {
      if (Platform.OS === 'web') {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }
      opacity.value = withTiming(1, { duration: 150 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled || loading ? 0.6 : opacity.value,
  }));

  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'outline':
        return { color: colors.primaryLight };
      case 'secondary':
        return { color: colors.text };
      case 'danger':
      case 'primary':
      default:
        return { color: '#ffffff' };
    }
  };

  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator color={getTextStyle().color} />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, getTextStyle(), textStyle]}>
            {title}
          </Text>
        </>
      )}
    </View>
  );

  const getVariantStyle = (): ViewStyle => {
    if (disabled || loading) {
      return { backgroundColor: colors.surfaceLight };
    }
    switch (variant) {
      case 'secondary':
        return { 
          backgroundColor: isDark ? 'rgba(41, 37, 36, 0.5)' : 'rgba(0, 0, 0, 0.05)', 
          borderWidth: 1, 
          borderColor: colors.border 
        };
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary };
      case 'danger':
        return { backgroundColor: colors.error };
      case 'primary':
      default:
        return { backgroundColor: '#15803d' };
    }
  };

  return (
    <Animated.View style={[styles.container, style, animatedStyle]}>
      <Pressable
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        //@ts-ignore - hover events for web
        onHoverIn={handleHoverIn}
        onHoverOut={handleHoverOut}
        style={[
          styles.button,
          variant !== 'primary' && getVariantStyle(),
          variant === 'primary' && !disabled && !loading && styles.primaryShadow
        ]}
        {...props}
      >
        {variant === 'primary' && !disabled && !loading ? (
          <LinearGradient
            colors={['#16a34a', '#15803d']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 12 }]}
          />
        ) : null}
        {content}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      web: {
        cursor: 'pointer',
      }
    }),
  },
  button: {
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  primaryShadow: {
    ...Platform.select({
      web: {
        boxShadow: '0 4px 15px -3px rgba(20, 83, 45, 0.4)', 
      },
      default: {
        elevation: 4,
        shadowColor: '#14532d',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      }
    }),
    overflow: 'visible',
  },
  text: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  }
});
