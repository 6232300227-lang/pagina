const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: Number, required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 }
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  subtotal: Number,
  shipping: Number,
  discount: Number,
  total: Number,
  customerInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    zipCode: String
  },
  paymentMethod: String,
  status: {
    type: String,
    enum: ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);