import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getPaymentMethods, createPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod } from '../services/api';
import { useAuth } from './AuthContext';

interface PaymentMethod {
  id: number;
  user_id: number;
  type: string;
  brand: string;
  last_digits: string;
  label: string;
  is_default: boolean;
}

interface PaymentContextData {
  payments: PaymentMethod[];
  loading: boolean;
  selectedPayment: PaymentMethod | null;
  setSelectedPayment: (payment: PaymentMethod | null) => void;
  loadPayments: () => Promise<void>;
  createPayment: (paymentData: Partial<PaymentMethod>) => Promise<void>;
  deletePayment: (id: number) => Promise<void>;
  setDefaultPayment: (id: number) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextData | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: ReactNode }) => {
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadPayments();
    } else {
      setPayments([]);
      setSelectedPayment(null);
      setLoading(false);
    }
  }, [user]);

  const loadPayments = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getPaymentMethods(user.id);
      setPayments(data);
      const def = data.find((p: PaymentMethod) => p.is_default);
      if (def) setSelectedPayment(def);
      else if (data.length > 0 && !selectedPayment) setSelectedPayment(data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: Partial<PaymentMethod>) => {
    try {
      if (!user) throw new Error('User not logged in');
      await createPaymentMethod({ ...paymentData, userId: user.id });
      await loadPayments();
    } catch (error) {
      throw error;
    }
  };

  const deletePayment = async (id: number) => {
    try {
      await deletePaymentMethod(id);
      await loadPayments();
    } catch (error) {
      throw error;
    }
  };

  const setDefaultPayment = async (id: number) => {
    try {
      if (!user) throw new Error('User not logged in');
      await setDefaultPaymentMethod(id, user.id);
      await loadPayments();
    } catch (error) {
      throw error;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        payments,
        loading,
        selectedPayment,
        setSelectedPayment,
        loadPayments,
        createPayment,
        deletePayment,
        setDefaultPayment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
