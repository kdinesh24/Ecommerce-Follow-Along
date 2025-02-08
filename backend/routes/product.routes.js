const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');

// Create a product (image optional)
router.post('/products', upload.single('image'), productController.createProduct);

// Get all products
router.get('/products', (req, res, next) => {
    if (req.file) {
        upload.single('image')(req, res, next);
    } else {
        next();
    }
}, productController.getProducts);


router.get('/products/:id', productController.getProductById);

// Update a product (image optional)
router.put('/products/:id', upload.single('image'), productController.updateProduct);

// Delete a product
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
