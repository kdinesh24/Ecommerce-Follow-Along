const Cart = require("../models/cart.model");

exports.addToCart = async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.userId; // From auth middleware

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
    }

    await cart.save();
    
    // Populate product details before sending response
    const populatedCart = await Cart.findById(cart._id)
      .populate({
        path: "items.productId",
        select: "name description price image"
      });
      
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Add to cart error:", error.message);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    // Get cart for specific user only
    const cart = await Cart.findOne({ userId: req.userId })
      .populate({
        path: "items.productId",
        select: "name description price imageUrl" // Make sure to select the image field
      });
    
    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    console.log('Cart items:', cart.items.map(item => ({
      id: item.productId._id,
      name: item.productId.name,
      imageUrl: item.productId.imageUrl
    })));
    
    res.status(200).json(cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.productId.toString() !== req.params.productId
    );
    
    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate("items.productId");
    res.status(200).json(populatedCart);
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};