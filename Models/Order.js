const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true },
  items: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: "item" },
    quantity: { type: Number, default: 1 }
  }],
  totalItems: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("order", OrderSchema);