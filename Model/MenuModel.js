const { Schema, model } = require('mongoose');

const menuSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = model('Menu', menuSchema);
