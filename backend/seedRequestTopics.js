// seedRequestTopics.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Dorin:Dorin1234@cluster0.twpdzpc.mongodb.net/loginDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log(" התחברת ל-MongoDB");
  seedTopics();
})
.catch(err => {
  console.error(" שגיאה בחיבור:", err);
});

const topicSchema = new mongoose.Schema({
  name: String
});

const RequestTopic = mongoose.model('requestTopics', topicSchema, 'requestTopics');


const topics = [
  { name: "ביטול % עבודות בית בציון סופי" },
  { name: "בקשה למועד מיוחד" },
  { name: "בקשה למטלה חלופית חרבות הברזל" },
  { name: "בקשה לפטור מדרישת קדם" },
  { name: "בקשה לפטור מקורס" },
  { name: "דחיית הגשת עבודה" },
  { name: "הגדלת נקודות זכות למותר/קבוע" },
  { name: "הגשת אישורי מילואים" },
  { name: "שחרור חסימת קורס" },
  { name: "שחרור מחובת הרשמה" },
  { name: "שקלול עבודות בית בציון הסופי" },
  { name: "אחר" }
];

async function seedTopics() {
  try {
    await RequestTopic.insertMany(topics);
    console.log(" הנושאים נוספו בהצלחה למסד הנתונים");
    mongoose.connection.close();
  } catch (err) {
    console.error(" שגיאה בהוספת הנושאים:", err);
  }
}
