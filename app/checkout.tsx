import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CheckCircle2, Leaf, MapPin } from 'lucide-react-native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useAddress } from '../contexts/AddressContext';
import { createOrder } from '../services/api';
import { Colors, Spacing, Radius, Shadows } from '../constants/Colors';
import { Button } from '../components/ui/Button';

export default function Checkout() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const { selectedAddress } = useAddress();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      await createOrder({
        userId: user?.id || 1,
        items: items,
        total: total
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
            <CheckCircle2 size={80} color={Colors.primary} />
          </View>
          <Text style={styles.successTitle}>Pedido Realizado!</Text>
          <Text style={styles.successSubtitle}>
            Seu pedido sustentável está sendo preparado e chegará em breve.
          </Text>
          <View style={styles.ecoBadge}>
            <Leaf size={16} color={Colors.primaryDark} />
            <Text style={styles.ecoBadgeText}>Você salvou 200g de CO2 hoje!</Text>
          </View>
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
          <ChevronLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.addressSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
            <TouchableOpacity onPress={() => router.push('/addresses')}>
              <Text style={styles.changeText}>Alterar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.addressCard}>
            <View style={styles.addressIconBox}>
              <MapPin size={20} color={Colors.primary} />
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

        <View style={styles.paymentMethod}>
          <Text style={styles.sectionTitle}>Método de Pagamento</Text>
          <View style={styles.methodItem}>
            <View style={styles.methodIcon} />
            <Text style={styles.methodText}>Pagamento na Entrega (Dinheiro/Cartão)</Text>
          </View>
        </View>

        <View style={styles.spacer} />

        <Button 
          fullWidth 
          size="lg" 
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? <ActivityIndicator color={Colors.white} /> : 'Confirmar Pedido'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    height: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  card: {
    backgroundColor: Colors.white,
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
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    ...Shadows.medium,
  },
  addressIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '15',
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
    color: Colors.textPrimary,
  },
  addressText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  addressSubtext: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  paymentMethod: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  methodIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: Colors.primary,
    marginRight: Spacing.md,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  spacer: {
    flex: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.huge,
    backgroundColor: Colors.white,
  },
  successIconWrapper: {
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    marginBottom: Spacing.huge,
  },
  ecoBadgeText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  homeBtn: {
    marginTop: Spacing.xl,
  }
});
