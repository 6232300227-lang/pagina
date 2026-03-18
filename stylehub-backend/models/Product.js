const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number },
  image: { type: String },
  rating: { type: Number },
  reviews: { type: Number },
  badge: { type: String },
  category: { type: String },
  subcategory: { type: String },
  // cantidad vendida se manejará aparte en las órdenes
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);