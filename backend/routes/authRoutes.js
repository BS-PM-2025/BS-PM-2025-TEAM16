const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const { login } = require('../controllers/authController');

router.post('/login', login);
=======
const { login, resetPassword } = require('../controllers/authController');

router.post('/login', login);
router.post('/reset-password', resetPassword); 
>>>>>>> main

module.exports = router;
