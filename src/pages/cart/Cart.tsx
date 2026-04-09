import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Button } from '../../components/ui/Button';
import { Minus, Plus, Trash2, Leaf } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import styles from './Cart.module.css';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity } = useCart();

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = 5.00;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <Header title="Carrinho" showBack />
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione itens sustentáveis ao seu pedido!</p>
          <Button onClick={() => navigate('/home')}>Voltar ao Início</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header title="Carrinho" showBack />
      
      <div className={styles.content}>
        <div className={styles.ecoBanner}>
          <Leaf size={20} className={styles.ecoIcon} />
          <span>Ao pedir hoje, você economiza <strong>200g</strong> de CO2!</span>
        </div>

        <div className={styles.desktopLayout}>
          <div className={styles.itemsList}>
            {items.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.imageUrl} alt={item.name} className={styles.itemImage} />
              
              <div className={styles.itemInfo}>
                <div>
                  <h4 className={styles.itemName}>
                    {item.name} {item.isEco && <Leaf size={12} className={styles.ecoIconSmall} />}
                  </h4>
                  <span className={styles.itemPrice}>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                  </span>
                </div>
                
                <div className={styles.itemActions}>
                  <div className={styles.quantityControl}>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, -1)}>
                      {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    <span className={styles.qtyValue}>{item.quantity}</span>
                    <button className={styles.qtyBtn} onClick={() => updateQuantity(item.id, 1)}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            ))}
          </div>

          <div className={styles.summaryWrapper}>
            <div className={styles.summary}>
              <h3 className={styles.summaryTitle}>Resumo do Pedido</h3>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Entrega Verde (Bicicleta)</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(deliveryFee)}</span>
              </div>
              
              <div className={styles.divider} />
              
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
              </div>

              {/* Action Button that was in the bottomBar is now here, though we can still show a mobile bottomBar */}
              <div className={styles.summaryAction}>
                <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
                  Continuar para Pagamento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBarMobile}>
        <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
          Continuar para Pagamento
        </Button>
      </div>
    </div>
  );
};

export default Cart;
