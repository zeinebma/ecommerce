const User = require('../models/user')
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.login = async (req, res) => {
    console.log("Login");
    let success = false;
    let user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = { user: { id: user.id } };
            success = true;
            console.log(user.id);
            const token = jwt.sign(data, process.env.SECRET_KEY);
            res.json({ success, token, role: user.role });
        } else {
            return res.status(400).json({ success: success, errors: "please try with correct email/password" });
        }
    } else {
        return res.status(400).json({ success: success, errors: "please try with correct email/password" });
    }
};


exports.signup = async (req, res) => {
    console.log("Sign Up");
    let success = false;
    let check = await User.findOne({ where: { email: req.body.email } });
    if (check) {
        return res.status(400).json({ success: success, errors: "existing user found with this email" });
    }
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    });
    await user.save();
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.SECRET_KEY);
    success = true;
    res.json({ success, token, role: user.role });
};

exports.addAdmin = async (req, res) => {
    console.log("Sign Up");
    let success = false;
    let check = await User.findOne({ where: { email: req.body.email } });
    if (check) {
        return res.status(400).json({ success: success, errors: "existing user found with this email" });
    }
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        role: 'admin',
    });
    await user.save();
    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.SECRET_KEY);
    success = true;
    res.json({ success, token, role: user.role });
};


exports.getUserDetails = async (req, res) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verified.user;

        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

exports.getAllUser = async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}

exports.editUser = async (req, res) => {
    const { id, role } = req.body;
    try {
        const result = await User.findByPk(id);
        if (result) {

            result.role = role;
            await result.save();
            res.json({ success: true, message: "User updated successfully", result });
        } else {
            res.status(404).json({ success: false, message: "user not found" });
        }
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ success: false, message: "An error occurred while updating the user" });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await User.destroy({ where: { id: id } });
        if (result) {
            res.json({ success: true, message: "User deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "user not found" });
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({
            success: false, message: "An error occurred while deleting the user"
        });
    }
}
