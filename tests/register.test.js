/**
 * TESTES UNITÁRIOS - TELA DE CADASTRO
 * Projeto: Delivery Multiplataforma
 * Descrição: Este arquivo contém os testes para validar o processo de criação de conta,
 * verificando preenchimento de campos, regras de negócio e integração com a API.
 * Autor: Programador Técnico
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Register from '../app/onboarding/register';
import { useRouter } from 'expo-router';
import { register as apiRegister } from '../services/api';

// --- CONFIGURAÇÃO DE MOCKS ---
// Simulamos o comportamento das rotas
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Simulamos as chamadas de API de cadastro
jest.mock('../services/api', () => ({
  register: jest.fn(),
}));

// Mock para os ícones da biblioteca Lucide
jest.mock('lucide-react-native', () => ({
  User: 'User',
  Mail: 'Mail',
  Lock: 'Lock',
  ChevronLeft: 'ChevronLeft',
  CheckCircle2: 'CheckCircle2',
  XCircle: 'XCircle',
}));

describe('Suíte de Testes: Tela de Cadastro', () => {
  const mockReplace = jest.fn();
  const mockBack = jest.fn();

  // Configuração inicial antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ replace: mockReplace, back: mockBack });
  });

  /**
   * TESTE 01: Verificação da Interface do Usuário
   */
  it('1. Deve renderizar todos os campos e o botão de criar conta corretamente', () => {
    // ARRANGE
    const { getByPlaceholderText, getByText } = render(<Register />);
    
    // ASSERT
    expect(getByPlaceholderText('Seu nome')).toBeTruthy();
    expect(getByPlaceholderText('seu@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Crie uma senha forte')).toBeTruthy();
    expect(getByText('Criar Conta')).toBeTruthy();
  });

  /**
   * TESTE 02: Validação de Campos Obrigatórios
   */
  it('2. Deve exibir alerta de erro se houver campos vazios', async () => {
    // ARRANGE
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = render(<Register />);
    const botaoCriar = getByText('Criar Conta');

    // ACT
    fireEvent.press(botaoCriar);

    // ASSERT
    expect(alertSpy).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    expect(apiRegister).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  /**
   * TESTE 03: Validação de Regra de Negócio (Tamanho da Senha)
   */
  it('3. Deve impedir o cadastro se a senha tiver menos de 6 caracteres', async () => {
    // ARRANGE
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByPlaceholderText, getByText } = render(<Register />);
    
    // ACT
    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Aluno Técnico');
    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'aluno@tecnico.com');
    fireEvent.changeText(getByPlaceholderText('Crie uma senha forte'), '12345'); // Senha inválida
    fireEvent.press(getByText('Criar Conta'));

    // ASSERT
    expect(alertSpy).toHaveBeenCalledWith('Erro', 'A senha deve ter pelo menos 6 caracteres');
    expect(apiRegister).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  /**
   * TESTE 04: Tratamento de Conflito de E-mail
   */
  it('4. Deve exibir modal de erro quando o e-mail já estiver cadastrado', async () => {
    // ARRANGE
    apiRegister.mockRejectedValueOnce({ message: 'E-mail já está em uso' });
    const { getByPlaceholderText, getByText, findByText } = render(<Register />);
    
    // ACT
    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Usuário Repetido');
    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'ja_existe@email.com');
    fireEvent.changeText(getByPlaceholderText('Crie uma senha forte'), 'senha123456');
    fireEvent.press(getByText('Criar Conta'));

    // ASSERT
    const mensagemErro = await findByText('E-mail já está em uso');
    expect(mensagemErro).toBeTruthy();
  });

  /**
   * TESTE 05: Sucesso no Processo de Cadastro
   */
  it('5. Deve realizar o cadastro com sucesso e exibir mensagem de confirmação', async () => {
    // ARRANGE
    apiRegister.mockResolvedValueOnce({ success: true });
    const { getByPlaceholderText, getByText, findByText } = render(<Register />);
    
    // ACT
    fireEvent.changeText(getByPlaceholderText('Seu nome'), 'Novo Aluno');
    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'novo_aluno@tecnico.com');
    fireEvent.changeText(getByPlaceholderText('Crie uma senha forte'), 'senhaSegura123');
    fireEvent.press(getByText('Criar Conta'));

    // ASSERT
    // Verifica se a API de cadastro foi chamada corretamente
    await waitFor(() => {
      expect(apiRegister).toHaveBeenCalledWith({
        name: 'Novo Aluno',
        email: 'novo_aluno@tecnico.com',
        password: 'senhaSegura123',
      });
    });

    // Verifica se a mensagem de sucesso do Modal apareceu na tela
    const mensagemSucesso = await findByText('Conta criada com sucesso. Redirecionando...');
    expect(mensagemSucesso).toBeTruthy();
  });
});
