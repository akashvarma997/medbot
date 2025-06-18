const OpenAI = require('openai');


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// function buildPrompt(data, messageHistory, userMessage) {
//   return [
//     {
//       role: 'system',
//       content: 'You are a professional medical assistant helping patients with pre/post surgery and prescription-related questions. Do not reveal or assume any personal identifiers.'
//     },
//     {
//       role: 'assistant',
//       content: `Patient Info:\nPrescription: ${data.prescription}\nMedical History: ${data.history}`
//     },
//     ...messageHistory,
//     {
//       role: 'user',
//       content: userMessage
//     }
//   ];
// }

function buildPrompt(data, messageHistory, userMessage) {
  return [
    {
      role: 'system',
      content: `
You are a professional medical assistant helping patients with queries related to their prescriptions, surgeries, recovery, and general care.

Respond in a **short, clear, and precise** manner. Avoid lengthy explanations or paragraphs.

If the patient asks about a medication listed in their prescription, provide a **direct answer** about its use. Do **not** give general advice unless the user explicitly asks for it.

If the patient asks about exercises or food:
- If doctor advice is available in the patient's data (e.g., exercises or food restrictions), clearly say:  
  “Your doctor has advised you to…” followed by the list.
- If there is **no advice from the doctor**, check if the patient has a medical/surgical history, and based on that, suggest common recovery-friendly exercises or food guidelines. Clearly note at the end:  
  “This is general advice. Please consult your doctor before following.”

Do **not** include disclaimers like “This is not medical advice...” in every message. Only mention that it’s general advice **if applicable**.

Never refer to the user by name or include personal identifiers.

Keep the tone professional, friendly, and efficient.
      `.trim()
    },
    {
      role: 'assistant',
      content: `Patient Data:\nPrescription: ${data.prescription}\nMedical History: ${data.history}`
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
