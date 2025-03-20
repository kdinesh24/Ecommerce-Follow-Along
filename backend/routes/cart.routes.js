const express = require("express");
const router = express.Router();
const { addToCart, getUserCart, removeFromCart } = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getUserCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);


router.post('/clear', authMiddleware, async (req, res) => {
    try {
      await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $set: { items: [] } }
      );
      res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Error clearing cart' });
    }
  });

module.exports = router;