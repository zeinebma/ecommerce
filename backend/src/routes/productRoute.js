const express = require('express');
const { allProducts, newCollections, popularinWomen, relatedProducts, addproduct, removeproduct, updateProduct } = require('../controllers/productController');
const { fetchuser } = require('../Middlewares/userMiddleware');
const router = express.Router();


router
    .get("/allproducts", allProducts)
    .get("/newcollections", newCollections)
    .get("/popularinwomen", popularinWomen)
    .post("/relatedproducts", relatedProducts)
    .post("/addproduct", addproduct)
    .put("/updateproduct", updateProduct)
    .delete("/removeproduct/:id", removeproduct)

module.exports = router