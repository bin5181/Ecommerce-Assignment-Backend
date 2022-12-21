const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true },
  item: { type: mongoose.Schema.Types.ObjectId, ref: "item", require: true },
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model("cart", CartSchema);