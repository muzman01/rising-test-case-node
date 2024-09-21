import { DataTypes } from "sequelize";
import sequelize from "./index";

const Service = sequelize.define("Service", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Service;
