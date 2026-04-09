import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, Lock } from 'lucide-react';
import styles from './Register.module.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className={styles.container}>
      <Header showBack />
      
      <div className={styles.content}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>Crie sua conta</h1>
          <p className={styles.subtitle}>Junte-se à revolução do delivery verde.</p>
        </div>

        <form onSubmit={handleRegister} className={styles.form}>
          <Input 
            label="Nome Completo" 
            type="text" 
            placeholder="Seu nome" 
            leftIcon={<User size={20} />} 
          />
          <Input 
            label="E-mail" 
            type="email" 
            placeholder="seu@email.com" 
            leftIcon={<Mail size={20} />} 
          />
          <Input 
            label="Senha" 
            type="password" 
            placeholder="Crie uma senha forte" 
            leftIcon={<Lock size={20} />} 
          />

          <div className={styles.terms}>
            <input type="checkbox" id="terms" className={styles.checkbox} />
            <label htmlFor="terms">
              Eu concordo com os <span className={styles.link}>Termos de Serviço</span> e <span className={styles.link}>Política de Privacidade</span>.
            </label>
          </div>

          <div className={styles.actions}>
            <Button fullWidth size="lg" type="submit">
              Criar Conta
            </Button>
          </div>
        </form>

        <p className={styles.footerText}>
          Já tem uma conta? <button onClick={() => navigate('/login')} className={styles.link}>Fazer Login</button>
        </p>
      </div>
    </div>
  );
};

export default Register;
