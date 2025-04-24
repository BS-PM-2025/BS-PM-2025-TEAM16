//most recent
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3006;

// Middleware
app.use(express.json());
app.use(cors());

// חיבור למסד נתונים
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// ייבוא ראוטים
const authRoutes = require('./routes/authRoutes');
const studentRequestsRouter = require('./routes/studentRequests');

// שימוש בראוטים
app.use('/api', authRoutes);
app.use('/api/staff/requests', studentRequestsRouter);
app.use('/api/requests', studentRequestsRouter);

// ייבוא מודלים
const RequestType = require('./models/RequestType');
const Course = require('./models/Course');

// שליפת נושאי בקשה
app.get('/api/topics', async (req, res) => {
  try {
    const topics = await RequestType.find({});
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשליפת נושאים', error: error.message });
  }
});

// שליפת קורסים
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'שגיאה בשליפת קורסים', error: error.message });
  }
});

// ברירת מחדל
app.get('/', (req, res) => {
  res.json({ message: 'Welcome' });
});

// הרצת השרת
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
