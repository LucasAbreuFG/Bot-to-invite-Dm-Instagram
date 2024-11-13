const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'my_secure_token_123';
const PORT = process.env.PORT || 3000;

// Endpoint para verificação do Webhook
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  // Verifica o token e responde ao desafio
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verificado com sucesso!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403); // Token inválido
    }
  }
});

// Endpoint para receber eventos (mensagens, DMs, etc.)
app.post('/webhook', (req, res) => {
  const body = req.body;

  // Verifica se o evento é do Instagram
  if (body.object === 'instagram') {
    body.entry.forEach(entry => {
      // Loop pelos eventos recebidos
      entry.messaging.forEach(event => {
        if (event.message) {
          const senderId = event.sender.id;
          const messageText = event.message.text;

          console.log(`Mensagem recebida de ${senderId}: ${messageText}`);

          // Aqui você pode adicionar respostas automáticas
          if (messageText.toLowerCase().includes('serviço')) {
            sendReply(senderId, 'Obrigado pelo interesse! Vamos te enviar mais informações sobre nossos serviços.');
          }
        }
      });
    });
    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Função para enviar respostas automáticas
const sendReply = (recipientId, message) => {
  const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
  const request = require('request');

  const requestBody = {
    messaging_type: 'RESPONSE',
    recipient: {
      id: recipientId,
    },
    message: {
      text: message,
    },
  };

  // Envia uma requisição para a Graph API
  request(
    {
      uri: `https://graph.facebook.com/v17.0/me/messages`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: requestBody,
    },
    (err, res, body) => {
      if (!err) {
        console.log('Mensagem enviada com sucesso!');
      } else {
        console.error('Erro ao enviar mensagem:', err);
      }
    }
  );
};

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
