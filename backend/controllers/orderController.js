const Order = require('../models/Order');
const Cart = require('../models/cart.model');

const orderController = {
    createOrder: async (req, res) => {
        try {
          const userId = req.user._id;
          const { deliveryAddress } = req.body;
      
          // Validate deliveryAddress
          if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || !deliveryAddress.state || !deliveryAddress.zipCode || !deliveryAddress.country) {
            return res.status(400).json({ message: 'Invalid delivery address' });
          }
      
          // Find user's cart and validate it has items - FIX: Use userId instead of user
          const cart = await Cart.findOne({ userId: userId }).populate('items.productId');
          
          console.log('Cart lookup result:', cart);
          
          if (!cart || !cart.items || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
          }
      
          // Make sure all items in cart have valid productId
          const validItems = cart.items.filter(item => item && item.productId);
          if (validItems.length === 0) {
            return res.status(400).json({ message: 'No valid products in cart' });
          }
          
          // Create the products array for the order
          const products = validItems.map(item => ({
            product: item.productId._id,
            quantity: item.quantity || 1,
            price: item.productId.price || 0
          }));
      
          // Calculate total amount
          const totalAmount = validItems.reduce((total, item) =>
            total + ((item.productId.price || 0) * (item.quantity || 1)), 0);
      
          // Create and save the order
          const order = new Order({
            user: userId,
            products,
            deliveryAddress,
            totalAmount,
          });
      
          await order.save();
      
          // Clear the cart after successful order creation - FIX: Use userId instead of user
          await Cart.findOneAndUpdate(
            { userId: userId },
            { $set: { items: [] } }
          );
      
          res.status(201).json({
            message: 'Order placed successfully',
            order
          });
        } catch (error) {
          console.error('Order creation error:', error);
          res.status(500).json({ message: 'Error creating order: ' + error.message });
        }
      },

  // ... other methods remain the same
  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate('products.product')
        .sort({ orderDate: -1 });

      res.json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ message: 'Error fetching orders' });
    }
  },

  getOrderDetails: async (req, res) => {
    try {
      const order = await Order.findOne({
        _id: req.params.orderId,
        user: req.user._id
      }).populate('products.product');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Error fetching order details' });
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid order status' });
      }

      order.status = status;
      await order.save();

      res.json({ message: 'Order status updated', order });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Error updating order status' });
    }
  }
};

module.exports = orderController;