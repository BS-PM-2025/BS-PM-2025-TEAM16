const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const User = require("../models/User");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const results = [];

fs.createReadStream(path.join(__dirname, "users.csv"))
  .pipe(csv())
  .on("data", (data) => {
    results.push(data);
  })
  .on("end", async () => {
    try {
      console.log("Parsed data:", results);
      await User.insertMany(results);
      console.log("Users imported successfully!");
    } catch (err) {
      console.error("Error importing users:", err);
    } finally {
      mongoose.connection.close();
    }
  });
