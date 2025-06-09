const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ייבוא ראוטים
const authRoutes = require("./routes/authRoutes");
const studentRequestsRouter = require("./routes/studentRequests");
const userRoutes = require("./routes/users");
const answerTemplatesRouter = require("./routes/answerTemplate");
const chatbotRoutes = require("./routes/chatBot");

// שימוש בראוטים
app.use("/api", authRoutes);
app.use("/api/staff/requests", studentRequestsRouter);
app.use("/api/requests", studentRequestsRouter);
app.use("/users", userRoutes);
app.use("/api/student", studentRequestsRouter);
app.use("/api/answer-templates", answerTemplatesRouter);
app.use("/api", chatbotRoutes);

// ייבוא מודלים לשליפת נושאים וקורסים
const RequestType = require("./models/RequestType");
const Course = require("./models/Course");

// שליפת נושאי בקשה (לסטודנטים)
app.get("/api/topics", async (req, res) => {
  try {
    const topics = await RequestType.find({});
    res.json(topics);
  } catch (error) {
    res
      .status(500)
      .json({ message: "שגיאה בשליפת נושאים", error: error.message });
  }
});

// שליפת קורסים (לסטודנטים)
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "שגיאה בשליפת קורסים", error: error.message });
  }
});

// ברירת מחדל
app.get("/", (req, res) => {
  res.json({ message: "Welcome" });
});

// הרצת שרת רגיל או ל־test
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

// הפעלת השרת אם זה הקובץ הראשי
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
