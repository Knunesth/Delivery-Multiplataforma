import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Bell, Leaf, Tag, PackageCheck } from 'lucide-react-native';
import { usePreferences } from '../contexts/PreferencesContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Spacing, Radius, Shadows } from '../constants/Colors';

export default function Notifications() {
  const router = useRouter();
  const { colors } = usePreferences();
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  React.useEffect(() => {
    // Optionally mark all as read automatically after a small delay
    const timer = setTimeout(() => {
      markAllAsRead();
    }, 1500);
    return () => clearTimeout(timer);
  }, [markAllAsRead]);

  const getIconForType = (type: string) => {
    switch(type) {
      case 'order': return <PackageCheck size={20} color={colors.primary} />;
      case 'eco': return <Leaf size={20} color={colors.secondary} />;
      case 'promo': return <Tag size={20} color={colors.error} />;
      default: return <Bell size={20} color={colors.primary} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <X size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {notifications.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 16 }}>Nenhuma notificação no momento.</Text>
          </View>
        )}
        {notifications.map((notif) => (
          <TouchableOpacity 
            key={notif.id} 
            style={[styles.notificationCard, !notif.read && styles.unreadCard]}
            activeOpacity={0.7}
            onPress={() => markAsRead(notif.id)}
          >
            <View style={styles.iconBox}>
              {getIconForType(notif.type)}
            </View>
            <View style={styles.contentBox}>
              <View style={styles.cardHeader}>
                <Text style={styles.title} numberOfLines={1}>{notif.title}</Text>
                <Text style={styles.time}>{notif.time}</Text>
              </View>
              <Text style={styles.message}>{notif.message}</Text>
            </View>
            {!notif.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
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
    borderBottomColor: colors.border + '50',
    ...Shadows.light,
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
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: colors.border + '30',
    alignItems: 'flex-start',
  },
  unreadCard: {
    backgroundColor: colors.primary + '0A',
    borderColor: colors.primary + '30',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    ...Shadows.light,
  },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
  }
});
