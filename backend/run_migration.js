const db = require('./src/config/db');

const query = `
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
)
`;

async function run() {
  try {
    await db.query(query);
    console.log('Payment methods table created successfully');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    process.exit();
  }
}

run();
