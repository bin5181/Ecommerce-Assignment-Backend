const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Connecting to Database
connectToMongo();

const app = express();
const port = process.env.PORT || 5000;

// To use cors
app.use(cors({origin: ["http://localhost:3000/", "https://ecommerce-assignment-frontend.vercel.app/"]}));

// To use json bodies
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*")
//   next();
// })

// Available Routes
app.use("/auth", require("./Routes/auth"));
app.use("/items", require("./Routes/item"));
app.use("/cart", require("./Routes/cart"));
app.use("/order", require("./Routes/order"));

// Listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
