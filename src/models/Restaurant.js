const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
	name: { type: String, required: true },
	description: { type: String, required: true },
	address: { type: String, required: true },
	imageUrl: { type: String },
	rating: { type: Number, default: 0 },
	isAvailable: { type: Boolean, default: false },
});

module.exports = mongoose.model("Restaurant", restaurantSchema);
