import React from 'react';
import { View, Text, StyleSheet, Alert, Platform, Pressable, Modal, TextInput as RNTextInput } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, interpolateColor } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Card, Button } from '../ui';
import { Producteur } from '../../core/types/producteur';
import { useTheme } from '../../hooks/useTheme';
import { spacing, typography, radius } from '../../theme';
import { Edit2, Trash2, Printer } from 'lucide-react-native';
import { usePdcPrint } from '../../hooks/usePdcPrint';
import { getFicheStatus } from '../../utils/producteurCalculations';

interface ProducteurCardProps {
  producteur: Producteur;
  onDelete: (id: string) => void;
  isLargeScreen?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Pill badge for entity ───────────────────────────────────────────────────
function EntityPill({ label, colors }: { label: string; colors: any }) {
  if (!label || label === 'N/A') return <Text style={{ color: colors.textMuted, fontSize: 12 }}>—</Text>;
  return (
    <View style={{
      backgroundColor: 'rgba(34, 197, 94, 0.12)',
      borderWidth: 1,
      borderColor: 'rgba(34, 197, 94, 0.3)',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 3,
      alignSelf: 'flex-start',
    }}>
      <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600' }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

// ─── Icon action button ───────────────────────────────────────────────────────
function IconBtn({ onPress, children, bgColor }: { onPress: () => void; children: React.ReactNode; bgColor?: string }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: bgColor || 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.6 : 1,
      }]}
    >
      {children}
    </Pressable>
  );
}

export function ProducteurCard({ producteur, onDelete, isLargeScreen = false }: ProducteurCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const hoverAnim = useSharedValue(0);
  const scaleAnim = useSharedValue(1);

  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = React.useState('');

  const handlePress = () => router.push(`/producteur/${producteur.id}`);
  const handleEdit = () => router.push(`/producteur/${producteur.id}/edit`);

  const handleDelete = () => {
    const fichesCompletes = getFicheStatus(producteur).filter(f => f.ok).length;
    
    if (fichesCompletes > 0) {
      setDeleteConfirmText('');
      setDeleteModalVisible(true);
    } else {
      if (Platform.OS === 'web') {
        if (window.confirm(`Voulez-vous vraiment supprimer ${producteur.nom} ?`)) {
          onDelete(producteur.id);
        }
      } else {
        Alert.alert(
          'Confirmer la suppression',
          `Êtes-vous sûr de vouloir supprimer ${producteur.nom} ?`,
          [
            { text: 'Annuler', style: 'cancel' },
            { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(producteur.id) }
          ]
        );
      }
    }
  };

  const { handlePrint: printPdc } = usePdcPrint();
  const handlePrint = async () => await printPdc(producteur);

  const cleanName = producteur.nom.replace('⭐ ', '').replace('⭐', '').trim();
  const isDemo = producteur.nom.includes('[DEMO]') || producteur.nom.includes('⭐');

  const deleteModal = (
    <Modal transparent visible={deleteModalVisible} animationType="fade" onRequestClose={() => setDeleteModalVisible(false)}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: spacing.md }}>
        <View style={{ backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.xl, width: '100%', maxWidth: 400 }}>
          <Text style={{ fontSize: typography.sizes.lg, fontWeight: 'bold', color: colors.error, marginBottom: spacing.sm }}>
            ⚠️ Attention : Suppression Critique
          </Text>
          <Text style={{ fontSize: typography.sizes.md, color: colors.text, marginBottom: spacing.lg, lineHeight: 22 }}>
            Ce producteur a un PDC avec des données sauvegardées. La suppression entraînera la perte DÉFINITIVE de toutes ses données saisies (Fiches 1 à 8). Cette action est irréversible.
          </Text>
          <Text style={{ fontSize: typography.sizes.sm, color: colors.textSecondary, marginBottom: spacing.xs }}>
            Veuillez taper <Text style={{ fontWeight: 'bold', color: colors.text }}>SUPPRIMER</Text> pour confirmer :
          </Text>
          <RNTextInput 
            style={{ height: 44, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, color: colors.text, marginBottom: spacing.xl, backgroundColor: colors.background }}
            value={deleteConfirmText}
            onChangeText={setDeleteConfirmText}
            autoCapitalize="characters"
          />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: spacing.md }}>
            <Button title="Annuler" variant="secondary" onPress={() => setDeleteModalVisible(false)} />
            <Button 
              title="Supprimer" 
              variant="danger" 
              disabled={deleteConfirmText !== 'SUPPRIMER'}
              onPress={() => {
                setDeleteModalVisible(false);
                onDelete(producteur.id);
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );

  // ── Large screen: table row layout ──────────────────────────────────────────
  if (isLargeScreen) {
    const animatedRowStyle = useAnimatedStyle(() => ({
      backgroundColor: interpolateColor(
        hoverAnim.value,
        [0, 1],
        ['transparent', colors.surface]
      ),
    }));

    return (
      <>
        {deleteModal}
        <AnimatedPressable
        style={[styles.tableRow, { borderBottomColor: colors.border }, animatedRowStyle]}
        onPress={handlePress}
        //@ts-ignore
        onHoverIn={() => { if (Platform.OS === 'web') hoverAnim.value = withTiming(1, { duration: 120 }); }}
        onHoverOut={() => { if (Platform.OS === 'web') hoverAnim.value = withTiming(0, { duration: 120 }); }}
      >
        {/* NOM ET PRÉNOMS */}
        <View style={[styles.col, { flex: 2.2 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {isDemo && <Text style={{ fontSize: 13 }}>⭐</Text>}
            <Text style={[styles.nameText, { color: colors.text }]} numberOfLines={1}>
              {cleanName}
            </Text>
          </View>
        </View>

        {/* CODE NATIONAL */}
        <View style={[styles.col, { flex: 1.4 }]}>
          <Text style={[styles.codeText, { color: colors.textSecondary }]} numberOfLines={1}>
            {producteur.codeNational || '—'}
          </Text>
        </View>

        {/* VILLAGE */}
        <View style={[styles.col, { flex: 1.2 }]}>
          <Text style={[styles.cellText, { color: colors.textSecondary }]} numberOfLines={1}>
            {producteur.village || '—'}
          </Text>
        </View>

        {/* DÉPARTEMENT */}
        <View style={[styles.col, { flex: 1.4 }]}>
          <Text style={[styles.cellText, { color: colors.textSecondary }]} numberOfLines={1}>
            {producteur.departement || '—'}
          </Text>
        </View>

        {/* ENTITÉ */}
        <View style={[styles.col, { flex: 1.3 }]}>
          <EntityPill label={producteur.nomEntite || ''} colors={colors} />
        </View>

        {/* ACTIONS */}
        <View style={[styles.col, styles.actionsCol]}>
          <IconBtn onPress={handlePrint}>
            <Printer size={15} color={colors.textSecondary} />
          </IconBtn>
          <IconBtn onPress={handleEdit} bgColor="rgba(34, 197, 94, 0.1)">
            <Edit2 size={15} color={colors.primary} />
          </IconBtn>
          <IconBtn onPress={handleDelete} bgColor="rgba(239, 68, 68, 0.1)">
            <Trash2 size={15} color={colors.error} />
          </IconBtn>
        </View>
      </AnimatedPressable>
      </>
    );
  }

  // ── Mobile: card layout ───────────────────────────────────────────────────
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnim.value }]
  }));

  return (
    <>
      {deleteModal}
      <Card variant="glass" style={styles.card}>
      <AnimatedPressable
        onPress={handlePress}
        onPressIn={() => scaleAnim.value = withSpring(0.98, { damping: 15, stiffness: 300 })}
        onPressOut={() => scaleAnim.value = withSpring(1, { damping: 15, stiffness: 300 })}
        style={[styles.content, animatedContentStyle]}
      >
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 6 }}>
            {isDemo && <Text style={{ fontSize: 13 }}>⭐</Text>}
            <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{cleanName}</Text>
          </View>
          <EntityPill label={producteur.nomEntite || ''} colors={colors} />
        </View>

        <Text style={[styles.code, { color: colors.primaryLight }]}>
          {producteur.codeNational || 'Pas de code'}
        </Text>

        <View style={styles.detailsRow}>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>📍 {producteur.village || 'Village inconnu'}</Text>
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>🏢 {producteur.departement || 'Dpt inconnu'}</Text>
        </View>
      </AnimatedPressable>

      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <Button
          title="Imprimer"
          variant="secondary"
          icon={<Printer size={15} color={colors.textSecondary} />}
          onPress={handlePrint}
          style={styles.actionBtn}
          textStyle={styles.actionBtnText}
        />
        <Button
          title="Modifier"
          variant="outline"
          onPress={handleEdit}
          style={styles.actionBtn}
          textStyle={styles.actionBtnText}
        />
        <Button
          title="Supprimer"
          variant="danger"
          onPress={handleDelete}
          style={styles.actionBtn}
          textStyle={styles.actionBtnText}
        />
      </View>
    </Card>
    </>
  );
}

const styles = StyleSheet.create({
  // ── Mobile card ─────────────────────────────────────────────────────────────
  card: { padding: 0, marginBottom: spacing.sm },
  content: { padding: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  name: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold, flex: 1 },
  code: { fontSize: typography.sizes.xs, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', marginBottom: spacing.sm },
  detailsRow: { flexDirection: 'row', gap: spacing.md },
  detailText: { fontSize: typography.sizes.xs },
  actions: { flexDirection: 'row', flexWrap: 'wrap', borderTopWidth: 1, padding: spacing.sm, justifyContent: 'flex-start', gap: spacing.sm },
  actionBtn: { height: 32, paddingHorizontal: spacing.xs, flex: 1, minWidth: 90 },
  actionBtnText: { fontSize: 11, textAlign: 'center' },

  // ── Large screen table row ───────────────────────────────────────────────────
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    ...Platform.select({ web: { cursor: 'pointer' } as any }),
  },
  col: {
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.1,
  },
  codeText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cellText: {
    fontSize: 13,
  },
  actionsCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingRight: spacing.md,
  },
});
