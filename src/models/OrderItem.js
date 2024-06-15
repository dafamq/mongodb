const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
	quantity: { type: Number, required: true },
	order: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Order",
		required: true,
	},
	dish: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Dish",
		required: true,
	},
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
