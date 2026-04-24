import React, { createContext, useContext, useState, useEffect } from 'react';
import * as API from '../services/api';
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
  createAddress: (addressData: any) => Promise<void>;
  updateAddress: (id: number, addressData: any) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  setDefaultAddress: (id: number) => Promise<void>;
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
      const data = await API.getAddresses(user.id);
      setAddresses(data);
      
      // Sync selected address
      if (selectedAddress) {
        const stillExists = data.find((a: Address) => a.id === selectedAddress.id);
        if (!stillExists) {
          const defaultAddr = data.find((a: Address) => a.is_default);
          setSelectedAddress(defaultAddr || (data.length > 0 ? data[0] : null));
        } else {
          // Update selected address data in case it changed (like is_default)
          setSelectedAddress(stillExists);
        }
      } else {
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

  const createAddress = async (addressData: any) => {
    await API.createAddress(addressData);
    await loadAddresses();
  };

  const updateAddress = async (id: number, addressData: any) => {
    await API.updateAddress(id, addressData);
    await loadAddresses();
  };

  const deleteAddress = async (id: number) => {
    console.log('Contexto: Deletando endereço ID:', id);
    await API.deleteAddress(id);
    await loadAddresses();
  };

  const setDefaultAddress = async (id: number) => {
    if (!user) return;
    await API.setDefaultAddress(id, user.id);
    await loadAddresses();
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
      createAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
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
