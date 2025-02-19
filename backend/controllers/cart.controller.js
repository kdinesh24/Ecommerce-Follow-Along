const Cart = require('../models/cart.model');
const Product = require('../models/product.model');

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;
        
        console.log('Adding to cart for user:', userId);
        console.log('Product ID:', productId);
        console.log('Quantity:', quantity);

       
        let cart = await Cart.findOne({ userId });
        console.log('Existing cart found:', cart);
        
        if (!cart) {
            cart = new Cart({ 
                userId, 
                items: [] 
            });
            console.log('Created new cart:', cart);
        }

       
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

       
        const cartItemIndex = cart.items.findIndex(
            item => item.productId.toString() === productId
        );

        if (cartItemIndex > -1) {
            
            cart.items[cartItemIndex].quantity = quantity;
            console.log('Updated existing item quantity');
        } else {
          
            cart.items.push({ productId, quantity });
            console.log('Added new item to cart');
        }

        const savedCart = await cart.save();
        console.log('Saved cart:', savedCart);

        // Populate product details before sending response
        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.productId',
                select: 'name price description imageUrl' // Select specific fields
            });

        res.status(200).json(populatedCart);
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.getUserCart = async (req, res) => {
    try {
        const userId = req.userId;
        console.log('Getting cart for user:', userId);

        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.productId',
                select: 'name price description imageUrl'
            });

        console.log('Found cart:', cart);

        if (!cart) {
            console.log('No cart found, returning empty cart');
            return res.status(200).json({ items: [] });
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.userId;
        
        console.log('Removing product from cart for user:', userId);
        console.log('Product ID to remove:', productId);

        const cart = await Cart.findOne({ userId });
        console.log('Found cart:', cart);
        
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

       
        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        );

        const savedCart = await cart.save();
        console.log('Updated cart after removal:', savedCart);

        // Populate product details before sending response
        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.productId',
                select: 'name price description imageUrl'
            });

        res.status(200).json(populatedCart);
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: error.message });
    }
};