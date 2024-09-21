import express, { Request, Response } from "express";
import { body } from "express-validator";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateRequest } from "../middlewares/validateRequest";
import { BadRequestError } from "../errors/badRequestError";
import { User } from "../models";

const router = express.Router();

router.post(
  "/api/users/register",
  [
    body("email").isEmail().withMessage("Geçerli bir e-posta adresi girin"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Şifre 4 ile 20 karakter arasında olmalıdır"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    // Kullanıcı zaten var mı kontrol et
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestError("Bu e-posta zaten kullanımda.");
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur ve kaydet
    const user: any = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      balance: 100,
    });

    // JWT Token oluştur
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!, // JWT anahtarını .env dosyasından al
      { expiresIn: "1h" }
    );

    // req.session.jwt özelliğini ekleyip güncelle
    //@ts-ignore
    req.session.jwt = userJwt;

    res.status(201).send({
      user,
      jwt: userJwt,
    });
  }
);

export { router as signupRouter };
