module.exports = (sequelize, DataTypes) => {
  const products = sequelize.define("Product", {
    name: {
      type: DataTypes.STRING(20),
      allowNULL: false,
    },
    price: {
      type: DataTypes.INTEGER(10),
      allowNULL: false,
    },
    name: {
      type: DataTypes.STRING(30),
      allowNULL: false,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNULL: false,
    },
    imageUrl: {
      type: DataTypes.STRING(300),
      allowNULL: false,
    },
    seller: {
      type: DataTypes.STRING(30),
      allowNULL: false,
    },
    soldout: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 0,
    },
  });
  return products;
};
