const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("WhatsApp AI Bot çalışıyor.");
});
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});app.post("/webhook", async (req, res) => {
  try {
    console.log(JSON.stringify(req.body, null, 2));

    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body;

    const aiReply = let aiReply = "";

if (text === "1") {
  aiReply = "📅 Randevu almak için adınızı ve istediğiniz tarihi yazın.";
}
else if (text === "2") {
  aiReply = "💄 Kirpik Lifting: 500 TL\n💅 Kalıcı Oje: 400 TL\n👁️ İpek Kirpik: 1200 TL";
}
else if (text === "3") {
  aiReply = "🎉 Bu ay tüm cilt bakımlarında %20 indirim!";
}
else if (text === "4") {
  aiReply = "🕘 Çalışma Saatleri:\nPazartesi-Cumartesi 09:00-20:00";
}
else {
  aiReply = `
Merhaba 🌸

1️⃣ Randevu Al
2️⃣ Fiyat Bilgisi
3️⃣ Kampanyalar
4️⃣ Çalışma Saatleri

Lütfen bir numara seçin.
`;
}    await axios.post(
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
