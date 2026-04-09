import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { MapPin, CreditCard, Leaf } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import styles from './Checkout.module.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/confirmation');
  };

  return (
    <div className={styles.container}>
      <Header title="Checkout" showBack />
      
      <form className={styles.content} onSubmit={handleFinish}>
        
        <div className={styles.desktopLayout}>
          <div className={styles.checkoutForm}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
            <MapPin size={20} className={styles.icon} />
            <h3 className={styles.sectionTitle}>Endereço de Entrega</h3>
          </div>
          <div className={styles.addressCard}>
            <p className={styles.addressText}>Av. Paulista, 1000</p>
            <p className={styles.addressSubtext}>Apto 42, Bela Vista - São Paulo, SP</p>
            <button type="button" className={styles.editBtn}>Editar</button>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Leaf size={20} className={styles.icon} />
            <h3 className={styles.sectionTitle}>Tipo de Entrega</h3>
          </div>
          <div className={styles.optionsList}>
            <label className={styles.optionItem}>
              <input type="radio" name="deliveryFlow" value="bike" defaultChecked className={styles.radio} />
              <div className={styles.optionDetails}>
                <span className={styles.optionName}>Bike Courier (Zero CO2)</span>
                <span className={styles.optionDesc}>20-30 min • R$ 5,00</span>
              </div>
            </label>
            <label className={styles.optionItem}>
              <input type="radio" name="deliveryFlow" value="moto" className={styles.radio} />
              <div className={styles.optionDetails}>
                <span className={styles.optionName}>Moto Padrão</span>
                <span className={styles.optionDesc}>15-20 min • R$ 8,00</span>
              </div>
            </label>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <CreditCard size={20} className={styles.icon} />
            <h3 className={styles.sectionTitle}>Pagamento</h3>
          </div>
          <Input 
            placeholder="Número do Cartão" 
            leftIcon={<CreditCard size={18} />} 
          />
          <div className={styles.row}>
            <Input placeholder="Validade (MM/AA)" />
            <Input placeholder="CVV" />
          </div>
            </section>
          </div>

          <div className={styles.summaryWrapper}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Pagamento</h3>
              <div className={styles.summaryRow}>
                <span className={styles.totalLabel}>Total Pagar</span>
                <span className={styles.totalValue}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
              </div>
              <div className={styles.summaryAction}>
                <Button fullWidth size="lg" type="submit">
                  Confirmar Pedido
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.bottomBarMobile}>
          <div className={styles.totalInfo}>
            <span className={styles.totalLabel}>Total Pagar</span>
            <span className={styles.totalValue}>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
          </div>
          <Button size="lg" type="submit">
            Confirmar Pedido
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
