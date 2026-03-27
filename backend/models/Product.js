const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  section: {
    type: String,
    enum: ['mujer', 'hombre', 'ninos', 'ofertas', 'novedades', 'general'],
    default: 'general'
  },
  pageTarget: {
    type: String,
    enum: [
      'camisas.html',
      'camisetas.html',
      'camisetas-niños.html',
      'chaquetas.html',
      'chaquetas-niño.html',
      'pantalones-hombre.html',
      'Pantalones-mujer.html',
      'pantalones-niña.html',
      'pantalones-niño.html',
      'tops.html',
      'tops-niña.html',
      'Trajes.html',
      'vestidos.html',
      'vestidos-niñas.html',
      'novedades.html',
      'ofertas.html',
      'colecciones.html',
      'index.html'
    ],
    default: 'index.html'
  },
  image: { type: String, default: '' },
  description: { type: String, default: '', trim: true },
  price: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 90 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);