const axios = require('axios');

const whatsappApiUrl = `https://graph.facebook.com/v17.0/${process.env.WHATSAPP_PHONE_ID}/messages`;
// const whatsappApiUrl = `https://graph.facebook.com/v17.0/654431724427948/messages`;

async function sendWhatsAppMessage(to, text) {
  try {
    await axios.post(
      whatsappApiUrl,
      {
        messaging_product: 'whatsapp',
        to,
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error.response?.data || error.message);
  }
}

module.exports = { sendWhatsAppMessage };
