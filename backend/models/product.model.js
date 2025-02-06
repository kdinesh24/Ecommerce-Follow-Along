// models/product.model.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['clothing', 'perfume', 'shoe']
  },
  subcategory: {
    type: String,
    required: true,
    enum: ['men', 'women', 'unisex']
  },
  imageUrl: {
    type: String,
    default: ''
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);