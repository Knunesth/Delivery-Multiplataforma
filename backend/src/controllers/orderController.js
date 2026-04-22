const db = require('../config/db');

exports.createOrder = async (req, res) => {
  const { userId, items, total } = req.body;
  try {
    // Start transaction
    await db.query('START TRANSACTION');

    const [orderResult] = await db.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [userId, total, 'pending']
    );
    
    const orderId = orderResult.insertId;

    const itemPromises = items.map(item => {
      return db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.id, item.quantity, item.price]
      );
    });

    await Promise.all(itemPromises);
    await db.query('COMMIT');

    res.status(201).json({ id: orderId, message: 'Order created successfully' });
  } catch (error) {
    await db.query('ROLLBACK');
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [order] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (order.length === 0) return res.status(404).json({ message: 'Order not found' });

    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    
    res.json({ ...order[0], items });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
