import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircle, Leaf } from 'lucide-react';
import styles from './Confirmation.module.css';

const Confirmation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.successIconWrapper}>
          <CheckCircle size={80} className={styles.successIcon} />
        </div>
        
        <h1 className={styles.title}>Pedido Confirmado!</h1>
        <p className={styles.subtitle}>
          Seu pedido foi recebido pelo restaurante e já está sendo preparado.
        </p>

        <div className={styles.ecoImpact}>
          <Leaf size={24} className={styles.ecoIcon} />
          <div className={styles.ecoTextWrapper}>
            <span className={styles.ecoTitle}>Impacto Positivo</span>
            <span className={styles.ecoDesc}>Este pedido economizou 200g de CO2 e usou embalagens recicláveis.</span>
          </div>
        </div>

      </div>

      <div className={styles.actions}>
        <Button fullWidth size="lg" onClick={() => navigate('/tracking/12345')}>
          Acompanhar Pedido
        </Button>
        <Button fullWidth variant="ghost" onClick={() => navigate('/home')}>
          Voltar ao Início
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
