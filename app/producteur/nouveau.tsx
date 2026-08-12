import React, { useState } from 'react';
import { View, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ProducteurForm } from '../../src/components/producteurs/ProducteurForm';
import { useProducteurStore } from '../../src/core/store/useProducteurStore';
import { Producteur } from '../../src/core/types/producteur';
import { useTheme } from "../../src/hooks/useTheme";
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';

export default function NouveauProducteurScreen() {

  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const router = useRouter();
  const { addProducteur } = useProducteurStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialData: Producteur = {
    id: Date.now().toString(), // Génération temporaire d'un ID
    nom: '',
    contact: '',
    codeNational: '',
    codeGroupe: '',
    nomEntite: '',
    codeEntite: '',
    delegation: '',
    departement: '',
    sousPrefecture: '',
    village: '',
    campement: '',
    menage: [],
    dateCreation: new Date().toISOString()
  };

  const handleSubmit = (data: Producteur) => {
    setIsSubmitting(true);
    // Simulation d'un délai pour montrer l'UX
    setTimeout(() => {
      addProducteur(data);
      setIsSubmitting(false);
      router.replace(`/producteur/${data.id}`);
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
          initialData={initialData} 
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
  }
});
