import Constants from 'expo-constants';

// Se estiver rodando no navegador, usa localhost.
// Se estiver rodando no celular real ou emulador, precisa do IP da sua máquina.
// Substitua o IP abaixo pelo IP da sua máquina (ex: 192.168.1.10) para testar no celular real.
const localhost = '10.15.107.56'; // Tente trocar pelo seu IP se o localhost falhar no celular

export const API_URL = `http://${localhost}:3000/api`;

export async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Falha ao buscar produtos');
    return await response.json();
  } catch (error) {
    console.error('Erro na API de produtos:', error);
    return [];
  }
}

export async function createOrder(orderData: any) {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Falha ao criar pedido');
    return await response.json();
  } catch (error) {
    console.error('Erro na API de pedidos:', error);
    throw error;
  }
}
