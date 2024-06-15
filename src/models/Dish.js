const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	imageUrl: { type: String },
	restaurant: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Restaurant",
		required: true,
	},
});

module.exports = mongoose.model("Dish", dishSchema);
