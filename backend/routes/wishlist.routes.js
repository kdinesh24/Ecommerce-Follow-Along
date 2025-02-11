const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlist.controller');
const  wishlistAuth  = require('../middleware/wishlistAuth');

router.get('/', wishlistAuth, wishlistController.getWishlist);
router.post('/toggle', wishlistAuth, wishlistController.toggleProduct);
router.get('/check/:productId', wishlistAuth, wishlistController.checkProduct);

module.exports = router;