import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, Moon, Sun, Leaf, UtensilsCrossed, MonitorSmartphone } from 'lucide-react-native';
import { usePreferences } from '../contexts/PreferencesContext';
import { Spacing, Radius, Shadows } from '../constants/Colors';

export default function Settings() {
  const router = useRouter();
  const { preferences, updatePreferences, loading, colors } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const toggleDelivery = (val: boolean) => updatePreferences({ notificationsDelivery: val });
  const togglePromo = (val: boolean) => updatePreferences({ notificationsPromo: val });
  const toggleEcoTips = (val: boolean) => updatePreferences({ ecoTips: val });
  const toggleCutlery = (val: boolean) => updatePreferences({ noCutlery: val });
  const selectTheme = (mode: 'light' | 'dark' | 'system') => updatePreferences({ themeMode: mode });

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/profile')} 
          style={styles.backBtn}
        >
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Preferências do App</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        
        {/* Notificações */}
        <Text style={styles.sectionTitle}>Notificações</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.iconBox}>
                <Bell size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Atualizações do Pedido</Text>
                <Text style={styles.settingDescription}>Avisos sobre o preparo e entrega</Text>
              </View>
            </View>
            <Switch 
              value={preferences.notificationsDelivery}
              onValueChange={toggleDelivery}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={[styles.iconBox, { backgroundColor: colors.surfaceHover }]}>
                <Bell size={18} color={colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Ofertas e Promoções</Text>
                <Text style={styles.settingDescription}>Cupons e novidades no app</Text>
              </View>
            </View>
            <Switch 
              value={preferences.notificationsPromo}
              onValueChange={togglePromo}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Sustentabilidade */}
        <Text style={styles.sectionTitle}>Sustentabilidade Padrão</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.iconBox}>
                <UtensilsCrossed size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Recusar Talheres</Text>
                <Text style={styles.settingDescription}>Não solicitar descartáveis por padrão</Text>
              </View>
            </View>
            <Switch 
              value={preferences.noCutlery}
              onValueChange={toggleCutlery}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.iconBox}>
                <Leaf size={18} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Dicas Ecológicas</Text>
                <Text style={styles.settingDescription}>Receba stats sobre seu impacto verde</Text>
              </View>
            </View>
            <Switch 
              value={preferences.ecoTips}
              onValueChange={toggleEcoTips}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* Tema */}
        <Text style={styles.sectionTitle}>Aparência (Global Status Bar)</Text>
        <View style={styles.card}>
          <View style={styles.themeSelector}>
            <TouchableOpacity 
              style={[styles.themeOption, preferences.themeMode === 'light' && styles.themeOptionActive]}
              onPress={() => selectTheme('light')}
            >
              <Sun size={24} color={preferences.themeMode === 'light' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.themeText, preferences.themeMode === 'light' && styles.themeTextActive]}>Claro</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.themeOption, preferences.themeMode === 'dark' && styles.themeOptionActive]}
              onPress={() => selectTheme('dark')}
            >
              <Moon size={24} color={preferences.themeMode === 'dark' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.themeText, preferences.themeMode === 'dark' && styles.themeTextActive]}>Escuro</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.themeOption, preferences.themeMode === 'system' && styles.themeOptionActive]}
              onPress={() => selectTheme('system')}
            >
              <MonitorSmartphone size={24} color={preferences.themeMode === 'system' ? colors.primary : colors.textSecondary} />
              <Text style={[styles.themeText, preferences.themeMode === 'system' && styles.themeTextActive]}>Dispositivo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Spacing.huge * 2 }} />
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
  content: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
    marginLeft: Spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    ...Shadows.light,
    shadowColor: colors.shadow,
    marginBottom: Spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: Spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    maxWidth: '90%',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: Spacing.md,
  },
  themeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.surfaceHover,
    marginHorizontal: 4,
  },
  themeOptionActive: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },
  themeText: {
    marginTop: Spacing.sm,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  themeTextActive: {
    color: colors.primary,
  }
});
