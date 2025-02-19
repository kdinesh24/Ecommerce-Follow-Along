const Order = require('../models/Order');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

const orderController = {
  createOrder: async (req, res) => {
    try {
      // Support both authentication patterns (req.user._id and req.userId)
      const userId = req.user?._id || req.userId;
      
      if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
      }
      
      const { deliveryAddress } = req.body;

      // Validate delivery address
      if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city || 
          !deliveryAddress.state || !deliveryAddress.zipCode || !deliveryAddress.country) {
        return res.status(400).json({ message: 'Invalid delivery address' });
      }

      // Get cart and populate product details
      const cart = await Cart.findOne({ userId }).populate('items.productId');
      
      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }

      // Filter valid items
      const validItems = cart.items.filter(item => item && item.productId);
      if (validItems.length === 0) {
        return res.status(400).json({ message: 'No valid products in cart' });
      }

      // Map products for order - without seller dependency
      const products = validItems.map(item => ({
        product: item.productId._id,
        quantity: item.quantity || 1,
        price: item.productId.price || 0
      }));

      // Calculate total amount
      const totalAmount = validItems.reduce((total, item) =>
        total + ((item.productId.price || 0) * (item.quantity || 1)), 0);

      // Create new order without requiring seller
      const order = new Order({
        user: userId,
        // Make seller optional
        products,
        deliveryAddress,
        totalAmount,
        status: 'pending',
        progressStatus: 25
      });

      await order.save();

      // Clear the cart
      await Cart.findOneAndUpdate(
        { userId },
        { $set: { items: [] } }
      );

      res.status(201).json({
        message: 'Order placed successfully',
        order
      });
    } catch (error) {
      console.error('Order creation error:', error);
      res.status(500).json({ 
        message: 'Error creating order',
        error: error.message 
      });
    }
  },

  // ... keep other methods the same ...
  getUserOrders: async (req, res) => {
    try {
      const userId = req.user?._id || req.userId;
      const orders = await Order.find({ user: userId })
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
      const userId = req.user?._id || req.userId;
      const order = await Order.findOne({
        _id: req.params.orderId,
        user: userId
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
  },
  
  cancelOrder: async (req, res) => {
    try {
        const { orderId } = req.params;
        const { cancelReason, cancelDescription } = req.body;
        const userId = req.user?._id || req.userId;

        if (!cancelReason || !cancelDescription) {
            return res.status(400).json({ message: 'Cancellation reason and description are required' });
        }

        const validReasons = ['changed_mind', 'wrong_item', 'delivery_time_too_long', 'found_better_price', 'other'];
        if (!validReasons.includes(cancelReason)) {
            return res.status(400).json({ message: 'Invalid cancellation reason' });
        }

        const order = await Order.findOne({
            _id: orderId,
            user: userId,
            status: { $in: ['pending', 'processing'] }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or cannot be cancelled' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            {
                $set: {
                    status: 'cancelled',
                    cancelReason,
                    cancelDescription,
                    progressStatus: 0
                }
            },
            { new: true }
        );

        res.json({ message: 'Order cancelled successfully', order: updatedOrder });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Error cancelling order' });
    }
  },

  updateOrderStatusAsSeller: async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const userId = req.user?._id || req.userId;

      // Verify user is seller
      if (!req.user?.isSeller) {
        return res.status(403).json({ message: 'Only sellers can update order status' });
      }

      const order = await Order.findOne({
        _id: orderId,
        seller: userId
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update progress status based on order status
      const progressMap = {
        'pending': 25,
        'processing': 50,
        'shipped': 75,
        'success': 100,
        'delivered': 100
      };

      order.status = status;
      order.progressStatus = progressMap[status] || 25;
      await order.save();

      res.json({ message: 'Order status updated', order });
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ message: 'Error updating order status' });
    }
  }
};
  
module.exports = orderController;