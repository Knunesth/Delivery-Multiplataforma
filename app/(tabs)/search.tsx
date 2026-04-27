import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search as SearchIcon, X, History, TrendingUp, Filter, Star } from 'lucide-react-native';
import { Spacing, Radius, Shadows } from '../../constants/Colors';
import { usePreferences } from '../../contexts/PreferencesContext';
import { getProducts } from '../../services/api';
import { ProductCard } from '../../components/ui/ProductCard';
import { useCart } from '../../contexts/CartContext';

const RECENT_SEARCHES = ['Hambúrguer de Grão de Bico', 'Salada Caesar', 'Suco Natural', 'Pizza Vegana'];
const TRENDING = ['EcoBurger', 'Suco Detox', 'Embalagem Biodegradável'];

export default function Search() {
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();
  const { colors } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data);
    setIsLoading(false);
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );

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
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <SearchIcon size={18} color={colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="O que você quer pedir hoje?"
              placeholderTextColor={colors.textTertiary}
              value={query}
              onChangeText={setQuery}
              autoFocus={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={20} color={colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn}>
             <Filter size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {query.length === 0 ? (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBox}>
                  <History size={16} color={colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Buscas Recentes</Text>
              </View>
              <View style={styles.chipContainer}>
                {RECENT_SEARCHES.map(item => (
                  <TouchableOpacity key={item} style={styles.chip} onPress={() => setQuery(item)} activeOpacity={0.7}>
                    <View style={styles.chipGradient}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBox}>
                  <TrendingUp size={16} color={colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Tendências do Momento</Text>
              </View>
              <View style={styles.chipContainer}>
                {TRENDING.map(item => (
                  <TouchableOpacity key={item} style={styles.chip} onPress={() => setQuery(item)} activeOpacity={0.7}>
                    <View style={styles.chipGradient}>
                      <Text style={styles.chipText}>{item}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBox}>
                  <Star size={16} color={colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Produtos Mais Pedidos</Text>
              </View>
              
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 20 }} />
              ) : (
                <View style={styles.productsGrid}>
                  {products.slice(0, 2).map(product => (
                    <ProductCard 
                      key={product.id} 
                      {...product} 
                      onAdd={() => handleAddToCart(product)} 
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsCount}>
                Encontramos <Text style={styles.boldText}>{filteredProducts.length}</Text> resultados
              </Text>
            </View>
            <View style={styles.productsGrid}>
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  {...product} 
                  onAdd={() => handleAddToCart(product)} 
                />
              ))}
            </View>
            {filteredProducts.length === 0 && (
              <View style={styles.noResults}>
                <Text style={styles.noResultsIcon}>🔍</Text>
                <Text style={styles.noResultsText}>Poxa, não encontramos nada com esse nome.</Text>
                <TouchableOpacity style={styles.clearBtn} onPress={() => setQuery('')}>
                  <Text style={styles.clearBtnText}>Limpar busca</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
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
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: Spacing.lg,
    height: 52,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: colors.border + '50',
    ...Shadows.light,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border + '50',
    ...Shadows.light,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionIconBox: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginBottom: Spacing.sm,
    marginRight: Spacing.sm,
  },
  chipGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: colors.border + '50',
    backgroundColor: colors.surface,
    ...Shadows.light,
  },
  chipText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    marginBottom: Spacing.lg,
  },
  resultsCount: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  boldText: {
    color: colors.textPrimary,
    fontWeight: '900',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noResults: {
    padding: Spacing.huge,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  noResultsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },
  clearBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  clearBtnText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
});
