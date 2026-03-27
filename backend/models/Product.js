const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  section: {
    type: String,
    enum: ['mujer', 'hombre', 'ninos', 'ofertas', 'novedades', 'general'],
    default: 'general'
  },
  image: { type: String, default: '' },
  description: { type: String, default: '', trim: true },
  price: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 90 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);