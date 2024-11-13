const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const { handleIncomingMessage } = require('./handlers/messageHandler');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

// Configuração do Webhook para verificação
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.status(403).send('Forbidden');
  }
});

// Endpoint para receber mensagens
app.post('/webhook', async (req, res) => {
  const body = req.body;

  if (body.object === 'instagram') {
    const entry = body.entry[0];
    const messaging = entry.messaging[0];
    const senderId = messaging.sender.id;
    const message = messaging.message.text;

    if (message) {
      await handleIncomingMessage(senderId, message);
    }
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
