const db = require('./src/config/db');

async function createTestUser() {
  try {
    const email = 'teste@email.com';
    const password = '123';
    const name = 'Usuário Teste';

    const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length === 0) {
      await db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
      );
      console.log('Test user created:');
      console.log('Email: teste@email.com');
      console.log('Senha: 123');
    } else {
      console.log('Test user already exists.');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
