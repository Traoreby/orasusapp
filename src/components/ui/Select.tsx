import React, { useState } from 'react';
import { View, Text, Modal, FlatList, StyleSheet, Platform, Pressable, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, radius } from '../../theme';

interface SelectProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  style?: StyleProp<ViewStyle>;
  compact?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Select = React.forwardRef<any, SelectProps>(({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Sélectionner...',
  error,
  disabled,
  required,
  style,
  compact = false
}, ref) => {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const pressAnim = useSharedValue(0);

  const selectedOption = options.find(o => o.value === value);

  const handlePressIn = () => {
    if (!disabled) pressAnim.value = withTiming(1, { duration: 150 });
  };
  const handlePressOut = () => {
    if (!disabled) pressAnim.value = withTiming(0, { duration: 150 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        pressAnim.value,
        [0, 1],
        [error ? colors.error : colors.border, error ? colors.error : 'rgba(22, 163, 74, 0.5)']
      ),
      backgroundColor: colors.surfaceLight,
    };
  });

  if (Platform.OS === 'web') {
    return (
      <View style={[{ marginBottom: spacing.md }, compact && { marginBottom: 0 }, style as any]}>
        {label && !compact && (
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            {label}
            {required && <Text style={{ color: colors.error }}> *</Text>}
          </Text>
        )}
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <select
            ref={ref}
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            style={{
              width: '100%',
              padding: compact ? '0 24px 0 8px' : '0 16px',
              height: compact ? '32px' : '44px',
              backgroundColor: disabled ? colors.surface : colors.surfaceLight,
              border: `1px solid ${error ? colors.error : (isFocused || isHovered) ? 'rgba(22, 163, 74, 0.8)' : colors.border}`,
              borderRadius: compact ? '6px' : radius.md,
              color: value ? colors.text : colors.textMuted,
              fontSize: compact ? '12px' : typography.sizes.sm,
              fontFamily: 'inherit',
              appearance: 'none',
              outline: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <option value="" disabled>{placeholder}</option>
            {options.map((opt, i) => (
              <option key={i} value={opt.value} style={{ backgroundColor: colors.surface }}>{opt.label}</option>
            ))}
          </select>
          <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <ChevronDown size={14} color={colors.textSecondary} />
          </div>
        </div>
        {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      </View>
    );
  }

  return (
    <View ref={ref} style={[{ marginBottom: spacing.md }, compact && { marginBottom: 0 }, style as any]}>
      {label && !compact && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
      )}
      
      <AnimatedPressable 
        style={[
          styles.inputBase,
          compact && styles.inputBaseCompact,
          animatedStyle,
          disabled ? styles.inputDisabled : null
        ]}
        onPress={() => !disabled && setModalVisible(true)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Text style={[styles.valueText, { color: selectedOption ? colors.text : colors.textMuted }, compact && styles.valueTextCompact]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={compact ? 16 : 20} color={colors.textSecondary} />
      </AnimatedPressable>

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{label || 'Sélectionner'}</Text>
              <Pressable onPress={() => setModalVisible(false)} style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}>
                <Text style={[styles.closeText, { color: colors.primaryLight }]}>Fermer</Text>
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(_, i) => String(i)}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [styles.optionItem, value === item.value && styles.optionSelected, pressed && { opacity: 0.7 }]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.optionText, { color: colors.textSecondary }, value === item.value && { color: colors.primaryLight, fontWeight: typography.weights.bold }]}>
                    {item.label}
                  </Text>
                  {value === item.value && <Text style={[styles.checkIcon, { color: colors.primaryLight }]}>✓</Text>}
                </Pressable>
              )}
              ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: colors.border }]} />}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
  inputBase: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  inputBaseCompact: {
    height: 32,
    borderRadius: 6,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  valueText: {
    fontSize: typography.sizes.sm,
  },
  valueTextCompact: {
    fontSize: 12,
  },
  error: {
    fontSize: typography.sizes.xs,
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    maxHeight: '70%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  closeText: {
    fontWeight: typography.weights.medium,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  optionSelected: {
    backgroundColor: 'rgba(22, 163, 74, 0.1)',
  },
  optionText: {
    fontSize: typography.sizes.sm,
  },
  checkIcon: {
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
  }
});
