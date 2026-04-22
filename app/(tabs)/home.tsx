import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, MapPin, Search as SearchIcon, Leaf, ChevronRight } from 'lucide-react-native';
import { useCart } from '../../contexts/CartContext';
import { ProductCard } from '../../components/ui/ProductCard';
import { Colors, Spacing, Radius, Shadows } from '../../constants/Colors';
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
  const [activeCategory, setActiveCategory] = useState('1');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        <View style={styles.headerTop}>
          <View style={styles.locationContainer}>
            <View style={styles.locationIconBox}>
              <MapPin size={18} color={Colors.white} />
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationLabel}>Entregar em</Text>
              <Text style={styles.locationValue} numberOfLines={1}>Av. Paulista, 1000</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={24} color={Colors.textPrimary} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar} 
          onPress={() => router.push('/search')}
          activeOpacity={0.9}
        >
          <SearchIcon size={20} color={Colors.textTertiary} />
          <Text style={styles.searchPlaceholder}>O que você quer pedir hoje?</Text>
        </TouchableOpacity>
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
            colors={Colors.primaryGradient}
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
               <Leaf size={120} color={Colors.white} opacity={0.2} />
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
               <ChevronRight size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.productsGrid}>
            {isLoading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ flex: 1, marginTop: 20 }} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    ...Shadows.medium,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationTextContainer: {
    marginLeft: Spacing.sm,
  },
  locationLabel: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceHover,
    height: 48,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  searchPlaceholder: {
    marginLeft: Spacing.sm,
    color: Colors.textSecondary,
    fontSize: 14,
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
    height: 180,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  promoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  newBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.white,
    lineHeight: 28,
  },
  promoPrice: {
    color: Colors.white,
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
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  promoBtnText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 12,
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
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  seeAllContainer: {
    padding: 4,
  },
  seeAll: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  categoriesList: {
    paddingBottom: 4,
  },
  categoryCard: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    marginRight: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...Shadows.light,
  },
  activeCategoryCard: {
    backgroundColor: Colors.primary + '10',
    borderColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  activeCategoryName: {
    color: Colors.primary,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
