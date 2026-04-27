import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Star, Clock, Leaf, Minus, Plus, ShoppingCart } from 'lucide-react-native';
import { getProductById } from '../../services/api';
import { useCart } from '../../contexts/CartContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { Spacing, Radius, Shadows } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { colors } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id as string);
      setProduct(data);
    } catch (error) {
      console.error('Erro ao carregar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          isEco: product.isEco
        });
      }
      router.back();
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Produto não encontrado</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          {product.isEco && (
            <LinearGradient colors={colors.primaryGradient} style={styles.ecoBadge}>
              <Leaf size={16} color={colors.white} />
              <Text style={styles.ecoText}>Eco-Friendly</Text>
            </LinearGradient>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>R$ {Number(product.price).toFixed(2)}</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Star size={16} color={colors.secondary} fill={colors.secondary} />
              <Text style={styles.statText}>{Number(product.rating).toFixed(1)} ({product.reviews} avaliações)</Text>
            </View>
            <View style={styles.stat}>
              <Clock size={16} color={colors.textTertiary} />
              <Text style={styles.statText}>{product.time}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {product.ingredients && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ingredientes</Text>
              <View style={styles.ingredientsList}>
                {product.ingredients.map((item: string, index: number) => (
                  <View key={index} style={styles.ingredientBadge}>
                    <Text style={styles.ingredientText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityBtn} 
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity 
            style={styles.quantityBtn} 
            onPress={() => setQuantity(quantity + 1)}
          >
            <Plus size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.addToCartBtn} onPress={handleAddToCart}>
          <ShoppingCart size={20} color={colors.white} />
          <Text style={styles.addToCartText}>Adicionar • R$ {(product.price * quantity).toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  backBtn: {
    padding: Spacing.md,
    backgroundColor: colors.primary,
    borderRadius: Radius.md,
  },
  backBtnText: {
    color: colors.white,
    fontWeight: '700',
  },
  imageContainer: {
    width: width,
    height: width * 0.8,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Spacing.xl,
    left: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.glass,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.medium,
  },
  ecoBadge: {
    position: 'absolute',
    bottom: Spacing.lg,
    right: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    ...Shadows.medium,
  },
  ecoText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 6,
  },
  content: {
    padding: Spacing.xl,
    backgroundColor: colors.background,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    marginTop: -Radius.xl,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.textPrimary,
    flex: 1,
    marginRight: Spacing.md,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    gap: Spacing.xl,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  ingredientsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: 8,
  },
  ingredientBadge: {
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.md,
  },
  ingredientText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  bottomBar: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xl + 10,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: Spacing.lg,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceHover,
    borderRadius: Radius.md,
    paddingHorizontal: 4,
  },
  quantityBtn: {
    padding: 10,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: 12,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    ...Shadows.medium,
  },
  addToCartText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '900',
  },
});
