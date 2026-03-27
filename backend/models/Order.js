const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String },
  title: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, default: 0 }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
  externalReference: { type: String, required: true, unique: true, index: true },
  preferenceId: { type: String, index: true },
  paymentId: { type: String, index: true },
  paymentStatus: { type: String, default: 'created' },
  paymentStatusDetail: { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending_payment', 'approved', 'pending', 'rejected', 'cancelled'],
    default: 'pending_payment'
  },
  payer: {
    name: { type: String, default: '' },
    email: { type: String, default: '' }
  },
  shippingInfo: {
    fullName: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    zipCode: { type: String, default: '' }
  },
  items: { type: [OrderItemSchema], default: [] },
  summary: {
    subtotal: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  rawPayment: { type: Object, default: null },
  paidAt: { type: Date, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);