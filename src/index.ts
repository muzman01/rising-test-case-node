import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { sequelize } from "./models"; // Tüm modeller burada import edilir

const app = express();

app.use(express.json());

sequelize.sync({ force: false }).then(() => {
  console.log("Veritabanı senkronize edildi.");

  // Sunucuyu başlat
  app.listen(3000, () => {
    console.log("Sunucu 3000 portunda çalışıyor.");
  });
});
