export const lightColors = {
  // Primary (Cacao / Green)
  primary: '#22c55e',
  primaryLight: '#16a34a',
  primaryDark: '#15803d',
  
  // Backgrounds — medium warm stone, not too light, not too dark
  background: '#d6d0c4',   // warm stone medium
  surface: '#cac4b7',      // slightly darker warm stone
  surfaceLight: '#bfb9ab', // input backgrounds, deeper
  
  // Text — dark cacao brown
  text: '#1a1208',         // deep cacao brown
  textSecondary: '#4a3a28', // medium warm brown
  textMuted: '#7a6e5a',    // muted warm brown
  
  // Status
  success: '#16a34a',
  error: '#dc2626',
  warning: '#d97706',
  info: '#2563eb',
  purple: '#7c3aed',
  
  // Borders — warm separated
  border: '#a89e8e',
  borderHover: 'rgba(34, 197, 94, 0.4)',
};

export const darkColors = {
  // Primary (Cacao / Green)
  primary: '#22c55e',
  primaryLight: '#4ade80',
  primaryDark: '#16a34a',
  
  // Backgrounds
  background: '#0a0a0a',
  surface: '#161616',
  surfaceLight: '#1f1f1f',
  
  // Text
  text: '#ffffff',
  textSecondary: '#a1a1aa',
  textMuted: '#6b7280',
  
  // Status
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  purple: '#A855F7',
  
  // Borders
  border: '#2a2a2a',
  borderHover: 'rgba(34, 197, 94, 0.35)',
};

// Legacy fallback
export const colors = darkColors;

export type ThemeColors = typeof darkColors;
