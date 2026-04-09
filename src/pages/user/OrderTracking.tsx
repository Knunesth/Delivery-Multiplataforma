import React from 'react';

import Header from '../../components/layout/Header';
import { CheckCircle, MapPin, Package, Bike } from 'lucide-react';
import styles from './OrderTracking.module.css';

const OrderTracking: React.FC = () => {

  return (
    <div className={styles.container}>
      <Header title="Acompanhar Pedido" showBack />
      
      {/* Map Placeholder */}
      <div className={styles.mapContainer}>
        <div className={styles.mapOverlay}>
          <span className={styles.eta}>Entrega em 15 min</span>
        </div>
        {/* Placeholder image simulating a map */}
        <img 
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600" 
          alt="Map"
          className={styles.mapImg}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.courierInfo}>
          <div className={styles.courierAvatar}>
            <Bike size={24} className={styles.bikeIcon} />
          </div>
          <div className={styles.courierDetails}>
            <h4>João (Bike Eco)</h4>
            <p>5.0 ★ • Courier Parceiro</p>
          </div>
          <button className={styles.callBtn}>Ligar</button>
        </div>

        <div className={styles.timeline}>
          <div className={`${styles.timelineItem} ${styles.completed}`}>
            <div className={styles.timelineIcon}><CheckCircle size={20} /></div>
            <div className={styles.timelineContent}>
              <h4>Pedido Confirmado</h4>
              <p>12:30</p>
            </div>
          </div>
          <div className={`${styles.timelineItem} ${styles.completed}`}>
            <div className={styles.timelineIcon}><Package size={20} /></div>
            <div className={styles.timelineContent}>
              <h4>Preparando Seu Pedido</h4>
              <p>12:35</p>
            </div>
          </div>
          <div className={`${styles.timelineItem} ${styles.active}`}>
            <div className={styles.timelineIcon}><Bike size={20} /></div>
            <div className={styles.timelineContent}>
              <h4>A Caminho</h4>
              <p>Em transporte por bicicleta</p>
            </div>
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineIcon}><MapPin size={20} /></div>
            <div className={styles.timelineContent}>
              <h4>Entregue</h4>
              <p>Previsto 12:55</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
