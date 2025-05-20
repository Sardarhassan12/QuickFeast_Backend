const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  menuId: { type: String, required: true },
  tableNumber: { type: Number, required: true },
  items: [{
    itemId: { type: String, required: true },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);