import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { useTheme } from "../../src/hooks/useTheme";

export default function TabLayout() {

  const { colors, isDark } = useTheme();

  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: [
          { backgroundColor: colors.surface, borderTopColor: colors.border },
          Platform.OS === 'web' && { display: 'none' } // Hide bottom tabs on web entirely, since sidebar is used
        ],
        headerStyle: { backgroundColor: colors.surface, borderBottomColor: colors.border },
        headerTintColor: colors.text,
        sceneStyle: { backgroundColor: colors.background }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Tableau de bord', headerShown: false }}
      />
      <Tabs.Screen
        name="producteurs"
        options={{ title: 'Producteurs', headerShown: false }}
      />
      <Tabs.Screen
        name="suivi"
        options={{ title: 'Suivi', headerShown: false }}
      />
      <Tabs.Screen
        name="rapports"
        options={{ title: 'Rapports', headerShown: false }}
      />
      <Tabs.Screen
        name="pdc"
        options={{ title: 'Fiche PDC', headerShown: false }}
      />
    </Tabs>
  );
}
