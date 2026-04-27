import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LightTheme, DarkTheme } from '../constants/Colors';

const PREFERENCES_KEY = '@ecofast/preferences';

export interface PreferencesConfig {
  notificationsDelivery: boolean;
  notificationsPromo: boolean;
  themeMode: 'light' | 'dark' | 'system';
  ecoTips: boolean;
  noCutlery: boolean;
}

interface PreferencesContextData {
  preferences: PreferencesConfig;
  updatePreferences: (newPrefs: Partial<PreferencesConfig>) => Promise<void>;
  loading: boolean;
  colors: typeof LightTheme;
  isDark: boolean;
}

const defaultPreferences: PreferencesConfig = {
  notificationsDelivery: true,
  notificationsPromo: false,
  themeMode: 'system',
  ecoTips: true,
  noCutlery: true,
};

const PreferencesContext = createContext<PreferencesContextData | undefined>(undefined);

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<PreferencesConfig>(defaultPreferences);
  const [loading, setLoading] = useState(true);
  const systemTheme = useColorScheme();

  const isDark = preferences.themeMode === 'system' 
    ? systemTheme === 'dark' 
    : preferences.themeMode === 'dark';
    
  const colors = isDark ? DarkTheme : LightTheme;

  useEffect(() => {
    const loadPrefs = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
        if (stored) {
          setPreferences({ ...defaultPreferences, ...JSON.parse(stored) });
        }
      } catch (e) {
        console.error('Failed to load preferences', e);
      } finally {
        setLoading(false);
      }
    };
    loadPrefs();
  }, []);

  const updatePreferences = async (newPrefs: Partial<PreferencesConfig>) => {
    try {
      const updated = { ...preferences, ...newPrefs };
      setPreferences(updated);
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save preferences', e);
    }
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences, loading, colors, isDark }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences must be used within a PreferencesProvider');
  return context;
};
