const db = require('../config/db');

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  const { name, price, rating, reviews, time, imageUrl, isEco, description, ingredients } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO products (name, price, rating, reviews, time, imageUrl, isEco, description, ingredients) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, price, rating, reviews, time, imageUrl, isEco, description, JSON.stringify(ingredients)]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
