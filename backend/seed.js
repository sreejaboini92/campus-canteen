const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");

dotenv.config();

const products = [
    {
        name: "Veg Biryani",
        price: 80,
        category: "meals",
        image: "images/biryani.jpeg"
    },
    {
        name: "Burger",
        price: 60,
        category: "snacks",
        image: "images/burger.jpeg"
    },
    {
        name: "Masala Dosa",
        price: 50,
        category: "breakfast",
        image: "images/dosa.jpeg"
    }
];

async function seedDatabase() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log("Products inserted successfully");

        await mongoose.connection.close();

    } catch (error) {

        console.error("Error:", error);

    }
}

seedDatabase();