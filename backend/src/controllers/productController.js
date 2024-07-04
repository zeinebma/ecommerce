const Product = require('../models/product')


exports.allProducts = async (req, res) => {
    let products = await Product.findAll();
    console.log("All Products");
    res.send(products);
};


exports.newCollections = async (req, res) => {
    let products = await Product.findAll();
    let arr = products.slice(0).slice(-8);
    console.log("New Collections");
    res.send(arr);
};


exports.popularinWomen = async (req, res) => {
    let products = await Product.findAll({ where: { category: "equipements" } });
    let arr = products.splice(0, 4);
    console.log("Popular In equipements");
    res.send(arr);
};


exports.relatedProducts = async (req, res) => {
    console.log("Related Products");
    const { category } = req.body;
    const products = await Product.findAll({ where: { category } });
    const arr = products.slice(0, 4);
    res.send(arr);
};


exports.addproduct = async (req, res) => {
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
};


exports.updateProduct = async (req, res) => {
    const { id, name, old_price, new_price, category, image } = req.body;

    try {
        const product = await Product.findByPk(id);
        if (product) {
            product.name = name;
            product.old_price = old_price;
            product.new_price = new_price;
            product.category = category;
            product.image = image;
            await product.save();
            console.log("Product updated");
            res.json({ success: true, message: "Product updated successfully" });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the product" });
    }
};


exports.removeproduct = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Product.destroy({ where: { id: id } });
        if (result) {
            console.log("Removed");
            res.json({ success: true, message: "Product removed successfully" });
        } else {
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, message: "An error occurred while removing the product" });
    }
};
