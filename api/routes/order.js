const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth')
const orderContrllers = require('../controllers/order_controllers');

router.get('/', checkAuth, orderContrllers.getAllOrders);
router.post('/', checkAuth, orderContrllers.createOrder);
router.get('/:orderId', orderContrllers.getOrderById);
router.delete('/:orderId', checkAuth, orderContrllers.deleteOrder);

module.exports = router; 