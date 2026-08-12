import { Tabs } from 'expo-router';
import { Platform, useWindowDimensions } from 'react-native';
import { useTheme } from "../../src/hooks/useTheme";
import { LayoutDashboard, Users, FileText, Eye, BarChart3 } from 'lucide-react-native';

export default function TabLayout() {

  const { colors, isDark } = useTheme();

  const { width } = useWindowDimensions();
  const isWebLarge = Platform.OS === 'web' && width > 768;

  return (
    <Tabs 
      screenOptions={{ 
        tabBarActiveTintColor: colors.primaryLight,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: [
          { backgroundColor: colors.surface, borderTopColor: colors.border },
          isWebLarge && { display: 'none' } // Hide bottom tabs on large web since sidebar is used
        ],
        headerStyle: { backgroundColor: colors.surface, borderBottomColor: colors.border },
        headerTintColor: colors.text,
        sceneStyle: { backgroundColor: colors.background }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ 
          title: 'Tableau', 
          headerShown: false,
          tabBarIcon: ({ color }) => <LayoutDashboard size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="producteurs"
        options={{ 
          title: 'Producteurs', 
          headerShown: false,
          tabBarIcon: ({ color }) => <Users size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="suivi"
        options={{ 
          title: 'Suivi', 
          headerShown: false,
          tabBarIcon: ({ color }) => <Eye size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="rapports"
        options={{ 
          title: 'Rapports', 
          headerShown: false,
          tabBarIcon: ({ color }) => <BarChart3 size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="pdc"
        options={{ 
          title: 'Fiche PDC', 
          headerShown: false,
          tabBarIcon: ({ color }) => <FileText size={24} color={color} />
        }}
      />
    </Tabs>
  );
}
