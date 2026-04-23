import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, MapPin, Trash2, Home, Briefcase, Check } from 'lucide-react-native';
import { getAddresses, createAddress, deleteAddress, setDefaultAddress } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useAddress } from '../contexts/AddressContext';
import { Colors, Spacing, Radius, Shadows } from '../constants/Colors';
import { Button } from '../components/ui/Button';

export default function Addresses() {
  const router = useRouter();
  const { user } = useAuth();
  const { setSelectedAddress, loadAddresses: refreshGlobalAddresses } = useAddress();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Form State
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const data = await getAddresses(user.id);
      setAddresses(data);
    } catch (error) {
      console.error('Erro ao carregar endereços:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAddress = async () => {
    if (!street || !number || !neighborhood || !city) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await createAddress({
        userId: user.id,
        label,
        street,
        number,
        complement,
        neighborhood,
        city,
        isDefault
      });
      setModalVisible(false);
      resetForm();
      loadAddresses();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o endereço.');
    }
  };

  const handleDeleteAddress = (id: number) => {
    Alert.alert(
      'Deletar Endereço',
      'Tem certeza que deseja remover este endereço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Remover', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAddress(id);
              loadAddresses();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível deletar o endereço.');
            }
          }
        }
      ]
    );
  };

  const handleSelectAddress = async (address: any) => {
    setSelectedAddress(address);
    try {
      await setDefaultAddress(address.id, user.id);
      await refreshGlobalAddresses();
      router.back();
    } catch (error) {
      console.error(error);
      router.back();
    }
  };

  const resetForm = () => {
    setLabel('Home');
    setStreet('');
    setNumber('');
    setComplement('');
    setNeighborhood('');
    setCity('');
    setIsDefault(false);
  };

  const getIcon = (label: string) => {
    if (label.toLowerCase() === 'home') return <Home size={20} color={Colors.primary} />;
    if (label.toLowerCase() === 'work' || label.toLowerCase() === 'trabalho') return <Briefcase size={20} color={Colors.primary} />;
    return <MapPin size={20} color={Colors.primary} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meus Endereços</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Plus size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MapPin size={64} color={Colors.textTertiary} />
          <Text style={styles.emptyTitle}>Nenhum endereço salvo</Text>
          <Text style={styles.emptySubtitle}>Adicione um endereço para facilitar seus pedidos.</Text>
          <Button style={styles.addBtnLarge} onPress={() => setModalVisible(true)}>
            Adicionar Endereço
          </Button>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {addresses.map((address) => (
            <TouchableOpacity 
              key={address.id} 
              style={[styles.addressCard, address.is_default && styles.defaultCard]}
              onPress={() => handleSelectAddress(address)}
              activeOpacity={0.7}
            >
              <View style={styles.addressIconBox}>
                {getIcon(address.label)}
              </View>
              <View style={styles.addressInfo}>
                <View style={styles.addressHeader}>
                  <Text style={styles.addressLabel}>{address.label}</Text>
                  {address.is_default && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultBadgeText}>Padrão</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.addressText}>
                  {address.street}, {address.number}
                </Text>
                {address.complement && (
                  <Text style={styles.addressSubtext}>{address.complement}</Text>
                )}
                <Text style={styles.addressSubtext}>
                  {address.neighborhood}, {address.city}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteBtn} 
                onPress={() => handleDeleteAddress(address.id)}
              >
                <Trash2 size={20} color={Colors.error} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Add Address Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Endereço</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeBtn}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Identificação (ex: Casa, Trabalho)</Text>
              <TextInput 
                style={styles.input} 
                value={label} 
                onChangeText={setLabel} 
                placeholder="Ex: Minha Casa"
              />

              <Text style={styles.inputLabel}>Rua *</Text>
              <TextInput 
                style={styles.input} 
                value={street} 
                onChangeText={setStreet} 
                placeholder="Nome da rua"
              />

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: Spacing.md }}>
                  <Text style={styles.inputLabel}>Número *</Text>
                  <TextInput 
                    style={styles.input} 
                    value={number} 
                    onChangeText={setNumber} 
                    placeholder="123"
                  />
                </View>
                <View style={{ flex: 2 }}>
                  <Text style={styles.inputLabel}>Complemento</Text>
                  <TextInput 
                    style={styles.input} 
                    value={complement} 
                    onChangeText={setComplement} 
                    placeholder="Apto, Bloco, etc"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Bairro *</Text>
              <TextInput 
                style={styles.input} 
                value={neighborhood} 
                onChangeText={setNeighborhood} 
                placeholder="Bairro"
              />

              <Text style={styles.inputLabel}>Cidade *</Text>
              <TextInput 
                style={styles.input} 
                value={city} 
                onChangeText={setCity} 
                placeholder="Cidade"
              />

              <TouchableOpacity 
                style={styles.defaultToggle} 
                onPress={() => setIsDefault(!isDefault)}
              >
                <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
                  {isDefault && <Check size={14} color={Colors.white} />}
                </View>
                <Text style={styles.defaultToggleText}>Definir como endereço padrão</Text>
              </TouchableOpacity>

              <Button fullWidth style={styles.saveBtn} onPress={handleCreateAddress}>
                Salvar Endereço
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    height: 60,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  addBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.huge,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  addBtnLarge: {
    paddingHorizontal: 32,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
    alignItems: 'center',
    ...Shadows.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  defaultCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '05',
  },
  addressIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  addressInfo: {
    flex: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.sm,
  },
  defaultBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  addressText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  addressSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  closeBtn: {
    color: Colors.error,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: Colors.surfaceHover,
    borderRadius: Radius.md,
    padding: Spacing.md,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  row: {
    flexDirection: 'row',
  },
  defaultToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  defaultToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  saveBtn: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  }
});
