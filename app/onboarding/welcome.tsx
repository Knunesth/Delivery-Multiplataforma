import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/ui/Button';
import { Leaf, Clock, MapPin } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '../../constants/Colors';

export default function Welcome() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  
  const isSmallDevice = height < 700;
  const isLargeDevice = width > 500;

  const heroHeight = isSmallDevice ? height * 0.3 : height * 0.25;
  const titleFontSize = width * 0.09 > 40 ? 40 : width * 0.09;

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={[styles.heroSection, { height: heroHeight }]}>
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.heroGradient}
        >
          <View style={styles.heroPattern}>
             <Leaf size={width * 0.8} color={Colors.white} opacity={0.05} style={styles.bgIcon} />
          </View>
          
          <View style={styles.glassCard}>
            <View style={styles.glassIcon}>
               <Leaf size={24} color={Colors.white} />
            </View>
            <Text style={styles.glassText}>EcoFast Delivery</Text>
          </View>
        </LinearGradient>
      </View>
      
      {/* Content Section */}
      <View style={[styles.content, { marginTop: -Radius.xl }]}>
        <View style={styles.indicator} />
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <SafeAreaView edges={['bottom']} style={styles.innerContent}>
            <View style={styles.ecoBadge}>
              <Leaf size={14} color={Colors.primary} fill={Colors.primary + '20'} />
              <Text style={styles.ecoBadgeText}>100% SUSTENTÁVEL</Text>
            </View>
            
            <Text style={[styles.title, { fontSize: titleFontSize, lineHeight: titleFontSize * 1.1 }]}>
              Comida rápida,{"\n"}impacto <Text style={styles.highlight}>verde</Text>.
            </Text>
            
            <Text style={styles.subtitle}>
              Peça fast food com embalagens biodegradáveis e entrega zero emissão. O futuro do delivery chegou.
            </Text>
            
            <View style={styles.features}>
              <View style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <Clock size={16} color={Colors.primary} />
                </View>
                <Text style={styles.featureText}>30 min</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureIconBox}>
                  <MapPin size={16} color={Colors.primary} />
                </View>
                <Text style={styles.featureText}>Zero CO2</Text>
              </View>
            </View>

            <View style={[styles.actions, isLargeDevice && styles.actionsLarge]}>
              <Button fullWidth size="lg" onPress={() => router.push('/onboarding/register')}>
                Criar minha conta
              </Button>
              <View style={{ height: Spacing.md }} />
              <Button fullWidth variant="outline" onPress={() => router.push('/onboarding/login')}>
                Já tenho uma conta
              </Button>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  heroSection: {
    width: '100%',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPattern: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgIcon: {
    position: 'absolute',
    transform: [{ rotate: '45deg' }],
  },
  glassCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Shadows.medium,
  },
  glassIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  glassText: {
    color: Colors.white,
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    ...Shadows.heavy,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  innerContent: {
    flex: 1,
    paddingVertical: Spacing.xl,
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
  },
  ecoBadgeText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 11,
    marginLeft: 6,
    letterSpacing: 1,
  },
  title: {
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: -1,
  },
  highlight: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },
  features: {
    flexDirection: 'row',
    marginBottom: Spacing.huge,
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  featureText: {
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  actions: {
    marginTop: 'auto',
    paddingBottom: Platform.OS === 'ios' ? 0 : Spacing.xl,
  },
  actionsLarge: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
});
