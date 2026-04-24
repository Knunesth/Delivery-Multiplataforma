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

exports.updateAddress = async (req, res) => {
  const { id } = req.params;
  const { label, street, number, complement, neighborhood, city, isDefault, userId } = req.body;
  try {
    if (isDefault) {
      await db.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [userId]);
    }

    await db.query(
      'UPDATE addresses SET label = ?, street = ?, number = ?, complement = ?, neighborhood = ?, city = ?, is_default = ? WHERE id = ?',
      [label, street, number, complement, neighborhood, city, isDefault, id]
    );
    res.json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  const { id } = req.params;
  console.log('Tentando deletar endereço com ID:', id);
  try {
    const [result] = await db.query('DELETE FROM addresses WHERE id = ?', [id]);
    console.log('Resultado da deleção:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Endereço não encontrado' });
    }
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Erro ao deletar endereço no banco:', error);
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
