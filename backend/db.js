// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Dorin:Dorin1234@cluster0.twpdzpc.mongodb.net/loginDB?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' התחברת בהצלחה ל-MongoDB!'))
.catch(err => console.error(' שגיאה בהתחברות ל-MongoDB:', err));
