const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const orderMiddleware = require('../middleware/orderMiddleware');

// All routes require authentication
router.use(orderMiddleware);

// Create new order
router.post('/', orderController.createOrder);

// Get all orders for the logged-in user
router.get('/', orderController.getUserOrders);

// Get specific order details
router.get('/:orderId', orderController.getOrderDetails);

// Update order status (could add admin middleware here)
router.post('/:orderId/cancel', orderController.cancelOrder);
router.patch('/:orderId/seller-status', orderController.updateOrderStatusAsSeller);

module.exports = router;