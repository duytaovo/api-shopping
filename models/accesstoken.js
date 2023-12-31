"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AccessToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      // define association here
      this.belongsTo(User, { foreignKey: "user_id", as: "User" });
    }
    toJSON() {
      return this.get("accessToken");
    }
  }
  AccessToken.init(
    {
      token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "AccessToken",
    }
  );
  return AccessToken;
};
