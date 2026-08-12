import React, { useState } from 'react';
import { 
  View, 
  TextInput as RNTextInput, 
  Text, 
  StyleSheet, 
  TextInputProps as RNTextInputProps,
  Platform 
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius, typography } from '../../theme';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  compact?: boolean;
}

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

export const TextInput = React.forwardRef<any, TextInputProps>(({ 
  label, 
  error, 
  helperText, 
  style, 
  editable = true,
  required = false,
  compact = false,
  value,
  ...props 
}, ref) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = useSharedValue(0);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    focusAnim.value = withTiming(1, { duration: 200 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    focusAnim.value = withTiming(0, { duration: 200 });
    props.onBlur?.(e);
  };

  const animatedInputStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        [error ? colors.error : colors.border, error ? colors.error : 'rgba(22, 163, 74, 0.5)']
      ),
      backgroundColor: interpolateColor(
        focusAnim.value,
        [0, 1],
        [colors.surfaceLight, colors.surface]
      ),
    };
  }, [error, colors]);

  return (
    <View style={[{ marginBottom: spacing.md, width: '100%' }, compact && { marginBottom: 0 }]}>
      {label && !compact && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}
      <AnimatedTextInput
        ref={ref}
        style={[
          styles.input,
          { color: colors.text },
          compact && styles.inputCompact,
          !editable && styles.disabled,
          animatedInputStyle,
          style
        ]}
        placeholderTextColor={colors.textMuted}
        editable={editable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessibilityLabel={label}
        value={value !== undefined && value !== null ? String(value) : ''}
        {...props}
      />
      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: colors.textMuted }]}>{helperText}</Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: typography.sizes.sm,
    marginBottom: spacing.xs,
    fontWeight: typography.weights.medium,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 44,
    fontSize: typography.sizes.sm,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as any
    })
  },
  inputCompact: {
    height: 32,
    fontSize: 12,
    paddingHorizontal: spacing.sm,
    borderRadius: 6,
  },
  disabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  helperText: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
});
