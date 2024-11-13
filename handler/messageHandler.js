const axios = require('axios');
const { getScriptedResponse } = require('../responses/scriptedResponses');
require('dotenv').config();

const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const userStates = {};

// Função para enviar uma mensagem simples
async function sendTextMessage(senderId, messageText) {
  const url = `https://graph.facebook.com/v17.0/${senderId}/messages`;
  const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: { id: senderId },
    message: { text: messageText },
  };

  try {
    await axios.post(url, payload, { headers });
    console.log(`Mensagem enviada para ${senderId}: ${messageText}`);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error.response?.data || error.message);
  }
}

// Função para enviar uma mensagem com botões
async function sendQuickReply(senderId, messageText, quickReplies) {
  const url = `https://graph.facebook.com/v17.0/${senderId}/messages`;
  const headers = { Authorization: `Bearer ${ACCESS_TOKEN}` };
  const payload = {
    messaging_type: 'RESPONSE',
    recipient: { id: senderId },
    message: {
      text: messageText,
      quick_replies: quickReplies,
    },
  };

  try {
    await axios.post(url, payload, { headers });
    console.log(`Mensagem com botões enviada para ${senderId}`);
  } catch (error) {
    console.error('Erro ao enviar mensagem com botões:', error.response?.data || error.message);
  }
}

// Função para lidar com mensagens recebidas
async function handleIncomingMessage(senderId, messageText) {
  const userState = userStates[senderId] || null;
  
  // Obter resposta com base no estado do usuário
  const { response, quickReplies, nextState } = getScriptedResponse(messageText, userState);

  if (response) {
    if (quickReplies) {
      await sendQuickReply(senderId, response, quickReplies);
    } else {
      await sendTextMessage(senderId, response);
    }
  }

  // Atualizar o estado do usuário
  if (nextState) {
    userStates[senderId] = nextState;
  } else {
    delete userStates[senderId];
  }
}

module.exports = { handleIncomingMessage };
