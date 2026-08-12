import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, useWindowDimensions, Pressable } from 'react-native';

import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from 'react-native-reanimated';
import { useProducteurStore } from '../../src/core/store/useProducteurStore';
import { formatNumber, formatCurrency } from '../../src/utils/formatters';
import { StatCard, Card, ProgressBar } from '../../src/components/ui';
import { spacing, typography, radius } from '../../src/theme';
import { Users, TreePine, Package, Banknote, TrendingUp, MapPin, AlertCircle, Target, Sprout, ClipboardList, Activity, Sun, Moon } from 'lucide-react-native';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';

import { getAvancementPDCGlobal, getAlertes, getPerformanceCultures, getAvancementParFiche, getDashboardScores } from '../../src/utils/producteurCalculations';

// Import our platform-specific chart wrappers
import { LineChart } from '../../src/components/dashboard/LineChart';
import { BarChart } from '../../src/components/dashboard/BarChart';
import { PieChart } from '../../src/components/dashboard/PieChart';
import { useTheme } from "../../src/hooks/useTheme";

const CHART_COLORS = ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#4ade80', '#86efac', '#bbf7d0'];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ZoneBox({ region, count, production, superficie }: any) {
  const { colors } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const hoverAnim = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      borderColor: interpolateColor(
        hoverAnim.value,
        [0, 1],
        ['rgba(68, 64, 60, 0.5)', 'rgba(22, 163, 74, 0.3)'] // earth-700/50 to cacao-600/30
      ),
      backgroundColor: interpolateColor(
        hoverAnim.value,
        [0, 1],
        ['rgba(41, 37, 36, 0.5)', 'rgba(41, 37, 36, 0.8)']
      )
    };
  }, []);

  return (
    <AnimatedPressable 
      style={[styles.zoneBox, animatedStyle]}
      //@ts-ignore
      onHoverIn={() => { if(Platform.OS === 'web') hoverAnim.value = withTiming(1, { duration: 150 }) }}
      onHoverOut={() => { if(Platform.OS === 'web') hoverAnim.value = withTiming(0, { duration: 150 }) }}
    >
      <View style={styles.zoneHeader}>
        <View style={styles.zoneDot} />
        <Text style={styles.zoneName} numberOfLines={1}>{region}</Text>
      </View>
      <View style={styles.zoneBody}>
        <Text style={styles.zoneText}>{count} producteur{count > 1 ? 's' : ''}</Text>
        <Text style={styles.zoneText}>{formatNumber(production)} kg</Text>
        <Text style={styles.zoneText}>{formatNumber(superficie)} ha</Text>
      </View>
    </AnimatedPressable>
  );
}

export default function DashboardScreen() {

  const { colors, isDark, toggleTheme } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const { producteurs, getStats } = useProducteurStore();
  const isOnline = useNetworkStatus();
  
  const stats = getStats();
  const { width } = useWindowDimensions();
  
  // Responsive breakpoints matching web Tailwind classes
  const isSm = width >= 640;
  const isLg = width >= 1024;
  const isXl = width >= 1280;

  // Exact flex percentages for wrapping
  const statCardWidth = isXl ? '23.5%' : isSm ? '48%' : '100%';
  const chartColSpan1 = isLg ? '48.5%' : '100%';
  
  // Bottom row grid: Entity (33%), Zones (65%)
  const bottomCol1 = isLg ? '33%' : '100%';
  const bottomCol2 = isLg ? '65%' : '100%';

  // Charts Inner Width for Native 
  // (Web uses ResponsiveContainer which ignores this)
  const contentWidth = Math.max(0, width - (spacing.lg * 2));
  const chartColPx = isLg ? (contentWidth * 0.485) : contentWidth;
  const chartInnerWidth = Math.max(0, chartColPx - 32 - 40); 

  // Production by region
  const regionChartData = useMemo(() => {
    const regionData: Record<string, any> = {};
    producteurs.forEach(p => {
      const r = p.delegation || 'Non défini';
      if (!regionData[r]) regionData[r] = { region: r, production: 0, superficie: 0, count: 0 };
      regionData[r].production += (p.cultures || []).reduce((s, c) => s + (parseFloat(String(c.production)) || 0), 0);
      regionData[r].superficie += p.supCacao || 0;
      regionData[r].count++;
    });
    const sorted = Object.values(regionData).sort((a, b) => b.production - a.production);
    return {
      stats: sorted,
      chart: sorted // BarChart handles mapping
    };
  }, [producteurs]);

  // Production history aggregate
  const historyData = useMemo(() => {
    const historyMap: Record<string, any> = {};
    producteurs.forEach(p => {
      (p.historiqueProduction || []).forEach(h => {
        if (!historyMap[h.annee]) historyMap[h.annee] = { annee: h.annee, production: 0, revenu: 0 };
        historyMap[h.annee].production += h.production || 0;
        historyMap[h.annee].revenu += h.revenu || 0;
      });
    });
    return Object.values(historyMap).sort((a, b) => Number(a.annee) - Number(b.annee));
  }, [producteurs]);

  // Pilotage Data
  const alertes = useMemo(() => getAlertes(producteurs), [producteurs]);
  const aTraiter = alertes.reduce((sum, a) => sum + a.count, 0);
  const cultures = useMemo(() => getPerformanceCultures(producteurs), [producteurs]);
  const avancementFiches = useMemo(() => getAvancementParFiche(producteurs), [producteurs]);
  const scoreGlobal = useMemo(() => getDashboardScores(producteurs), [producteurs]);
  const avancementGlobal = useMemo(() => getAvancementPDCGlobal(producteurs), [producteurs]);

  const statCards = [
    { label: 'Producteurs', value: formatNumber(stats.totalProducteurs), icon: Users, iconColors: ['#16a34a', '#15803d'] as [string, string] },
    { label: 'Superficie Totale', value: `${formatNumber(stats.superficieTotale)} ha`, icon: TreePine, iconColors: ['#10b981', '#047857'] as [string, string] },
    { label: 'Avancement PDC', value: `${avancementGlobal}%`, icon: Target, iconColors: ['#3b82f6', '#2563eb'] as [string, string] },
    { label: 'À Traiter', value: String(aTraiter), icon: AlertCircle, iconColors: ['#f59e0b', '#d97706'] as [string, string] },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View>
          <Text style={styles.title}>Tableau de bord</Text>
          <Text style={styles.subtitle}>Vue d'ensemble de la gestion des producteurs</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.primaryLight : colors.error }]} />
            <Text style={styles.statusText}>{isOnline ? 'En ligne' : 'Hors ligne'}</Text>
          </View>
          
          <Pressable 
            onPress={toggleTheme}
            style={styles.themeToggle}
          >
            {isDark ? (
              <Moon size={18} color={colors.textSecondary} />
            ) : (
              <Sun size={18} color={colors.textSecondary} />
            )}
          </Pressable>
        </View>
      </Animated.View>

      {/* Stat Cards */}
      <View style={styles.statsGrid}>
        {statCards.map((card, i) => (
          <Animated.View 
            key={i} 
            entering={FadeInDown.delay(i * 100).duration(400)}
            style={[{ width: statCardWidth as any, display: 'flex' }]}
          >
            <StatCard 
              title={card.label} 
              value={card.value} 
              icon={<card.icon size={18} color="#fff" />} 
              iconColors={card.iconColors} 
            />
          </Animated.View>
        ))}
      </View>

      {/* Performance & PDC Progress */}
      <View style={styles.chartsRow}>
        <Animated.View entering={FadeInUp.delay(200).duration(500)} style={[{ width: chartColSpan1 as any, display: 'flex' }]}>
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <Sprout size={16} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Performance des cultures</Text>
            </View>
            <View style={styles.progressList}>
              {cultures.length > 0 ? cultures.map((c, i) => (
                <ProgressBar 
                  key={i} 
                  label={c.nom} 
                  percent={c.percent} 
                  valueText={`${formatNumber(c.production)} kg`} 
                  color={CHART_COLORS[i % CHART_COLORS.length]} 
                />
              )) : (
                <Text style={styles.emptyText}>Aucune donnée de culture</Text>
              )}
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={[{ width: chartColSpan1 as any, display: 'flex' }]}>
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <ClipboardList size={16} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Avancement des PDC</Text>
            </View>
            <View style={styles.progressList}>
              {avancementFiches.length > 0 ? avancementFiches.map((f, i) => (
                <ProgressBar 
                  key={i} 
                  label={f.label} 
                  percent={f.percent} 
                  color={colors.primary} 
                />
              )) : (
                <Text style={styles.emptyText}>Aucun PDC suivi</Text>
              )}
            </View>
          </Card>
        </Animated.View>
      </View>

      {/* A surveiller & Zones */}
      <View style={styles.chartsRow}>
        <Animated.View entering={FadeInUp.delay(400).duration(500)} style={[{ width: bottomCol1 as any, display: 'flex' }]}>
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <AlertCircle size={16} color={colors.warning} />
              <Text style={styles.cardTitle}>À surveiller</Text>
            </View>
            <View style={styles.alertsContainer}>
              {alertes.length > 0 ? alertes.map((a, i) => (
                <View key={i} style={styles.alertBox}>
                  <AlertCircle size={18} color={colors[a.type as keyof typeof colors] || colors.warning} />
                  <Text style={styles.alertText}>{a.message}</Text>
                </View>
              )) : (
                <View style={styles.emptyStateBox}>
                  <Text style={styles.emptyText}>Tout est en ordre</Text>
                </View>
              )}
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(500).duration(500)} style={[{ width: bottomCol2 as any, display: 'flex' }]}>
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <MapPin size={16} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Zones géographiques</Text>
            </View>
            <View style={styles.zonesGrid}>
              {regionChartData.stats.length > 0 ? regionChartData.stats.map((r, i) => (
                <ZoneBox 
                  key={i} 
                  region={r.region} 
                  count={r.count} 
                  production={r.production} 
                  superficie={r.superficie} 
                />
              )) : (
                <Text style={styles.emptyText}>Aucune donnée régionale</Text>
              )}
            </View>
          </Card>
        </Animated.View>
      </View>

      {/* Evolution Chart */}
      <View style={styles.chartsRow}>
        <Animated.View entering={FadeInUp.delay(600).duration(500)} style={[{ width: '100%', display: 'flex' }]}>
          <Card variant="glass" style={styles.chartCard}>
            <View style={styles.cardHeader}>
              <TrendingUp size={16} color={colors.primaryLight} />
              <Text style={styles.cardTitle}>Évolution de la production (kg)</Text>
            </View>
            <View style={styles.chartContainer}>
              {historyData.length > 0 ? (
                <LineChart
                  data={historyData}
                  width={chartInnerWidth * (isLg ? 2.06 : 1)} // Full width adjustment
                  height={220}
                  isLg={isLg}
                />
              ) : (
                <Text style={styles.emptyText}>Pas assez de données pour l'évolution</Text>
              )}
            </View>
          </Card>
        </Animated.View>
      </View>
    </ScrollView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  themeToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chartsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chartCard: {
    flex: 1,
    minHeight: 300,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
    paddingTop: 4,
    paddingLeft: 4,
  },
  cardTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: 'transparent',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    ...Platform.select({
      web: {
        userSelect: 'none',
      },
    }),
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    overflow: 'hidden',
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: typography.sizes.sm,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  zonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  zoneBox: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexGrow: 1,
    flexBasis: 140,
    ...Platform.select({
      web: { cursor: 'pointer' }
    })
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  zoneDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  zoneName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.text,
    flex: 1,
  },
  zoneBody: {
    gap: 2,
  },
  zoneText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  progressList: {
    gap: spacing.sm,
    width: '100%',
  },
  alertsContainer: {
    gap: spacing.sm,
    width: '100%',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
  },
  alertText: {
    color: colors.text,
    fontSize: 13,
    flex: 1,
  },
  emptyStateBox: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
