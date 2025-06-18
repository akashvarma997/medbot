const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const webhookRoutes = require('./routes/webhook');

const app = express();
app.use(express.json());

app.use('/', webhookRoutes);

// const PORT = process.env.PORT || 5050;
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
