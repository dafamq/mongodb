const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		orderDate: { type: Date, default: Date.now },
		status: {
			type: String,
			enum: [
				"New",
				"In progress",
				"Out for delivery",
				"Delivered",
				"Cancelled",
			],
			default: "New",
		},
		totalPrice: { type: Number, required: true },
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		restaurant: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Restaurant",
			required: true,
		},
	},
	{ toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

orderSchema.virtual("orderItems", {
	ref: "OrderItem",
	localField: "_id",
	foreignField: "order",
});

module.exports = mongoose.model("Order", orderSchema);
