import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order, Service, User } from "../models";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/api/orders",
  authMiddleware,
  [
    // Validasyon: Servis adı ve miktar dizisinin boş olup olmadığını kontrol et
    body("services")
      .isArray({ min: 1 })
      .withMessage("En az bir servis seçilmelidir."),
    body("services.*.serviceName")
      .notEmpty()
      .withMessage("Servis adı boş olamaz"),
    body("services.*.quantity")
      .isInt({ gt: 0 })
      .withMessage("Miktar pozitif bir sayı olmalıdır"),
  ],
  validateRequest, // Gelen isteğin doğruluğunu kontrol et
  async (req: Request, res: Response) => {
    const { services } = req.body;

    // Kullanıcıyı veritabanından al
    const user: any = await User.findByPk(req.userId); // authMiddleware kullanıcının ID'sini ekler
    if (!user) {
      return res.status(400).send({ error: "Kullanıcı bulunamadı." });
    }

    // Servisleri toplu olarak almak ve fiyatlarını kontrol etmek için Promise.all kullan
    const servicePromises = services.map(
      async (serviceItem: { serviceName: string; quantity: number }) => {
        const { serviceName, quantity } = serviceItem;

        // Servisi veritabanından bul
        const service: any = await Service.findOne({
          where: { name: serviceName },
        });
        if (!service) {
          throw new Error(`Geçersiz servis: ${serviceName}`);
        }

        // Toplam fiyatı hesapla (Her servis için)
        const totalPrice = service.price * quantity;

        return {
          service,
          quantity,
          totalPrice,
        };
      }
    );

    // Tüm servis işlemlerini tamamla
    let serviceDetails;
    try {
      serviceDetails = await Promise.all(servicePromises);
    } catch (err: any) {
      return res.status(400).send({ error: err.message });
    }

    // Tüm servislerin toplam fiyatını hesapla
    const totalPrice = serviceDetails.reduce(
      (acc, item) => acc + item.totalPrice,
      0
    );

    // Kullanıcının bakiyesini kontrol et
    if (user.balance < totalPrice) {
      return res.status(400).send({ error: "Yetersiz bakiye." });
    }

    // Siparişleri kaydet ve Promise.all ile paralel olarak siparişleri veritabanına kaydet
    const orderPromises = serviceDetails.map(async (item) => {
      const { service, quantity, totalPrice } = item;

      return await Order.create({
        serviceName: service.name,
        quantity,
        totalPrice,
        userId: user.id,
        serviceId: service.id,
      });
    });

    // Tüm siparişleri kaydet
    await Promise.all(orderPromises);

    // Kullanıcının bakiyesini güncelle
    user.balance -= totalPrice;
    await user.save();

    // Yanıt olarak başarı mesajı döndür
    res
      .status(201)
      .send({ message: "Sipariş başarıyla oluşturuldu.", totalPrice });
  }
);

export { router as addOrderRouter };
