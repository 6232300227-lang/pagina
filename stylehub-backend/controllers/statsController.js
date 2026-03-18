const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getStats = async (req, res) => {
  try {
    // Total de productos en la base de datos
    const totalProducts = await Product.countDocuments();

    // Total de productos vendidos: suma de quantity en todos los items de todas las órdenes
    const orders = await Order.find();
    let totalSold = 0;
    orders.forEach(order => {
      order.items.forEach(item => {
        totalSold += item.quantity;
      });
    });

    // También podemos devolver cantidad de órdenes
    const totalOrders = orders.length;

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalSold,
        totalOrders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};