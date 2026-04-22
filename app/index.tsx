import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Leaf } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Colors, Spacing, Radius } from '../constants/Colors';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding/welcome');
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#E8F5E9']}
      style={styles.container}
    >
      <View style={styles.logoWrapper}>
        <View style={styles.iconCircle}>
          <LinearGradient
            colors={Colors.primaryGradient}
            style={styles.iconGradient}
          >
            <Leaf size={40} color={Colors.white} />
          </LinearGradient>
        </View>
        <Text style={styles.brandName}>EcoFast</Text>
        <Text style={styles.tagline}>Delivery Sustentável</Text>
      </View>
      
      <View style={styles.bottomContainer}>
        <ActivityIndicator size="small" color={Colors.primary} style={styles.loader} />
        <Text style={styles.footerText}>Fazendo a diferença a cada pedido</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    elevation: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.primaryDark,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: -4,
    opacity: 0.8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  loader: {
    marginBottom: Spacing.md,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
