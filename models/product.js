const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  title:{
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: String,
  imageUrl: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = model('Product',productSchema);

// const { getDB } = require('../utils/database');
// const { ObjectId } = require('mongodb');

// class Product {
//   constructor(objectParams) {
//     this.title = objectParams.title;
//     this.imageUrl = objectParams.imageUrl;
//     this.price = objectParams.price;
//     this.description = objectParams.description;
//     this._id = objectParams.id ? new ObjectId(objectParams.id) : null;
//     this.userId = objectParams.userId;
//   }

//   save() {
//     const db = getDB();
//     let dbOp;
//     if (this._id) {
//       console.log(new ObjectId(this._id));
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then((result) => console.log(result))
//       .catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDB();
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then((products) => {
//         console.log(products);
//         return products;
//       })
//       .catch((error) => console.log(error));
//   }
//   static findById(id) {
//     const db = getDB();
//     return db
//       .collection('products')
//       .find({ _id: new ObjectId(id) })
//       .next()
//       .then((product) => {
//         console.log(product);
//         return product;
//       })
//       .catch((error) => console.log(error));
//   }

//   static deleteById(id) {
//     const db = getDB();
//     return db
//       .collection('products')
//       .deleteOne({ _id: new ObjectId(id) })
//       .then(() => console.log('Deleted'))
//       .catch((error) => console.log(error));
//   }
// }

// const { DataTypes, Model } = require('sequelize');
// const sequelize = require('../utils/database');
// const User = require('./user');
// class Product extends Model {}
// Product.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     title: DataTypes.STRING,
//     price: {
//       type: DataTypes.DOUBLE,
//       allowNull: false,
//     },
//     imageUrl: DataTypes.STRING,
//     description: DataTypes.STRING,
//   },
//   { sequelize, modelName: 'products' }
// );

// Product.belongsTo(User,{constraints: true, onDelete: 'CASCADE'})
// User.hasMany(Product)

// module.exports = Product;

// const fs = require('fs');
// const rootDir = require('../utils/path');
// const path = require('path');
// const filePath = path.join(rootDir, 'data', 'products.json');
// const Cart = require('./cart');

// const getProductFromFile = () =>
//   new Promise((resolve) => {
//     fs.readFile(filePath, (err, fileContent) => {
//       if (err) resolve([]);
//       resolve(JSON.parse(fileContent.toString()));
//     });
//   });

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     getProductFromFile().then((products) => {
//       if (this.id) {
//         const index = products.findIndex((p) => p.id === this.id);
//         products[index] = this;
//       } else {
//         this.id = Math.round(Math.random() * 0x100000).toString();
//         products.push(this);
//       }
//       fs.writeFile(filePath, JSON.stringify(products), (err) => {
//         console.log(err);
//       });
//     });
//   }
//   static fetchAll() {
//     return getProductFromFile();
//   }

//   static async findById(id) {
//     const products = await getProductFromFile();
//     return products.find((p) => p.id === id);
//   }

//   static deleteById(id) {
//     getProductFromFile().then((prods) => {
//       const price = prods.find(p => p.id === id).price;
//       const updatedProds = prods.filter((p) => p.id !== id);
//       fs.writeFile(filePath, JSON.stringify(updatedProds), (err) => {
//         if (!err) {
//           Cart.deleteProduct(id,price);
//         }
//       });
//     });
//   }
// };
