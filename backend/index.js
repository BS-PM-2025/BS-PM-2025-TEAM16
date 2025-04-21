const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3006;


app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


const authRoutes = require('./routes/authRoutes');
const studentRequestsRouter = require('./routes/studentRequests');

app.use('/api', authRoutes);
app.use('/api/staff/requests', studentRequestsRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome' });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
