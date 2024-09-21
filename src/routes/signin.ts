import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { validateRequest } from "../middlewares/validateRequest";
import { BadRequestError } from "../errors/badRequestError";
import { User } from "../models";

const router = express.Router();

router.post(
  "/api/users/login",
  [
    body("email").isEmail().withMessage("Geçerli bir e-posta adresi girin"),
    body("password").trim().notEmpty().withMessage("Şifre boş olamaz"),
  ],
  validateRequest, // Validasyon sonuçlarını kontrol eden middleware
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Kullanıcıyı e-postaya göre bul
    const user: any = await User.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestError("E-posta veya şifre hatalı.");
    }

    // Şifreyi doğrula
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError("E-posta veya şifre hatalı.");
    }

    // Kullanıcı doğru, JWT Token oluştur
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!, // JWT anahtarını .env dosyasından al
      { expiresIn: "1h" } // Token geçerlilik süresi 1 saat
    );

    // JWT token'ı oturuma ekle
    //@ts-ignore
    req.session.jwt = userJwt;

    // Token'ı ve kullanıcı bilgilerini döndür
    res.status(200).send({
      user,
      jwt: userJwt,
    });
  }
);

export { router as signinRouter };
