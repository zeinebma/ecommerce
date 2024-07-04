const express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const sequelize = require('./src/config/db')

app.use(express.json());
app.use(cors({
  origin: "*"
}));

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

const userRoute = ('./src/routes/userRoute.js');
const productRoute = ('./src/routes/productRoute.js');
const cartRoute = ('./src/routes/cartRoute.js');

app.use('/api/auth/', require(userRoute));
app.use('/api/product/', require(productRoute));
app.use('/api/cart/', require(cartRoute));

app.get("/", (req, res) => {
  res.send("Root");
});


const port = process.env.PORT || 4000;
app.listen(port, (error) => {
  if (!error) console.log("Server Running on port " + port);
  else console.log("Error : ", error);
});
