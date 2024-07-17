const express = require('express');
const { allProducts, newCollections, popularProduct, relatedProducts, addproduct, removeproduct, updateProduct, productByCat, getProductById } = require('../controllers/productController');
const { fetchuser } = require('../Middlewares/userMiddleware');
const router = express.Router();
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage: storage });

router
    .post("/addproduct", upload.single('image'), addproduct)
    .post("/relatedproducts", relatedProducts)
    .put("/updateproduct/:id", upload.single('image'), updateProduct)
    .get("/allproducts", allProducts)
    .get("/newcollections", newCollections)
    .get("/popularinProduct", popularProduct)
    .get('/category/:categoryName', productByCat)
    .get('/getproduct/:id', getProductById)
    .delete("/removeproduct/:id", removeproduct)

module.exports = router