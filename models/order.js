"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, OrderProduct }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id", as: "User" });
      this.belongsTo(OrderProduct, {
        foreignKey: "order_id",
        as: "OrderProduct",
      });
    }
  }
  Order.init(
    {
      name_receiver: DataTypes.STRING,
      phone_receiver: DataTypes.STRING,
      address_receiver: DataTypes.STRING,
      message: DataTypes.STRING,
      // buy_count: DataTypes.STRING,
      price: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
