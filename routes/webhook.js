const express = require('express');
const router = express.Router();
const { sendWhatsAppMessage } = require('../services/whatsapp');
const { getPatientData, getSurgicalQnA } = require('../services/sheets');
const { buildPrompt, getAIResponse } = require('../services/openai');

const sessions = new Map();

router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // console.log("process.env.WHATSAPP_VERIFY_TOKEN:", process.env.WHATSAPP_VERIFY_TOKEN);
  console.log("Token received:", token);
  if (mode === 'subscribe' && token === "mychatbot123") {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post('/webhook', async (req, res) => {
  try {
    const entry = req.body?.entry?.[0]?.changes?.[0]?.value;
    const messages = entry?.messages;

    if (!messages) return res.sendStatus(200);

    const message = messages[0];
    const from = message.from;
    const userMessage = message.text?.body;

    if (!userMessage || !from) return res.sendStatus(200);

    console.log(`Received message from ${from}`);

    const session = sessions.get(from) || [];

    const patientData = await getPatientData(from);
    if (!patientData) {
      await sendWhatsAppMessage(from, 'Sorry, we could not find your medical information.');
      return res.sendStatus(200);
    }
    const { fullRecord, prescription, raw } = patientData || {};
    let qnaSection = '';
    if (raw['Surgery Type']) {
      const qna = await getSurgicalQnA(raw['Surgery Type']);
      if (qna) {
        console.log('Surgical Q&A found:', qna);
        qnaSection = `\n\nDoctor-Provided Surgical Q&A for "${raw['Surgery Type']}":\n${qna}`;
      }
    }

    const prompt = buildPrompt(patientData, session, userMessage, qnaSection);
    console.log('Prompt for OpenAI:', JSON.stringify(prompt, null, 2));
    const answer = await getAIResponse(prompt);
    await sendWhatsAppMessage(from, answer);

    const newSession = [...session, { role: 'user', content: userMessage }, { role: 'assistant', content: answer }];
    sessions.set(from, newSession.slice(-10));

    res.sendStatus(200);
  } catch (err) {
    console.error('Webhook error:', err);
    res.sendStatus(500);
  }
});

module.exports = router;
