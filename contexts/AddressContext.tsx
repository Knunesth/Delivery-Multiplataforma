import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAddresses } from '../services/api';
import { useAuth } from './AuthContext';

interface Address {
  id: number;
  label: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  is_default: boolean;
}

interface AddressContextData {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address) => void;
  addresses: Address[];
  loadAddresses: () => Promise<void>;
  loading: boolean;
}

const AddressContext = createContext<AddressContextData>({} as AddressContextData);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);

  const loadAddresses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getAddresses(user.id);
      setAddresses(data);
      
      // Se já houver um endereço selecionado, mantém ele.
      // Caso contrário, tenta pegar o padrão.
      if (!selectedAddress) {
        const defaultAddr = data.find((a: Address) => a.is_default);
        if (defaultAddr) setSelectedAddress(defaultAddr);
        else if (data.length > 0) setSelectedAddress(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar endereços no contexto:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, [user]);

  return (
    <AddressContext.Provider value={{ 
      selectedAddress, 
      setSelectedAddress, 
      addresses, 
      loadAddresses, 
      loading 
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress deve ser usado dentro de um AddressProvider');
  }
  return context;
}
