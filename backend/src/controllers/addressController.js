const db = require('../config/db');

exports.getAddresses = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM addresses WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAddress = async (req, res) => {
  const { userId, label, street, number, complement, neighborhood, city, isDefault } = req.body;
  try {
    if (isDefault) {
      await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    }

    const [result] = await db.query(
      'INSERT INTO addresses (user_id, label, street, number, complement, neighborhood, city, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, label, street, number, complement, neighborhood, city, isDefault || false]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM addresses WHERE id = ?', [id]);
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.setDefaultAddress = async (req, res) => {
  const { id, userId } = req.body;
  try {
    await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    await db.query('UPDATE addresses SET is_default = TRUE WHERE id = ?', [id]);
    res.json({ message: 'Default address updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
