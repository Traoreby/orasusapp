import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useProducteurStore } from '../../src/core/store/useProducteurStore';
import { Producteur } from '../../src/core/types/producteur';
import { formatNumber, formatCurrency } from '../../src/utils/formatters';
import { Card, StatCard, EmptyState, Button, Badge, Divider } from '../../src/components/ui';
import { spacing, typography, radius } from '../../src/theme';
import { TreePine, Package, Banknote, AlertTriangle, MapPin, Leaf, Sprout, ClipboardList, ArrowLeft, Edit2, Trash2 } from 'lucide-react-native';
import { useTheme } from "../../src/hooks/useTheme";

// --- Calculs Helpers ---
const parseNum = (s: any) => parseFloat(String(s || '').replace(/[\s]/g, '')) || 0;
const getSupCacao = (p: Producteur) => (p?.cultures || []).filter(c => (c.nom||'').toLowerCase().includes('cacao')).reduce((s,c)=>s+(parseFloat(String(c.superficie))||0),0);
const getSupTotale = (p: Producteur) => (p?.cultures || []).reduce((s,c)=>s+(parseFloat(String(c.superficie))||0),0);
const getMaladiesActives = (p: Producteur) => (p?.cacaoyere?.maladies || []).filter(m => m.severite && m.severite !== 'Aucun');

function getFinance(p: Producteur) {
  const revCacao = parseNum(p?.productionCacaoAncienne?.[0]?.revenu);
  const revAutres = (p?.sourcesRevenusAutres||[]).reduce((s,r)=>s+parseNum(r.revenu),0);
  const depFoyer = (p?.depensesFoyer||[]).reduce((s,d)=>s+parseNum(d.montant),0);
  const depMO = (p?.mainOeuvre||[]).reduce((s,m)=>s+parseNum(m.cout),0);
  const revTotal = revCacao + revAutres;
  const depTotal = depFoyer + depMO;
  return { revCacao, revAutres, revTotal, depFoyer, depMO, depTotal, solde: revTotal - depTotal };
}

function getFicheStatus(p: Producteur) {
  return [
    { label:'Fiche 1 – Profil', ok: !!(p.nom && p.contact && p.codeNational && p.codeGroupe && p.codeEntite) },
    { label:'Fiche 2 – Exploitation', ok: (p.cultures||[]).some(c=>Number(c.superficie)>0) },
    { label:'Fiche 3 – Cacaoyère', ok: !!(p.cacaoyere?.dispositif && p.cacaoyere?.densite) },
    { label:'Fiche 4 – Socio-éco', ok: !!(p.productionCacaoAncienne?.[0]?.prod) },
    { label:'Fiche 5 – Problèmes', ok: (p.analyseProblemes||[]).some(r=>r.problemes) },
    { label:'Fiche 6 – Planification', ok: (p.fiche7||[]).some(a=>a.activites?.some(ac=>ac.obj||ac.act)) },
    { label:'Fiche 7 – Programme', ok: (p.fiche8||[]).some(a=>a.activites?.some(ac=>ac.act)) },
    { label:'Fiche 8 – Moyens/Coûts', ok: (p.moyensCouts||[]).some(g=>g.items?.some(i=>i.a1q||i.a1c)) },
  ];
}

export default function ProducteurDetailScreen() {

  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getProducteur, deleteProducteur } = useProducteurStore();
  
  const p = id ? getProducteur(id) : undefined;

  if (!p) {
    return (
      <View style={styles.container}>
        <EmptyState 
          title="Producteur introuvable" 
          description="Ce producteur n'existe pas ou a été supprimé."
          actionTitle="Retour à la liste"
          onAction={() => router.replace('/(tabs)/producteurs')}
        />
      </View>
    );
  }

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Voulez-vous vraiment supprimer ${p.nom} ?`)) {
        deleteProducteur(p.id);
        router.back();
      }
    } else {
      Alert.alert(
        'Confirmer la suppression',
        `Êtes-vous sûr de vouloir supprimer ${p.nom} ? Cette action est irréversible.`,
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Supprimer', style: 'destructive', onPress: () => {
            deleteProducteur(p.id);
            router.back();
          }}
        ]
      );
    }
  };

  const supCacao = getSupCacao(p);
  const supTotale = getSupTotale(p);
  const maladiesActives = getMaladiesActives(p);
  const fin = getFinance(p);
  const ficheStatus = getFicheStatus(p);
  const ficheOk = ficheStatus.filter(f=>f.ok).length;
  const pct = Math.round((ficheOk / ficheStatus.length) * 100);

  const prodN1 = p?.productionCacaoAncienne?.[0]?.prod 
    || formatNumber((p?.cultures||[]).reduce((s,c)=>s+(Number(c.production)||0),0)) || '—';
  const revN1 = p?.productionCacaoAncienne?.[0]?.revenu 
    ? p.productionCacaoAncienne[0].revenu + ' FCFA' 
    : formatCurrency((p?.cultures||[]).reduce((s,c)=>s+(Number(c.revenu)||0),0));

  const cultures = (p?.cultures||[]).filter(c=>c.nom && parseFloat(String(c.superficie))>0);
  const cultTotal = cultures.reduce((s,c)=>s+(parseFloat(String(c.superficie))||0),0);

  return (
    <> <Stack.Screen options={{ headerShown: false }} />
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Actions */}
      <View style={styles.headerActions}>
        <Button 
          title="Retour" 
          icon={<ArrowLeft size={16} color={colors.text} />}
          variant="secondary" 
          onPress={() => router.back()} 
        />
        <View style={styles.rightActions}>
          <Button 
            title="Modifier" 
            icon={<Edit2 size={16} color={colors.primaryLight} />}
            variant="outline" 
            onPress={() => router.push(`/producteur/${p.id}/edit`)} 
          />
          <Button 
            title="Supprimer" 
            icon={<Trash2 size={16} color="#fff" />}
            variant="danger" 
            onPress={handleDelete} 
          />
        </View>
      </View>

      {/* Identity */}
      <View style={styles.identity}>
        <Text style={styles.title}>{p.nom}</Text>
        <Text style={styles.subtitle}>{p.codeNational || 'Pas de code national'}</Text>
        <Badge label={p.nomEntite || 'Entité non définie'} variant="info" style={styles.entityBadge} />
      </View>

      {/* KPIs */}
      <View style={styles.kpis}>
        <View style={styles.kpiWrapper}>
          <StatCard title="Superficie Cacao" value={`${supCacao} ha`} icon={<TreePine size={18} color="#fff" />} iconColors={['#10b981', '#047857']} />
        </View>
        <View style={styles.kpiWrapper}>
          <StatCard title="Production N-1" value={String(prodN1)} icon={<Package size={18} color="#fff" />} iconColors={['#f59e0b', '#b45309']} />
        </View>
        <View style={styles.kpiWrapper}>
          <StatCard title="Revenus N-1" value={revN1} icon={<Banknote size={18} color="#fff" />} iconColors={['#8b5cf6', '#6d28d9']} />
        </View>
        <View style={styles.kpiWrapper}>
          <StatCard title="Maladies Actives" value={maladiesActives.length} icon={<AlertTriangle size={18} color="#fff" />} iconColors={['#ef4444', '#b91c1c']} variationColor={maladiesActives.length > 0 ? colors.warning : colors.success} />
        </View>
      </View>

      {/* Infos rapides */}
      <Card variant="glass" style={styles.section}>
        <View style={styles.sectionHeader}>
          <MapPin size={18} color={colors.primaryLight} />
          <Text style={styles.sectionTitle}>Informations locales</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.label}>Village:</Text>
          <Text style={styles.value}>{p.village || 'Non renseigné'}</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.label}>Superficie totale:</Text>
          <Text style={styles.value}>{supTotale > 0 ? `${supTotale} ha` : 'Non renseigné'}</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.label}>Membres ménage:</Text>
          <Text style={styles.value}>{p.menage && p.menage.length > 0 ? `${p.menage.length} personne(s)` : 'Non renseigné'}</Text>
        </View>
      </Card>

      {/* Cultures */}
      <Card variant="glass" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Leaf size={18} color={colors.primaryLight} />
          <Text style={styles.sectionTitle}>Cultures</Text>
        </View>
        {cultures.length > 0 ? (
          <View>
            {cultures.map((c, i) => (
              <View key={i} style={styles.cultureItem}>
                <Text style={styles.cultureName}>{c.nom}</Text>
                <Text style={styles.cultureSup}>{c.superficie} ha</Text>
              </View>
            ))}
            <View style={[styles.cultureItem, { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: spacing.xs, paddingTop: spacing.xs }]}>
              <Text style={[styles.cultureName, { fontWeight: 'bold' }]}>Total</Text>
              <Text style={[styles.cultureSup, { fontWeight: 'bold', color: colors.primaryLight }]}>{cultTotal.toFixed(2)} ha</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.emptyText}>Aucune culture renseignée.</Text>
        )}
      </Card>

      {/* État cacaoyère */}
      <Card variant="glass" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Sprout size={18} color={colors.primaryLight} />
          <Text style={styles.sectionTitle}>État de la cacaoyère</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.label}>Dispositif:</Text>
          <Text style={styles.value}>{p.cacaoyere?.dispositif || 'Non renseigné'}</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.label}>Densité:</Text>
          <Text style={styles.value}>{p.cacaoyere?.densite ? `${p.cacaoyere.densite} pieds/ha` : 'Non renseigné'}</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.label}>Ombrage:</Text>
          <Text style={styles.value}>{p.cacaoyere?.ombrage || 'Non renseigné'}</Text>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.label}>Maladies:</Text>
          <Text style={styles.value}>{maladiesActives.length > 0 ? `${maladiesActives.length} active(s)` : 'Aucune'}</Text>
        </View>
      </Card>

      {/* Résumé financier */}
      <Card variant="glass" style={styles.section}>
        <View style={styles.sectionHeader}>
          <Banknote size={18} color={colors.primaryLight} />
          <Text style={styles.sectionTitle}>Résumé financier</Text>
        </View>
        <View style={styles.finBox}>
          <Text style={styles.finLabel}>Revenus totaux:</Text>
          <Text style={styles.finValue}>{formatCurrency(fin.revTotal)}</Text>
        </View>
        <View style={styles.finBox}>
          <Text style={styles.finLabel}>Dépenses totales:</Text>
          <Text style={[styles.finValue, { color: colors.warning }]}>{formatCurrency(fin.depTotal)}</Text>
        </View>
        <Divider style={{ marginVertical: spacing.md, backgroundColor: 'rgba(255,255,255,0.1)' }} />
        <View style={styles.finBox}>
          <Text style={styles.finLabel}>Solde net:</Text>
          <Text style={[styles.finValue, { color: fin.solde >= 0 ? colors.primaryLight : colors.warning }]}>
            {fin.solde >= 0 ? '+' : ''}{formatCurrency(fin.solde)}
          </Text>
        </View>
      </Card>

      {/* Avancement PDC */}
      <Card variant="glass" style={styles.section}>
        <View style={styles.sectionHeader}>
          <ClipboardList size={18} color={colors.primaryLight} />
          <Text style={styles.sectionTitle}>Avancement du PDC ({pct}%)</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${pct}%` }]} />
        </View>
        <View style={{ marginTop: spacing.md }}>
          {ficheStatus.map((f, i) => (
            <View key={i} style={[styles.rowInfo, { marginBottom: spacing.xs }]}>
              <View style={[styles.statusDot, { backgroundColor: f.ok ? colors.primary : colors.surfaceLight }]} />
              <Text style={[styles.label, { flex: 1, marginLeft: spacing.sm, color: f.ok ? colors.text : colors.textSecondary }]}>{f.label}</Text>
            </View>
          ))}
        </View>
      </Card>

    </ScrollView>
    </>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  rightActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  identity: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.sizes.md,
    color: colors.primaryLight,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: spacing.xs,
  },
  entityBadge: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
  },
  kpis: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  kpiWrapper: {
    flex: 1,
    minWidth: 140,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  rowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    width: 140,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  value: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontWeight: typography.weights.medium,
  },
  cultureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  cultureName: {
    fontSize: typography.sizes.sm,
    color: colors.text,
  },
  cultureSup: {
    fontSize: typography.sizes.sm,
    color: colors.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  emptyText: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  finBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  finLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  finValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.text,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primaryLight,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  }
});
