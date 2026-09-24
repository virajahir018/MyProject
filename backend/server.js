require("dotenv").config();

const express = require("express");
const session = require("express-session");

const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRouters = require("./routes/userRoutes");
const cartRouters = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const port = 3000;

app.use(express.json());
app.use(session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false
}))

app.use("/products", productRoutes)
app.use("/users", userRouters)
app.use("/cart", cartRouters)
app.use("/order", orderRoutes)

connectDB();

app.get("/user", (req, res) => {
    res.send("App is Running");
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})