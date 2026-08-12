import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert } from 'react-native';
import { useProducteurStore } from '../../src/core/store/useProducteurStore';
import { Card, Select, Button } from '../../src/components/ui';
import { spacing, typography, radius } from '../../src/theme';
import { formatNumber, formatCurrency } from '../../src/utils/formatters';
import { getAggregateStats, getTopProgressions, getImpactMetrics } from '../../src/utils/producteurCalculations';
import { REGIONS, ENTITES } from '../../src/constants/data';
import { useTheme } from "../../src/hooks/useTheme";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun, Moon, TrendingUp, Tractor, BookOpen, Printer } from 'lucide-react-native';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import { useRapportPrint } from '../../src/hooks/useRapportPrint';
import { Pressable } from 'react-native';

export default function RapportsScreen() {

  const { colors, isDark, toggleTheme } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const isOnline = useNetworkStatus();
  const { handlePrintRapport } = useRapportPrint();

  const { producteurs } = useProducteurStore();
  
  const [filterRegion, setFilterRegion] = useState('');
  const [filterEntite, setFilterEntite] = useState('');

  const filtered = producteurs.filter(p => {
    const matchR = !filterRegion || p.delegation === filterRegion;
    const matchE = !filterEntite || p.nomEntite === filterEntite;
    return matchR && matchE;
  });

  const aggregate = getAggregateStats(filtered);
  const topProgressions = getTopProgressions(filtered);
  const impactMetrics = getImpactMetrics(filtered);

  const exportCSV = () => {
    const headers = ['Nom', 'Code', 'Village', 'Entite', 'Superficie Cacao', 'Production', 'Revenus'];
    const rows = filtered.map(p => {
      const supCacao = (p.cultures || []).filter(c => (c.nom||'').toLowerCase().includes('cacao')).reduce((s, c) => s + (parseFloat(String(c.superficie)) || 0), 0);
      const prod = (p.cultures || []).reduce((s, c) => s + (parseFloat(String(c.production)) || 0), 0);
      const rev = (p.cultures || []).reduce((s, c) => s + (parseFloat(String(c.revenu)) || 0), 0);
      return [
        p.nom, 
        p.codeNational, 
        p.village, 
        p.nomEntite, 
        supCacao,
        prod,
        rev
      ].join(',');
    });
    
    const csvContent = headers.join(',') + '\n' + rows.join('\n');
    
    if (Platform.OS === 'web') {
      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "rapport_producteurs.csv");
      document.body.appendChild(link);
      link.click();
    } else {
      Alert.alert(
        "Export CSV", 
        "L'export direct en CSV natif sera implémenté ultérieurement via expo-file-system et expo-sharing.\n\nContenu généré : " + filtered.length + " lignes.",
        [{ text: "OK" }]
      );
    }
  };

  const renderHeader = () => (
    <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm }}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View>
          <Text style={styles.title}>Rapports et Exports</Text>
          <Text style={styles.subtitle}>Générez des rapports filtrés sur votre base de données</Text>
        </View>
        <View style={styles.headerActions}>
          <Button 
            title="Export Excel (CSV)" 
            onPress={exportCSV} 
            style={{ marginRight: spacing.sm }}
          />
          <Button 
            title="Imprimer / PDF" 
            variant="secondary"
            icon={<Printer size={16} color={colors.text} />}
            onPress={() => handlePrintRapport(filtered, filterRegion, filterEntite)} 
            style={{ marginRight: spacing.sm }}
          />
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.primaryLight : colors.error }]} />
            <Text style={styles.statusText}>{isOnline ? 'En ligne' : 'Hors ligne'}</Text>
          </View>
          <Pressable onPress={toggleTheme} style={styles.themeToggle}>
            {isDark ? <Moon size={18} color={colors.textSecondary} /> : <Sun size={18} color={colors.textSecondary} />}
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {renderHeader()}
        <Card variant="glass" style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Filtres du rapport</Text>
        <View style={styles.filtersRow}>
          <View style={styles.filterWrapper}>
            <Select 
              label="Région"
              value={filterRegion} 
              onValueChange={setFilterRegion} 
              options={[{label: 'Toutes les régions', value: ''}, ...REGIONS.map(r => ({label: r, value: r}))]} 
            />
          </View>
          <View style={styles.filterWrapper}>
            <Select 
              label="Entité"
              value={filterEntite} 
              onValueChange={setFilterEntite} 
              options={[{label: 'Toutes les entités', value: ''}, ...ENTITES.map(e => ({label: e, value: e}))]} 
            />
          </View>
        </View>
      </Card>

      <Card variant="default" style={styles.reportSection}>
        <View style={styles.reportHeader}>
          <Text style={styles.reportTitle}>Rapport Synthétique d'Exploitation</Text>
          <Text style={styles.reportSubtitle}>
            Filtres : {filterRegion || 'Toutes régions'} | {filterEntite || 'Toutes entités'}
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {[
            { l: 'NOMBRE DE PRODUCTEURS', v: aggregate.totalProducteurs, c: colors.text },
            { l: 'SUPERFICIE CACAO (HA)', v: aggregate.supCacao.toFixed(2), c: colors.primary },
            { l: 'PRODUCTION ESTIMÉE (KG)', v: formatNumber(aggregate.prodEstimee), c: colors.primary },
            { l: 'REVENUS CUMULÉS', v: formatCurrency(aggregate.revenus), c: colors.purple },
            { l: 'COÛTS OPÉRATIONNELS', v: formatCurrency(aggregate.couts), c: colors.warning },
            { l: 'MARGE BRUTE ESTIMÉE', v: formatCurrency(aggregate.revenus - aggregate.couts), c: colors.primary },
          ].map((s, i) => (
            <Card variant="glass" key={i} style={styles.statBox}>
              <Text style={styles.statLabel}>{s.l}</Text>
              <Text style={[styles.statValue, { color: s.c }]}>{s.v}</Text>
            </Card>
          ))}
        </View>

        {/* SECTION: Producteurs à l'honneur */}
        <View style={{ marginTop: spacing.xl, marginBottom: spacing.lg }}>
          <Text style={[styles.sectionTitle, { fontSize: typography.sizes.lg, color: colors.primary }]}>🌟 Producteurs à l'honneur</Text>
          {topProgressions.length > 0 ? (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
              {topProgressions.map((prog, i) => (
                <Card variant="glass" key={i} style={{ flex: 1, minWidth: '30%', padding: spacing.md, borderRadius: radius.lg, borderLeftWidth: 4, borderLeftColor: colors.success }}>
                  <Text style={{ fontWeight: 'bold', fontSize: typography.sizes.md, color: colors.text, marginBottom: 4 }}>{prog.producteur.nom}</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm, marginBottom: spacing.sm }}>📍 {prog.producteur.village || 'Village inconnu'}</Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, flexWrap: 'wrap' }}>
                    <TrendingUp size={16} color={colors.success} style={{ marginRight: 6 }} />
                    <Text style={{ color: colors.text, fontSize: typography.sizes.xs }}>
                      Revenu passé de {formatCurrency(prog.rOld)} à {formatCurrency(prog.rN1)} (<Text style={{ color: colors.success, fontWeight: 'bold' }}>+{prog.pct}%</Text>)
                    </Text>
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>Pas assez de données historiques pour calculer les progressions.</Text>
          )}
        </View>

        {/* SECTION: Impact concret */}
        <View style={{ marginBottom: spacing.xl }}>
          <Text style={[styles.sectionTitle, { fontSize: typography.sizes.lg, color: '#f59e0b' }]}>📊 Impact concret des investissements</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            <Card variant="glass" style={{ flex: 1, minWidth: '45%', padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: 12, borderRadius: radius.full, marginRight: spacing.md }}>
                <Tractor size={24} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm, marginBottom: spacing.sm }}>Moyens & Intrants distribués</Text>
                {Object.entries(impactMetrics.investissements).map(([k, v], i) => (
                   <Text key={i} style={{ fontWeight: 'bold', color: colors.text, marginTop: 4, fontSize: 13 }}>• {k} : <Text style={{ color: colors.primary }}>{formatNumber(v as number)}</Text></Text>
                ))}
              </View>
            </Card>

            <Card variant="glass" style={{ flex: 1, minWidth: '45%', padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: 12, borderRadius: radius.full, marginRight: spacing.md }}>
                <BookOpen size={24} color="#22c55e" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textSecondary, fontSize: typography.sizes.sm, marginBottom: spacing.sm }}>Accompagnement et Formation</Text>
                <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: typography.sizes.lg }}>{impactMetrics.formationsCount} <Text style={{ fontSize: typography.sizes.sm, fontWeight: 'normal' }}>formations dispensées</Text></Text>
                <Text style={{ fontWeight: 'bold', color: colors.text, fontSize: typography.sizes.lg, marginTop: spacing.md }}>{impactMetrics.replantationActions} <Text style={{ fontSize: typography.sizes.sm, fontWeight: 'normal' }}>actions de réhabilitation</Text></Text>
              </View>
            </Card>
          </View>
        </View>

        <Text style={[styles.listTitle, { marginTop: spacing.xl, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.xl }]}>Annexe — Détail par producteur ({Math.min(filtered.length, 100)} premiers)</Text>
        
        {filtered.length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.th, { flex: 2 }]}>Nom</Text>
              <Text style={[styles.th, { flex: 1.5 }]}>Région</Text>
              <Text style={[styles.th, { flex: 1 }]}>Sup. Cacao</Text>
              <Text style={[styles.th, { flex: 1 }]}>Production</Text>
              <Text style={[styles.th, { flex: 1.5, textAlign: 'right' }]}>Revenus</Text>
            </View>
            {filtered.slice(0, 100).map(p => {
              const supCacao = (p.cultures || []).filter(c => (c.nom||'').toLowerCase().includes('cacao')).reduce((s, c) => s + (parseFloat(String(c.superficie)) || 0), 0);
              const prod = (p.cultures || []).reduce((s, c) => s + (parseFloat(String(c.production)) || 0), 0);
              const rev = (p.cultures || []).reduce((s, c) => s + (parseFloat(String(c.revenu)) || 0), 0);
              
              return (
                <View key={p.id} style={styles.tableRow}>
                  <Text style={[styles.td, { flex: 2, fontWeight: 'bold' }]} numberOfLines={1}>{p.nom}</Text>
                  <Text style={[styles.td, { flex: 1.5, color: colors.textSecondary }]} numberOfLines={1}>{p.delegation || '-'}</Text>
                  <Text style={[styles.td, { flex: 1, color: colors.primary }]}>{supCacao} ha</Text>
                  <Text style={[styles.td, { flex: 1, color: colors.primary }]}>{formatNumber(prod)} kg</Text>
                  <Text style={[styles.td, { flex: 1.5, textAlign: 'right', color: colors.purple }]}>{formatNumber(rev)} FCFA</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <Text style={styles.emptyText}>Aucun producteur ne correspond à ces filtres.</Text>
        )}
      </Card>
      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
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
  exportBtn: { marginTop: spacing.xs },
  filterSection: { marginBottom: spacing.xl, padding: spacing.lg },
  sectionTitle: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md },
  filtersRow: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap' },
  filterWrapper: { flex: 1, minWidth: 200 },
  reportSection: { padding: spacing.lg },
  reportHeader: { alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.lg, marginBottom: spacing.lg },
  reportTitle: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold, color: colors.text, textAlign: 'center' },
  reportSubtitle: { fontSize: typography.sizes.sm, color: colors.textSecondary, marginTop: spacing.sm },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  statBox: { flex: 1, minWidth: '30%', padding: spacing.md, borderRadius: radius.lg },
  statLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: spacing.xs },
  statValue: { fontSize: typography.sizes.xl, fontWeight: typography.weights.bold },
  listTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text, marginBottom: spacing.md },
  table: { backgroundColor: colors.surface, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  tableHeader: { flexDirection: 'row', padding: spacing.sm, backgroundColor: 'rgba(28, 25, 23, 0.7)', borderBottomWidth: 1, borderBottomColor: colors.border },
  th: { fontSize: typography.sizes.xs, fontWeight: typography.weights.bold, color: colors.textSecondary },
  tableRow: { flexDirection: 'row', padding: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  td: { fontSize: typography.sizes.sm, color: colors.text },
  emptyText: { color: colors.textSecondary, fontStyle: 'italic', textAlign: 'center', marginVertical: spacing.lg }
});
