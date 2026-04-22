import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CartProvider } from '../contexts/CartContext';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CartProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding/welcome" />
          <Stack.Screen name="onboarding/login" />
          <Stack.Screen name="onboarding/register" />
        </Stack>
      </CartProvider>
    </SafeAreaProvider>
  );
}
