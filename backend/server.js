const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const Order = require("./models/Order");
const User = require("./models/User");
const bcrypt = require("bcrypt");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

app.get("/", (req, res) => {
    res.send("Campus Canteen Backend is Running!");
});

app.get("/api/products", async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch products"
        });

    }

});
app.post("/api/orders", async (req, res) => {

    try {

        const { orderId, items, total } = req.body;

        const newOrder = new Order({
            orderId: orderId,
            items: items,
            total: total
        });

        const savedOrder = await newOrder.save();

        res.status(201).json({
            message: "Order placed successfully",
            order: savedOrder
        });

    } catch (error) {

        console.error("Error placing order:", error);

        res.status(500).json({
            message: "Failed to place order"
        });

    }

});
app.get("/api/orders", async (req, res) => {

    try {

        const orders = await Order.find()
            .sort({ date: -1 });

        res.json(orders);

    } catch (error) {

        console.error("Error fetching orders:", error);

        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
});
app.put("/api/orders/:id", async (req, res) => {

    try {

        const { status } = req.body;

        const order =
    await Order.findByIdAndUpdate(
        req.params.id,
        { status: status },
        { returnDocument: "after" }
    );
        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json({
            message: "Order status updated",
            order: order
        });

    } catch (error) {

        console.error(
            "Error updating order:",
            error
        );

        res.status(500).json({
            message: "Failed to update order"
        });
    }
});
app.delete("/api/orders/:id", async (req, res) => {

    try {

        const order =
            await Order.findByIdAndDelete(
                req.params.id
            );

        if (!order) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json({
            message: "Order deleted successfully"
        });

    } catch (error) {

        console.error(
            "Error deleting order:",
            error
        );

        res.status(500).json({
            message: "Failed to delete order"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
app.post("/api/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check whether user already exists
        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash the password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create user
        const user =
            new User({
                name: name,
                email: email,
                password: hashedPassword
            });

        // Save user in MongoDB
        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {

        console.error(
            "Signup error:",
            error
        );

        res.status(500).json({
            message: "Signup failed"
        });
    }
});
app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user by email
        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare entered password with hashed password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(
            "Login error:",
            error
        );

        res.status(500).json({
            message: "Login failed"
        });
    }
});