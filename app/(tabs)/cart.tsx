import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Minus, Plus, Trash2, Leaf, ShoppingBag, ChevronRight } from 'lucide-react-native';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../../components/ui/Button';
import { Spacing, Radius, Shadows } from '../../constants/Colors';
import { usePreferences } from '../../contexts/PreferencesContext';

const { height } = Dimensions.get('window');

export default function Cart() {
  const router = useRouter();
  const { items, updateQuantity, isLoading } = useCart();
  const { colors } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Carregando carrinho...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Carrinho</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconContainer}>
             <View style={styles.emptyIconGradient}>
               <ShoppingBag size={64} color={colors.textTertiary} />
             </View>
          </View>
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptySubtitle}>Seus itens sustentáveis aparecerão aqui quando você os adicionar.</Text>
          <Button fullWidth onPress={() => router.push('/home')}>Explorar Cardápio</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Resumo do Pedido</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.ecoBanner}>
          <Leaf size={24} color={colors.primary} fill={colors.primary + '20'} />
          <View style={styles.ecoBannerTextContainer}>
            <Text style={styles.ecoBannerTitle}>Pedido Sustentável</Text>
            <Text style={styles.ecoBannerText}>
              Economia estimada de <Text style={styles.boldText}>200g</Text> de CO2.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Seus Itens ({items.length})</Text>

        <View style={styles.itemsList}>
          {items.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
              
              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>{formatCurrency(item.price * item.quantity)}</Text>
                </View>
                
                {item.isEco && (
                  <View style={styles.itemEcoTag}>
                    <Leaf size={10} color={colors.primary} />
                    <Text style={styles.itemEcoText}>Ecológico</Text>
                  </View>
                )}
                
                <View style={styles.itemActions}>
                   <Text style={styles.itemUnitPrice}>{formatCurrency(item.price)} un.</Text>
                  <View style={styles.quantityControl}>
                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => updateQuantity(item.id, -1)}
                    >
                      {item.quantity === 1 ? (
                        <Trash2 size={14} color={colors.error} />
                      ) : (
                        <Minus size={14} color={colors.textPrimary} />
                      )}
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity}</Text>
                    <TouchableOpacity 
                      style={styles.qtyBtn} 
                      onPress={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={14} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summary}>
          <Text style={styles.summarySectionTitle}>Totais</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.deliveryLabelRow}>
               <Text style={styles.summaryLabel}>Entrega Verde</Text>
               <View style={styles.bikeBadge}><Text style={styles.bikeText}>BIKE</Text></View>
            </View>
            <Text style={styles.summaryValue}>{formatCurrency(deliveryFee)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <Button fullWidth size="lg" onPress={() => router.push('/checkout')}>
          Finalizar Pedido
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    fontWeight: '600',
  },
  header: {
    height: 60,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  ecoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: Radius.xl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    backgroundColor: colors.primary + '0A',
  },
  ecoBannerTextContainer: {
    marginLeft: Spacing.md,
  },
  ecoBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  ecoBannerText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '900',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  itemsList: {
    marginBottom: Spacing.xl,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  itemImage: {
    width: 90,
    height: 90,
    borderRadius: Radius.lg,
    backgroundColor: colors.surfaceHover,
  },
  itemInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.primaryDark,
  },
  itemEcoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  itemEcoText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  itemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: Spacing.sm,
  },
  itemUnitPrice: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: '600',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    borderRadius: Radius.full,
    padding: 2,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.light,
  },
  qtyValue: {
    paddingHorizontal: Spacing.md,
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadows.medium,
    borderWidth: 1,
    borderColor: colors.border + '50',
  },
  summarySectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  deliveryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bikeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  bikeText: {
    color: colors.white,
    fontSize: 8,
    fontWeight: '900',
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: Spacing.md,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.huge,
  },
  emptyIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    ...Shadows.medium,
  },
  emptyIconGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
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
});
