const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

// Create new product
router.post('/products', productController.createProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get single product
router.get('/:id', productController.getProductById);

module.exports = router;