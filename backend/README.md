# Delivery App Backend

Backend desenvolvido em Node.js com MySQL para o projeto Delivery Multiplataforma.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução.
- **Express**: Framework para criação de rotas e APIs.
- **MySQL**: Banco de dados relacional.
- **mysql2**: Driver MySQL para Node.js com suporte a Promises.
- **dotenv**: Gerenciamento de variáveis de ambiente.
- **cors**: Middleware para habilitar Cross-Origin Resource Sharing.

## Pré-requisitos

- Node.js instalado.
- Servidor MySQL rodando (ex: XAMPP, WAMP, ou MySQL Installer).

## Configuração

1.  Crie um banco de dados chamado `delivery_db` no seu MySQL.
2.  Configure o arquivo `.env` com suas credenciais do banco de dados:
    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=sua_senha
    DB_NAME=delivery_db
    ```
3.  Instale as dependências:
    ```bash
    npm install
    ```
4.  Crie as tabelas necessárias utilizando o script `setup.sql` no seu cliente MySQL ou ferramenta (como phpMyAdmin).
5.  (Opcional) Popule o banco com dados iniciais:
    ```bash
    npm run seed
    ```

## Execução

Para iniciar o servidor em modo de desenvolvimento:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

## Endpoints Principais

- `GET /api/products`: Lista todos os produtos.
- `GET /api/products/:id`: Detalhes de um produto específico.
- `POST /api/orders`: Cria um novo pedido.
