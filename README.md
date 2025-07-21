# WhatsApp Chatbot

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
