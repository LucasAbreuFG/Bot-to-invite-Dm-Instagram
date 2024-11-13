// Respostas scriptadas com base em palavras-chave
const responses = {
    serviço: {
      text: `Trazer velocidade para o seu negócio é difícil né.
  Minutos e horas de trabalho perdidas fazendo planilhas, arrumando erros e até tendo o trabalho de enviá-las manualmente. 😩
  Mas veja, no mundo digital sempre há uma solução, sempre há um jeito de trazer mais agilidade, automatizar processos chatos e, acima disso, ganhar o precioso tempo seu e de seus funcionários. ⏳
  Quer conquistar o 100% da sua equipe?`,
      quickReplies: [
        { content_type: 'text', title: 'SIM', payload: 'SIM' },
        { content_type: 'text', title: 'NÃO', payload: 'NAO' },
      ],
      nextState: 'esperando_confirmacao',
    },
    
    despedida: {
      text: 'Entendo, obrigado pelo seu tempo! Se precisar de algo no futuro, estaremos por aqui. Até mais! 👋',
    },
    
    apresentacao: {
      text: `Ótimo! 🎉 Vamos mostrar como podemos ajudar sua equipe a ser mais produtiva e automatizar processos.
  Nosso serviço é especializado em automações que economizam tempo e reduzem erros. Posso te enviar uma apresentação detalhada?`,
      quickReplies: [
        { content_type: 'text', title: 'APRESENTAR', payload: 'APRESENTAR' },
        { content_type: 'text', title: 'SAIR', payload: 'SAIR' },
      ],
      nextState: 'apresentando',
    },
    
    default: {
      text: 'Desculpe, não entendi. Você pode reformular sua pergunta?',
    },
  };
  
  // Função para obter a resposta com base no texto da mensagem
  function getScriptedResponse(messageText, userState) {
    const loweredText = messageText.toLowerCase();
  
    if (userState === 'esperando_confirmacao') {
      if (loweredText.includes('sim')) {
        return { response: responses.apresentacao.text, quickReplies: responses.apresentacao.quickReplies, nextState: 'apresentando' };
      } else if (loweredText.includes('nao')) {
        return { response: responses.despedida.text, nextState: 'finalizado' };
      }
    }
  
    if (userState === 'apresentando' && loweredText.includes('apresentar')) {
      return { response: 'Aqui está nossa apresentação completa: [link para apresentação]. Se tiver dúvidas, estamos à disposição!', nextState: 'finalizado' };
    }
  
    if (loweredText.includes('serviço')) {
      return { response: responses.serviço.text, quickReplies: responses.serviço.quickReplies, nextState: 'esperando_confirmacao' };
    }
  
    return { response: responses.default.text };
  }
  
  module.exports = { getScriptedResponse };
  