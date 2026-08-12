import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useProducteurStore } from '../../src/core/store/useProducteurStore';
import { ProducteurCard } from '../../src/components/producteurs/ProducteurCard';
import { Button, EmptyState, Select, Card } from '../../src/components/ui';
import { REGIONS, DEPARTEMENTS, ENTITES } from '../../src/constants/data';
import { spacing, typography, radius } from '../../src/theme';
import { Search, Filter, Plus } from 'lucide-react-native';
import { useTheme } from "../../src/hooks/useTheme";
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProducteursScreen() {

  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const router = useRouter();
  const { producteurs, deleteProducteur } = useProducteurStore();
  const flatListRef = React.useRef<FlatList>(null);
  const screenWidth = Dimensions.get('window').width;
  const isLargeScreen = screenWidth > 768;
  
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterEntite, setFilterEntite] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const filtered = useMemo(() => {
    return producteurs.filter(p => {
      if (!p || !String(p.nom || '').trim()) return false;
      const q = search.toLowerCase();
      const matchSearch = !q || 
        p.nom.toLowerCase().includes(q) || 
        (p.codeNational || '').toLowerCase().includes(q) || 
        (p.village || '').toLowerCase().includes(q);
      
      const matchRegion = !filterRegion || p.delegation === filterRegion;
      const matchDept = !filterDept || p.departement === filterDept;
      const matchEntite = !filterEntite || p.nomEntite === filterEntite;
      
      return matchSearch && matchRegion && matchDept && matchEntite;
    });
  }, [producteurs, search, filterRegion, filterDept, filterEntite]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRegion, filterDept, filterEntite]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const activeFiltersCount = [filterRegion, filterDept, filterEntite].filter(Boolean).length;

  const handleNew = () => {
    router.push('/producteur/nouveau');
  };

  const handleResetFilters = () => {
    setFilterRegion('');
    setFilterDept('');
    setFilterEntite('');
  };

  const availableDepts = filterRegion 
    ? (DEPARTEMENTS[filterRegion] || []) 
    : Object.values(DEPARTEMENTS).flat();

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.md }}>
        <Button 
          title="Précédent" 
          variant="secondary" 
          disabled={currentPage === 1} 
          onPress={handlePrevPage} 
        />
        <Text style={{ color: colors.text, fontSize: typography.sizes.sm }}>
          Page {currentPage} sur {totalPages}
        </Text>
        <Button 
          title="Suivant" 
          variant="secondary" 
          disabled={currentPage === totalPages} 
          onPress={handleNextPage} 
        />
      </View>
    );
  };

  const renderHeader = () => (
    <>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Gestion des producteurs</Text>
          <Text style={styles.subtitle}>
            {producteurs.length} producteurs trouvés
          </Text>
        </View>
        <Button 
          title="Ajouter un producteur"
          icon={<Plus size={18} color="#fff" />} 
          onPress={handleNew} 
        />
      </Animated.View>

      <View style={styles.searchCard}>
        <View style={styles.searchRow}>
          <View style={styles.searchInputWrapper}>
            <Search size={18} color={colors.textSecondary} style={styles.searchIcon} />
            {Platform.OS === 'web' ? (
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, code ou village..."
                style={{
                  width: '100%',
                  height: 44,
                  backgroundColor: 'rgba(41, 37, 36, 0.5)',
                  border: '1px solid rgba(68, 64, 60, 0.5)',
                  borderRadius: 12,
                  paddingLeft: 44,
                  paddingRight: 16,
                  color: colors.text,
                  outline: 'none',
                  fontSize: 14,
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <View style={styles.mobileSearchBg}>
                <Text style={{color: colors.textMuted, marginLeft: 36}}>Rechercher...</Text>
              </View>
            )}
          </View>
          <Button 
            title={isLargeScreen ? "Filtres" : ""} 
            icon={<Filter size={18} color={showFilters || activeFiltersCount > 0 ? '#fff' : colors.text} />}
            variant={showFilters || activeFiltersCount > 0 ? 'primary' : 'secondary'}
            onPress={() => setShowFilters(!showFilters)}
            style={[styles.filterButton, { flexShrink: 0 }]}
          />
        </View>

        {showFilters && (
          <View style={styles.filtersGrid}>
            <View style={styles.filterCol}>
              <Select
                value={filterRegion}
                onValueChange={(v) => { setFilterRegion(v); setFilterDept(''); }}
                options={REGIONS.map(r => ({ label: r, value: r }))}
                placeholder="Toutes les régions"
              />
            </View>
            <View style={styles.filterCol}>
              <Select
                value={filterDept}
                onValueChange={setFilterDept}
                options={availableDepts.map(d => ({ label: d, value: d }))}
                placeholder="Tous les départements"
                disabled={!filterRegion}
              />
            </View>
            <View style={styles.filterCol}>
              <Select
                value={filterEntite}
                onValueChange={setFilterEntite}
                options={ENTITES.map(e => ({ label: e, value: e }))}
                placeholder="Toutes les entités"
              />
            </View>
            {activeFiltersCount > 0 && (
              <TouchableOpacity onPress={handleResetFilters} style={styles.resetBtn}>
                <Text style={styles.resetBtnText}>Réinitialiser</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {isLargeScreen && filtered.length > 0 && (
        <View style={[styles.tableHeader, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
          <Text style={[styles.tableHead, { flex: 2.2 }]}>NOM ET PRÉNOMS</Text>
          <Text style={[styles.tableHead, { flex: 1.4 }]}>CODE NATIONAL</Text>
          <Text style={[styles.tableHead, { flex: 1.2 }]}>VILLAGE</Text>
          <Text style={[styles.tableHead, { flex: 1.4 }]}>DÉPARTEMENT</Text>
          <Text style={[styles.tableHead, { flex: 1.3 }]}>ENTITÉ</Text>
          <Text style={[styles.tableHead, { flex: 1, textAlign: 'right', paddingRight: spacing.md }]}>ACTIONS</Text>
        </View>
      )}
    </>
  );

  return (
    <View style={styles.container}>

      <FlatList
        ref={flatListRef}
        data={paginatedData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'ios'}
        renderItem={({ item }) => (
          <ProducteurCard 
            producteur={item} 
            onDelete={deleteProducteur}
            isLargeScreen={isLargeScreen}
          />
        )}
        ListFooterComponent={renderPagination}
        ListEmptyComponent={
          <EmptyState
            title={producteurs.length === 0 ? "Aucun producteur" : "Aucun résultat"}
            description={
              producteurs.length === 0 
                ? "Ajoutez votre premier producteur pour commencer à collecter des données."
                : "Aucun producteur ne correspond à vos critères de recherche."
            }
            actionTitle={producteurs.length === 0 ? "Ajouter un producteur" : "Réinitialiser les filtres"}
            onAction={producteurs.length === 0 ? handleNew : () => {
              setSearch('');
              handleResetFilters();
            }}
          />
        }
      />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: Platform.OS !== 'web' ? 44 : spacing.lg,
    paddingBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
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
  },
  searchCard: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  searchInputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  mobileSearchBg: {
    height: 44,
    backgroundColor: 'rgba(41, 37, 36, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(68, 64, 60, 0.5)',
    borderRadius: 12,
    justifyContent: 'center',
  },
  filterButton: {
    height: 44,
    width: Platform.OS !== 'web' ? 44 : undefined,
    paddingHorizontal: Platform.OS !== 'web' ? 0 : spacing.lg,
  },
  filtersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  filterCol: {
    flex: 1,
    minWidth: 200,
  },
  resetBtn: {
    alignSelf: 'center',
    padding: spacing.sm,
  },
  resetBtnText: {
    color: colors.error,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: 'transparent',
  },
  tableHead: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
    paddingHorizontal: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
