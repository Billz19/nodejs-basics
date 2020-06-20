const { Schema, model } = require('mongoose');
const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
        qty: Number,
      },
    ],
  },
});

userSchema.methods.addProduct = function (product) {
  const items = [...this.cart.items];
  const index = items.findIndex(
    (p) => p.productId.toString() === product._id.toString()
  );
  if (index !== -1) {
    items[index].qty += 1;
  } else {
    items.push({ productId: product._id, qty: 1 });
  }
  const updatedCart = {
    items: items,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteProductFromCart = function(id){
  const updatedCart = [...this.cart.items].filter(i => i.productId !== id)
  this.cart = updatedCart
  return this.save();
}

userSchema.methods.clearCart = function(){
  this.cart = {items:[]};
  return this.save();
}

module.exports = model('User', userSchema);

// const { getDB } = require('../utils/database');
// const { ObjectId } = require('mongodb');

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDB();
//     return db
//       .collection('users')
//       .insertOne(this)
//       .then((result) => console.log(result))
//       .catch((error) => console.log(error));
//   }

//   addProduct(product) {
//     const items = [...this.cart.items];
//     const index = items.findIndex(
//       (p) => p.productId.toString() === product._id.toString()
//     );
//     if (index !== -1) {
//       items[index].qty += 1;
//     } else {
//       items.push({ productId: new ObjectId(product._id), qty: 1 });
//     }
//     const updatedCart = {
//       items: items,
//     };
//     const db = getDB();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const prodsIds = this.cart.items.map((p) => p.productId);
//     const db = getDB();
//     return db
//       .collection('products')
//       .find({ _id: { $in: prodsIds } })
//       .toArray()
//       .then((prods) => {
//         return prods.map((p) => ({
//           ...p,
//           quantity: this.cart.items.find(
//             (i) => i.productId.toString() === p._id.toString()
//           ).qty,
//         }));
//       });
//   }

//   deleteProductFromCart(prodId) {
//     const db = getDB();
//     const newItems = [...this.cart.items].filter(
//       (p) => p.productId.toString() !== prodId.toString()
//     );
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: newItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDB();
//     return this.getCart()
//       .then((products) => {
//         const orders = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection('orders').insertOne(orders);
//       })
//       .then((result) => {
//         this.cart = { items: [] };
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDB();
//     return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray();
//   }
//   static findById(id) {
//     const db = getDB();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(id) })
//       .then((user) => {
//         return user;
//       })
//       .catch((error) => console.log(error));
//   }
// }

// const { Model, DataTypes } = require('sequelize');
// const sequelize = require('../utils/database');
// class User extends Model {}
// User.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//       allowNull: false,
//     },
//     name: DataTypes.STRING,
//     email: DataTypes.STRING,
//   },
//   { sequelize }
// );
// module.exports = User;
