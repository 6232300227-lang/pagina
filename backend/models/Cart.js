const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String },
  qty: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  userEmail: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CartItem', CartItemSchema);
