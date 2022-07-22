const { db, DataTypes } = require("../utils/database.util");

const FavoriteSong = db.define(
  "favoriteSong",
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    songId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "favoriteSong",
    timestamps: false,
  }
);

module.exports = { FavoriteSong };
