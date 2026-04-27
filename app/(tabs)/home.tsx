import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Search as SearchIcon, Leaf, ChevronRight } from 'lucide-react-native';
import { useCart } from '../../contexts/CartContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { ProductCard } from '../../components/ui/ProductCard';
import { Spacing, Radius, Shadows } from '../../constants/Colors';
import { getProducts } from '../../services/api';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'Burgers', icon: '🍔' },
  { id: '2', name: 'Vegano', icon: '🥗' },
  { id: '3', name: 'Bebidas', icon: '🥤' },
  { id: '4', name: 'Sobremesas', icon: '🍦' },
  { id: '5', name: 'Saladas', icon: '🥗' },
];

export default function Home() {
  const router = useRouter();
  const { addToCart } = useCart();
  const { colors } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [activeCategory, setActiveCategory] = useState('1');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { unreadCount } = useNotifications();

  React.useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      isEco: product.isEco
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity 
            style={styles.searchBar} 
            onPress={() => router.push('/search')}
            activeOpacity={0.9}
          >
            <SearchIcon size={20} color={colors.textTertiary} />
            <Text style={styles.searchPlaceholder}>O que você quer pedir hoje?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.notificationBtn}
            onPress={() => router.push('/notifications')}
            activeOpacity={0.8}
          >
            <Bell size={24} color={colors.textPrimary} />
            {unreadCount > 0 && <View style={styles.badge} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Featured Promo Card */}
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false} 
          style={styles.promoContainer}
        >
          <LinearGradient
            colors={colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.promoCard}
          >
            <View style={styles.promoInfo}>
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>OFERTA DO DIA</Text>
              </View>
              <Text style={styles.promoTitle}>Combo{"\n"}EcoBurger</Text>
              <Text style={styles.promoPrice}>R$ 34,90 <Text style={styles.promoOldPrice}>R$ 45,90</Text></Text>
              <TouchableOpacity style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Pedir Agora</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.promoIconContainer}>
               <Leaf size={120} color={colors.white} opacity={0.2} />
            </View>
          </LinearGradient>
        </ScrollView>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <TouchableOpacity style={styles.seeAllContainer}>
              <Text style={styles.seeAll}>Ver Tudo</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesList}>
            {CATEGORIES.map(category => (
              <TouchableOpacity 
                key={category.id} 
                style={[
                  styles.categoryCard,
                  activeCategory === category.id && styles.activeCategoryCard
                ]}
                onPress={() => setActiveCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  activeCategory === category.id && styles.activeCategoryName
                ]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Products Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destaques Sustentáveis</Text>
            <TouchableOpacity>
               <ChevronRight size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {isLoading ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ flex: 1, marginTop: 20 }} />
            ) : (
              products.map(product => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAdd={() => handleAddToCart(product)} 
                />
              ))
            )}
          </View>
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
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notificationBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border + '80',
    ...Shadows.light,
  },
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    height: 52,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    borderWidth: 1,
    borderColor: colors.border + '80',
    ...Shadows.light,
  },
  searchPlaceholder: {
    marginLeft: Spacing.sm,
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '500',
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  promoContainer: {
    marginBottom: Spacing.xl,
  },
  promoCard: {
    width: width - (Spacing.lg * 2),
    height: 200,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    ...Shadows.medium,
  },
  promoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  newBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newBadgeText: {
    color: colors.black,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    lineHeight: 28,
  },
  promoPrice: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  promoOldPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  promoBtn: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginTop: 16,
    ...Shadows.light,
  },
  promoBtnText: {
    color: colors.primary,
    fontWeight: '900',
    fontSize: 13,
  },
  promoIconContainer: {
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  seeAllContainer: {
    padding: 4,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  categoriesList: {
    paddingBottom: 4,
  },
  categoryCard: {
    backgroundColor: colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    marginRight: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border + '50',
    ...Shadows.light,
  },
  activeCategoryCard: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textSecondary,
  },
  activeCategoryName: {
    color: colors.white,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
