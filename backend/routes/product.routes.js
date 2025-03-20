const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const upload = require('../middleware/upload.middleware');


router.post('/products', upload.single('image'), productController.createProduct);


router.get('/products', (req, res, next) => {
    if (req.file) {
        upload.single('image')(req, res, next);
    } else {
        next();
    }
}, productController.getProducts);


router.get('/products/:id', productController.getProductById);


router.put('/products/:id', upload.single('image'), productController.updateProduct);


router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
