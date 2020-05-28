const mongoose = require("mongoose");
const config = require("config");

const db = config.get("mongoURI");

const connectDB = async () => {
  const mongoOptions = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  };
  try {
    await mongoose.connect(db, mongoOptions);
    console.log("MondoDB connected...");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectDB;
