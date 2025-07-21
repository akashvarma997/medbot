# WhatsApp Chatbot
This repository contains a Node.js-based WhatsApp chatbot that delivers **AI-powered, context-aware medical support** for patients undergoing surgical procedures. It provides intelligent responses based on real-time patient data and surgery-specific clinical protocols to assist with **pre- and post-operative care**, as well as general health queries.

---

## ✨ Features

- **GPT-4-Driven Responses**  
  Integrates OpenAI’s GPT-4 API to deliver high-quality, concise medical conversations tailored to the patient’s clinical context.

- **WhatsApp Integration**  
  Uses the WhatsApp Business Cloud API to enable real-time messaging with patients.

- **Patient Data Personalization**  
  Dynamically retrieves patient records from a CSV database and builds responses accordingly.

- **Surgery-Specific Q&A Engine**  
  Maps patient surgery types to dedicated CSV files containing curated doctor-provided Q&A content.

- **Session Memory**  
  Maintains short-term chat history (up to 10 exchanges) to preserve conversational context across multiple turns.

---

## 🧪 **Tech Stack**
- Node.js (Express.js)

- OpenAI GPT-4 API

- WhatsApp Cloud API

- MongoDB (optional, currently using CSV)

- CSV Parser

- Dotenv for config

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/whatsapp-chatbot.git
   ```
2. Install the dependencies:
   ```
   cd whatsapp-chatbot
   npm install
   ```
3. Create a `.env` file in the project root and add the following environment variables:
   ```
   OPENAI_API_KEY=your-openai-api-key
   WHATSAPP_PHONE_ID=your-whatsapp-phone-id
   WHATSAPP_TOKEN=your-whatsapp-access-token
   WHATSAPP_VERIFY_TOKEN=mychatbot123
   ```

## Usage

1. Start the server:
   ```
   npm start
   ```
2. The server will start running on the specified port (default is 3000).
3. Send a message to the WhatsApp number associated with your WhatsApp Business API account, and the chatbot will respond with relevant information based on the user's message and the patient's medical data.

## API

The chatbot exposes the following API endpoints:

1. `GET /webhook`: This endpoint is used for the WhatsApp Business API webhook verification process.
2. `POST /webhook`: This endpoint receives incoming messages from the WhatsApp Business API and processes them.
