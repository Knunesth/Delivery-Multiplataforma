import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, Lock, ChevronLeft } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '../../constants/Colors';
import { register } from '../../services/api';

export default function Register() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isLargeDevice = width > 500;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password });
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/onboarding/login') }
      ]);
    } catch (error: any) {
      Alert.alert('Erro no Cadastro', error.message || 'Não foi possível criar a conta');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, isLargeDevice && styles.scrollContentLarge]}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <ChevronLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>Crie sua conta</Text>
            <Text style={styles.subtitle}>Junte-se à revolução do delivery verde.</Text>
          </View>

          <View style={styles.form}>
            <Input 
              label="Nome Completo" 
              placeholder="Seu nome" 
              leftIcon={<User size={20} color={Colors.textTertiary} />} 
              value={name}
              onChangeText={setName}
            />
            <Input 
              label="E-mail" 
              placeholder="seu@email.com" 
              leftIcon={<Mail size={20} color={Colors.textTertiary} />} 
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <Input 
              label="Senha" 
              placeholder="Crie uma senha forte" 
              secureTextEntry
              leftIcon={<Lock size={20} color={Colors.textTertiary} />} 
              value={password}
              onChangeText={setPassword}
            />
            
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                Ao criar uma conta, você concorda com nossos{" "}
                <Text style={styles.linkTextInline}>Termos de Serviço</Text> e{" "}
                <Text style={styles.linkTextInline}>Política de Privacidade</Text>.
              </Text>
            </View>

            <View style={styles.actions}>
              <Button fullWidth size="lg" onPress={handleRegister} disabled={isLoading}>
                {isLoading ? <ActivityIndicator color={Colors.white} /> : 'Criar Conta'}
              </Button>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/login')}>
              <Text style={styles.linkText}>Fazer Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
  scrollContentLarge: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerText: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  termsContainer: {
    marginBottom: Spacing.xl,
  },
  termsText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  linkTextInline: {
    color: Colors.primary,
    fontWeight: '600',
  },
  actions: {
    marginTop: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: Spacing.xl,
  },
  footerText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
});
