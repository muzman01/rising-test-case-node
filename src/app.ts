import express from "express";
import session from "express-session";
import "express-async-errors";
import "dotenv/config";

// services
import { sequelize } from "./models"; // Tüm modeller burada import edilir
import { errorHandler } from "./errors/errorHandler";

// use routes
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { addOrderRouter } from "./routes/addOrder";
import { addServiceRouter } from "./routes/addServices";
import { listOrdersRouter } from "./routes/listOrders";

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

// order routes
app.use(addOrderRouter);
app.use(listOrdersRouter);

// service routes
app.use(addServiceRouter);

// error handler
app.use(errorHandler);

// Uygulamayı export et (testler için)
export { app, sequelize };
