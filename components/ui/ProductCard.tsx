import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Leaf, Star } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadows } from '../../constants/Colors';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  rating: number;
  imageUrl: string;
  isEco?: boolean;
  onAdd?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, rating, imageUrl, isEco, onAdd }) => {
  const router = useRouter();

  const formattedPrice = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(price);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => router.push(`/product/${id}`)}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: imageUrl || 'https://via.placeholder.com/150' }} 
          style={styles.image} 
          resizeMode="cover"
        />
        {isEco && (
          <LinearGradient
            colors={Colors.primaryGradient}
            style={styles.ecoBadge}
          >
            <Leaf size={10} color={Colors.white} />
          </LinearGradient>
        )}
        <View style={styles.ratingBadge}>
          <Star size={10} color={Colors.secondary} fill={Colors.secondary} />
          <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{formattedPrice}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAdd}
          >
            <Plus size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    ...Shadows.medium,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: Colors.surfaceHover,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ecoBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: Radius.full,
    padding: 6,
    ...Shadows.light,
  },
  ratingBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginLeft: 2,
  },
  info: {
    padding: Spacing.md,
  },
  name: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primaryDark,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    padding: 4,
    ...Shadows.light,
  },
});
