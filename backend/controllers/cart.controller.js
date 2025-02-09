const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.userId; // Extract user ID from authentication middleware

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const existingItem = cart.items.find(item => item.productId.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get user cart
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.productId");
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Remove an item from cart
exports.removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
