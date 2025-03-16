const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const orderMiddleware = require('../middleware/orderMiddleware');


router.use(orderMiddleware);


router.post('/', orderController.createOrder);


router.get('/', orderController.getUserOrders);


router.get('/:orderId', orderController.getOrderDetails);


router.post('/:orderId/cancel', orderController.cancelOrder);
router.patch('/:orderId/seller-status', orderController.updateOrderStatusAsSeller);

module.exports = router;