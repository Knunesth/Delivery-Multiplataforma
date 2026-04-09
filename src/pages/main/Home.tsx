import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from '../../components/ui/ProductCard';
import { Bell, MapPin, Search as SearchIcon, Leaf } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import styles from './Home.module.css';

import { MOCK_PRODUCTS } from '../../data/products';

const CATEGORIES = [
  { id: '1', name: 'Burgers', icon: '🍔' },
  { id: '2', name: 'Vegano', icon: '🥗' },
  { id: '3', name: 'Bebidas', icon: '🥤' },
  { id: '4', name: 'Sobremesas', icon: '🍦' },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      isEco: product.isEco
    });
    setToastMessage(`${product.name} adicionado ao pedido 🌱`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className={styles.container}>
      {/* Toast Notification */}
      <div className={`${styles.toast} ${toastMessage ? styles.toastVisible : ''}`}>
        {toastMessage}
      </div>
      <header className={styles.topHeader}>
        <div className={styles.innerContainerHeader}>
          <div className={styles.locationInfo}>
            <p className={styles.locationLabel}>Entregar em</p>
            <div className={styles.locationSelector}>
              <MapPin size={16} className={styles.primaryIcon} />
              <span className={styles.locationText}>Av. Paulista, 1000</span>
            </div>
          </div>
          <div className={styles.notificationWrapper}>
            <button className={styles.iconBtn} onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={24} />
              <span className={styles.notificationBadge}></span>
            </button>
            
            {showNotifications && (
              <div className={styles.notificationDropdown}>
                <div className={styles.dropdownHeader}>Notificações</div>
                <div className={styles.dropdownItem}>
                  <p><strong>Desconto Verde!</strong> 🌍</p>
                  <span>Peça hoje e ganhe 15% OFF em itens sustentáveis.</span>
                </div>
                <div className={styles.dropdownItem}>
                  <p><strong>Novo Restaurante</strong></p>
                  <span>VeggieHouse entrou na plataforma!</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.innerContainer}>
          {/* Search Bar - Fake click to navigate */}
        <div className={styles.searchBar} onClick={() => navigate('/search')}>
          <SearchIcon size={20} className={styles.searchIcon} />
          <span className={styles.placeholder}>O que você quer pedir hoje?</span>
        </div>

        {/* Promo Banner */}
        <div className={styles.promoBanner}>
          <div className={styles.promoContent}>
            <span className={styles.promoBadge}>Novo</span>
            <h2>Combo Sustentável</h2>
            <p>Frete grátis com bike-courier</p>
          </div>
          <div className={styles.promoImageWrapper}>
             <Leaf size={60} className={styles.promoIcon} />
          </div>
        </div>

        {/* Categories */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Categorias</h3>
            <button className={styles.seeAll} onClick={() => navigate('/categories')}>Ver todas</button>
          </div>
          <div className={styles.categoriesList}>
            {CATEGORIES.map(category => (
              <div key={category.id} className={styles.categoryItem} onClick={() => navigate('/categories')}>
                <div className={styles.categoryIcon}>{category.icon}</div>
                <span className={styles.categoryName}>{category.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Destaques (Products) */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Destaques Ecológicos</h3>
          </div>
          <div className={styles.productsGrid}>
            {MOCK_PRODUCTS.map(product => (
              <ProductCard 
                key={product.id} 
                {...product} 
                onAdd={() => handleAddToCart(product)} 
              />
            ))}
          </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;
