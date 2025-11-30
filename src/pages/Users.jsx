import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import Modal from '../components/Modal';
import AnimatedText from '../components/AnimatedText';
import { dataService } from '../services/dataService';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterClassroom, setFilterClassroom] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Carregar usuários
      const { mockUsers } = await import('../services/mockData.js');
      
      const existingUsers = localStorage.getItem('mockUsers');
      const existingMap = new Map();
      
      if (existingUsers) {
        const existing = JSON.parse(existingUsers);
        existing.forEach(user => {
          existingMap.set(user.email, user.id);
        });
      }
      
      let nextId = 1;
      const usersList = mockUsers.map(mockUser => {
        const existingId = existingMap.get(mockUser.email);
        return {
          ...mockUser,
          id: existingId || (mockUser.id || nextId++)
        };
      });
      
      usersList.sort((a, b) => a.id - b.id);
      localStorage.setItem('mockUsers', JSON.stringify(usersList));
      setUsers(usersList);

      // Carregar salas
      const classroomsList = await dataService.getClassrooms();
      setClassrooms(classroomsList);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const usersList = await dataService.getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const getRoleLabel = (role) => {
    const roles = {
      'ADMIN': 'Administrador',
      'TEACHER': 'Professor',
      'STUDENT': 'Aluno',
      'DEV': 'Dev'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      'ADMIN': 'bg-red-500',
      'TEACHER': 'bg-blue-500',
      'STUDENT': 'bg-green-500',
      'DEV': 'bg-purple-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  const isStarredUser = (email) => {
    const starredEmails = [
      'pedro.augusto@eaduck.com',
      'gabriel.sales@eaduck.com',
      'aleardo.cartocci@eaduck.com'
    ];
    return starredEmails.includes(email);
  };

  const getUserClassrooms = (userId) => {
    return classrooms.filter(c => 
      c.students?.some(s => s.id === userId) || 
      c.teachers?.some(t => t.id === userId)
    );
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || (
      user.name?.toLowerCase().includes(searchLower) ||
      user.nomeCompleto?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
    
    const matchesRole = !filterRole || user.role === filterRole;
    
    const matchesClassroom = !filterClassroom || (() => {
      const userClassrooms = getUserClassrooms(user.id);
      return userClassrooms.some(c => c.id.toString() === filterClassroom);
    })();
    
    return matchesSearch && matchesRole && matchesClassroom;
  }).sort((a, b) => {
    // Colocar usuários com estrela primeiro
    const aIsStarred = isStarredUser(a.email);
    const bIsStarred = isStarredUser(b.email);
    if (aIsStarred && !bIsStarred) return -1;
    if (!aIsStarred && bIsStarred) return 1;
    // Manter ordem original entre os com estrela
    if (aIsStarred && bIsStarred) {
      const starredOrder = ['pedro.augusto@eaduck.com', 'gabriel.sales@eaduck.com', 'aleardo.cartocci@eaduck.com'];
      return starredOrder.indexOf(a.email) - starredOrder.indexOf(b.email);
    }
    return 0;
  });

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      nomeCompleto: user.nomeCompleto || '',
      email: user.email || '',
      cpf: user.cpf || '',
      telefone: user.telefone || '',
      endereco: user.endereco || '',
      dataNascimento: user.dataNascimento || '',
      nomeMae: user.nomeMae || '',
      nomePai: user.nomePai || '',
      titulacao: user.titulacao || '',
      isActive: user.isActive !== false
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;

    try {
      await dataService.updateUser(editingUser.id, editFormData);
      await loadUsers();
      setShowEditModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar usuário');
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingUser(null);
    setEditFormData({});
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
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <MobileMenuButton />
      <div className="flex-1 ml-0 md:ml-64 p-3 md:p-4 lg:p-8 pt-16 md:pt-28">
        <div className="mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 md:mb-4 gap-3">
            <h1 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Usuários
            </h1>
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  localStorage.removeItem('mockUsers');
                  loadData();
                }}
                className="flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg font-semibold transition-all text-xs md:text-sm min-h-[44px]"
                style={{
                  background: 'var(--error-color)',
                  color: 'white'
                }}
              >
                Recarregar
              </button>
              <button
                onClick={loadUsers}
                className="flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-lg font-semibold transition-all text-xs md:text-sm min-h-[44px]"
                style={{
                  background: 'var(--button-bg)',
                  color: 'var(--button-text)'
                }}
              >
                Atualizar
              </button>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
            <input
              type="text"
              placeholder="Buscar por nome, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2.5 md:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-sm md:text-base min-h-[44px]"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2.5 md:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-sm md:text-base min-h-[44px]"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            >
              <option value="">Todos os tipos</option>
              <option value="ADMIN">Administrador</option>
              <option value="TEACHER">Professor</option>
              <option value="STUDENT">Aluno</option>
              <option value="DEV">Dev</option>
            </select>
            <select
              value={filterClassroom}
              onChange={(e) => setFilterClassroom(e.target.value)}
              className="px-4 py-2.5 md:py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none text-sm md:text-base min-h-[44px]"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            >
              <option value="">Todas as salas</option>
              {classrooms.map(classroom => (
                <option key={classroom.id} value={classroom.id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs md:text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total: {filteredUsers.length} usuário(s)
          </p>
        </div>

        {/* Cards de usuários (Mobile) */}
        <div className="md:hidden space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="p-6 text-center rounded-xl shadow-lg" style={{ background: 'var(--panel-bg)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Nenhum usuário encontrado</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl shadow-lg p-4"
                style={{ background: 'var(--panel-bg)' }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                        {user.nomeCompleto || user.name || 'Sem nome'}
                      </h3>
                      {isStarredUser(user.email) && (
                        <span className="text-yellow-400 text-lg flex-shrink-0" title="Usuário destacado">
                          ⭐
                        </span>
                      )}
                    </div>
                    {user.nomeCompleto && user.name !== user.nomeCompleto && (
                      <p className="text-xs mb-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                        {user.name}
                      </p>
                    )}
                    <p className="text-xs truncate mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {user.email}
                    </p>
                  </div>
                  {!isStarredUser(user.email) && (
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                      style={{ 
                        color: 'var(--accent-color)',
                        background: 'var(--bg-secondary)'
                      }}
                      title="Editar usuário"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                  {isStarredUser(user.email) ? (
                    <div className="flex items-center">
                      <AnimatedText 
                        text="DEV" 
                        speed={60}
                        className="text-green-500 text-xs"
                      />
                    </div>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tabela de usuários (Desktop) */}
        <div 
          className="hidden md:block rounded-xl shadow-lg overflow-hidden"
          style={{ background: 'var(--panel-bg)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Ações
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Nome
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Email
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Tipo
                  </th>
                  <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center" style={{ color: 'var(--text-secondary)' }}>
                      Nenhum usuário encontrado
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-opacity-50" style={{ backgroundColor: 'transparent' }}>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {!isStarredUser(user.email) && (
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-2 rounded-lg hover:bg-gray-700 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                            style={{ color: 'var(--accent-color)' }}
                            title="Editar usuário"
                          >
                            <span className="material-icons text-lg">edit</span>
                          </button>
                        )}
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <div>
                            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                              {user.nomeCompleto || user.name || 'Sem nome'}
                            </div>
                            {user.nomeCompleto && user.name !== user.nomeCompleto && (
                              <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                {user.name}
                              </div>
                            )}
                          </div>
                          {isStarredUser(user.email) && (
                            <span className="text-yellow-400 text-lg ml-1" title="Usuário destacado">
                              ⭐
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                          {user.email}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                        {isStarredUser(user.email) ? (
                          <div className="flex items-center">
                            <AnimatedText 
                              text="DEV" 
                              speed={60}
                              className="text-green-500"
                            />
                          </div>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <Modal
        visible={showEditModal}
        type="info"
        title="Editar Usuário"
        message=""
        onClose={handleCancelEdit}
      >
        {editingUser && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Nome
              </label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Nome Completo
              </label>
              <input
                type="text"
                value={editFormData.nomeCompleto}
                onChange={(e) => setEditFormData({ ...editFormData, nomeCompleto: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Email
              </label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                CPF
              </label>
              <input
                type="text"
                value={editFormData.cpf}
                onChange={(e) => setEditFormData({ ...editFormData, cpf: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
            </div>
            {editingUser.role === 'STUDENT' && (
              <>
                <div>
                  <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={editFormData.dataNascimento}
                    onChange={(e) => setEditFormData({ ...editFormData, dataNascimento: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                    style={{
                      background: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      border: '1px solid var(--input-border)'
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Nome da Mãe
                  </label>
                  <input
                    type="text"
                    value={editFormData.nomeMae}
                    onChange={(e) => setEditFormData({ ...editFormData, nomeMae: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                    style={{
                      background: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      border: '1px solid var(--input-border)'
                    }}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Nome do Pai
                  </label>
                  <input
                    type="text"
                    value={editFormData.nomePai}
                    onChange={(e) => setEditFormData({ ...editFormData, nomePai: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                    style={{
                      background: 'var(--input-bg)',
                      color: 'var(--input-text)',
                      border: '1px solid var(--input-border)'
                    }}
                  />
                </div>
              </>
            )}
            {editingUser.role === 'TEACHER' && (
              <div>
                <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Titulação
                </label>
                <input
                  type="text"
                  value={editFormData.titulacao}
                  onChange={(e) => setEditFormData({ ...editFormData, titulacao: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    border: '1px solid var(--input-border)'
                  }}
                />
              </div>
            )}
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Telefone
              </label>
              <input
                type="text"
                value={editFormData.telefone}
                onChange={(e) => setEditFormData({ ...editFormData, telefone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Endereço
              </label>
              <input
                type="text"
                value={editFormData.endereco}
                onChange={(e) => setEditFormData({ ...editFormData, endereco: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={editFormData.isActive}
                onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Usuário Ativo
              </label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: 'var(--button-bg)',
                  color: 'var(--button-text)'
                }}
              >
                Salvar
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: 'var(--text-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Users;
