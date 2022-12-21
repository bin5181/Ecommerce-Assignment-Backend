const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Connecting to Database
connectToMongo();

const app = express();
const port = 5000;

var whitelist = ["http://localhost:3000/", "https://ecommerce-assignment-frontend.vercel.app/"];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Something went wrong"));
        }
    },
};

// To use cors
app.use(cors(corsOptions));

// To use json bodies
app.use(express.json());

// Available Routes
app.use("/auth", require("./Routes/auth"));
app.use("/items", require("./Routes/item"));
app.use("/cart", require("./Routes/cart"));
app.use("/order", require("./Routes/order"));

// Listening
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
