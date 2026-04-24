const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

router.get('/user/:userId', addressController.getAddresses);
router.post('/', addressController.createAddress);
router.put('/:id', addressController.updateAddress);
router.delete('/:id', addressController.deleteAddress);
router.put('/default', addressController.setDefaultAddress);

module.exports = router;
