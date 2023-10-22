"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ OrderProduct, Feedback, Category }) {
      // define association here
      this.hasMany(OrderProduct, {
        foreignKey: "product_id",
        as: "OrderProduct",
      });
      this.hasMany(Feedback, {
        foreignKey: "product_id",
        as: "Feedback",
      });
      this.belongsTo(Category, { foreignKey: "category_id", as: "Category" });
    }
  }
  Product.init(
    {
      name: DataTypes.STRING,
      brand: DataTypes.STRING,
      imgUrl: DataTypes.STRING,
      price: DataTypes.STRING,
      sale_price: DataTypes.STRING,
      description: DataTypes.STRING,
      display: DataTypes.STRING,
      os: DataTypes.STRING,
      main_camera: DataTypes.STRING,
      selfi_camera: DataTypes.STRING,
      chip: DataTypes.STRING,
      Ram: DataTypes.STRING,
      Rom: DataTypes.STRING,
      battery: DataTypes.STRING,
      priority: DataTypes.STRING,
      num_quantity: DataTypes.STRING,
      isDeleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
