import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterRead, setFilterRead] = useState('ALL');
  const [users, setUsers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    notificationType: 'AVISO'
  });
  const [recipientType, setRecipientType] = useState('USER');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState(null);
  const [sendError, setSendError] = useState(null);

  const currentUser = authService.getCurrentUser();
  const isAdminOrTeacher = currentUser?.role === 'ADMIN' || currentUser?.role === 'TEACHER';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      let usersList = [];
      let classroomsList = [];
      
      if (isAdminOrTeacher) {
        [usersList, classroomsList] = await Promise.all([
          dataService.getUsers(),
          dataService.getClassrooms()
        ]);
        setUsers(usersList);
        setClassrooms(classroomsList);
      } else {
        classroomsList = await dataService.getClassrooms();
        setClassrooms(classroomsList);
      }
      
      const notificationsList = await dataService.getNotifications();
      
      // Filtrar notificações do usuário atual ou todas se for admin/teacher
      const filtered = isAdminOrTeacher 
        ? notificationsList 
        : notificationsList.filter(n => {
            if (n.userId === currentUser?.id) return true;
            if (n.classroomId) {
              const classroom = classroomsList.find(c => c.id === n.classroomId);
              if (!classroom) return false;
              const studentIds = (classroom.students || []).map(s => s.id);
              const teacherIds = (classroom.teachers || []).map(t => t.id);
              return [...studentIds, ...teacherIds].includes(currentUser?.id);
            }
            return false;
          });
      
      setNotifications(filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notification) => {
    if (notification.isRead) return;
    try {
      await dataService.markNotificationAsRead(notification.id);
      await loadData();
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  };

  const openModal = () => {
    if (!isAdminOrTeacher) return;
    setShowModal(true);
    setNewNotification({ title: '', message: '', notificationType: 'AVISO' });
    setRecipientType('USER');
    setSelectedUserId(null);
    setSelectedClassroomId(null);
    setSendError(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setSendError(null);
  };

  const sendNotification = async () => {
    if (!isAdminOrTeacher) return;
    setSendError(null);
    
    if (!newNotification.title || !newNotification.message) {
      setSendError('Preencha todos os campos obrigatórios.');
      return;
    }

    if (recipientType === 'USER' && !selectedUserId) {
      setSendError('Selecione um usuário.');
      return;
    }

    if (recipientType === 'CLASSROOM' && !selectedClassroomId) {
      setSendError('Selecione uma turma.');
      return;
    }

    try {
      const notificationData = {
        ...newNotification,
        createdAt: new Date().toISOString(),
        isRead: false
      };

      if (recipientType === 'USER') {
        notificationData.userId = selectedUserId;
      } else {
        notificationData.classroomId = selectedClassroomId;
      }

      await dataService.createNotification(notificationData);
      setShowModal(false);
      setNewNotification({ title: '', message: '', notificationType: 'AVISO' });
      setSelectedUserId(null);
      setSelectedClassroomId(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      setSendError('Erro ao enviar notificação. Tente novamente.');
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesText = searchText.trim() === '' ||
      (n.title?.toLowerCase().includes(searchText.toLowerCase()) || 
       n.message?.toLowerCase().includes(searchText.toLowerCase()));
    const matchesType = filterType === 'ALL' || n.notificationType === filterType;
    const matchesRead = filterRead === 'ALL' || (filterRead === 'READ' ? n.isRead : !n.isRead);
    return matchesText && matchesType && matchesRead;
  });

  const getNotifTypeColor = (type) => {
    switch (type) {
      case 'TAREFA': return 'bg-blue-600';
      case 'FORUM': return 'bg-green-600';
      case 'SISTEMA': return 'bg-gray-600';
      case 'AVISO': return 'bg-yellow-600';
      default: return 'bg-indigo-500';
    }
  };

  const getNotifTypeIcon = (type) => {
    switch (type) {
      case 'TAREFA': return 'assignment';
      case 'FORUM': return 'forum';
      case 'SISTEMA': return 'settings';
      case 'AVISO': return 'announcement';
      default: return 'notifications';
    }
  };

  const getNotifTypeLabel = (type) => {
    switch (type) {
      case 'TAREFA': return 'Tarefa';
      case 'FORUM': return 'Fórum';
      case 'SISTEMA': return 'Sistema';
      case 'AVISO': return 'Aviso';
      default: return 'Notificação';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <MobileMenuButton />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              Notificações
              {getUnreadCount() > 0 && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: 'var(--error-color)' }}
                >
                  {getUnreadCount()}
                </span>
              )}
            </h1>
            {isAdminOrTeacher && (
              <button
                onClick={openModal}
                className="px-4 py-2 rounded-lg font-semibold transition-all text-sm flex items-center gap-2"
                style={{
                  background: 'var(--button-bg)',
                  color: 'var(--button-text)'
                }}
              >
                <span className="material-icons text-lg">add</span>
                Nova Notificação
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="space-y-4 mb-4">
            <div className="relative">
              <span className="material-icons absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                search
              </span>
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Buscar notificações..."
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Tipo
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    border: '1px solid var(--input-border)'
                  }}
                >
                  <option value="ALL">Todos os tipos</option>
                  <option value="AVISO">Aviso</option>
                  <option value="TAREFA">Tarefa</option>
                  <option value="SISTEMA">Sistema</option>
                  <option value="FORUM">Fórum</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </label>
                <select
                  value={filterRead}
                  onChange={(e) => setFilterRead(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    border: '1px solid var(--input-border)'
                  }}
                >
                  <option value="ALL">Todas</option>
                  <option value="UNREAD">Não lidas</option>
                  <option value="READ">Lidas</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Notificações */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-color)' }}></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div 
              className="rounded-xl shadow-lg p-8 text-center"
              style={{ background: 'var(--panel-bg)' }}
            >
              <span className="material-icons text-6xl mb-4" style={{ color: 'var(--text-secondary)' }}>
                notifications_none
              </span>
              <p style={{ color: 'var(--text-secondary)' }}>
                Nenhuma notificação encontrada
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification)}
                  className={`rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:scale-[1.02] ${
                    notification.isRead ? 'opacity-75' : ''
                  }`}
                  style={{ 
                    background: notification.isRead ? 'var(--panel-bg)' : 'var(--panel-bg)',
                    border: notification.isRead ? '1px solid transparent' : '2px solid var(--accent-color)'
                  }}
                >
                  {/* Header do Card */}
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`p-3 rounded-lg ${getNotifTypeColor(notification.notificationType)}`}>
                      <span className="material-icons text-white">
                        {getNotifTypeIcon(notification.notificationType)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {notification.title || 'Notificação'}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          !notification.isRead 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.isRead ? 'Lida' : 'Nova'}
                        </span>
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Body do Card */}
                  <div className="mb-3">
                    <p style={{ color: 'var(--text-primary)' }}>
                      {notification.message}
                    </p>
                  </div>

                  {/* Footer do Card */}
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getNotifTypeColor(notification.notificationType)}`}>
                      {getNotifTypeLabel(notification.notificationType)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Nova Notificação */}
      <Modal
        visible={showModal}
        type="info"
        title="Nova Notificação"
        onClose={closeModal}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Destinatário
            </label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="recipientType"
                  value="USER"
                  checked={recipientType === 'USER'}
                  onChange={(e) => setRecipientType(e.target.value)}
                />
                <span style={{ color: 'var(--text-primary)' }}>Usuário</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="recipientType"
                  value="CLASSROOM"
                  checked={recipientType === 'CLASSROOM'}
                  onChange={(e) => setRecipientType(e.target.value)}
                />
                <span style={{ color: 'var(--text-primary)' }}>Turma</span>
              </label>
            </div>
            
            {recipientType === 'USER' && (
              <select
                value={selectedUserId || ''}
                onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              >
                <option value="">Selecione o usuário</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.nomeCompleto || user.name} ({user.email})
                  </option>
                ))}
              </select>
            )}
            
            {recipientType === 'CLASSROOM' && (
              <select
                value={selectedClassroomId || ''}
                onChange={(e) => setSelectedClassroomId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              >
                <option value="">Selecione a turma</option>
                {classrooms.map(classroom => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Título *
            </label>
            <input
              type="text"
              value={newNotification.title}
              onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              placeholder="Digite o título da notificação"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Mensagem *
            </label>
            <textarea
              value={newNotification.message}
              onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
              rows="4"
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none resize-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              placeholder="Digite a mensagem da notificação"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Tipo
            </label>
            <select
              value={newNotification.notificationType}
              onChange={(e) => setNewNotification({ ...newNotification, notificationType: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            >
              <option value="AVISO">Aviso</option>
              <option value="TAREFA">Tarefa</option>
              <option value="FORUM">Fórum</option>
              <option value="SISTEMA">Sistema</option>
            </select>
          </div>
          
          {sendError && (
            <div className="p-3 rounded-lg text-sm" style={{ background: 'var(--error-color)', color: 'white' }}>
              {sendError}
            </div>
          )}
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={closeModal}
              className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: 'var(--text-secondary)',
                color: 'var(--text-primary)'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={sendNotification}
              className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              <span className="material-icons text-lg">send</span>
              Enviar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notifications;

