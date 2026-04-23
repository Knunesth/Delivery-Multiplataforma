import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Leaf, Settings, MapPin, CreditCard, ChevronRight, LogOut, Shield, HelpCircle } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/onboarding/login');
  };

  const menuGroups = [
    {
      title: 'Minha Conta',
      items: [
        { id: 'orders', label: 'Meus Pedidos Sustentáveis', icon: <Leaf size={18} color={Colors.textSecondary} />},
        { id: 'addresses', label: 'Meus Endereços', icon: <MapPin size={18} color={Colors.textSecondary} /> },
        { id: 'payments', label: 'Formas de Pagamento', icon: <CreditCard size={18} color={Colors.textSecondary} /> },
      ]
    },
    {
      title: 'Configurações',
      items: [
        { id: 'settings', label: 'Preferências do App', icon: <Settings size={18} color={Colors.textSecondary} /> },
        { id: 'security', label: 'Privacidade e Segurança', icon: <Shield size={18} color={Colors.textSecondary} /> },
        { id: 'help', label: 'Ajuda e Suporte', icon: <HelpCircle size={18} color={Colors.textSecondary} /> },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Header */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary]}
          style={styles.profileHeader}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Meu Perfil</Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'U'}</Text>
              </View>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'Usuário'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'email@exemplo.com'}</Text>
              <View style={styles.memberBadge}>
                <Leaf size={10} color={Colors.white} fill={Colors.white} />
                <Text style={styles.memberText}>Membro Eco Platinum</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Eco Impact Summary */}
          <LinearGradient
            colors={[Colors.white, '#F8F9FA']}
            style={styles.impactCard}
          >
            <View style={styles.impactInfo}>
              <Text style={styles.impactLabel}>Seu Impacto Verde</Text>
              <Text style={styles.impactValue}>12.5 kg <Text style={styles.impactUnit}>CO2</Text></Text>
            </View>
            <View style={styles.impactVisual}>
              <View style={styles.leafCircle}>
                <Leaf size={24} color={Colors.primary} />
              </View>
            </View>
          </LinearGradient>

          {/* Dynamic Menu Groups */}
          {menuGroups.map((group, groupIdx) => (
            <View key={groupIdx} style={styles.menuGroup}>
              <Text style={styles.groupTitle}>{group.title}</Text>
              <View style={styles.menuList}>
                {group.items.map((item, idx) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.menuItem}
                    onPress={() => {
                      if (item.id === 'orders') router.push('/orders');
                      if (item.id === 'addresses') router.push('/addresses');
                    }}
                  >
                    <View style={styles.menuIconContainer}>
                      {item.icon}
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <View style={styles.menuRight}>
                      {item.badge && (
                        <View style={styles.menuBadge}>
                          <Text style={styles.menuBadgeText}>{item.badge}</Text>
                        </View>
                      )}
                      <ChevronRight size={18} color={Colors.textTertiary} />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          {/* Logout Section */}
          <TouchableOpacity 
            style={styles.logoutBtn} 
            onPress={handleLogout}
          >
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>Versão 1.0.0 Sustainable Edition</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  profileHeader: {
    padding: Spacing.xl,
    paddingTop: Spacing.lg,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    paddingBottom: Spacing.huge,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  settingsIcon: {
    padding: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: '900',
  },
  userDetails: {
    marginLeft: Spacing.xl,
  },
  userName: {
    color: Colors.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
  userEmail: {
    color: Colors.white,
    opacity: 0.8,
    fontSize: 14,
    marginTop: 2,
    fontWeight: '500',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.sm,
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  memberText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 6,
    textTransform: 'uppercase',
  },
  content: {
    padding: Spacing.lg,
    marginTop: -Spacing.huge,
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    backgroundColor: Colors.white,
    ...Shadows.medium,
    marginBottom: Spacing.xl,
  },
  impactInfo: {
    flex: 1,
  },
  impactLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  impactValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primaryDark,
    marginTop: 4,
  },
  impactUnit: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
  impactVisual: {
    width: 50,
    height: 50,
  },
  leafCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuGroup: {
    marginBottom: Spacing.xl,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textTertiary,
    marginLeft: Spacing.md,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuList: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.medium,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconContainer: {
    width: 20,
    alignItems: 'center',
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
    marginRight: 10,
  },
  menuBadgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    marginTop: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.error + '25',
    ...Shadows.light,
  },
  logoutText: {
    marginLeft: Spacing.sm,
    color: Colors.error,
    fontWeight: '900',
    fontSize: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.huge,
    fontWeight: '600',
  },
});
