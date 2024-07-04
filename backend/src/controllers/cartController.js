const User = require('../models/user')



exports.addtocart = async (req, res) => {
    console.log("Add Cart");
    try {
        const userData = await User.findOne({ where: { id: req.user.id } });
        let cartData = userData.cartData || {};  // Initialize as empty object if not exists
        const { itemId } = req.body;

        if (!cartData[itemId]) {
            cartData[itemId] = 0;
        }

        cartData[itemId] += 1;
        await User.update({ cartData: JSON.stringify(cartData) }, { where: { id: req.user.id } });

        res.status(200).json({ message: "Added to cart" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};




exports.removefromcart = async (req, res) => {
    console.log("Remove Cart");
    let userData = await User.findOne({ where: { id: req.user.id } });
    let cartData = userData.cartData;
    if (cartData[req.body.itemId] != 0) {
        cartData[req.body.itemId] -= 1;
    }
    await User.update({ cartData: cartData }, { where: { id: req.user.id } });
    res.send("Removed");
};


exports.getcart = async (req, res) => {
    console.log("Get Cart");
    let userData = await User.findOne({ where: { id: req.user.id } });
    return res.json(userData.cartData);
};
