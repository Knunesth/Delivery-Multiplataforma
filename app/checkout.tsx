import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle2, Leaf, MapPin, CreditCard, Smartphone, Banknote } from 'lucide-react-native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAddress } from '../contexts/AddressContext';
import { usePayment } from '../contexts/PaymentContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { useNotifications } from '../contexts/NotificationContext';
import { createOrder } from '../services/api';
import { Spacing, Radius, Shadows } from '../constants/Colors';
import { Button } from '../components/ui/Button';

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const { selectedAddress } = useAddress();
  const { selectedPayment } = usePayment();
  const { preferences, colors } = usePreferences();
  const { addNotification } = useNotifications();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderAddress, setOrderAddress] = useState<any>(null);
  const [wantCutlery, setWantCutlery] = useState(!preferences.noCutlery);

  const getPaymentIcon = (type: string | undefined) => {
    if (type === 'PIX') return <Smartphone size={20} color={colors.primary} />;
    if (type === 'VA' || type === 'VR') return <Banknote size={20} color={colors.primary} />;
    return <CreditCard size={20} color={colors.primary} />;
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      await createOrder({
        userId: user?.id || 1,
        items: items,
        total: total,
        addressId: selectedAddress?.id,
        paymentMethodId: selectedPayment?.id,
      });
      
      setOrderAddress(selectedAddress);
      
      // Envia a notificação Push Dinâmica Interna
      addNotification({
        title: 'Pedido Realizado! 🚀',
        message: 'Seu pedido foi confirmado e nossa cozinha sustentável já começou a preparar. Acompanhe a entrega ecologicamente!',
        type: 'order',
        time: 'Agora mesmo'
      });

      setIsSuccess(true);
      clearCart();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível finalizar seu pedido. Verifique sua conexão com o backend.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconWrapper}>
            <CheckCircle2 size={80} color={colors.primary} />
          </View>
          <Text style={styles.successTitle}>Pedido Realizado!</Text>
          <Text style={styles.successSubtitle}>
            Seu pedido sustentável está sendo preparado e chegará em breve.
          </Text>
          
          {orderAddress && (
            <View style={styles.successAddressCard}>
              <View style={styles.successAddressHeader}>
                <MapPin size={18} color={colors.primary} />
                <Text style={styles.successAddressLabel}>Entregue em:</Text>
              </View>
              <View style={styles.successAddressContent}>
                <Text style={styles.successAddressTitle}>{orderAddress.label}</Text>
                <Text style={styles.successAddressText}>
                  {orderAddress.street}, {orderAddress.number}
                </Text>
                {orderAddress.complement && (
                  <Text style={styles.successAddressText}>
                    {orderAddress.complement}
                  </Text>
                )}
                <Text style={styles.successAddressText}>
                  {orderAddress.neighborhood}, {orderAddress.city}
                </Text>
              </View>
            </View>
          )}
          
          {preferences.ecoTips && (
            <View style={styles.ecoBadge}>
              <Leaf size={16} color={colors.primaryDark} />
              <Text style={styles.ecoBadgeText}>Você salvou 200g de CO2 hoje!</Text>
            </View>
          )}

          <Button fullWidth style={styles.homeBtn} onPress={() => router.replace('/home')}>
            Voltar para o Início
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.addressSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
            <TouchableOpacity onPress={() => router.push('/addresses')}>
              <Text style={styles.changeText}>Alterar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <View style={styles.addressIconBox}>
              <MapPin size={20} color={colors.primary} />
            </View>
            <View style={styles.addressInfo}>
              {selectedAddress ? (
                <>
                  <Text style={styles.addressLabel}>{selectedAddress.label}</Text>
                  <Text style={styles.addressText}>
                    {selectedAddress.street}, {selectedAddress.number}
                  </Text>
                  <Text style={styles.addressSubtext}>
                    {selectedAddress.neighborhood}, {selectedAddress.city}
                  </Text>
                </>
              ) : (
                <Text style={styles.addressLabel}>Nenhum endereço selecionado</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Resumo do Pagamento</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Itens ({items.length})</Text>
            <Text style={styles.value}>R$ {subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Entrega</Text>
            <Text style={styles.value}>R$ {deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.row, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.addressSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Método de Pagamento</Text>
            <TouchableOpacity onPress={() => router.push('/payments')}>
              <Text style={styles.changeText}>Alterar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <View style={styles.addressIconBox}>
              {getPaymentIcon(selectedPayment?.type)}
            </View>
            <View style={styles.addressInfo}>
              {selectedPayment ? (
                <>
                  <Text style={styles.addressLabel}>{selectedPayment.label}</Text>
                  <Text style={styles.addressText}>
                    {selectedPayment.type === 'PIX' ? 'Pagamento Instantâneo' : `${selectedPayment.type} •••• ${selectedPayment.last_digits}`}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.addressLabel}>Pagamento na Entrega</Text>
                  <Text style={styles.addressText}>Dinheiro ou Cartão</Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cutlerySection}>
           <Text style={styles.cutleryLabel}>Enviar Talheres Descartáveis?</Text>
           <TouchableOpacity 
              style={[styles.cutleryBtn, wantCutlery && styles.cutleryBtnActive]} 
              onPress={() => setWantCutlery(!wantCutlery)}
           >
              <Text style={[styles.cutleryBtnText, wantCutlery && styles.cutleryBtnTextActive]}>
                {wantCutlery ? 'Sim, enviar' : 'Não, ajude o planeta!'}
              </Text>
           </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          fullWidth 
          size="lg" 
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? <ActivityIndicator color={colors.white} /> : 'Confirmar Pedido'}
        </Button>
      </View>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl * 2,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    ...Shadows.medium,
    marginBottom: Spacing.xl,
  },
  addressSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  changeText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    ...Shadows.medium,
  },
  addressIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  addressText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addressSubtext: {
    fontSize: 12,
    color: colors.textTertiary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  totalRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.primary,
  },
  paymentMethod: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: Spacing.md,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  methodIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: colors.primary,
    marginRight: Spacing.md,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cutlerySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    ...Shadows.medium,
  },
  cutleryLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cutleryBtn: {
    borderWidth: 2,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  cutleryBtnActive: {
    borderColor: colors.error,
    backgroundColor: colors.error + '10',
  },
  cutleryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cutleryBtnTextActive: {
    color: colors.error,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    backgroundColor: colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    ...Shadows.medium,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.huge,
    backgroundColor: colors.background,
  },
  successIconWrapper: {
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    marginBottom: Spacing.huge,
  },
  ecoBadgeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  successAddressCard: {
    backgroundColor: colors.surfaceHover,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: Radius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    width: '100%',
  },
  successAddressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  successAddressLabel: {
    marginLeft: Spacing.md,
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  successAddressContent: {
    paddingLeft: Spacing.lg,
  },
  successAddressTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  successAddressText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
    lineHeight: 18,
  },
  homeBtn: {
    marginTop: Spacing.xl,
  }
});
