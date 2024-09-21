import express from "express";
import session from "express-session";
import "express-async-errors";
import "dotenv/config";

// services
import { sequelize } from "./models"; // Tüm modeller burada import edilir
import { errorHandler } from "./errors/errorHandler";

// user routes
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";

const app = express();

app.use(express.json());
// Oturum yönetimi için session middleware'i
app.use(
  session({
    secret: process.env.SESSION_SECRET!, // Oturum için gizli anahtar
    resave: false,
    saveUninitialized: false,
  })
);

// user login register
app.use(signupRouter);
app.use(signinRouter);

// error handler
app.use(errorHandler);

sequelize.sync({ force: false }).then(() => {
  console.log("Veritabanı senkronize edildi.");

  // Sunucuyu başlat
  app.listen(3000, () => {
    console.log("Sunucu 3000 portunda çalışıyor.");
  });
});
