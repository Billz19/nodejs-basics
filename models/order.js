const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
  products:[{
    product: Object,
    quantity: Number
  }],
  user:{
    name: String,
    userId:{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  }
});

module.exports = model('Order',orderSchema)

// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../utils/database');
// const Product = require('./product');
// const User = require('./user');
// const OrderItem = require('./orderItem');

// class Order extends Model {}
// Order.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//       allowNull: false,
//     },
//   },
//   { sequelize }
// );

// Order.belongsTo(User);
// User.hasMany(Order)

// Order.belongsToMany(Product, { through: OrderItem });

// module.exports = Order;