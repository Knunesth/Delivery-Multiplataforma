const db = require('./src/config/db');

const products = [
  {
    name: 'Eco Burger Clássico',
    price: 32.90,
    rating: 4.8,
    reviews: 124,
    time: '20-30 min',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    isEco: true,
    description: 'Pão artesanal de fermentação natural, hambúrguer "future meat" suculento, queijo vegano derretido, alface orgânica, tomate e nosso molho da casa.',
    ingredients: ['🍔 Pão vegano', '🥩 Future meat 150g', '🧀 Queijo de castanhas', '🥗 Alface e tomate orgânicos']
  },
  {
    name: 'Wrap Vegano da Casa',
    price: 28.50,
    rating: 4.6,
    reviews: 89,
    time: '15-25 min',
    imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800',
    isEco: true,
    description: 'Massa integral fina recheada com grão de bico temperado, abacate fresco, espinafre, pimentões e um toque de tahine.',
    ingredients: ['🌯 Massa integral', '🥑 Abacate Fresco', '🌱 Grão de bico', '🥬 Espinafre e Tahine']
  },
  {
    name: 'Batata Rústica Assada',
    price: 15.00,
    rating: 4.9,
    reviews: 210,
    time: '15-20 min',
    imageUrl: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&q=80&w=800',
    isEco: false,
    description: 'Nossas famosas batatas rústicas com casca, assadas com azeite de oliva e alecrim colhido no dia. Acompanha maionese verde.',
    ingredients: ['🥔 Batatas com casca', '🌿 Alecrim fresco', '🫒 Azeite de oliva', '🍋 Maionese verde']
  },
  {
    name: 'Suco Natural Verde',
    price: 12.00,
    rating: 4.7,
    reviews: 156,
    time: '5-10 min',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800',
    isEco: true,
    description: 'Refrescante e altamente nutritivo: maçã verde, couve manteiga, limão cravo e um leve toque de gengibre silvestre.',
    ingredients: ['🍏 Maçã Verde', '🥬 Couve orgânica', '🍋 Limão', '🫚 Gengibre']
  },
  {
    name: 'Salada Orgânica Fresca',
    price: 24.90,
    rating: 4.5,
    reviews: 67,
    time: '10-15 min',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800',
    isEco: true,
    description: 'Um prato leve para qualquer momento do dia! Mix de folhas colhidas em hortas locais, tomatinhos cereja, croutons e molho mostarda e mel vegano.',
    ingredients: ['🥗 Mix de Folhas', '🍅 Tomate Cereja', '🍞 Croutons', '🍯 Molho Doce vegano']
  },
  {
    name: 'Milkshake de Morango Plant-based',
    price: 18.00,
    rating: 4.8,
    reviews: 320,
    time: '10-20 min',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    isEco: true,
    description: 'Milkshake denso e cremoso batido com leite de aveia premium, morangos orgânicos esmagados e calda zero açúcar.',
    ingredients: ['🍓 Morangos Frescos', '🥛 Leite de Aveia', '🥥 Creme vegetal', '✨ Calda Artesanal']
  },
  {
    name: 'Pizza Margherita Vegana',
    price: 45.00,
    rating: 4.9,
    reviews: 412,
    time: '30-40 min',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
    isEco: true,
    description: 'A clássica italiana, com massa de fermentação prolongada elaborada com trigo moído na pedra, molho de tomate san marzano e queijo vegetal tipo muçarela com bastante manjericão fresco.',
    ingredients: ['🍕 Massa de fermentação longa', '🍅 Molho Rústico', '🧀 Queijo vegano', '🌿 Manjericão fresco']
  },
  {
    name: 'Nuggets Verdes (Falafel)',
    price: 22.00,
    rating: 4.4,
    reviews: 95,
    time: '15-25 min',
    imageUrl: 'https://images.unsplash.com/photo-1593010916053-5d518d6ee948?auto=format&fit=crop&q=80&w=800',
    isEco: true,
    description: 'Porção com 8 deliciosos e crocantes mini hambúrguers de grão de bico assados. Rico em proteínas vegetais.',
    ingredients: ['🌱 Massa de grão de bico', '🧄 Alho & Ervas', '🌿 Cheiro-verde verde fresco']
  },
  {
    name: 'Brownie de Cacau 100%',
    price: 14.50,
    rating: 4.7,
    reviews: 231,
    time: '10-15 min',
    imageUrl: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&q=80&w=800',
    isEco: false,
    description: 'Doce, mas sem exageros. Nosso brownie molhadinho derrete na boca. Feito usando cacau amazônico sustentável.',
    ingredients: ['🍫 Cacau 100% da Amazônia', '🌰 Nozes moídas', '🌾 Farinha especial', '🍯 Xarope de Agave']
  },
  {
    name: 'Kombucha Artesanal',
    price: 16.00,
    rating: 4.6,
    reviews: 87,
    time: '05-10 min',
    imageUrl: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=800',
    isEco: true,
    description: 'Sua digestão nunca mais será a mesma! Bebida probiótica gelifificada naturalmente com frutas cítricas da estação.',
    ingredients: ['🍵 Chá Verde fermentado', '🍊 Frutas Cítricas', '🫧 Gás Natural']
  }
];

async function seed() {
  try {
    for (const product of products) {
      await db.query(
        'INSERT INTO products (name, price, rating, reviews, time, imageUrl, isEco, description, ingredients) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [product.name, product.price, product.rating, product.reviews, product.time, product.imageUrl, product.isEco, product.description, JSON.stringify(product.ingredients)]
      );
    }
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
