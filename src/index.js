const mongoose = require("mongoose");
const Restaurant = require("./models/Restaurant");
const Dish = require("./models/Dish");
const User = require("./models/User");
const Order = require("./models/Order");
const OrderItem = require("./models/OrderItem");
const { faker } = require("@faker-js/faker");

async function run() {
	await mongoose.connect("mongodb://localhost:27017/test");

	// Create restaurants
	const restaurants = [];
	for (let i = 0; i < 10; i++) {
		const restaurant = new Restaurant({
			name: faker.company.name(),
			description: faker.lorem.sentence(),
			address: faker.location.streetAddress(),
			imageUrl: faker.image.urlLoremFlickr({
				category: "food",
				width: 640,
				height: 480,
			}),
			rating: faker.number.float({ min: 1, max: 5 }),
			isAvailable: faker.datatype.boolean(),
		});
		restaurants.push(restaurant);
	}
	await Restaurant.create(restaurants);

	// Create dishes
	const dishes = [];
	for (let i = 0; i < restaurants.length; i++) {
		for (let j = 0; j < 5; j++) {
			const dish = new Dish({
				name: faker.lorem.words(2),
				description: faker.lorem.sentence(),
				price: faker.commerce.price({ min: 1, max: 10, dec: 2 }),
				imageUrl: faker.image.urlLoremFlickr({
					category: "food",
					width: 640,
					height: 480,
				}),
				restaurant: restaurants[i],
			});
			dishes.push(dish);
		}
	}
	await Dish.create(dishes);

	// Create users
	const users = [];
	for (let i = 0; i < 20; i++) {
		const user = new User({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			phoneNumber: faker.phone.number(),
			address: faker.location.streetAddress(),
		});
		users.push(user);
	}
	await User.create(users);

	// Create orders
	const orders = [];
	for (let i = 0; i < users.length; i++) {
		const numOrders = faker.number.int({ min: 1, max: 3 });
		for (let j = 0; j < numOrders; j++) {
			const randomRestaurant = faker.helpers.arrayElement(restaurants);
			const randomDishes = faker.helpers.arrayElements(
				dishes.filter((d) => d.restaurant.equals(randomRestaurant)),
				faker.number.int({ min: 1, max: 3 })
			);

			const order = new Order({
				orderDate: faker.date.past(),
				status: faker.helpers.arrayElement([
					"New",
					"In progress",
					"Out for delivery",
					"Delivered",
					"Cancelled",
				]),
				totalPrice: 0,
				user: users[i],
				restaurant: randomRestaurant,
			});

			await order.save();
			orders.push(order);

			const orderItems = randomDishes.map((dish) => {
				const orderItem = new OrderItem({
					quantity: faker.number.int({ min: 1, max: 5 }),
					dish: dish,
					order: order,
				});
				return orderItem;
			});

			await OrderItem.create(orderItems);

			order.totalPrice = orderItems.reduce(
				(sum, item) => sum + item.quantity * item.dish.price,
				0
			);
			await order.save();
		}
	}

	// Count all restaurants
	const countRestaurants = await Restaurant.countDocuments();
	console.log("Count restaurants:", countRestaurants);

	// Read a specific order by ID
	const order = await Order.findById(orders[0]._id)
		.populate("user")
		.populate("restaurant")
		.populate("orderItems");
	console.log("Order:", order);

	// Update a dish's price
	const updatedDish = await Dish.findByIdAndUpdate(
		dishes[0]._id,
		{ price: 9.99 },
		{ new: true }
	);
	console.log("Updated Dish:", updatedDish);

	// Delete a user and their orders
	const deletedUser = await User.findByIdAndDelete(users[0]._id);
	await Order.deleteMany({ user: deletedUser._id });
}

run()
	.catch(console.error)
	.finally(async () => await mongoose.disconnect());
