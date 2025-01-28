const Product = require('../models/product.model');

const productController = {
    // Create new product
    createProduct: async (req, res) => {
        try {
            const { name, description, price, category, stock, images } = req.body;

            // Basic validation
            if (!name || !description || !price || !category || stock === undefined || !images || images.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide all required fields'
                });
            }

            // Create new product
            const product = await Product.create({
                name,
                description,
                price,
                category,
                stock,
                images
            });

            res.status(201).json({
                success: true,
                product,
                message: 'Product created successfully'
            });

        } catch (error) {
            // Handle mongoose validation errors
            if (error.name === 'ValidationError') {
                const messages = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({
                    success: false,
                    message: messages
                });
            }

            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get all products
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find();
            res.status(200).json({
                success: true,
                count: products.length,
                products
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    },

    // Get single product
    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            res.status(200).json({
                success: true,
                product
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error',
                error: error.message
            });
        }
    }
};

module.exports = productController;