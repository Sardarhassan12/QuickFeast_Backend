const { model, Schema } = require("mongoose");

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String, 
        required: true
    },
    availability: {
        type: String,
        enum: ['available', 'notAvailable'],
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    menuId: {
        type: Schema.Types.ObjectId,
        ref: 'Menu',
        default: null
      }
      
}, { timestamps: true });

module.exports = model("Item", itemSchema);
