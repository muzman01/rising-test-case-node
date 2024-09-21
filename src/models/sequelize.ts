import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite", // Veritabanı dosyanın konumu
});

export default sequelize;
