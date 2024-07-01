const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { Sequelize, DataTypes } = require('sequelize');
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

const sequelize = new Sequelize('ecom', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});


sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));


const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  cartData: { type: DataTypes.JSON },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  new_price: { type: DataTypes.FLOAT },
  old_price: { type: DataTypes.FLOAT },
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  available: { type: DataTypes.BOOLEAN, defaultValue: true },
});


sequelize.sync();


const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `/images/${req.file.filename}`
  });
});


app.use('/images', express.static('upload/images'));


const fetchuser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};


app.get("/", (req, res) => {
  res.send("Root");
});


app.post('/login', async (req, res) => {
  console.log("Login");
  let success = false;
  let user = await User.findOne({ where: { email: req.body.email } });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = { user: { id: user.id } };
      success = true;
      console.log(user.id);
      const token = jwt.sign(data, 'secret_ecom');
      res.json({ success, token });
    } else {
      return res.status(400).json({ success: success, errors: "please try with correct email/password" });
    }
  } else {
    return res.status(400).json({ success: success, errors: "please try with correct email/password" });
  }
});


app.post('/signup', async (req, res) => {
  console.log("Sign Up");
  let success = false;
  let check = await User.findOne({ where: { email: req.body.email } });
  if (check) {
    return res.status(400).json({ success: success, errors: "existing user found with this email" });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new User({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = { user: { id: user.id } };
  const token = jwt.sign(data, 'secret_ecom');
  success = true;
  res.json({ success, token });
});


app.get("/allproducts", async (req, res) => {
  let products = await Product.findAll();
  console.log("All Products");
  res.send(products);
});


app.get("/newcollections", async (req, res) => {
  let products = await Product.findAll();
  let arr = products.slice(0).slice(-8);
  console.log("New Collections");
  res.send(arr);
});


app.get("/popularinwomen", async (req, res) => {
  let products = await Product.findAll({ where: { category: "equipements" } });
  let arr = products.splice(0, 4);
  console.log("Popular In equipements");
  res.send(arr);
});


app.post("/relatedproducts", async (req, res) => {
  console.log("Related Products");
  const { category } = req.body;
  const products = await Product.findAll({ where: { category } });
  const arr = products.slice(0, 4);
  res.send(arr);
});


app.post('/addtocart', fetchuser, async (req, res) => {
  console.log("Add Cart");
  let userData = await User.findOne({ where: { id: req.user.id } });
  let cartData = userData.cartData;
  cartData[req.body.itemId] += 1;
  await User.update({ cartData: cartData }, { where: { id: req.user.id } });
  res.send("Added");
});


app.post('/removefromcart', fetchuser, async (req, res) => {
  console.log("Remove Cart");
  let userData = await User.findOne({ where: { id: req.user.id } });
  let cartData = userData.cartData;
  if (cartData[req.body.itemId] != 0) {
    cartData[req.body.itemId] -= 1;
  }
  await User.update({ cartData: cartData }, { where: { id: req.user.id } });
  res.send("Removed");
});


app.post('/getcart', fetchuser, async (req, res) => {
  console.log("Get Cart");
  let userData = await User.findOne({ where: { id: req.user.id } });
  res.json(userData.cartData);
});


app.post("/addproduct", async (req, res) => {
  let products = await Product.findAll();
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    description: req.body.description,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  await product.save();
  console.log("Saved");
  res.json({ success: true, name: req.body.name });
});


app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({ success: true, name: req.body.name });
});


app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
