import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolateColor } from 'react-native-reanimated';
import { useRouter, usePathname } from 'expo-router';
import { LayoutDashboard, Users, FileText, Eye, BarChart3, Leaf } from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const NAV_ITEMS = [
  { id: '/', label: 'Tableau de bord', icon: LayoutDashboard },
  { id: '/producteurs', label: 'Producteurs', icon: Users },
  { id: '/pdc', label: 'Fiche PDC', icon: FileText },
  { id: '/suivi', label: 'Suivi', icon: Eye },
  { id: '/rapports', label: 'Rapports', icon: BarChart3 },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function NavItem({ item, isActive, onPress }: { item: typeof NAV_ITEMS[0], isActive: boolean, onPress: () => void }) {
  const { colors } = useTheme();
  const Icon = item.icon;
  const hoverAnim = useSharedValue(0);
  const scale = useSharedValue(1);

  const handlePressIn = () => { scale.value = withSpring(0.96, { damping: 15, stiffness: 300 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15, stiffness: 300 }); };
  
  const handleHoverIn = () => { 
    if (Platform.OS === 'web') {
      hoverAnim.value = withTiming(1, { duration: 150 }); 
    }
  };
  const handleHoverOut = () => { 
    if (Platform.OS === 'web') {
      hoverAnim.value = withTiming(0, { duration: 150 }); 
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: isActive 
        ? 'rgba(22, 163, 74, 0.2)' 
        : interpolateColor(hoverAnim.value, [0, 1], ['transparent', colors.surface])
    };
  }, [isActive, colors]);

  return (
    <AnimatedPressable
      style={[
        styles.navItem,
        isActive && {
          borderColor: 'rgba(22, 163, 74, 0.3)',
          borderWidth: 1,
          ...(Platform.OS === 'web' && {
            boxShadow: '0 4px 15px rgba(20, 83, 45, 0.2)',
          }),
        },
        animatedStyle,
        //@ts-ignore
        Platform.OS === 'web' && { cursor: 'pointer' }
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      //@ts-ignore
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
    >
      <Icon 
        size={20} 
        color={isActive ? colors.primary : colors.textSecondary} 
      />
      <Text style={[
        styles.navLabel,
        { color: isActive ? colors.primaryLight : colors.textSecondary },
        isActive && { color: colors.primary, fontWeight: typography.weights.semibold }
      ]}>
        {item.label}
      </Text>
    </AnimatedPressable>
  );
}

export function Sidebar() {
  const { colors } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: colors.surface, 
        borderRightColor: colors.border,
      }
    ]}>
      {/* Logo */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.logoContainer}>
          <View style={styles.iconBox}>
            <Leaf size={22} color="#fff" />
          </View>
          <View>
            <Text style={[styles.logoTitle, { color: colors.text }]}>CacaoGest</Text>
            <Text style={[styles.logoSubtitle, { color: colors.primary }]}>Gestion PDC</Text>
          </View>
        </View>
      </View>

      {/* Navigation */}
      <ScrollView style={styles.nav} contentContainerStyle={styles.navContent}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.id || (item.id !== '/' && pathname.startsWith(item.id));
          return (
            <NavItem 
              key={item.id}
              item={item}
              isActive={isActive}
              onPress={() => router.push(item.id as any)}
            />
          );
        })}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.textMuted }]}>Conseil Café-Cacao</Text>
        <Text style={[styles.footerSub, { color: colors.textMuted }]}>v1.0 • 2025</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 256,
    height: '100%',
    borderRightWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    ...(Platform.OS === 'web' && {
      backdropFilter: 'blur(12px)',
    }),
  },
  header: {
    padding: spacing.xl,
    borderBottomWidth: 1,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)',
    }),
  },
  logoTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    lineHeight: 24,
  },
  logoSubtitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    opacity: 0.9,
  },
  nav: {
    flex: 1,
  },
  navContent: {
    padding: spacing.md,
    gap: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: 12,
    marginBottom: 4,
  },
  navLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: typography.sizes.xs,
  },
  footerSub: {
    fontSize: typography.sizes.xs,
    opacity: 0.7,
  },
});
