const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.get("/webhook", (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === verifyToken) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body?.trim();

    let aiReply = "";

    if (text === "1") {
      aiReply = `
📅 RANDEVU TALEBİ

Lütfen aşağıdaki bilgileri gönderiniz:

👤 Ad Soyad
📞 Telefon
📅 Tarih
⏰ Saat
💅 İşlem

Örnek:

Ayşe Yılmaz
20 Haziran
14:00
Kalıcı Oje
`;
    }

    else if (text === "2") {
      aiReply = `
💰 GÜNCEL FİYAT LİSTESİ

💅 Kalıcı Oje .......... 500 TL
👁️ Kirpik Lifting ...... 800 TL
👑 İpek Kirpik ......... 1.500 TL
🤎 Kaş Laminasyonu ..... 700 TL
💆 Cilt Bakımı ......... 1.200 TL
💎 Hydrafacial ......... 2.000 TL
🌟 Lazer Epilasyon ..... 750 TL+
💄 Profesyonel Makyaj .. 2.500 TL

Fiyatlar işlem detayına göre değişebilir.
`;
    }

    else if (text === "3") {
      aiReply = `
🎉 GÜNCEL KAMPANYALAR

✨ İlk Ziyaret İndirimi
%20 İndirim

✨ Kalıcı Oje + Manikür
700 TL

✨ Kirpik Lifting + Kaş Laminasyonu
1.300 TL

✨ 3 Seans Cilt Bakımı
%25 İndirim

✨ Arkadaşını Getir
Her iki kişiye %15 İndirim

Kampanyalar sınırlı süre geçerlidir.
`;
    }

    else if (text === "4") {
      aiReply = `
🕒 ÇALIŞMA SAATLERİ

Pazartesi - Cumartesi
09:00 - 20:00

Pazar
10:00 - 18:00

Resmi tatillerde değişiklik olabilir.
`;
    }

    else if (text === "5") {
      aiReply = `
⏱️ İŞLEM SÜRELERİ

💅 Kalıcı Oje → 60 dk
👁️ Kirpik Lifting → 75 dk
👑 İpek Kirpik → 120 dk
🤎 Kaş Laminasyonu → 45 dk
💆 Cilt Bakımı → 90 dk
💎 Hydrafacial → 60 dk
🌟 Lazer Epilasyon → 20-60 dk
`;
    }

    else if (text === "6") {
      aiReply = `
👩‍💼 Uzman ekibimiz size yardımcı olacaktır.

Lütfen sorunuzu yazınız.

En kısa sürede dönüş sağlanacaktır.
`;
    }

    else {
      aiReply = `
🌸 HOŞ GELDİNİZ 🌸

Güzellik Salonumuza hoş geldiniz.

Size nasıl yardımcı olabiliriz?

━━━━━━━━━━━━━━
1️⃣ Randevu Oluştur

2️⃣ Fiyat Listesi

3️⃣ Kampanyalar

4️⃣ Çalışma Saatleri

5️⃣ İşlem Süreleri

6️⃣ Uzmanla Görüş
━━━━━━━━━━━━━━

💅 Kalıcı Oje
👁️ Kirpik Lifting
👑 İpek Kirpik
🤎 Kaş Laminasyonu
💆 Cilt Bakımı
💎 Hydrafacial
🌟 Lazer Epilasyon
💄 Profesyonel Makyaj

Lütfen bir numara gönderiniz.
`;
    }

    await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: from,
        text: {
          body: aiReply
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.sendStatus(200);

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
