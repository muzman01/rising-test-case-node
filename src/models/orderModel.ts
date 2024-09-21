import { DataTypes } from "sequelize";
import sequelize from "./index";

const Order = sequelize.define("Order", {
  serviceName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default Order;
