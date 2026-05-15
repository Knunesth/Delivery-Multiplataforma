/**
 * TESTES UNITÁRIOS - TELA DE LOGIN
 * Projeto: Delivery Multiplataforma
 * Descrição: Este arquivo contém os testes para validar o comportamento da tela de Login,
 * incluindo validações de campos, erros da API e sucesso na autenticação.
 * Autor: Programador Técnico
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Login from '../app/onboarding/login';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { login as apiLogin } from '../services/api';

// --- CONFIGURAÇÃO DE MOCKS (Simulação de dependências externas) ---
// Simulamos o comportamento das rotas
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Simulamos o contexto de autenticação
jest.mock('../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Simulamos as chamadas de API
jest.mock('../services/api', () => ({
  login: jest.fn(),
}));

// Mock para os ícones da biblioteca Lucide (evita erros de renderização nos testes)
jest.mock('lucide-react-native', () => ({
  Mail: 'Mail',
  Lock: 'Lock',
  ChevronLeft: 'ChevronLeft',
  XCircle: 'XCircle',
}));

describe('Suíte de Testes: Tela de Login', () => {
  const mockReplace = jest.fn();
  const mockLogin = jest.fn();

  // Executa antes de cada teste para limpar as simulações e garantir um ambiente limpo
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({ replace: mockReplace, back: jest.fn() });
    useAuth.mockReturnValue({ login: mockLogin });
  });

  /**
   * TESTE 01: Verificação de Interface
   */
  it('1. Deve renderizar os componentes da tela corretamente', () => {
    // ARRANGE (Preparar o ambiente)
    const { getByPlaceholderText, getByText } = render(<Login />);
    
    // ASSERT (Verificar os resultados esperados)
    expect(getByPlaceholderText('seu@email.com')).toBeTruthy();
    expect(getByPlaceholderText('Sua senha')).toBeTruthy();
    expect(getByText('Entrar')).toBeTruthy();
  });

  /**
   * TESTE 02: Validação de Campos Vazios
   */
  it('2. Deve validar se os campos obrigatórios estão preenchidos', async () => {
    // ARRANGE
    const alertSpy = jest.spyOn(Alert, 'alert'); // Espiona o alerta do sistema
    const { getByText } = render(<Login />);
    const botaoEntrar = getByText('Entrar');

    // ACT (Executar a ação do usuário)
    fireEvent.press(botaoEntrar);

    // ASSERT
    expect(alertSpy).toHaveBeenCalledWith('Erro', 'Preencha todos os campos');
    expect(apiLogin).not.toHaveBeenCalled(); // Garante que a API não foi chamada
    
    alertSpy.mockRestore(); // Limpa a espionagem
  });

  /**
   * TESTE 03: Validação de Regra de Negócio (Senha Curta)
   */
  it('3. Deve validar se a senha possui o tamanho mínimo de 6 caracteres', async () => {
    // ARRANGE
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByPlaceholderText, getByText } = render(<Login />);
    
    // ACT
    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'aluno@tecnico.com');
    fireEvent.changeText(getByPlaceholderText('Sua senha'), '123'); // Senha abaixo do permitido
    fireEvent.press(getByText('Entrar'));

    // ASSERT
    expect(alertSpy).toHaveBeenCalledWith('Erro', 'A senha deve ter pelo menos 6 caracteres');
    expect(apiLogin).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  /**
   * TESTE 04: Tratamento de Erros da API
   */
  it('4. Deve exibir erro quando as credenciais forem inválidas (Usuário não existe)', async () => {
    // ARRANGE
    apiLogin.mockRejectedValueOnce({ message: 'Usuário não encontrado' }); // Simula erro de API
    const { getByPlaceholderText, getByText, findByText } = render(<Login />);
    
    // ACT
    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'email@errado.com');
    fireEvent.changeText(getByPlaceholderText('Sua senha'), 'senha1234');
    fireEvent.press(getByText('Entrar'));

    // ASSERT
    const mensagemErro = await findByText('Usuário não encontrado');
    expect(mensagemErro).toBeTruthy();
  });

  /**
   * TESTE 05: Sucesso no Login
   */
  it('5. Deve realizar o login com sucesso e navegar para a Home', async () => {
    // ARRANGE
    const dadosUsuarioMock = { id: 1, name: 'Aluno Técnico' };
    apiLogin.mockResolvedValueOnce(dadosUsuarioMock); // Simula retorno positivo da API
    const { getByPlaceholderText, getByText } = render(<Login />);
    
    // ACT
    fireEvent.changeText(getByPlaceholderText('seu@email.com'), 'teste@exemplo.com');
    fireEvent.changeText(getByPlaceholderText('Sua senha'), 'senha123');
    fireEvent.press(getByText('Entrar'));

    // ASSERT
    await waitFor(() => {
      // Verifica se a API recebeu os dados corretos
      expect(apiLogin).toHaveBeenCalledWith({
        email: 'teste@exemplo.com',
        password: 'senha123',
      });
      // Verifica se o estado global de autenticação foi atualizado
      expect(mockLogin).toHaveBeenCalledWith(dadosUsuarioMock);
      // Verifica se o sistema redirecionou para a página inicial
      expect(mockReplace).toHaveBeenCalledWith('/home');
    });
  });
});
