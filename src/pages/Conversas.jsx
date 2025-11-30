import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';
import { initializeAnimatedChats, shouldInitializeChats, markChatsAsInitialized } from '../services/animatedChatService';

const Conversas = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const animationIntervalRef = useRef(null);
  const unreadCheckIntervalRef = useRef(null);
  const currentUser = authService.getCurrentUser();
  const loginTimeRef = useRef(Date.now());
  const lastReadMessageRef = useRef({});

  useEffect(() => {
    const init = async () => {
      await initializeAnimatedChatsIfNeeded();
      await loadClassrooms();
    };
    init();
    
    // Verificar mensagens não lidas periodicamente
    unreadCheckIntervalRef.current = setInterval(() => {
      if (classrooms.length > 0) {
        updateUnreadCounts();
      }
    }, 1000);
    
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
      if (unreadCheckIntervalRef.current) {
        clearInterval(unreadCheckIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (classrooms.length > 0) {
      updateUnreadCounts();
    }
  }, [classrooms]);

  const initializeAnimatedChatsIfNeeded = async () => {
    if (shouldInitializeChats()) {
      try {
        const classroomsList = await dataService.getClassrooms();
        const usersList = await dataService.getUsers();
        await initializeAnimatedChats(classroomsList, usersList);
        markChatsAsInitialized();
        await loadClassrooms();
        updateUnreadCounts();
      } catch (error) {
        console.error('Erro ao inicializar conversas animadas:', error);
      }
    }
  };

  useEffect(() => {
    if (selectedClassroom) {
      loadMessages(selectedClassroom.id);
      // Marcar como lida quando selecionar a sala
      setUnreadCounts(prev => ({
        ...prev,
        [selectedClassroom.id]: 0
      }));
      lastReadMessageRef.current[selectedClassroom.id] = Date.now();
      updateUnreadCounts();
      return () => {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
        }
      };
    }
  }, [selectedClassroom]);

  useEffect(() => {
    if (messages.length > 0) {
      startMessageAnimation();
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startMessageAnimation = () => {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
    }

    const updateVisibleMessages = () => {
      const now = Date.now();
      
      // Filtrar mensagens que devem aparecer baseado no tempo
      const messagesToShow = messages
        .filter(msg => {
          const messageTime = new Date(msg.createdAt || msg.timestamp).getTime();
          return messageTime <= now;
        })
        .sort((a, b) => {
          const timeA = new Date(a.createdAt || a.timestamp).getTime();
          const timeB = new Date(b.createdAt || b.timestamp).getTime();
          return timeA - timeB;
        });

      setVisibleMessages(prev => {
        if (prev.length !== messagesToShow.length) {
          return messagesToShow;
        }
        return prev;
      });
    };

    // Atualizar imediatamente
    updateVisibleMessages();

    // Verificar novas mensagens periodicamente
    animationIntervalRef.current = setInterval(() => {
      updateVisibleMessages();
    }, 500); // Verificar a cada 500ms
  };

  const updateUnreadCounts = async () => {
    try {
      const now = Date.now();
      const counts = {};
      
      for (const classroom of classrooms) {
        if (!classroom.isActive) continue;
        
        // Se a sala está selecionada, não contar como não lida
        if (selectedClassroom?.id === classroom.id) {
          counts[classroom.id] = 0;
          continue;
        }
        
        const classroomMessages = await dataService.getChatMessages(classroom.id);
        const lastReadTime = lastReadMessageRef.current[classroom.id] || loginTimeRef.current;
        
        // Contar mensagens não lidas (que apareceram após a última leitura e não são do usuário atual)
        // Considerar mensagens que apareceram nos últimos 5 segundos como "novas"
        const unread = classroomMessages.filter(msg => {
          const messageTime = new Date(msg.createdAt || msg.timestamp).getTime();
          // Mensagem apareceu recentemente (nos últimos 5 segundos) ou após a última leitura
          const appearedRecently = messageTime <= now && messageTime > (now - 5000);
          const isNew = messageTime > lastReadTime && messageTime <= now;
          const isNotMine = msg.senderEmail !== currentUser?.email && 
                           msg.sender !== currentUser?.email &&
                           (msg.senderName !== currentUser?.nomeCompleto);
          // Contar se apareceu recentemente OU se é nova e não é do usuário
          return (appearedRecently || isNew) && isNotMine;
        }).length;
        
        counts[classroom.id] = unread;
      }
      
      setUnreadCounts(counts);
    } catch (error) {
      console.error('Erro ao atualizar contadores de não lidas:', error);
    }
  };

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      const classroomsList = await dataService.getClassrooms();
      const activeClassrooms = classroomsList.filter(c => c.isActive);
      setClassrooms(activeClassrooms);
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (classroomId) => {
    try {
      const messagesList = await dataService.getChatMessages(classroomId);
      // Marcar mensagens como próprias
      const messagesWithOwnership = messagesList.map(msg => ({
        ...msg,
        isMine: msg.senderEmail === currentUser?.email || 
                msg.sender === currentUser?.email ||
                (msg.senderName && currentUser?.nomeCompleto && msg.senderName === currentUser.nomeCompleto)
      }))
      .sort((a, b) => {
        const timeA = new Date(a.createdAt || a.timestamp).getTime();
        const timeB = new Date(b.createdAt || b.timestamp).getTime();
        return timeA - timeB;
      });
      
      setMessages(messagesWithOwnership);
      startMessageAnimation();
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClassroom) return;

    try {
      const messageData = {
        classroomId: selectedClassroom.id,
        content: newMessage.trim(),
        sender: currentUser?.name || currentUser?.nomeCompleto || 'Usuário',
        senderEmail: currentUser?.email,
        type: 'CHAT'
      };

      await dataService.sendChatMessage(messageData);
      setNewMessage('');
      // Recarregar mensagens após enviar
      await loadMessages(selectedClassroom.id);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem');
    }
  };

  const filteredClassrooms = classrooms.filter(classroom => {
    const searchLower = searchTerm.toLowerCase();
    return (
      classroom.name?.toLowerCase().includes(searchLower) ||
      classroom.academicYear?.toLowerCase().includes(searchLower)
    );
  });

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    if (diff < 86400000) return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Sidebar />
        <MobileMenuButton />
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-color)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @keyframes slideInMessage {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-in {
          animation: slideInMessage 0.3s ease-out forwards;
        }
      `}</style>
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Sidebar />
        <MobileMenuButton />
      <div className="flex-1 ml-0 md:ml-64 flex flex-col h-screen pt-16 md:pt-0">
        <div className="flex flex-1 overflow-hidden">
          {/* Lista de Turmas */}
          <div className="w-full md:w-80 border-r flex flex-col" style={{ borderColor: 'var(--border-color)', background: 'var(--panel-bg)' }}>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
                Conversas
              </h2>
              <input
                type="text"
                placeholder="Buscar turma..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredClassrooms.length === 0 ? (
                <div className="p-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                  <p>Nenhuma turma encontrada</p>
                </div>
              ) : (
                <div className="p-2">
                  {filteredClassrooms.map((classroom) => {
                    const unreadCount = unreadCounts[classroom.id] || 0;
                    return (
                      <button
                        key={classroom.id}
                        onClick={() => setSelectedClassroom(classroom)}
                        className={`w-full text-left p-3 rounded-lg mb-2 transition-all relative ${
                          selectedClassroom?.id === classroom.id
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-700'
                        }`}
                        style={
                          selectedClassroom?.id !== classroom.id
                            ? { background: 'var(--input-bg)', color: 'var(--text-primary)' }
                            : {}
                        }
                      >
                        <div className="flex items-center gap-3">
                          <span className="material-icons text-2xl">
                            {selectedClassroom?.id === classroom.id ? 'chat' : 'chat_bubble_outline'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate">{classroom.name}</div>
                            <div className="text-sm opacity-75 truncate">
                              {classroom.academicYear}
                            </div>
                          </div>
                          {unreadCount > 0 && (
                            <div 
                              className="flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold text-white animate-pulse"
                              style={{ background: '#ef4444' }}
                            >
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Área de Chat */}
          <div className="flex-1 flex flex-col" style={{ background: 'var(--bg-primary)' }}>
            {selectedClassroom ? (
              <>
                {/* Header do Chat */}
                <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)', background: 'var(--panel-bg)' }}>
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                      {selectedClassroom.name}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {selectedClassroom.academicYear}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedClassroom(null)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-700"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    <span className="material-icons">close</span>
                  </button>
                </div>

                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {visibleMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
                        <span className="material-icons text-6xl mb-4 opacity-50">chat_bubble_outline</span>
                        <p>Nenhuma mensagem ainda</p>
                        <p className="text-sm mt-2">Seja o primeiro a enviar uma mensagem!</p>
                      </div>
                    </div>
                  ) : (
                    visibleMessages.map((message, index) => {
                      const messageTime = new Date(message.createdAt || message.timestamp).getTime();
                      const now = Date.now();
                      const timeSinceMessage = now - messageTime;
                      const shouldAnimate = message.animated && timeSinceMessage < 2000; // Animar se foi criada há menos de 2 segundos
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex ${message.isMine ? 'justify-end' : 'justify-start'} animate-slide-in`}
                        >
                          <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg transition-all ${
                              message.isMine
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-white'
                            }`}
                            style={
                              !message.isMine
                                ? { background: 'var(--input-bg)', color: 'var(--text-primary)' }
                                : {}
                            }
                          >
                            {!message.isMine && (
                              <div className="text-xs font-semibold mb-1 opacity-75">
                                {message.senderName || message.sender || message.senderEmail}
                              </div>
                            )}
                            <div className="text-sm whitespace-pre-wrap break-words">
                              {message.content || message.message}
                            </div>
                            <div className="text-xs mt-1 opacity-75">
                              {formatMessageTime(message.createdAt || message.timestamp)}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input de Mensagem */}
                <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)', background: 'var(--panel-bg)' }}>
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        background: 'var(--button-bg)',
                        color: 'var(--button-text)'
                      }}
                    >
                      <span className="material-icons">send</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center" style={{ color: 'var(--text-secondary)' }}>
                  <span className="material-icons text-6xl mb-4 opacity-50">chat</span>
                  <p className="text-lg">Selecione uma turma para começar a conversar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Conversas;

