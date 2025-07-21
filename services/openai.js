const OpenAI = require('openai');
const { getSurgicalQnA } = require('./sheets');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// function buildPrompt(data, messageHistory, userMessage) {
//   return [
//     {
//       role: 'system',
//       content: `
// You are a professional medical assistant helping patients with queries related to their prescriptions, surgeries, recovery, and general care.

// Respond in a **short, clear, and precise** manner. Avoid lengthy explanations or paragraphs.

// If the patient asks about a medication listed in their prescription, provide a **direct answer** about its use. Do **not** give general advice unless the user explicitly asks for it.

// If the patient asks about exercises or food:
// - If doctor advice is available in the patient's data (e.g., exercises or food restrictions), clearly say:  
//   “Your doctor has advised you to…” followed by the list.
// - If there is **no advice from the doctor**, check if the patient has a medical/surgical history, and based on that, suggest common recovery-friendly exercises or food guidelines. Clearly note at the end:  
//   “This is general advice. Please consult your doctor before following.”

// Do **not** include disclaimers like “This is not medical advice...” in every message. Only mention that it’s general advice **if applicable**.

// Never refer to the user by name or include personal identifiers.

// Keep the tone professional, friendly, and efficient.
//       `.trim()
//     },
//     {
//       role: 'assistant',
//       content: `Patient Data:
// Prescription: ${data.raw["Medications"] || 'Not specified'}

// Full Medical History:
// ${Object.entries(data.raw).map(([key, value]) => `${key}: ${value}`).join('\n')}`
//     },
//     ...messageHistory,
//     {
//       role: 'user',
//       content: userMessage
//     }
//   ];
// }

function buildPrompt(data, messageHistory, userMessage, qnaSection = '') {
  const { fullRecord, prescription, raw } = data;

  return [
    {
      role: 'system',
      content:
        `You are a concise, professional medical assistant for post-surgery and prescription-related questions. Respond crisply. Avoid paragraphs.\n` +
        `If a doctor has provided exercises, advice, or recovery steps, use those instead of general suggestions.\n` +
        `Avoid repeating disclaimers like "This is not medical advice" unless giving general suggestions based on history.\n` +
        `Only provide general suggestions (e.g., exercises, food) when the doctor hasn't already advised, and make it clear it is not a substitute for professional guidance.\n` +
        `Do not provide general drug information unless the patient explicitly asks for it.\n` +
        `Patient Record:\n${fullRecord}\n\nPrescription: ${prescription}\n\n${qnaSection}`
    },
    ...messageHistory,
    {
      role: 'user',
      content: userMessage
    }
  ];
}


async function getAIResponse(prompt) {
  try {
    const aiResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: prompt,
      temperature: 0.7
    });
    return aiResponse.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error.message);
    return 'Sorry, I am unable to process your request right now. Please try again later.';
  }
}

module.exports = { buildPrompt, getAIResponse };
