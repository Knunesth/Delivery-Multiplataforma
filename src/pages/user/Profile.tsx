import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Leaf, Settings, MapPin, CreditCard, ChevronRight, LogOut } from 'lucide-react';
import styles from './Profile.module.css';

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Header title="Meu Perfil" />
      
      <div className={styles.content}>
        
        {/* User Info Header */}
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <span className={styles.avatarText}>M</span>
          </div>
          <div className={styles.userDetails}>
            <h2 className={styles.userName}>Maria Silva</h2>
            <p className={styles.userEmail}>maria.silva@email.com</p>
          </div>
        </div>

        {/* Eco Stats */}
        <div className={styles.ecoStats}>
          <div className={styles.statIcon}>
            <Leaf size={24} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Seu Impacto Verde</span>
            <span className={styles.statValue}>12.5 kg CO2 economizados</span>
          </div>
        </div>

        {/* Menu Options */}
        <div className={styles.menuList}>
          <button className={styles.menuItem} onClick={() => navigate('/tracking/123')}>
            <div className={styles.menuIconWrapper}>
              <Leaf size={20} className={styles.menuIcon} />
            </div>
            <span className={styles.menuLabel}>Meus Pedidos Sustentáveis</span>
            <ChevronRight size={20} className={styles.chevron} />
          </button>
          
          <button className={styles.menuItem}>
            <div className={styles.menuIconWrapper}>
              <MapPin size={20} className={styles.menuIcon} />
            </div>
            <span className={styles.menuLabel}>Endereços</span>
            <ChevronRight size={20} className={styles.chevron} />
          </button>
          
          <button className={styles.menuItem}>
            <div className={styles.menuIconWrapper}>
              <CreditCard size={20} className={styles.menuIcon} />
            </div>
            <span className={styles.menuLabel}>Pagamentos</span>
            <ChevronRight size={20} className={styles.chevron} />
          </button>

          <button className={styles.menuItem}>
            <div className={styles.menuIconWrapper}>
              <Settings size={20} className={styles.menuIcon} />
            </div>
            <span className={styles.menuLabel}>Configurações</span>
            <ChevronRight size={20} className={styles.chevron} />
          </button>
        </div>

        <button className={styles.logoutBtn} onClick={() => navigate('/')}>
          <LogOut size={20} />
          Sair da Conta
        </button>
      </div>
    </div>
  );
};

export default Profile;
