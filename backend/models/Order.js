const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    orderId: {
        type: String,
        required: true,
        unique: true
    },

    items: [
        {
            name: {
                type: String,
                required: true
            },

            price: {
                type: Number,
                required: true
            },

            quantity: {
                type: Number,
                required: true
            }
        }
    ],

    total: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        default: "Order Placed"
    },

    date: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;