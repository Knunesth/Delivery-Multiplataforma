import React, { useState, useEffect } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Leaf } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const { totalItems } = useCart();

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.layout}>
      {/* Top Navigation for Desktop */}
      {isDesktop && (
        <header className={styles.topNav}>
          <div className={styles.navContainer}>
            <div className={styles.logo}>
              <Leaf className={styles.leafIcon} size={24} />
              <span className={styles.brandName}>EcoFast</span>
            </div>
            
            <nav className={styles.desktopMenu}>
              <NavLink to="/home" className={({ isActive }) => isActive ? `${styles.desktopNavItem} ${styles.active}` : styles.desktopNavItem}>
                <Home size={20} /> Início
              </NavLink>
              <NavLink to="/search" className={({ isActive }) => isActive ? `${styles.desktopNavItem} ${styles.active}` : styles.desktopNavItem}>
                <Search size={20} /> Busca
              </NavLink>
            </nav>

            <div className={styles.desktopActions}>
              <NavLink to="/cart" className={({ isActive }) => isActive ? `${styles.desktopNavItem} ${styles.active}` : styles.desktopNavItem}>
                <div className={styles.cartIconWrapper}>
                  <ShoppingBag size={20} />
                  {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
                </div>
                Carrinho
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.desktopNavItem} ${styles.active}` : styles.desktopNavItem}>
                <User size={20} /> Perfil
              </NavLink>
            </div>
          </div>
        </header>
      )}

      <main className={styles.mainContent}>
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      {!isDesktop && (
        <nav className={styles.bottomNav}>
          <NavLink to="/home" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            <Home size={24} />
            <span>Início</span>
          </NavLink>
          <NavLink to="/search" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            <Search size={24} />
            <span>Busca</span>
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            <div className={styles.cartIconWrapper}>
              <ShoppingBag size={24} />
              {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
            </div>
            <span>Carrinho</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
            <User size={24} />
            <span>Perfil</span>
          </NavLink>
        </nav>
      )}
    </div>
  );
};

export default MainLayout;
