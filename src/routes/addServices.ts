import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest } from "../middlewares/validateRequest";
import { Service } from "../models";

const router = express.Router();

// Yeni Servis Ekleme Rotası
router.post(
  "/api/services",
  [
    // Validasyon: Adın boş olup olmadığını kontrol et
    body("name").notEmpty().withMessage("Servis adı boş olamaz"),
    // Validasyon: Açıklamanın boş olup olmadığını kontrol et
    body("description").notEmpty().withMessage("Servis açıklaması boş olamaz"),
    // Validasyon: Fiyatın bir sayı olup olmadığını kontrol et
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Fiyat pozitif bir sayı olmalıdır"),
  ],
  validateRequest, // Validasyon hatalarını kontrol etmek için middleware
  async (req: Request, res: Response) => {
    const { name, description, price } = req.body;

    try {
      // Servis adının veritabanında olup olmadığını kontrol et
      const existingService = await Service.findOne({ where: { name } });

      if (existingService) {
        // Eğer servis varsa hata döndür
        return res.status(400).send({ error: "Bu servis adı zaten mevcut." });
      }

      // Yeni servis oluştur ve kaydet
      const service = await Service.create({
        name,
        description,
        price,
      });

      // Yanıt olarak eklenen servisi döndür
      res.status(201).send(service);
    } catch (error) {
      res.status(500).send({ error: "Servis eklenirken bir hata oluştu." });
    }
  }
);

export { router as addServiceRouter };
