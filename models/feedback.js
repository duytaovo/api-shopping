"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Product }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id", as: "User" });
      this.belongsTo(Product, { foreignKey: "product_id", as: "Product" });
    }
  }
  Feedback.init(
    {
      rating: DataTypes.FLOAT,
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );
  return Feedback;
};
