import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform, FlatList, TouchableOpacity, TextInput as RNTextInput, Pressable, Modal, ScrollView, ActivityIndicator } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useProducteurStore } from '../../src/core/store/useProducteurStore';
import { ProducteurForm } from '../../src/components/producteurs/ProducteurForm';
import { usePdcPrint } from '../../src/hooks/usePdcPrint';
import { generatePdcHtml } from '../../src/utils/printPdc';
import { spacing, typography, radius } from '../../src/theme';
import { Search, User, MapPin, Sun, Moon, Eye, Printer, ChevronLeft } from 'lucide-react-native';
import { Producteur } from '../../src/core/types/producteur';
import { useTheme } from "../../src/hooks/useTheme";
import { useNetworkStatus } from '../../src/hooks/useNetworkStatus';
import { Button } from '../../src/components/ui';

export default function PdcScreen() {

  const { colors, isDark, toggleTheme } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const isOnline = useNetworkStatus();

  const router = useRouter();
  const { producteurs, updateProducteur } = useProducteurStore();
  const { handlePrint } = usePdcPrint();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [isBacking, setIsBacking] = useState(false);
  const formRef = React.useRef<any>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const handleBack = async () => {
    if (savingState !== 'saved' && savingState !== 'idle') {
      setIsBacking(true);
      if (formRef.current && formRef.current.forceSaveAsync) {
        await formRef.current.forceSaveAsync();
      }
      setIsBacking(false);
    }
    setSelectedId(null);
  };

  // Slecteur de producteur
  const filtered = useMemo(() => {
    return producteurs.filter(p => {
      if (!p || !String(p.nom || '').trim()) return false;
      const q = search.toLowerCase();
      return !q || 
        p.nom.toLowerCase().includes(q) || 
        (p.codeNational || '').toLowerCase().includes(q) || 
        (p.village || '').toLowerCase().includes(q);
    });
  }, [producteurs, search]);

  const selectedProducteur = useMemo(() => {
    return producteurs.find(p => p.id === selectedId) || null;
  }, [producteurs, selectedId]);

  const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved'>('idle');

  const handleAutoSave = (updatedData: Producteur) => {
    setSavingState('saving');
    updateProducteur(updatedData.id, updatedData);
    
    // Simulate API delay
    setTimeout(() => {
      setSavingState('saved');
      setTimeout(() => setSavingState('idle'), 2000);
    }, 500);
  };

  const handlePrintPdc = () => {
    if (selectedProducteur) {
      handlePrint(selectedProducteur);
    }
  };

  const handlePreviewPdc = () => {
    if (selectedProducteur) {
      setPreviewHtml(generatePdcHtml(selectedProducteur));
    }
  };

  const renderHeader = () => (
    <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {selectedProducteur && (
          <Pressable onPress={handleBack} style={{ marginRight: spacing.md, opacity: isBacking ? 0.5 : 1 }} disabled={isBacking}>
            {isBacking ? <ActivityIndicator size="small" color={colors.text} /> : <ChevronLeft size={24} color={colors.text} />}
          </Pressable>
        )}
        <View>
          <Text style={styles.title}>Fiche PDC</Text>
          <Text style={styles.subtitle}>
            {selectedProducteur ? selectedProducteur.nom : "Consultez et complétez le plan de développement communal"}
          </Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        {selectedProducteur && (
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginRight: spacing.sm }}>
            <Button 
              title="Aperçu" 
              variant="secondary" 
              icon={<Eye size={18} color={colors.text} />} 
              onPress={handlePreviewPdc} 
            />
            <Button 
              title="Imprimer" 
              variant="secondary" 
              icon={<Printer size={18} color={colors.text} />} 
              onPress={handlePrintPdc} 
            />
          </View>
        )}
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? colors.primaryLight : colors.error }]} />
          <Text style={styles.statusText}>{isOnline ? 'En ligne' : 'Hors ligne'}</Text>
        </View>
        <Pressable onPress={toggleTheme} style={styles.themeToggle}>
          {isDark ? <Moon size={18} color={colors.textSecondary} /> : <Sun size={18} color={colors.textSecondary} />}
        </Pressable>
      </View>
    </Animated.View>
  );

  const renderListHeader = () => (
    <>
      {renderHeader()}
      
      <View style={styles.selectorHeader}>
        <Text style={styles.selectorTitle}>Sélectionner un Producteur</Text>
        <Text style={styles.selectorSubtitle}>Choisissez un producteur pour consulter ou modifier sa Fiche PDC.</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textSecondary} style={{ marginRight: 8 }} />
        <RNTextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher par nom, code ou village..."
          placeholderTextColor={colors.textSecondary}
          style={styles.searchInput}
        />
      </View>
    </>
  );

  if (!selectedId || !selectedProducteur) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={renderListHeader}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.producteurCard}
                onPress={() => setSelectedId(item.id)}
              >
                <View style={styles.avatar}>
                  <User size={24} color={colors.primary} />
                </View>
                <View style={styles.producteurInfo}>
                  <Text style={styles.producteurName}>{item.nom}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <MapPin size={14} color={colors.textSecondary} style={{ marginRight: 4 }} />
                    <Text style={styles.producteurVillage}>{item.village || 'Village non renseigné'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: spacing.md, paddingTop: spacing.sm }}>
        {renderHeader()}
        <View style={{ flex: 1, paddingTop: spacing.md }}>
          <ProducteurForm
            ref={formRef}
            initialData={selectedProducteur}
            mode="pdc"
            onAutoSave={handleAutoSave}
            onPrint={handlePrintPdc}
            onPreview={handlePreviewPdc}
            onChangeProducteur={handleBack}
            savingState={savingState}
          />
        </View>
      </ScrollView>

      <Modal visible={!!previewHtml} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setPreviewHtml(null)}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md, borderBottomWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 18, color: colors.text, fontWeight: 'bold' }}>Aperçu avant impression</Text>
            <View style={{ flexDirection: 'row', gap: spacing.md }}>
              <Button title="Imprimer" variant="primary" icon={<Printer size={18} color="#fff" />} onPress={() => { handlePrintPdc(); setPreviewHtml(null); }} />
              <Button title="Fermer" variant="secondary" onPress={() => setPreviewHtml(null)} />
            </View>
          </View>
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
            {Platform.OS === 'web' ? (
              <iframe srcDoc={previewHtml || ''} style={{ width: '100%', height: '100%', border: 'none' }} />
            ) : (
              <ScrollView style={{ padding: 24 }}>
                <Text style={{ color: '#000', fontSize: 16, textAlign: 'center', marginTop: 40 }}>L'aperçu HTML enrichi nécessite la version Web ou une WebView.</Text>
                <Text style={{ color: '#555', fontSize: 14, textAlign: 'center', marginTop: 20 }}>Vous pouvez utiliser le bouton "Imprimer" pour générer directement le document PDF final.</Text>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
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
  selectorContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  selectorHeader: {
    marginBottom: spacing.xl,
  },
  selectorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  selectorSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: 16,
    ...Platform.select({ web: { outlineStyle: 'none' } as any, default: {} })
  },
  listContent: {
    padding: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  producteurCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  producteurInfo: {
    flex: 1,
  },
  producteurName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  producteurVillage: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
