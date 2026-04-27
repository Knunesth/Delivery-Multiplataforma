const db = require('../config/db');

exports.getPaymentMethods = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM payment_methods WHERE user_id = ? ORDER BY is_default DESC, created_at DESC', [userId]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createPaymentMethod = async (req, res) => {
  const { userId, type, brand, last_digits, label, isDefault } = req.body;
  if (!userId || !type || !label) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    if (isDefault) {
      await db.query('UPDATE payment_methods SET is_default = FALSE WHERE user_id = ?', [userId]);
    }

    const defaultVal = isDefault ? 1 : 0;
    const [result] = await db.query(
      'INSERT INTO payment_methods (user_id, type, brand, last_digits, label, is_default) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, type, brand, last_digits, label, defaultVal]
    );
    res.status(201).json({ id: result.insertId, message: 'Payment method created successfully' });
  } catch (error) {
    console.error('Error creating payment method:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deletePaymentMethod = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM payment_methods WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json({ message: 'Payment method deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment method:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.setDefaultPaymentMethod = async (req, res) => {
  const { id, userId } = req.body;
  
  if (!id || !userId) {
    return res.status(400).json({ error: 'Missing id or userId' });
  }

  try {
    await db.query('UPDATE payment_methods SET is_default = FALSE WHERE user_id = ?', [userId]);
    const [result] = await db.query('UPDATE payment_methods SET is_default = TRUE WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment method not found' });
    }
    res.json({ message: 'Default payment method updated successfully' });
  } catch (error) {
    console.error('Error setting default payment:', error);
    res.status(500).json({ error: error.message });
  }
};
