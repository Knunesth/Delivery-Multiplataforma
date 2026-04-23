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

exports.getUserOrders = async (req, res) => {
  const { userId } = req.params;
  try {
    const [results] = await db.query(`
      SELECT 
        o.id as orderId, o.total, o.status, o.created_at,
        oi.id as itemId, oi.product_id, oi.quantity, oi.price as itemPrice,
        p.name as productName, p.imageUrl
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `, [userId]);

    // Group items by order
    const ordersMap = results.reduce((acc, row) => {
      if (!acc[row.orderId]) {
        acc[row.orderId] = {
          id: row.orderId,
          total: row.total,
          status: row.status,
          date: row.created_at,
          items: []
        };
      }
      if (row.itemId) {
        acc[row.orderId].items.push({
          id: row.itemId,
          productId: row.product_id,
          name: row.productName,
          quantity: row.quantity,
          price: row.itemPrice,
          imageUrl: row.imageUrl
        });
      }
      return acc;
    }, {});

    res.json(Object.values(ordersMap));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
