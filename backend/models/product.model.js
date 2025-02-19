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
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['clothing', 'perfume', 'shoe'],
    lowercase: true
  },
  subcategory: {
    type: String,
    required: true,
    enum: ['men', 'women', 'unisex'],
    lowercase: true
  },
  imageUrl: {
    type: String,
    required: true,
    get: function(imageUrl) {
      if (imageUrl && !imageUrl.startsWith('http')) {
        return `http://localhost:3000/uploads/${imageUrl}`;
      }
      return imageUrl;
    }
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});


productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);