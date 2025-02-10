const express = require("express");
const router = express.Router();
const { addToCart, getUserCart, removeFromCart } = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth");

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getUserCart);
router.delete("/remove/:productId", authMiddleware, removeFromCart);

module.exports = router;