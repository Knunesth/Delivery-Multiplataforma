import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import styles from './Splash.module.css';

const Splash: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.splashContainer}>
      <div className={styles.logoWrapper}>
        <div className={styles.iconCircle}>
          <Leaf size={48} className={styles.icon} />
        </div>
        <h1 className={styles.brandName}>EcoFast</h1>
        <p className={styles.tagline}>Delivery Sustentável</p>
      </div>
      <div className={styles.loader}></div>
    </div>
  );
};

export default Splash;
