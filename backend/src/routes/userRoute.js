const express = require('express');
const { login, signup, getUserDetails } = require('../controllers/userController');
const router = express.Router();

router
    .post('/login', login)
    .post('/signup', signup)
    .get('/user', getUserDetails)

module.exports = router
