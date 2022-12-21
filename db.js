const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;
console.log(mongoURI);

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Database connected!!!");
  });
};

module.exports = connectToMongo;