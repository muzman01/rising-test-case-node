import { app, sequelize } from "./app";

// Veritabanını senkronize et ve sunucuyu başlat
sequelize.sync({ force: false }).then(() => {
  console.log("Veritabanı senkronize edildi.");

  app.listen(3000, () => {
    console.log("Sunucu 3000 portunda çalışıyor.");
  });
});
