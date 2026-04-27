import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf, Settings, MapPin, CreditCard, ChevronRight, LogOut, Shield, HelpCircle, MessageCircle, Mail } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { usePreferences } from '../../contexts/PreferencesContext';

const { width } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { preferences, colors, isDark } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const handleLogout = async () => {
    await logout();
    router.replace('/onboarding/login');
  };

  const menuGroups = [
    {
      title: 'Minha Conta',
      items: [
        { id: 'orders', label: 'Meus Pedidos Sustentáveis', icon: <Leaf size={18} color={colors.textSecondary} />},
        { id: 'addresses', label: 'Meus Endereços', icon: <MapPin size={18} color={colors.textSecondary} /> },
        { id: 'payments', label: 'Formas de Pagamento', icon: <CreditCard size={18} color={colors.textSecondary} /> },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { id: 'settings', label: 'Preferências do App', icon: <Settings size={18} color={colors.textSecondary} /> },
        { id: 'security', label: 'Privacidade e Segurança', icon: <Shield size={18} color={colors.textSecondary} /> },
        { id: 'help', label: 'Ajuda e Suporte', icon: <HelpCircle size={18} color={colors.textSecondary} /> },
      ]
    },
    {
      title: 'Contatos (Suporte)',
      items: [
        { id: 'whatsapp', label: 'WhatsApp: (11) 99999-9999', icon: <MessageCircle size={18} color={colors.textSecondary} /> },
        { id: 'email', label: 'E-mail: suporte@ecodelivery.com', icon: <Mail size={18} color={colors.textSecondary} /> },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Header */}
        <LinearGradient
          colors={colors.primaryGradient}
          style={styles.profileHeader}
        >
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
            </View>
            <View>
              <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'usuario@email.com'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Eco Impact Summary - Conditionally Displayed based on User Preferences */}
          {preferences.ecoTips && (
            <View style={[styles.impactCard, isDark && styles.impactCardDark]}>
              <View style={styles.impactInfo}>
                <Text style={styles.impactLabel}>Seu Impacto Verde</Text>
                <Text style={styles.impactValue}>12.5 kg <Text style={styles.impactUnit}>CO2</Text></Text>
              </View>
              <View style={styles.impactVisual}>
                <View style={[styles.leafCircle, isDark && styles.leafCircleDark]}>
                  <Leaf size={24} color={colors.primary} />
                </View>
              </View>
            </View>
          )}

          {/* Dynamic Menu Groups */}
          {menuGroups.map((group, groupIdx) => (
            <View key={groupIdx} style={styles.menuGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.groupContent}>
                {group.items.map((item, idx) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={[
                      styles.menuItem,
                      idx !== group.items.length - 1 && styles.menuItemBorder
                    ]}
                    onPress={() => {
                      if (item.id === 'orders') router.push('/orders');
                      if (item.id === 'addresses') router.push('/addresses');
                      if (item.id === 'payments') router.push('/payments');
                      if (item.id === 'settings') router.push('/settings');
                      if (item.id === 'security') router.push('/security');
                      if (item.id === 'help') router.push('/help');
                      if (item.id === 'whatsapp') {
                        // Import Linking at the top or use dynamic import if needed
                        import('react-native').then(({ Linking, Alert }) => {
                          const url = 'whatsapp://send?phone=5511999999999';
                          Linking.canOpenURL(url).then(supported => {
                            if (supported) Linking.openURL(url);
                            else Alert.alert('Erro', 'WhatsApp não está instalado.');
                          });
                        });
                      }
                      if (item.id === 'email') {
                         import('react-native').then(({ Linking }) => {
                            Linking.openURL('mailto:suporte@ecodelivery.com');
                         });
                      }
                    }}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuIconContainer}>
                        {item.icon}
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <ChevronRight size={20} color={colors.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <LogOut size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
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
  profileHeader: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
    ...Shadows.medium,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    padding: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  impactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    backgroundColor: colors.surfaceHover,
    ...Shadows.medium,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  impactCardDark: {
    backgroundColor: colors.surfaceHover,
  },
  impactInfo: {
    flex: 1,
  },
  impactLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
    marginBottom: 4,
  },
  impactValue: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.primary,
  },
  impactUnit: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  impactVisual: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafCircleDark: {
    backgroundColor: colors.primary + '25',
  },
  menuGroup: {
    marginBottom: Spacing.lg,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: Spacing.md,
    marginLeft: Spacing.md,
    marginTop: Spacing.sm,
  },
  groupContent: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    paddingVertical: Spacing.xs,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border + '80',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginRight: 10,
  },
  menuBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: colors.surfaceHover,
    borderRadius: Radius.xl,
    marginTop: Spacing.xl,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  logoutText: {
    marginLeft: Spacing.sm,
    color: colors.error,
    fontWeight: '900',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.textTertiary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.huge,
    fontWeight: '600',
  },
});
