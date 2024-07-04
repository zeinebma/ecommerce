const express = require('express');
const { fetchuser } = require('../Middlewares/userMiddleware');
const { addtocart, getcart, removefromcart } = require('../controllers/cartController');
const router = express.Router();


router
    .post('/addtocart', fetchuser, addtocart)
    .post('/getcart', fetchuser, getcart)
    .post('/removefromcart', fetchuser, removefromcart)

module.exports = router