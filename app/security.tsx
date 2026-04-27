import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShieldCheck, Lock, EyeOff } from 'lucide-react-native';
import { usePreferences } from '../contexts/PreferencesContext';
import { Spacing, Radius, Shadows } from '../constants/Colors';

export default function Security() {
  const router = useRouter();
  const { colors } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidade e Segurança</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.heroSection}>
          <View style={styles.iconGlow}>
            <ShieldCheck size={40} color={colors.primary} />
          </View>
          <Text style={styles.title}>Seus dados estão seguros</Text>
          <Text style={styles.subtitle}>
            Levamos sua privacidade a sério. Saiba como gerenciamos as informações e garantimos a segurança da sua conta.
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionIconBox}>
            <Lock size={20} color={colors.primary} />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Criptografia de Ponta</Text>
            <Text style={styles.sectionText}>
              Todos os seus dados pessoais, endereços e informações de pagamento são criptografados durante o trânsito e no armazenamento usando os mais altos padrões de segurança da indústria (AES-256).
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionIconBox}>
            <EyeOff size={20} color={colors.primary} />
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionTitle}>Compartilhamento</Text>
            <Text style={styles.sectionText}>
              Não vendemos seus dados. O compartilhamento ocorre apenas quando é estritamente necessário para entregar o seu pedido (por ex., sua localização) e processar pagamentos de forma anônima.
            </Text>
          </View>
        </View>

        <View style={styles.alertBox}>
          <Text style={styles.alertText}>
            Deseja excluir sua conta e apagar todos os seus dados? Entre em contato pelo e-mail dpo@ecodelivery.com.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    height: 60,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    backgroundColor: colors.primary + '0A',
    padding: Spacing.xl,
    borderRadius: Radius.xl,
  },
  iconGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary + '1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  section: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  sectionIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.lg,
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  alertBox: {
    backgroundColor: colors.surfaceHover,
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  alertText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: '600',
    textAlign: 'center'
  }
});
