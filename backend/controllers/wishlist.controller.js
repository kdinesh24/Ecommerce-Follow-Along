const Wishlist = require('../models/wishlist.model');
const mongoose = require('mongoose');

const wishlistController = {
  getWishlist: async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ user: req.user._id })
        .populate({
          path: 'products',
          select: '_id name description price image category subcategory inStock'
        });
      
      res.json(wishlist ? wishlist.products : []);
    } catch (error) {
      console.error('Wishlist fetch error:', error);
      res.status(500).json({ message: "Error fetching wishlist" });
    }
  },

  toggleProduct: async (req, res) => {
    try {
      const { productId } = req.body;
      const userId = req.user._id;

    
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }

     
      let wishlist = await Wishlist.findOne({ user: userId });
      
      if (!wishlist) {
        wishlist = new Wishlist({ 
          user: userId, 
          products: [productId] 
        });
        await wishlist.save();
        return res.json([productId]);
      }

      
      const productObjectId = new mongoose.Types.ObjectId(productId);
      const productIndex = wishlist.products.findIndex(
        id => id.equals(productObjectId)
      );

      if (productIndex === -1) {
       
        wishlist.products.push(productObjectId);
      } else {
      
        wishlist.products.splice(productIndex, 1);
      }

      await wishlist.save();
      
    
      res.json(wishlist.products);
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      res.status(500).json({ message: "Error updating wishlist" });
    }
  },

  checkProduct: async (req, res) => {
    try {
      const { productId } = req.params;
      const wishlist = await Wishlist.findOne({ user: req.user._id });
      
      const isInWishlist = wishlist 
        ? wishlist.products.some(id => id.toString() === productId)
        : false;
      
      res.json({ isInWishlist });
    } catch (error) {
      console.error('Wishlist check error:', error);
      res.status(500).json({ message: "Error checking product status" });
    }
  }
};

module.exports = wishlistController;