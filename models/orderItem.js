const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

class OrderItem extends Model {}
OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    quantity: DataTypes.STRING,
  },
  { sequelize }
);

module.exports = OrderItem;
