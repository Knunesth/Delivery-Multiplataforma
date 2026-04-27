import { Stack } from 'expo-router';
import { ThemeProvider, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import { AddressProvider } from '../contexts/AddressContext';
import { PaymentProvider } from '../contexts/PaymentContext';
import { PreferencesProvider, usePreferences } from '../contexts/PreferencesContext';
import { NotificationProvider } from '../contexts/NotificationContext';
import { StatusBar } from 'expo-status-bar';
import { Platform, View, StyleSheet, useWindowDimensions, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function AppContent() {
  const { preferences, colors, isDark } = usePreferences();

  const customTheme = {
    ...(isDark ? NavDarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? NavDarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.surface,
      text: colors.textPrimary,
      border: colors.border,
      primary: colors.primary,
    }
  };

  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width > 768;

  const appStack = (
    <ThemeProvider value={customTheme}>
      <StatusBar style={preferences.themeMode === 'system' ? 'auto' : preferences.themeMode} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/welcome" />
        <Stack.Screen name="onboarding/login" />
        <Stack.Screen name="onboarding/register" />
        <Stack.Screen name="notifications" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );

  if (isDesktop) {
    return (
      <View style={desktopStyles.root}>
        {/* Fundo premium da versão de PC */}
        <View style={StyleSheet.absoluteFillObject}>
          {isDark ? (
             <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={StyleSheet.absoluteFillObject} />
          ) : (
             <LinearGradient colors={['#a8e063', '#56ab2f']} style={StyleSheet.absoluteFillObject} />
          )}
        </View>
        
        {/* Quadro do celular */}
        <View style={desktopStyles.phoneFrame}>
           {appStack}
        </View>

        {/* Texto descritivo lateral para a versão Desktop */}
        <View style={desktopStyles.heroTextContainer}>
           <Text style={[desktopStyles.heroTitle, { color: '#ffffff' }]}>EcoDelivery</Text>
           <Text style={[desktopStyles.heroSubtitle, { color: '#ffffff90' }]}>O futuro do delivery sustentável.</Text>
           <Text style={[desktopStyles.heroDescription, { color: '#ffffff80' }]}>Use o aplicativo no navegador ou instale em seu celular para a melhor experiência.</Text>
        </View>
      </View>
    );
  }

  return appStack;
}

const desktopStyles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 428,
    height: '92%',
    maxHeight: 926,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#fff',
    ...Platform.select({
      web: {
        boxShadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.5)',
      } as any,
    }),
    borderWidth: 8,
    borderColor: '#1f1f1f',
    marginRight: '10%',
    zIndex: 2,
  },
  heroTextContainer: {
    flex: 1,
    paddingHorizontal: 60,
    maxWidth: 600,
    justifyContent: 'center',
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 72,
    fontWeight: '900',
    marginBottom: 10,
    letterSpacing: -2,
  },
  heroSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 24,
  }
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AddressProvider>
          <PaymentProvider>
            <CartProvider>
              <NotificationProvider>
                <PreferencesProvider>
                  <AppContent />
                </PreferencesProvider>
              </NotificationProvider>
            </CartProvider>
          </PaymentProvider>
        </AddressProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
