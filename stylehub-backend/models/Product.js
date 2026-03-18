const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: String,
  image: String,
  badge: String, // "Nuevo", "Premium", etc.
  inStock: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', productSchema);