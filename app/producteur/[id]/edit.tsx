import React, { useState } from 'react';
import { View, StyleSheet, Platform, SafeAreaView, Text } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ProducteurForm } from '../../../src/components/producteurs/ProducteurForm';
import { useProducteurStore } from '../../../src/core/store/useProducteurStore';
import { Producteur } from '../../../src/core/types/producteur';
import { typography, spacing } from '../../../src/theme';
import { ErrorState } from '../../../src/components/ui';
import { useTheme } from "../../../src/hooks/useTheme";
import { ChevronLeft } from 'lucide-react-native';
import { Pressable } from 'react-native';

export default function EditProducteurScreen() {

  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { producteurs, updateProducteur } = useProducteurStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const producteur = producteurs.find(p => p.id === id);

  if (!producteur) {
    return (
      <View style={styles.center}>
        <ErrorState 
          title="Producteur introuvable" 
          message="Ce producteur n'existe pas ou a été supprimé."
          onRetry={() => router.back()}
        />
      </View>
    );
  }

  const handleSubmit = (data: Producteur) => {
    setIsSubmitting(true);
    // Simulation d'un délai pour montrer l'UX
    setTimeout(() => {
      updateProducteur(data.id, data);
      setIsSubmitting(false);
      router.back();
    }, 500);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Le bouton retour est désormais géré dans le header de ProducteurForm */}
      <View style={styles.container}>
        <ProducteurForm 
          initialData={producteur} 
          onSubmit={handleSubmit} 
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  }
});
