import React, { type InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  leftIcon, 
  className = '', 
  id,
  ...props 
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
      <div className={`${styles.inputContainer} ${error ? styles.errorContainer : ''}`}>
        {leftIcon && <div className={styles.leftIcon}>{leftIcon}</div>}
        <input 
          id={inputId}
          className={`${styles.input} ${leftIcon ? styles.withIcon : ''}`}
          {...props}
        />
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
