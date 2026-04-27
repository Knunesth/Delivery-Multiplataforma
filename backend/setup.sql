CREATE DATABASE IF NOT EXISTS delivery_db;
USE delivery_db;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  rating DECIMAL(3, 2),
  reviews INT,
  time VARCHAR(50),
  imageUrl TEXT,
  isEco BOOLEAN DEFAULT FALSE,
  description TEXT,
  ingredients TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  label VARCHAR(100) NOT NULL, -- ex: Home, Work
  street VARCHAR(255) NOT NULL,
  number VARCHAR(50) NOT NULL,
  complement VARCHAR(100),
  neighborhood VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS payment_methods (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  type VARCHAR(50) NOT NULL,
  brand VARCHAR(50),
  last_digits VARCHAR(4),
  label VARCHAR(100),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  address_id INT,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (address_id) REFERENCES addresses(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Inserção de dados iniciais (Seed)
INSERT INTO products (name, price, rating, reviews, time, imageUrl, isEco, description, ingredients) VALUES
('Eco Burger Clássico', 32.90, 4.8, 124, '20-30 min', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800', 1, 'Pão artesanal de fermentação natural, hambúrguer "future meat" suculento, queijo vegano derretido, alface orgânica, tomate e nosso molho da casa.', '["🍔 Pão vegano","🥩 Future meat 150g","🧀 Queijo de castanhas","🥗 Alface e tomate orgânicos"]'),
('Wrap Vegano da Casa', 28.50, 4.6, 89, '15-25 min', 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800', 1, 'Massa integral fina recheada com grão de bico temperado, abacate fresco, espinafre, pimentões e um toque de tahine.', '["🌯 Massa integral","🥑 Abacate Fresco","🌱 Grão de bico","🥬 Espinafre e Tahine"]'),
('Batata Rústica Assada', 15.00, 4.9, 210, '15-20 min', 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=800', 0, 'Nossas famosas batatas rústicas com casca, assadas com azeite de oliva e alecrim colhido no dia. Acompanha maionese verde.', '["🥔 Batatas com casca","🌿 Alecrim fresco","🫒 Azeite de oliva","🍋 Maionese verde"]'),
('Suco Natural Verde', 12.00, 4.7, 156, '5-10 min', 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800', 1, 'Refrescante e altamente nutritivo: maçã verde, couve manteiga, limão cravo e um leve toque de gengibre silvestre.', '["🍏 Maçã Verde","🥬 Couve orgânica","🍋 Limão","🫚 Gengibre"]'),
('Salada Orgânica Fresca', 24.90, 4.5, 67, '10-15 min', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800', 1, 'Um prato leve para qualquer momento do dia! Mix de folhas colhidas em hortas locais, tomatinhos cereja, croutons e molho mostarda e mel vegano.', '["🥗 Mix de Folhas","🍅 Tomate Cereja","🍞 Croutons","🍯 Molho Doce vegano"]'),
('Milkshake de Morango Plant-based', 18.00, 4.8, 320, '10-20 min', 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800', 1, 'Milkshake denso e cremoso batido com leite de aveia premium, morangos orgânicos esmagados e calda zero açúcar.', '["🍓 Morangos Frescos","🥛 Leite de Aveia","🥥 Creme vegetal","✨ Calda Artesanal"]'),
('Pizza Margherita Vegana', 45.00, 4.9, 412, '30-40 min', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800', 1, 'A clássica italiana, com massa de fermentação prolongada elaborada com trigo moído na pedra, molho de tomate san marzano e queijo vegetal tipo muçarela com bastante manjericão fresco.', '["🍕 Massa de fermentação longa","🍅 Molho Rústico","🧀 Queijo vegano","🌿 Manjericão fresco"]'),
('Nuggets Verdes (Falafel)', 22.00, 4.4, 95, '15-25 min', 'https://images.unsplash.com/photo-1593010916053-5d518d6ee948?auto=format&fit=crop&q=80&w=800', 1, 'Porção com 8 deliciosos e crocantes mini hambúrguers de grão de bico assados. Rico em proteínas vegetais.', '["🌱 Massa de grão de bico","🧄 Alho & Ervas","🌿 Cheiro-verde verde fresco"]'),
('Brownie de Cacau 100%', 14.50, 4.7, 231, '10-15 min', 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800', 0, 'Doce, mas sem exageros. Nosso brownie molhadinho derrete na boca. Feito usando cacau amazônico sustentável.', '["🍫 Cacau 100% da Amazônia","🌰 Nozes moídas","🌾 Farinha especial","🍯 Xarope de Agave"]'),
('Kombucha Artesanal', 16.00, 4.6, 87, '05-10 min', 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=800', 1, 'Sua digestão nunca mais será a mesma! Bebida probiótica gelifificada naturalmente com frutas cítricas da estação.', '["🍵 Chá Verde fermentado","🍊 Frutas Cítricas","🫧 Gás Natural"]');
