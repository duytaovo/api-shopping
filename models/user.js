"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order, AccessToken, RefreshToken, Feedback }) {
      // define association here
      this.hasMany(Order, { foreignKey: "order_id", as: "Order" });
      this.hasMany(Feedback, { foreignKey: "user_id", as: "Feedback" });
      this.belongsTo(AccessToken, { foreignKey: "user_id", as: "AccessToken" });
      this.belongsTo(RefreshToken, {
        foreignKey: "user_id",
        as: "RefreshToken",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      roles: DataTypes.STRING,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
