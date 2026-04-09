import React from 'react';
import { ArrowLeft, Leaf } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, showBack = false, rightElement }) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        {showBack ? (
          <button onClick={() => navigate(-1)} className={styles.iconBtn}>
            <ArrowLeft size={24} />
          </button>
        ) : (
          <div className={styles.logo}>
            <Leaf className={styles.leafIcon} size={24} />
            <span className={styles.brandName}>EcoFast</span>
          </div>
        )}
      </div>

      {title && <h1 className={styles.title}>{title}</h1>}

      <div className={styles.right}>
        {rightElement}
      </div>
    </header>
  );
};

export default Header;
