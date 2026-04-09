import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Leaf, Star, Clock, Minus, Plus } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import styles from './ProductDetails.module.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [userActive, setUserActive] = useState(true);

  // Inactivity tracking for bouncy CTA
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const resetTimer = () => {
      setUserActive(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setUserActive(false), 3000);
    };
    
    window.addEventListener('touchstart', resetTimer);
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('scroll', resetTimer);
    
    resetTimer();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('touchstart', resetTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('scroll', resetTimer);
    };
  }, []);

  const product = MOCK_PRODUCTS.find(p => p.id === id);

  if (!product) {
    return (
      <div className={styles.container} style={{ alignItems: 'center', justifyContent: 'center' }}>
        <h2>Eco-Produto não encontrado 🎋</h2>
        <button className={styles.bouncyCta} style={{ marginTop: '24px', padding: '12px 32px' }} onClick={() => navigate(-1)}>Voltar</button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      isEco: product.isEco
    }, quantity);
    
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate('/cart');
    }, 2000);
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      <div className={`${styles.toast} ${showToast ? styles.toastVisible : ''}`}>
        Item adicionado ao seu pedido 🌱
      </div>

      {/* GlassHeader Overlaid */}
      <header className={styles.glassHeader}>
        <button onClick={() => navigate(-1)} className={styles.headerBtn}>
          <ArrowLeft size={24} />
        </button>
        <button 
          onClick={() => setIsFavorite(!isFavorite)} 
          className={`${styles.headerBtn} ${isFavorite ? styles.favoriteActive : ''}`}
        >
          <Heart size={24} fill={isFavorite ? 'var(--color-error)' : 'none'} color={isFavorite ? 'var(--color-error)' : 'currentColor'} />
        </button>
      </header>

      {/* Desktop Layout Wrapper */}
      <div className={styles.desktopWrapper}>
        {/* Hero Image (45-50% height) with Shimmer */}
        <div className={styles.heroWrapper}>
          {!imageLoaded && <div className={styles.shimmer} />}
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className={`${styles.heroImage} ${imageLoaded ? styles.loaded : ''}`} 
            onLoad={() => setImageLoaded(true)}
          />
          {product.isEco && (
            <div className={styles.ecoBadge}>
              <Leaf size={14} /> Embalagem ecológica
            </div>
          )}
        </div>

        {/* Content Floating Card */}
        <div className={styles.contentCard}>
          <div className={styles.topInfo}>
          <h1 className={styles.title}>{product.name}</h1>
          <div className={styles.metaRow}>
            <div className={styles.metaBadge}>
              <Star size={14} className={styles.starIcon} fill="currentColor" />
              <span>{product.rating} ({product.reviews})</span>
            </div>
            <div className={styles.metaBadge}>
              <Clock size={14} className={styles.clockIcon} />
              <span>{product.time}</span>
            </div>
          </div>
        </div>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.ingredientsSection}>
          <h3 className={styles.sectionTitle}>Ingredientes</h3>
          <div className={styles.chipsContainer}>
            {product.ingredients.map((ing, idx) => (
              <span key={idx} className={styles.ingredientChip}>{ing}</span>
            ))}
          </div>
        </div>

        {/* Glassmorphism Bottom Bar */}
        <div className={styles.bottomBar}>
          <div className={styles.quantityControl}>
            <button className={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>
              <Minus size={18} />
            </button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button className={styles.qtyBtn} onClick={() => setQuantity(q => q + 1)}>
              <Plus size={18} />
            </button>
          </div>

          {/* Bouncy CTA */}
          <button 
            className={`${styles.bouncyCta} ${!userActive ? styles.attentionPulse : ''}`} 
            onClick={handleAddToCart}
          >
            <span className={styles.ctaText}>Incluir ao Pedido</span>
            <span className={styles.ctaDot}>•</span>
            <span className={styles.ctaPrice}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price * quantity)}
            </span>
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
