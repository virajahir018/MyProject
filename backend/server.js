require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRouters = require("./routes/userRoutes");
const userorderRoutes = require("./routes/userorderRoutes");
const cartRouters = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/products", productRoutes)
app.use("/api/users", userRouters)
app.use("/api/order", userorderRoutes)
app.use("/api/cart", cartRouters)
app.use("/order", orderRoutes)

connectDB();

app.get("/user", (req, res) => {
    res.send("App is Running");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})