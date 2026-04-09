import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock } from 'lucide-react';
import styles from './Login.module.css';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      <Header showBack />
      
      <div className={styles.content}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Bem-vindo de volta!</h1>
          <p className={styles.subtitle}>Faça login para continuar seus pedidos sustentáveis.</p>
        </div>

        <form onSubmit={handleLogin} className={styles.form}>
          <Input 
            label="E-mail" 
            type="email" 
            placeholder="seu@email.com" 
            leftIcon={<Mail size={20} />} 
          />
          <Input 
            label="Senha" 
            type="password" 
            placeholder="Sua senha" 
            leftIcon={<Lock size={20} />} 
          />
          
          <button type="button" className={styles.forgotPassword}>
            Esqueceu a senha?
          </button>

          <div className={styles.actions}>
            <Button fullWidth size="lg" type="submit">
              Entrar
            </Button>
          </div>
        </form>

        <p className={styles.footerText}>
          Não tem uma conta? <button onClick={() => navigate('/register')} className={styles.link}>Cadastre-se</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
