const { DataTypes } = require("sequelize");
const sequelize = require('../config/db')

const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    cartData: {
        type: DataTypes.JSON, // Use JSON type for cartData
        defaultValue: {}, // Default value as an empty object
    },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        validate: {
            isIn: [['user', 'admin']],
        },
    },
});

module.exports = User;
