import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Leaf, Clock, MapPin } from 'lucide-react';
import styles from './Welcome.module.css';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.imageBackground}>
        <div className={styles.floatingGlass}>
          <Leaf size={32} />
          <span>EcoFast Delivery</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.badges}>
          <span className={styles.ecoBadge}>
            <Leaf size={14} /> 100% Sustentável
          </span>
        </div>
        
        <h1 className={styles.title}>Comida rápida,<br/>impacto <span className={styles.highlight}>verde</span>.</h1>
        <p className={styles.subtitle}>
          Faça seus pedidos de fast food, escolha embalagens ecológicas e acompanhe o percurso zero-carbono da sua entrega.
        </p>
        
        <div className={styles.features}>
          <div className={styles.featureItem}>
            <Clock size={20} className={styles.featureIcon} />
            <span>Entrega Rápida</span>
          </div>
          <div className={styles.featureItem}>
            <MapPin size={20} className={styles.featureIcon} />
            <span>Rotas Otimizadas</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button fullWidth size="lg" onClick={() => navigate('/register')}>
            Criar minha conta
          </Button>
          <Button fullWidth variant="ghost" onClick={() => navigate('/login')}>
            Já tenho uma conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
