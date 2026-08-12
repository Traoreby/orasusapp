import { useEffect } from 'react';
import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { View, Text, useWindowDimensions, Platform, StyleSheet } from 'react-native';
import { useProducteurStore } from '../src/core/store/useProducteurStore';
import { Sidebar } from '../src/components/navigation/Sidebar';
import { useTheme } from "../src/hooks/useTheme";

export default function RootLayout() {

  const { colors, isDark } = useTheme();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const initStore = useProducteurStore(s => s.initStore);
  const { width } = useWindowDimensions();
  const isWebLarge = Platform.OS === 'web' && width > 768;

  useEffect(() => {
    initStore();
  }, [initStore]);

  return (
    <View style={[styles.container, isWebLarge ? styles.row : styles.column]}>
      {isWebLarge && <Sidebar />}
      <View style={styles.mainContent}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="producteur/nouveau" options={{ title: 'Nouveau Producteur', headerShown: false }} />
          <Stack.Screen name="producteur/[id]" options={{ title: 'Détail Producteur', headerShown: false }} />
        </Stack>
      </View>
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  mainContent: {
    flex: 1,
  },
  mobileHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    paddingTop: Platform.OS === 'ios' ? 40 : 0, // safe area for ios if needed
  },
  mobileHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
