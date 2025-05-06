const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/authRoutes");
const studentRequestsRouter = require("./routes/studentRequests");
const userRoutes = require("./routes/users");

app.use("/api", authRoutes);
app.use("/api/staff/requests", studentRequestsRouter);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

let server = null;

const startServer = async () => {
  const PORT = process.env.PORT || 3006;

  await mongoose.connect(process.env.MONGO_URI);

  return new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
};

const stopServer = async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
  await mongoose.disconnect();
};

if (require.main === module) {
  startServer().catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
}

module.exports = {
  app,
  startServer,
  stopServer,
};
