import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Modal, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Plus, CreditCard, Trash2, Check, Smartphone, Banknote } from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { usePayment } from '../contexts/PaymentContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { Spacing, Radius, Shadows } from '../constants/Colors';
import { Button } from '../components/ui/Button';

export default function Payments() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    payments, 
    loading, 
    setSelectedPayment, 
    createPayment, 
    deletePayment,
    setDefaultPayment
  } = usePayment();
  
  const { colors } = usePreferences();
  const styles = React.useMemo(() => getStyles(colors), [colors]);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Fom State
  const [type, setType] = useState('CREDITO'); // PIX, CREDITO, DEBITO, VA, VR
  const [brand, setBrand] = useState('');
  const [lastDigits, setLastDigits] = useState('');
  const [label, setLabel] = useState('');
  const [isDefault, setIsDefault] = useState(false);

  const handleSavePayment = async () => {
    let finalLabel = label;
    let finalBrand = brand;
    let finalDigits = lastDigits;

    if (type === 'PIX') {
      finalLabel = 'Pix Associado';
      finalBrand = 'PIX';
      finalDigits = '';
    } else if (!finalLabel || !finalDigits) {
      Alert.alert('Erro', 'Por favor, preencha os 4 últimos dígitos e o apelido para o cartão.');
      return;
    }

    const payload = {
      type,
      brand: finalBrand || type,
      last_digits: finalDigits,
      label: finalLabel,
      isDefault
    };

    try {
      await createPayment(payload);
      setModalVisible(false);
      resetForm();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o método de pagamento.');
    }
  };

  const handleDelete = (id: number) => {
    const performDelete = async () => {
      try {
        await deletePayment(id);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível deletar.');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Certeza que deseja remover este método?')) performDelete();
    } else {
      Alert.alert('Remover', 'Tem certeza?', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: performDelete }
      ]);
    }
  };

  const handleSelectPayment = async (payment: any) => {
    setSelectedPayment(payment);
    try {
      await setDefaultPayment(payment.id);
      if (router.canGoBack()) router.back();
      else router.replace('/home');
    } catch (error) {
      console.error(error);
      if (router.canGoBack()) router.back();
      else router.replace('/home');
    }
  };

  const resetForm = () => {
    setType('CREDITO');
    setBrand('');
    setLastDigits('');
    setLabel('');
    setIsDefault(false);
  };

  const getIcon = (type: string) => {
    if (type === 'PIX') return <Smartphone size={24} color={colors.primary} />;
    if (type === 'VA' || type === 'VR') return <Banknote size={24} color={colors.primary} />;
    return <CreditCard size={24} color={colors.primary} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} style={styles.backBtn}>
          <ChevronLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Formas de Pagamento</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Plus size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : payments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <CreditCard size={64} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>Nenhum método salvo</Text>
          <Text style={styles.emptySubtitle}>Adicione um cartão ou Pix para facilitar suas compras.</Text>
          <Button style={styles.addBtnLarge} onPress={() => setModalVisible(true)}>
            Adicionar Pagamento
          </Button>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {payments.map((p) => (
            <View key={p.id} style={[styles.cardContainer, p.is_default && styles.defaultCard]}>
              <TouchableOpacity style={styles.cardMain} onPress={() => handleSelectPayment(p)} activeOpacity={0.7}>
                <View style={styles.iconBox}>{getIcon(p.type)}</View>
                <View style={styles.cardInfo}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={styles.cardLabel}>{p.label}</Text>
                    {p.is_default && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Padrão</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardDetails}>
                    {p.type === 'PIX' ? 'Pagamento Instantâneo' : `${p.type} •••• ${p.last_digits}`}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => handleDelete(p.id)}>
                  <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Add Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Pagamento</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={styles.closeBtn}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Tipo de Pagamento</Text>
              <View style={styles.typeSelector}>
                {['CREDITO', 'DEBITO', 'PIX', 'VA', 'VR'].map(t => (
                  <TouchableOpacity 
                    key={t}
                    style={[styles.typeOption, type === t && styles.typeOptionActive]}
                    onPress={() => setType(t)}
                  >
                    <Text style={[styles.typeText, type === t && styles.typeTextActive]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {type !== 'PIX' && (
                <>
                  <Text style={styles.inputLabel}>Apelido do Cartão</Text>
                  <TextInput style={styles.input} value={label} onChangeText={setLabel} placeholder="Ex: Cartão Roxinho" />

                  <View style={{flexDirection: 'row', gap: 10}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.inputLabel}>Bandeira (Opcional)</Text>
                      <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder="Ex: Master" />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.inputLabel}>Últimos 4 Dígitos *</Text>
                      <TextInput style={styles.input} value={lastDigits} onChangeText={setLastDigits} placeholder="1234" maxLength={4} keyboardType="numeric" />
                    </View>
                  </View>
                </>
              )}

              <TouchableOpacity style={styles.defaultToggle} onPress={() => setIsDefault(!isDefault)}>
                <View style={[styles.checkbox, isDefault && styles.checkboxActive]}>
                  {isDefault && <Check size={14} color={colors.white} />}
                </View>
                <Text style={styles.defaultToggleText}>Definir pagamento como padrão</Text>
              </TouchableOpacity>

              <Button fullWidth style={styles.saveBtn} onPress={handleSavePayment}>
                Salvar Método
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.lg, height: 60, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  addBtn: { width: 40, height: 40, alignItems: 'flex-end', justifyContent: 'center' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.huge },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginTop: Spacing.xl, marginBottom: Spacing.sm },
  emptySubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
  addBtnLarge: { paddingHorizontal: 32 },
  scrollContent: { padding: Spacing.lg },
  cardContainer: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: Radius.lg, marginBottom: Spacing.md, alignItems: 'center', ...Shadows.medium, borderWidth: 2, borderColor: 'transparent' },
  defaultCard: { borderColor: colors.primary, backgroundColor: colors.primary + '05' },
  cardMain: { flex: 1, flexDirection: 'row', alignItems: 'center', padding: Spacing.xl },
  actions: { paddingRight: Spacing.lg },
  actionBtn: { padding: 10, backgroundColor: colors.surfaceHover, borderRadius: Radius.full },
  iconBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  cardInfo: { flex: 1 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  cardLabel: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginRight: 8 },
  defaultBadge: { backgroundColor: colors.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: Radius.sm },
  defaultBadgeText: { color: colors.white, fontSize: 9, fontWeight: '900', textTransform: 'uppercase' },
  cardDetails: { fontSize: 14, color: colors.textPrimary, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, padding: Spacing.xl, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xl },
  modalTitle: { fontSize: 20, fontWeight: '900', color: colors.textPrimary },
  closeBtn: { color: colors.error, fontWeight: '700' },
  inputLabel: { fontSize: 14, fontWeight: '700', color: colors.textPrimary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.surfaceHover, borderRadius: Radius.md, padding: Spacing.md, fontSize: 15, color: colors.textPrimary },
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  typeOptionActive: { backgroundColor: colors.primary + '20', borderColor: colors.primary },
  typeText: { fontSize: 12, fontWeight: '700', color: colors.textSecondary },
  typeTextActive: { color: colors.primary },
  defaultToggle: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  defaultToggleText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  saveBtn: { marginTop: Spacing.xl, marginBottom: Spacing.xl }
});
