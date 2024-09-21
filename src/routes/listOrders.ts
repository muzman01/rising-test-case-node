import express, { Request, Response } from "express";
import { Order, Service } from "../models";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// Kullanıcının mevcut siparişlerini listeleme
router.get(
  "/api/orders",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      // Kullanıcının ID'sine göre siparişleri bul
      const orders = await Order.findAll({
        where: { userId: req.userId }, // authMiddleware'den gelen userId
        include: [{ model: Service, as: "service" }], // Her siparişe ait servisi de dahil et
      });

      // Eğer sipariş bulunmazsa
      if (!orders || orders.length === 0) {
        return res.status(200).send([]);
      }

      // Siparişleri JSON formatında döndür
      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send({ error: "Siparişler alınırken bir hata oluştu." });
    }
  }
);

export { router as listOrdersRouter };
