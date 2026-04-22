import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, FlatList, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search as SearchIcon, X, History, TrendingUp, Filter } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '../../constants/Colors';
import { MOCK_PRODUCTS } from '../../data/products';
import { ProductCard } from '../../components/ui/ProductCard';
import { useCart } from '../../contexts/CartContext';

const RECENT_SEARCHES = ['Hambúrguer de Grão de Bico', 'Salada Caesar', 'Suco Natural', 'Pizza Vegana'];
const TRENDING = ['EcoBurger', 'Suco Detox', 'Embalagem Biodegradável'];

export default function Search() {
  const [query, setQuery] = useState('');
  const { addToCart } = useCart();

  const filteredProducts = MOCK_PRODUCTS.filter(product => 
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
            <SearchIcon size={18} color={Colors.primary} />
            <TextInput
              style={styles.input}
              placeholder="O que você quer pedir hoje?"
              placeholderTextColor={Colors.textTertiary}
              value={query}
              onChangeText={setQuery}
              autoFocus={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={20} color={Colors.textTertiary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={styles.filterBtn}>
             <Filter size={20} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {query.length === 0 ? (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBox}>
                  <History size={16} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Buscas Recentes</Text>
              </View>
              <View style={styles.chipContainer}>
                {RECENT_SEARCHES.map(item => (
                  <TouchableOpacity key={item} style={styles.chip} onPress={() => setQuery(item)}>
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIconBox}>
                  <TrendingUp size={16} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Tendências do Momento</Text>
              </View>
              <View style={styles.chipContainer}>
                {TRENDING.map(item => (
                  <TouchableOpacity key={item} style={styles.chip} onPress={() => setQuery(item)}>
                    <LinearGradient
                      colors={[Colors.white, '#F8F9FA']}
                      style={styles.chipGradient}
                    >
                      <Text style={styles.chipText}>{item}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: Radius.xl,
    borderBottomRightRadius: Radius.xl,
    ...Shadows.medium,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceHover,
    paddingHorizontal: Spacing.md,
    height: 52,
    borderRadius: Radius.lg,
  },
  input: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: Radius.lg,
    backgroundColor: Colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
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
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    marginBottom: Spacing.sm,
    marginRight: Spacing.sm,
    ...Shadows.light,
  },
  chipGradient: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: 14,
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  boldText: {
    color: Colors.textPrimary,
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
    color: Colors.textSecondary,
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
    borderColor: Colors.primary,
  },
  clearBtnText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 14,
  },
});
