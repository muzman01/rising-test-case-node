import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// UserPayload, JWT'den çıkarılan kullanıcı bilgilerini temsil eder
interface UserPayload {
  id: string;
  email: string;
}

// JWT doğrulaması yapılırken kullanacağız
declare global {
  namespace Express {
    interface Request {
      userId?: string; // Kimliği doğrulanmış kullanıcıyı temsil eder
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Authorization başlığından token'ı alıyoruz
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Yetkisiz erişim." });
  }

  const token = authHeader.split(" ")[1]; // 'Bearer <token>' formatından token'ı alıyoruz
  console.log(token);

  if (!token) {
    return res.status(401).send({ error: "Yetkisiz erişim." });
  }

  try {
    // JWT doğrula ve kullanıcı bilgilerini al
    const payload = jwt.verify(token, process.env.JWT_KEY!) as UserPayload;
    req.userId = payload.id; // Kullanıcı kimliğini isteğe ekle
    next(); // Middleware işlemi tamamla
  } catch (_) {
    res.status(401).send({ error: "Geçersiz token." });
  }
};
