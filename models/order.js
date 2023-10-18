"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id", as: "User" });
    }
  }
  Orders.init(
    {
      buy_count: DataTypes.NUMBER,
      price: DataTypes.STRING,
      price_before_discount: DataTypes.NUMBER,
      status: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "Orders",
    }
  );
  return Orders;
};
