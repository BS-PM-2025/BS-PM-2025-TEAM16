const express = require('express');
const router = express.Router();
const { getRequestsForStaff } = require('../controllers/studentRequestsController');


const isStaff = (req, res, next) => {
  if (req.headers['user-role'] === 'Staff') {
    next();
  } else {
    return res.status(403).json({ message: "Unauthorized - Not Staff" });
  }
};

router.get('/', isStaff, getRequestsForStaff);

module.exports = router;
