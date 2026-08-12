import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';

type ThemeState = {
  theme: 'light' | 'dark';
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
};

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark', // default to dark
      isDark: true,
      colors: darkColors,
      toggleTheme: () => set((state) => {
        const newTheme = state.theme === 'light' ? 'dark' : 'light';
        return {
          theme: newTheme,
          isDark: newTheme === 'dark',
          colors: newTheme === 'dark' ? darkColors : lightColors,
        };
      }),
      setTheme: (theme) => set({
        theme,
        isDark: theme === 'dark',
        colors: theme === 'dark' ? darkColors : lightColors,
      }),
    }),
    {
      name: 'cacao-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
