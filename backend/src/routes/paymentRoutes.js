const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Define routes for reading and writing payment methods
router.get('/user/:userId', paymentController.getPaymentMethods);
router.post('/', paymentController.createPaymentMethod);
router.delete('/:id', paymentController.deletePaymentMethod);
router.put('/default', paymentController.setDefaultPaymentMethod);

module.exports = router;
