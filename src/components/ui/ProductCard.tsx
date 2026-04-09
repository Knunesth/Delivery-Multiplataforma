import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Leaf, Star } from 'lucide-react';
import styles from './ProductCard.module.css';

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
  const navigate = useNavigate();

  return (
    <div className={styles.card} onClick={() => navigate(`/product/${id}`)}>
      <div className={styles.imageContainer}>
        <img src={imageUrl} alt={name} className={styles.image} />
        {isEco && (
          <div className={styles.ecoBadge}>
            <Leaf size={12} />
          </div>
        )}
      </div>
      
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        
        <div className={styles.meta}>
          <div className={styles.rating}>
            <Star size={14} className={styles.starIcon} fill="currentColor" />
            <span>{rating.toFixed(1)}</span>
          </div>
          <span className={styles.price}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
          </span>
        </div>
      </div>
      
      <button 
        className={styles.addButton}
        onClick={(e) => {
          e.stopPropagation();
          onAdd ? onAdd() : navigate('/cart');
        }}
      >
        <Plus size={20} />
      </button>
    </div>
  );
};
