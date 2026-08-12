import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, FlatList, Pressable, useWindowDimensions, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducteurStore } from '../../src/core/store/useProducteurStore';
import { Card, StatCard, Button, Badge, EmptyState } from '../../src/components/ui';
import { spacing, typography, radius } from '../../src/theme';
import { formatNumber, formatCurrency } from '../../src/utils/formatters';
import { 
  getSupCacao, getSupTotale, getMaladiesActives, getFinance, getFicheStatus, parseNum 
} from '../../src/utils/producteurCalculations';
import { useTheme } from "../../src/hooks/useTheme";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Sun, Moon, ChevronLeft, ChevronRight, User, Search } from 'lucide-react-native';
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';

const PERIODE_COLORS = [
  { color: '#22c55e', label: 'Plantation / Création' },
  { color: '#f97316', label: 'Entretien / Taille' },
  { color: '#3b82f6', label: 'Traitement phytosanitaire' },
  { color: '#eab308', label: 'Récolte / Autre' },
];

export default function SuiviScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const isOnline = useNetworkStatus();
  const router = useRouter();
  const { producteurs } = useProducteurStore();
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const numColumns = isLargeScreen ? 3 : 2;
  
  const validProducteurs = producteurs.filter(p => !!String(p.nom || '').trim());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredProducteurs = useMemo(() => {
    if (!searchQuery.trim()) return validProducteurs;
    const query = searchQuery.toLowerCase().trim();
    return validProducteurs.filter(p => 
      p.nom?.toLowerCase().includes(query) || 
      p.village?.toLowerCase().includes(query)
    );
  }, [validProducteurs, searchQuery]);

  const p = selectedId ? validProducteurs.find(pr => pr.id === selectedId) : null;

  if (!validProducteurs.length) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm }}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
            <View>
              <Text style={styles.title}>Suivi des exploitations</Text>
              <Text style={styles.subtitle}>Données réelles par producteur</Text>
            </View>
            <View style={styles.headerActions}>
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
        <View style={styles.center}>
          <Text style={styles.emptyText}>Aucun producteur enregistré.</Text>
          <Button title="Ajouter un producteur" onPress={() => router.push('/producteur/nouveau')} style={{ marginTop: spacing.lg }} />
        </View>
      </View>
    );
  }

  const renderHeader = () => (
    <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm }}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {selectedId && (
            <Pressable onPress={() => setSelectedId(null)} style={{ marginRight: spacing.md }}>
              <ChevronLeft size={24} color={colors.text} />
            </Pressable>
          )}
          <View>
            <Text style={styles.title}>{selectedId ? 'Détail Suivi' : 'Suivi des exploitations'}</Text>
            <Text style={styles.subtitle}>{selectedId && p ? p.nom : 'Sélectionnez un producteur'}</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
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

  const renderListHeader = () => (
    <>
      {renderHeader()}
      {/* Search Bar */}
      <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surfaceLight,
          borderRadius: radius.md,
          paddingHorizontal: spacing.md,
          height: 44,
          borderWidth: 1,
          borderColor: colors.border
        }}>
          <Search size={18} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
          {Platform.OS === 'web' ? (
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un producteur par nom..."
              style={{
                flex: 1,
                height: '100%',
                backgroundColor: 'transparent',
                border: 'none',
                color: colors.text,
                outline: 'none',
                fontSize: 14,
              }}
            />
          ) : (
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Rechercher un producteur par nom..."
              placeholderTextColor={colors.textMuted}
              style={{ flex: 1, height: '100%', color: colors.text, fontSize: 14 }}
            />
          )}
        </View>
      </View>
    </>
  );

  if (!selectedId || !p) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
          key={`grid-${numColumns}`}
          data={filteredProducteurs}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderListHeader}
          numColumns={numColumns}
          contentContainerStyle={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xl }}
          columnWrapperStyle={{ gap: spacing.md, marginBottom: spacing.md }}
          ListEmptyComponent={
            <EmptyState 
              title="Aucun producteur trouvé" 
              description={`Aucun résultat pour "${searchQuery}"`}
              icon={<Search size={48} color={colors.textMuted} />}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.producteurCard, { flex: 1, flexDirection: 'column', alignItems: 'flex-start', padding: spacing.sm }]}
              onPress={() => setSelectedId(item.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, width: '100%' }}>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primaryLight, justifyContent: 'center', alignItems: 'center', marginRight: spacing.sm }}>
                  <User size={18} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text }} numberOfLines={1}>{item.nom}</Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }} numberOfLines={1}>{item.village || 'Village inconnu'}</Text>
                </View>
              </View>
              <View style={{ gap: 6, width: '100%' }}>
                <Badge label={`${getSupCacao(item)} ha cacao`} variant="info" style={{ alignSelf: 'flex-start' }} />
                <Badge label={`${getFicheStatus(item).filter(f => f.ok).length}/7 fiches PDC`} variant={getFicheStatus(item).filter(f => f.ok).length === 7 ? 'success' : 'warning'} style={{ alignSelf: 'flex-start' }} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  const supCacao = getSupCacao(p);
  const supTotale = getSupTotale(p);
  const maladiesActives = getMaladiesActives(p);
  const fin = getFinance(p);

  const prodN1 = p?.productionCacaoAncienne?.[0]?.prod 
    || formatNumber((p?.cultures||[]).reduce((s,c)=>s+parseNum(c.production),0)) || '—';
  const revN1 = p?.productionCacaoAncienne?.[0]?.revenu 
    ? p.productionCacaoAncienne[0].revenu + ' FCFA' 
    : formatCurrency((p?.cultures||[]).reduce((s,c)=>s+parseNum(c.revenu),0));

  const cultures = (p?.cultures||[]).filter(c => c.nom && parseNum(c.superficie) > 0);
  const cultTotal = cultures.reduce((s,c) => s + parseNum(c.superficie), 0);

  const activitesAxe6 = p.planification || [];
  const activitesAxe7 = p.programmeAnnuel || [];
  
  const renderAxeActivites = (axes: any[], title: string, periods: string[], periodKey: string) => {
    if (!axes || axes.length === 0 || !axes.some(a => a.activites?.length > 0)) return null;
    return (
      <View style={{ marginBottom: spacing.lg }}>
        <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text, marginBottom: spacing.sm }}>{title}</Text>
        {axes.map((axe, i) => {
          if (!axe.activites || axe.activites.length === 0) return null;
          return (
            <View key={i} style={{ marginBottom: spacing.md, backgroundColor: colors.surfaceLight, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
              <View style={{ backgroundColor: colors.surface, padding: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                <Text style={{ fontWeight: 'bold', color: colors.primary }}>{axe.nom || `Axe ${i + 1}`}</Text>
              </View>
              {axe.activites.map((act: any, j: number) => {
                const isActEmpty = !act.activite?.trim() && !act.objectif?.trim() && !act.indicateur?.trim();
                if (isActEmpty) return null;
                const hasEmptyPeriod = periods.some(p => !act[periodKey]?.[p]);
                return (
                  <View key={j} style={{ padding: spacing.sm, borderBottomWidth: j < axe.activites.length - 1 ? 1 : 0, borderBottomColor: colors.border }}>
                    <Text style={{ color: colors.text, fontSize: 13, marginBottom: spacing.xs }}>
                      {act.activite || act.objectif || act.indicateur || 'Activité sans nom'}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      {periods.map(pLabel => {
                        const color = act[periodKey]?.[pLabel];
                        return (
                          <View key={pLabel} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: color || 'transparent', borderWidth: color ? 0 : 1, borderColor: colors.border, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                            <Text style={{ fontSize: 10, color: color ? '#fff' : colors.textSecondary, fontWeight: color ? 'bold' : 'normal' }}>{pLabel}</Text>
                          </View>
                        );
                      })}
                      {hasEmptyPeriod && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 4 }}>
                          <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.warning, marginRight: 4 }} />
                          <Text style={{ fontSize: 10, color: colors.warning }}>Période(s) non définie(s)</Text>
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {renderHeader()}

        <View style={{ alignItems: 'flex-end', marginBottom: spacing.lg }}>
          <Button title="Modifier PDC" onPress={() => router.push(`/producteur/${p.id}/edit`)} />
        </View>

        <View style={styles.kpis}>
        <View style={styles.kpiWrapper}>
          <StatCard title="Superficie Cacao" value={`${supCacao} ha`} icon={<Text>🌲</Text>} />
        </View>
        <View style={styles.kpiWrapper}>
          <StatCard title="Production N-1" value={String(prodN1)} icon={<Text>📦</Text>} />
        </View>
        <View style={styles.kpiWrapper}>
          <StatCard title="Revenus N-1" value={revN1} icon={<Text>💰</Text>} />
        </View>
        <View style={styles.kpiWrapper}>
          <StatCard 
            title="Maladies actives" 
            value={maladiesActives.length} 
            icon={<Text>⚠️</Text>} 
            variationColor={maladiesActives.length > 0 ? colors.warning : colors.success} 
          />
        </View>
      </View>

      {/* Infos rapides */}
      <View style={styles.quickInfos}>
        {[{l: 'Village', v: p.village || 'N/A'}, {l: 'Sup totale', v: supTotale > 0 ? `${supTotale} ha` : 'N/A'}, {l: 'Ménage', v: (p.menage||[]).length}].map(info => (
          <View key={info.l} style={styles.quickInfoCard}>
            <Text style={styles.quickInfoLabel}>{info.l}</Text>
            <Text style={styles.quickInfoValue}>{info.v}</Text>
          </View>
        ))}
      </View>

      {/* Cultures Chart */}
      <Card variant="glass" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🌿 Répartition superficies (Fiche 2)</Text>
          <Badge label={`${cultures.length} cultures`} variant="info" />
        </View>
        
        {cultures.length > 0 ? (
          <View>
            <View style={styles.stackedBar}>
              {cultures.map((c, i) => {
                const pctC = (parseNum(c.superficie) / cultTotal) * 100;
                const colorsArr = [colors.primary, colors.primaryLight, '#3b82f6', '#8b5cf6', '#f59e0b'];
                return <View key={i} style={{ width: `${pctC}%`, backgroundColor: colorsArr[i % colorsArr.length], height: '100%' }} />;
              })}
            </View>
            <View style={styles.legend}>
              {cultures.map((c, i) => {
                const pctC = (parseNum(c.superficie) / cultTotal) * 100;
                const colorsArr = [colors.primary, colors.primaryLight, '#3b82f6', '#8b5cf6', '#f59e0b'];
                return (
                  <View key={i} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colorsArr[i % colorsArr.length] }]} />
                    <Text style={styles.legendText}>{c.nom} ({pctC.toFixed(1)}%)</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>Aucune culture renseignée.</Text>
        )}
      </Card>

      {/* Suivi Sanitaire (Fiche 3) */}
      <Card variant="glass" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🦠 Suivi sanitaire (Fiche 3)</Text>
          <Badge label={`${maladiesActives.length} actives`} variant={maladiesActives.length > 0 ? "warning" : "success"} />
        </View>
        {maladiesActives.length > 0 ? (
          <View style={{ gap: spacing.sm }}>
            {maladiesActives.map((m, i) => (
              <View key={i} style={{ backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs, alignItems: 'center' }}>
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 14 }}>{m.nom || 'Ravageur non spécifié'}</Text>
                  <Badge 
                    label={m.severite || '3.Moyen'} 
                    variant={
                      m.severite?.includes('Fort') ? 'error' : 
                      m.severite?.includes('Moyen') ? 'warning' : 
                      m.severite?.includes('Faible') ? 'success' : 
                      'default'
                    } 
                  />
                </View>
                {m.observations ? (
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: spacing.xs }}>{m.observations}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Aucune maladie ou ravageur signalé pour cette cacaoyère.</Text>
        )}
      </Card>

      {/* Suivi des activités (Fiche 6/7) */}
      <Card variant="glass" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>📅 Suivi des activités planifiées</Text>
        </View>
        
        {/* Légende */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: spacing.lg, padding: spacing.sm, backgroundColor: colors.surfaceLight, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border }}>
          {PERIODE_COLORS.map(({ color, label }) => (
            <View key={color} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 12, height: 12, backgroundColor: color, marginRight: 6, borderRadius: 2 }} />
                  <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{label}</Text>
            </View>
          ))}
        </View>

        {renderAxeActivites(activitesAxe6, "Matrice Stratégique (Fiche 6)", ['A1', 'A2', 'A3', 'A4', 'A5'], 'periodes')}
        {renderAxeActivites(activitesAxe7, "Programme Annuel (Fiche 7)", ['T1', 'T2', 'T3', 'T4'], 'chronogramme')}
        
        {(!activitesAxe6.some((a: any) => a.activites?.length > 0) && !activitesAxe7.some((a: any) => a.activites?.length > 0)) && (
          <Text style={styles.emptyText}>Aucune activité planifiée.</Text>
        )}
      </Card>

      {/* Résumé financier (Fiche 4) */}
      <Card variant="glass" style={styles.section}>
        <Text style={styles.sectionTitle}>💰 Résumé financier (Fiche 4)</Text>
        <View style={styles.finGrid}>
          <View style={[styles.finBox, styles.finBoxSuccess]}>
            <Text style={styles.finBoxLabel}>Revenus totaux</Text>
            <Text style={styles.finBoxValue}>{formatCurrency(fin.revTotal)}</Text>
          </View>
          <View style={[styles.finBox, styles.finBoxDanger]}>
            <Text style={styles.finBoxLabel}>Dépenses totales</Text>
            <Text style={styles.finBoxValue}>{formatCurrency(fin.depTotal)}</Text>
          </View>
          <View style={[styles.finBox, fin.solde >= 0 ? styles.finBoxSuccess : styles.finBoxDanger]}>
            <Text style={styles.finBoxLabel}>Solde net</Text>
            <Text style={styles.finBoxValue}>{fin.solde >= 0 ? '+' : ''}{formatCurrency(fin.solde)}</Text>
          </View>
        </View>
      </Card>

      </ScrollView>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { color: colors.textSecondary, fontSize: typography.sizes.md, fontStyle: 'italic' },
  content: { padding: spacing.lg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md, flexWrap: 'wrap', gap: spacing.sm },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.bold, color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: typography.sizes.xs, color: colors.textMuted, marginTop: 2, letterSpacing: 0.3 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: colors.surface, borderRadius: radius.full },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: typography.sizes.xs, color: colors.textMuted },
  themeToggle: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  
  producteurCard: { flexDirection: 'column', backgroundColor: colors.surfaceLight, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  
  kpis: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  kpiWrapper: { flex: 1, minWidth: 140 },
  quickInfos: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.lg },
  quickInfoCard: { flex: 1, minWidth: 100, backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  quickInfoLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, textTransform: 'uppercase', marginBottom: 2 },
  quickInfoValue: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold, color: colors.text },
  section: { marginBottom: spacing.lg },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
  stackedBar: { height: 12, borderRadius: radius.full, overflow: 'hidden', flexDirection: 'row', backgroundColor: colors.surfaceLight, marginBottom: spacing.md },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: typography.sizes.xs, color: colors.textSecondary },
  
  finGrid: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  finBox: { flex: 1, padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
  finBoxSuccess: { backgroundColor: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.2)' },
  finBoxDanger: { backgroundColor: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' },
  finBoxLabel: { fontSize: typography.sizes.xs, color: colors.textSecondary, marginBottom: spacing.xs, textTransform: 'uppercase' },
  finBoxValue: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, color: colors.text },
});
