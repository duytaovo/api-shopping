"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order, Product }) {
      // define association here
      this.belongsTo(Order, { foreignKey: "order_id", as: "Order" });
      this.belongsTo(Product, { foreignKey: "product_id", as: "Product" });
    }
  }
  OrderProduct.init(
    {
      quantity: DataTypes.INTEGER,
      isFeedBack: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "OrderProduct",
    }
  );
  return OrderProduct;
};
