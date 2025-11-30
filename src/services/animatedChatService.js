// Serviço para gerar conversas animadas automaticamente

// Conversas pré-definidas para diferentes contextos
const conversationTemplates = [
  // Início de aula
  {
    context: 'inicio',
    messages: [
      { role: 'teacher', delay: 0, text: 'Bom dia, turma! Como estão hoje?' },
      { role: 'student', delay: 3000, text: 'Bom dia, professor! Estou bem!' },
      { role: 'student', delay: 5000, text: 'Bom dia! Tudo certo aqui também' },
      { role: 'teacher', delay: 8000, text: 'Ótimo! Hoje vamos trabalhar com um conteúdo novo' },
    ]
  },
  // Dúvidas sobre matéria
  {
    context: 'duvida',
    messages: [
      { role: 'student', delay: 0, text: 'Professor, tenho uma dúvida sobre o exercício 5' },
      { role: 'teacher', delay: 4000, text: 'Claro! Qual é sua dúvida?' },
      { role: 'student', delay: 7000, text: 'Não entendi como resolver a equação do segundo grau' },
      { role: 'teacher', delay: 12000, text: 'Vou explicar passo a passo. Primeiro, você precisa identificar os coeficientes a, b e c' },
      { role: 'student', delay: 18000, text: 'Ah, entendi! Obrigado, professor' },
    ]
  },
  // Discussão sobre trabalho
  {
    context: 'trabalho',
    messages: [
      { role: 'teacher', delay: 0, text: 'Lembrem-se: o trabalho em grupo deve ser entregue até sexta-feira' },
      { role: 'student', delay: 5000, text: 'Professor, pode ser em dupla?' },
      { role: 'teacher', delay: 9000, text: 'Sim, pode ser em dupla ou trio, no máximo' },
      { role: 'student', delay: 14000, text: 'Perfeito! Já estou organizando com meu grupo' },
    ]
  },
  // Conversa casual
  {
    context: 'casual',
    messages: [
      { role: 'student', delay: 0, text: 'Alguém conseguiu fazer o exercício 3?' },
      { role: 'student', delay: 4000, text: 'Eu consegui! Se quiser, posso ajudar' },
      { role: 'student', delay: 8000, text: 'Obrigado! Vou te chamar depois' },
    ]
  },
  // Explicação de conteúdo
  {
    context: 'explicacao',
    messages: [
      { role: 'teacher', delay: 0, text: 'Vou explicar um conceito importante agora' },
      { role: 'teacher', delay: 5000, text: 'Prestem atenção porque vai cair na prova' },
      { role: 'student', delay: 10000, text: 'Professor, pode repetir a última parte?' },
      { role: 'teacher', delay: 15000, text: 'Claro! Vou repetir de forma mais detalhada' },
    ]
  },
  // Ajuda com material
  {
    context: 'material',
    messages: [
      { role: 'student', delay: 0, text: 'Professor, onde encontro o material da última aula?' },
      { role: 'teacher', delay: 4000, text: 'Está na pasta "Materiais" do Google Drive' },
      { role: 'student', delay: 8000, text: 'Encontrei! Obrigado' },
    ]
  },
  // Discussão sobre nota
  {
    context: 'nota',
    messages: [
      { role: 'student', delay: 0, text: 'Professor, quando saem as notas da prova?' },
      { role: 'teacher', delay: 5000, text: 'Até o final da semana, estou corrigindo ainda' },
      { role: 'student', delay: 10000, text: 'Entendi, obrigado!' },
    ]
  },
  // Pergunta sobre horário
  {
    context: 'horario',
    messages: [
      { role: 'student', delay: 0, text: 'Professor, a aula de hoje vai até que horas?' },
      { role: 'teacher', delay: 4000, text: 'Até as 11h30, como sempre' },
      { role: 'student', delay: 7000, text: 'Ok, obrigado pela informação!' },
    ]
  },
  // Dúvida sobre prazo
  {
    context: 'prazo',
    messages: [
      { role: 'student', delay: 0, text: 'Professor, qual é o prazo para entregar o trabalho?' },
      { role: 'teacher', delay: 4000, text: 'O prazo é até o dia 25 deste mês' },
      { role: 'student', delay: 8000, text: 'Entendido! Vou me organizar' },
    ]
  },
  // Discussão entre alunos
  {
    context: 'discussao',
    messages: [
      { role: 'student', delay: 0, text: 'Alguém pode me ajudar com a questão 7?' },
      { role: 'student', delay: 5000, text: 'Eu posso! Qual parte você não entendeu?' },
      { role: 'student', delay: 10000, text: 'A parte da fórmula, não consegui aplicar' },
      { role: 'student', delay: 15000, text: 'Te explico depois da aula, combinado?' },
    ]
  },
  // Anúncio do professor
  {
    context: 'anuncio',
    messages: [
      { role: 'teacher', delay: 0, text: 'Pessoal, lembrem-se da prova na próxima semana' },
      { role: 'teacher', delay: 5000, text: 'Vai cobrir todo o conteúdo que vimos até agora' },
      { role: 'student', delay: 10000, text: 'Professor, vai ter revisão?' },
      { role: 'teacher', delay: 15000, text: 'Sim, na quinta-feira faremos uma revisão completa' },
    ]
  },
  // Pergunta sobre conteúdo
  {
    context: 'conteudo',
    messages: [
      { role: 'student', delay: 0, text: 'Professor, esse conteúdo vai cair na prova?' },
      { role: 'teacher', delay: 4000, text: 'Sim, é importante estudar bem esse tópico' },
      { role: 'student', delay: 8000, text: 'Obrigado pela informação!' },
    ]
  }
];

// Gerar conversas realistas para uma sala
export const generateAnimatedConversations = (classroom, users, startTime) => {
  const conversations = [];
  const classroomUsers = users.filter(u => 
    classroom.students?.some(s => s.id === u.id) || 
    classroom.teachers?.some(t => t.id === u.id)
  );
  
  const teachers = classroomUsers.filter(u => u.role === 'TEACHER');
  const students = classroomUsers.filter(u => u.role === 'STUDENT');
  
  if (teachers.length === 0 || students.length === 0) {
    return conversations;
  }

  const teacher = teachers[0];
  let currentTime = startTime;
  let messageId = 1;

  // Gerar múltiplas conversas ao longo de 25 minutos (1500 segundos)
  const totalDuration = 25 * 60 * 1000; // 25 minutos em milissegundos
  const endTime = startTime + totalDuration;

  // Selecionar templates aleatórios e gerar mensagens
  while (currentTime < endTime) {
    const template = conversationTemplates[Math.floor(Math.random() * conversationTemplates.length)];
    const selectedStudents = students.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, students.length));
    
    let lastDelay = 0;
    template.messages.forEach((msgTemplate) => {
      if (currentTime + msgTemplate.delay > endTime) return;
      
      const sender = msgTemplate.role === 'teacher' 
        ? teacher 
        : selectedStudents[Math.floor(Math.random() * selectedStudents.length)];
      
      if (!sender) return;

      conversations.push({
        id: messageId++,
        type: 'CHAT',
        content: msgTemplate.text,
        sender: sender.email,
        senderName: sender.nomeCompleto || sender.name,
        senderRole: sender.role,
        senderEmail: sender.email,
        classroomId: classroom.id,
        createdAt: new Date(currentTime + msgTemplate.delay).toISOString(),
        timestamp: currentTime + msgTemplate.delay,
        animated: true
      });
      
      lastDelay = Math.max(lastDelay, msgTemplate.delay);
    });

    // Avançar tempo (intervalo entre conversas: 20-90 segundos para gerar mais mensagens)
    currentTime += lastDelay + (20000 + Math.random() * 70000); // 20-90 segundos
  }
  
  // Garantir que temos pelo menos mensagens suficientes para 25 minutos
  // Se não tiver, adicionar mais conversas
  if (conversations.length < 30) {
    const additionalTime = endTime - currentTime;
    const additionalConversations = Math.floor(additionalTime / 60000); // conversas por minuto
    
    for (let i = 0; i < additionalConversations && currentTime < endTime; i++) {
      const template = conversationTemplates[Math.floor(Math.random() * conversationTemplates.length)];
      const selectedStudents = students.sort(() => 0.5 - Math.random()).slice(0, Math.min(3, students.length));
      
      let lastDelay = 0;
      template.messages.forEach((msgTemplate) => {
        if (currentTime + msgTemplate.delay > endTime) return;
        
        const sender = msgTemplate.role === 'teacher' 
          ? teacher 
          : selectedStudents[Math.floor(Math.random() * selectedStudents.length)];
        
        if (!sender) return;

        conversations.push({
          id: messageId++,
          type: 'CHAT',
          content: msgTemplate.text,
          sender: sender.email,
          senderName: sender.nomeCompleto || sender.name,
          senderRole: sender.role,
          senderEmail: sender.email,
          classroomId: classroom.id,
          createdAt: new Date(currentTime + msgTemplate.delay).toISOString(),
          timestamp: currentTime + msgTemplate.delay,
          animated: true
        });
        
        lastDelay = Math.max(lastDelay, msgTemplate.delay);
      });

      currentTime += lastDelay + (20000 + Math.random() * 70000);
    }
  }

  // Ordenar por timestamp
  conversations.sort((a, b) => a.timestamp - b.timestamp);
  
  return conversations;
};

// Inicializar conversas animadas para todas as salas
export const initializeAnimatedChats = async (classrooms, users) => {
  const loginTime = Date.now();
  const allMessages = [];
  
  classrooms.forEach(classroom => {
    if (classroom.isActive) {
      const messages = generateAnimatedConversations(classroom, users, loginTime);
      allMessages.push(...messages);
    }
  });

  // Salvar no localStorage
  const existingMessages = JSON.parse(localStorage.getItem('mockChatMessages') || '[]');
  
  // Remover mensagens animadas antigas antes de adicionar novas
  const nonAnimatedMessages = existingMessages.filter(m => !m.animated);
  const newMessages = [...nonAnimatedMessages, ...allMessages];
  
  // Ordenar por timestamp
  newMessages.sort((a, b) => {
    const timeA = new Date(a.createdAt || a.timestamp).getTime();
    const timeB = new Date(b.createdAt || b.timestamp).getTime();
    return timeA - timeB;
  });

  localStorage.setItem('mockChatMessages', JSON.stringify(newMessages));
  
  return allMessages;
};

// Verificar se já foram inicializadas as conversas na sessão atual
export const shouldInitializeChats = () => {
  const sessionKey = `animatedChatsSession_${Date.now().toString().slice(0, -6)}`; // Por hora
  const lastInit = localStorage.getItem('animatedChatsLastInit');
  
  // Se não há inicialização ou foi há mais de 1 hora, inicializar
  if (!lastInit) return true;
  
  const lastInitTime = parseInt(lastInit);
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  return lastInitTime < oneHourAgo;
};

// Marcar como inicializado
export const markChatsAsInitialized = () => {
  localStorage.setItem('animatedChatsLastInit', Date.now().toString());
};

