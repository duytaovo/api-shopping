"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Category }) {
      // define association here
      this.belongsTo(Category, { foreignKey: "category_id", as: "Category" });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      images: DataTypes.STRING,
      image: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.STRING,
      rating: DataTypes.STRING,
      price_before_discount: DataTypes.STRING,
      quantity: DataTypes.STRING,
      sold: DataTypes.STRING,
      view: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
