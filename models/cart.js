// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../utils/database');
// const Product = require('./product');
// const User = require('./user');
// const CartItem = require('./cartItem');

// class Cart extends Model {}
// Cart.init(
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

// User.hasOne(Cart);

// Cart.belongsToMany(Product, { through: CartItem });
// Product.belongsToMany(Cart, { through: CartItem });

// module.exports = Cart;


// const fs = require('fs');
// const rootDir = require('../utils/path');
// const path = require('path');
// const filePath = path.join(rootDir, 'data', 'cart.json');

// module.exports = class Cart {
//   static addProduct(id, price) {
//     fs.readFile(filePath, (err, fileContent) => {
//       let cart = { products: [], totalPrice: 0 };
//       if (!err && fileContent.length) {
//         cart = JSON.parse(fileContent.toString());
//       }
//       const index = cart.products.findIndex((p) => p.id === id);
//       const target = cart.products[index];
//       if (target) {
//         target.qty++;
//         cart.products[index] = target;
//       } else {
//         cart.products.push({ id: id, qty: 1 });
//       }
//       cart.totalPrice += +price;
//       fs.writeFile(filePath, JSON.stringify(cart), (err) => {
//         console.log('done');
//       });
//     });
//   }

//   static deleteProduct(id, price) {
//     fs.readFile(filePath, (err, fileContent) => {
//       if (err) return;
//       const cart = { ...JSON.parse(fileContent.toString()) };
//       const productTarget = cart.products.find((p) => p.id === id);
//       if(!productTarget) return;
//       const QTY = productTarget.qty;
//       cart.products = cart.products.filter((p) => p.id !== id);
//       cart.totalPrice = cart.totalPrice - price * QTY;
//       fs.writeFile(filePath, JSON.stringify(cart), (err) => {
//         console.log(err);
//       });
//     });
//   }

//   static getCart() {
//     return new Promise((resolve) => {
//       fs.readFile(filePath, (err, fileContent) => {
//         if (!err && fileContent.length) {
//           resolve(JSON.parse(fileContent.toString()));
//         }
//         resolve(null);
//       });
//     });
//   }
// };
