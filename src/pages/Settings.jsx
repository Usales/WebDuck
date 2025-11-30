import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import { authService } from '../services/authService';
import { dataService } from '../services/dataService';

const Settings = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form data - Nome simples
  const [nameForm, setNameForm] = useState({ name: '' });

  // Form data - Teacher
  const [teacherForm, setTeacherForm] = useState({
    nomeCompleto: '',
    cpf: '',
    endereco: '',
    titulacao: '',
    titulacoes: []
  });

  // Form data - Admin
  const [adminForm, setAdminForm] = useState({
    nomeCompleto: '',
    cpf: '',
    endereco: ''
  });

  // Form data - Student
  const [studentForm, setStudentForm] = useState({
    name: '',
    nomeCompleto: '',
    cpf: '',
    dataNascimento: '',
    nomeMae: '',
    nomePai: '',
    telefone: '',
    endereco: ''
  });

  // Form data - Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    messageNotifications: true
  });

  // Form states
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingNotifications, setIsUpdatingNotifications] = useState(false);
  const [isUpdatingTeacherData, setIsUpdatingTeacherData] = useState(false);
  const [isUpdatingAdminData, setIsUpdatingAdminData] = useState(false);
  const [isUpdatingStudentData, setIsUpdatingStudentData] = useState(false);

  // Messages
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Theme
  const [currentTheme, setCurrentTheme] = useState('auto');

  useEffect(() => {
    loadUserData();
    loadTheme();
    loadNotificationSettings();
    
    // Aplicar tema ao carregar
    const applyTheme = () => {
      const saved = localStorage.getItem('theme');
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      
      if (saved === 'auto' || !saved) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.classList.add(prefersDark ? 'dark' : 'light');
      } else {
        root.classList.add(saved);
      }
    };
    
    applyTheme();
    
    // Listener para mudanças na preferência do sistema quando tema é auto
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => {
      const saved = localStorage.getItem('theme');
      if (saved === 'auto' || !saved) {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, []);

  const loadUserData = () => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      nameForm.name = user.name || '';
      setNameForm({ ...nameForm });

      // Carregar dados específicos por role
      if (user.role === 'TEACHER') {
        setTeacherForm({
          nomeCompleto: user.nomeCompleto || '',
          cpf: user.cpf || '',
          endereco: user.endereco || '',
          titulacao: '',
          titulacoes: user.titulacao ? user.titulacao.split(';').map(t => t.trim()).filter(t => t) : []
        });
      }

      if (user.role === 'ADMIN') {
        setAdminForm({
          nomeCompleto: user.nomeCompleto || '',
          cpf: user.cpf || '',
          endereco: user.endereco || ''
        });
      }

      if (user.role === 'STUDENT') {
        setStudentForm({
          name: user.name || '',
          nomeCompleto: user.nomeCompleto || '',
          cpf: user.cpf || '',
          dataNascimento: user.dataNascimento || '',
          nomeMae: user.nomeMae || '',
          nomePai: user.nomePai || '',
          telefone: user.telefone || '',
          endereco: user.endereco || ''
        });
      }
    }
    setLoading(false);
  };

  const loadTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved && (saved === 'light' || saved === 'dark' || saved === 'auto')) {
      setCurrentTheme(saved);
    } else {
      setCurrentTheme('auto');
    }
  };

  const loadNotificationSettings = () => {
    const saved = localStorage.getItem('notificationSettings');
    if (saved) {
      try {
        setNotificationSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Erro ao carregar configurações de notificação:', e);
      }
    }
  };

  const clearMessages = () => {
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };

  // Theme management
  const setTheme = (theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
      localStorage.setItem('theme', 'auto');
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }

    setCurrentTheme(theme);
  };

  // Format functions
  const formatCPF = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const formatDate = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '-' + value.substring(2);
    }
    if (value.length >= 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 9);
    }
    return value;
  };

  const formatPhone = (value) => {
    value = value.replace(/\D/g, '');
    if (value.length <= 11) {
      if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
      } else {
        value = value.replace(/(\d{2})(\d)/, '($1) $2');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
      }
    }
    return value;
  };

  // Update functions
  const updateName = async () => {
    if (!nameForm.name.trim()) {
      setErrorMessage('Nome é obrigatório');
      clearMessages();
      return;
    }

    setIsUpdatingName(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await dataService.updateUser(currentUser.id, { name: nameForm.name.trim() });
      
      // Atualizar usuário atual no localStorage
      const updatedUser = { ...currentUser, name: nameForm.name.trim() };
      localStorage.setItem('eaduck_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      setSuccessMessage('Nome atualizado com sucesso!');
      clearMessages();
    } catch (error) {
      setErrorMessage('Erro ao atualizar nome');
      clearMessages();
    } finally {
      setIsUpdatingName(false);
    }
  };

  const updatePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setErrorMessage('Todos os campos de senha são obrigatórios');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMessage('Nova senha e confirmação não coincidem');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setErrorMessage('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsUpdatingPassword(true);
    setErrorMessage('');
    setSuccessMessage('');

    // Simular atualização de senha (em um sistema real, isso seria uma chamada à API)
    setTimeout(() => {
      setIsUpdatingPassword(false);
      setSuccessMessage('Senha atualizada com sucesso!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      clearMessages();
    }, 1000);
  };

  const updateNotifications = async () => {
    setIsUpdatingNotifications(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings));
      setSuccessMessage('Configurações de notificação atualizadas!');
      clearMessages();
    } catch (error) {
      setErrorMessage('Erro ao atualizar configurações');
      clearMessages();
    } finally {
      setIsUpdatingNotifications(false);
    }
  };

  const addTitulacao = () => {
    const titulacaoTrimmed = teacherForm.titulacao?.trim() || '';
    
    if (!titulacaoTrimmed) {
      setErrorMessage('Por favor, digite uma titulação antes de adicionar');
      clearMessages();
      return;
    }

    if (teacherForm.titulacoes.includes(titulacaoTrimmed)) {
      setErrorMessage('Esta titulação já foi adicionada');
      clearMessages();
      return;
    }

    setTeacherForm({
      ...teacherForm,
      titulacoes: [...teacherForm.titulacoes, titulacaoTrimmed],
      titulacao: ''
    });
  };

  const removeTitulacao = (index) => {
    setTeacherForm({
      ...teacherForm,
      titulacoes: teacherForm.titulacoes.filter((_, i) => i !== index)
    });
  };

  const updateTeacherData = async () => {
    if (!teacherForm.nomeCompleto.trim()) {
      setErrorMessage('Nome completo é obrigatório');
      clearMessages();
      return;
    }
    if (!teacherForm.cpf.trim()) {
      setErrorMessage('CPF é obrigatório');
      clearMessages();
      return;
    }
    if (!teacherForm.endereco.trim()) {
      setErrorMessage('Endereço é obrigatório');
      clearMessages();
      return;
    }
    if (teacherForm.titulacoes.length === 0) {
      setErrorMessage('Adicione pelo menos uma titulação');
      clearMessages();
      return;
    }

    setIsUpdatingTeacherData(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updateData = {
        nomeCompleto: teacherForm.nomeCompleto.trim(),
        cpf: teacherForm.cpf.trim(),
        endereco: teacherForm.endereco.trim(),
        titulacao: teacherForm.titulacoes.join('; ')
      };

      await dataService.updateUser(currentUser.id, updateData);

      const updatedUser = { ...currentUser, ...updateData };
      localStorage.setItem('eaduck_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setSuccessMessage('Dados atualizados com sucesso!');
      clearMessages();
    } catch (error) {
      setErrorMessage('Erro ao atualizar dados');
      clearMessages();
    } finally {
      setIsUpdatingTeacherData(false);
    }
  };

  const updateAdminData = async () => {
    if (!adminForm.nomeCompleto.trim()) {
      setErrorMessage('Nome completo é obrigatório');
      clearMessages();
      return;
    }
    if (!adminForm.cpf.trim()) {
      setErrorMessage('CPF é obrigatório');
      clearMessages();
      return;
    }
    if (!adminForm.endereco.trim()) {
      setErrorMessage('Endereço é obrigatório');
      clearMessages();
      return;
    }

    setIsUpdatingAdminData(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updateData = {
        nomeCompleto: adminForm.nomeCompleto.trim(),
        cpf: adminForm.cpf.trim(),
        endereco: adminForm.endereco.trim()
      };

      await dataService.updateUser(currentUser.id, updateData);

      const updatedUser = { ...currentUser, ...updateData };
      localStorage.setItem('eaduck_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setSuccessMessage('Dados atualizados com sucesso!');
      clearMessages();
    } catch (error) {
      setErrorMessage('Erro ao atualizar dados');
      clearMessages();
    } finally {
      setIsUpdatingAdminData(false);
    }
  };

  const updateStudentData = async () => {
    if (!studentForm.name.trim()) {
      setErrorMessage('Apelido/Nickname é obrigatório');
      clearMessages();
      return;
    }
    if (!studentForm.nomeCompleto.trim()) {
      setErrorMessage('Nome completo é obrigatório');
      clearMessages();
      return;
    }
    if (!studentForm.cpf.trim()) {
      setErrorMessage('CPF é obrigatório');
      clearMessages();
      return;
    }
    if (!studentForm.dataNascimento.trim() || studentForm.dataNascimento.length !== 10) {
      setErrorMessage('Data de nascimento é obrigatória (formato dd-mm-aaaa)');
      clearMessages();
      return;
    }
    if (!studentForm.nomeMae.trim()) {
      setErrorMessage('Nome da mãe é obrigatório');
      clearMessages();
      return;
    }
    if (!studentForm.nomePai.trim()) {
      setErrorMessage('Nome do pai é obrigatório');
      clearMessages();
      return;
    }
    if (!studentForm.telefone.trim()) {
      setErrorMessage('Telefone de contato é obrigatório');
      clearMessages();
      return;
    }
    if (!studentForm.endereco.trim()) {
      setErrorMessage('Endereço é obrigatório');
      clearMessages();
      return;
    }

    setIsUpdatingStudentData(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const updateData = {
        name: studentForm.name.trim(),
        nomeCompleto: studentForm.nomeCompleto.trim(),
        cpf: studentForm.cpf.trim(),
        dataNascimento: studentForm.dataNascimento.trim(),
        nomeMae: studentForm.nomeMae.trim(),
        nomePai: studentForm.nomePai.trim(),
        telefone: studentForm.telefone.trim(),
        endereco: studentForm.endereco.trim()
      };

      await dataService.updateUser(currentUser.id, updateData);

      const updatedUser = { ...currentUser, ...updateData };
      localStorage.setItem('eaduck_user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      setSuccessMessage('Dados atualizados com sucesso!');
      clearMessages();
    } catch (error) {
      setErrorMessage('Erro ao atualizar dados');
      clearMessages();
    } finally {
      setIsUpdatingStudentData(false);
    }
  };

  const isTeacher = currentUser?.role === 'TEACHER';
  const isAdmin = currentUser?.role === 'ADMIN';
  const isStudent = currentUser?.role === 'STUDENT';

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
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="material-icons">settings</span>
            Configurações
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Gerencie suas preferências e informações pessoais
          </p>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mb-4 p-4 rounded-lg flex items-center gap-2" style={{ background: 'var(--success-bg)', color: 'var(--success-color)' }}>
            <span className="material-icons">check_circle</span>
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-4 rounded-lg flex items-center gap-2" style={{ background: 'var(--error-bg)', color: 'var(--error-color)' }}>
            <span className="material-icons">error</span>
            {errorMessage}
          </div>
        )}

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Informações Pessoais */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: 'var(--panel-bg)' }}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span className="material-icons">person</span>
                Informações Pessoais
              </h2>
            </div>

            <div className="space-y-4">
              {/* Campos para Administradores */}
              {isAdmin && (
                <>
                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      disabled
                    />
                    <small className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      O email não pode ser alterado
                    </small>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Nome Completo <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={adminForm.nomeCompleto}
                      onChange={(e) => setAdminForm({ ...adminForm, nomeCompleto: e.target.value })}
                      disabled={isUpdatingAdminData}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      CPF <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={adminForm.cpf}
                      onChange={(e) => setAdminForm({ ...adminForm, cpf: formatCPF(e.target.value) })}
                      disabled={isUpdatingAdminData}
                      maxLength={14}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Endereço <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <textarea
                      value={adminForm.endereco}
                      onChange={(e) => setAdminForm({ ...adminForm, endereco: e.target.value })}
                      disabled={isUpdatingAdminData}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg outline-none resize-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite seu endereço completo"
                    />
                  </div>

                  <button
                    onClick={updateAdminData}
                    disabled={isUpdatingAdminData || !adminForm.nomeCompleto.trim() || !adminForm.cpf.trim() || !adminForm.endereco.trim()}
                    className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      background: 'var(--button-bg)',
                      color: 'var(--button-text)'
                    }}
                  >
                    {isUpdatingAdminData ? (
                      <>
                        <span className="material-icons animate-spin">refresh</span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <span className="material-icons">save</span>
                        Salvar Dados
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Campos para Professores */}
              {isTeacher && (
                <>
                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      disabled
                    />
                    <small className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      O email não pode ser alterado
                    </small>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Nome Completo <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={teacherForm.nomeCompleto}
                      onChange={(e) => setTeacherForm({ ...teacherForm, nomeCompleto: e.target.value })}
                      disabled={isUpdatingTeacherData}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      CPF <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={teacherForm.cpf}
                      onChange={(e) => setTeacherForm({ ...teacherForm, cpf: formatCPF(e.target.value) })}
                      disabled={isUpdatingTeacherData}
                      maxLength={14}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Endereço <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <textarea
                      value={teacherForm.endereco}
                      onChange={(e) => setTeacherForm({ ...teacherForm, endereco: e.target.value })}
                      disabled={isUpdatingTeacherData}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg outline-none resize-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite seu endereço completo"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Titulação <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={teacherForm.titulacao}
                          onChange={(e) => setTeacherForm({ ...teacherForm, titulacao: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTitulacao();
                            }
                          }}
                          disabled={isUpdatingTeacherData}
                          className="flex-1 px-4 py-2 rounded-lg outline-none"
                          style={{
                            background: 'var(--input-bg)',
                            color: 'var(--input-text)',
                            border: '1px solid var(--input-border)'
                          }}
                          placeholder="Ex: Mestre em Educação, Doutor em Matemática"
                        />
                        <button
                          type="button"
                          onClick={addTitulacao}
                          disabled={isUpdatingTeacherData || !teacherForm.titulacao?.trim()}
                          className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                          style={{
                            background: 'var(--accent-color)',
                            color: 'white'
                          }}
                        >
                          Adicionar
                        </button>
                      </div>
                      {teacherForm.titulacoes.length > 0 && (
                        <div className="space-y-1">
                          {teacherForm.titulacoes.map((tit, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg"
                              style={{ background: 'var(--bg-secondary)' }}
                            >
                              <span style={{ color: 'var(--text-primary)' }}>{tit}</span>
                              <button
                                type="button"
                                onClick={() => removeTitulacao(index)}
                                disabled={isUpdatingTeacherData}
                                className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                              >
                                <span className="material-icons text-sm">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      <small className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Adicione uma ou mais titulações. Pressione Enter ou clique em "Adicionar" para incluir.
                      </small>
                    </div>
                  </div>

                  <button
                    onClick={updateTeacherData}
                    disabled={isUpdatingTeacherData || !teacherForm.nomeCompleto.trim() || !teacherForm.cpf.trim() || !teacherForm.endereco.trim() || teacherForm.titulacoes.length === 0}
                    className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      background: 'var(--button-bg)',
                      color: 'var(--button-text)'
                    }}
                  >
                    {isUpdatingTeacherData ? (
                      <>
                        <span className="material-icons animate-spin">refresh</span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <span className="material-icons">save</span>
                        Salvar Dados
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Campos para Estudantes */}
              {isStudent && (
                <>
                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      disabled
                    />
                    <small className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      O email não pode ser alterado
                    </small>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Apelido/Nickname <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.name}
                      onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                      disabled={isUpdatingStudentData}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite seu apelido"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Nome Completo <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.nomeCompleto}
                      onChange={(e) => setStudentForm({ ...studentForm, nomeCompleto: e.target.value })}
                      disabled={isUpdatingStudentData}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      CPF <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.cpf}
                      onChange={(e) => setStudentForm({ ...studentForm, cpf: formatCPF(e.target.value) })}
                      disabled={isUpdatingStudentData}
                      maxLength={14}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="000.000.000-00"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Data de Nascimento <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.dataNascimento}
                      onChange={(e) => setStudentForm({ ...studentForm, dataNascimento: formatDate(e.target.value) })}
                      disabled={isUpdatingStudentData}
                      maxLength={10}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="dd-mm-aaaa"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Nome da Mãe <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.nomeMae}
                      onChange={(e) => setStudentForm({ ...studentForm, nomeMae: e.target.value })}
                      disabled={isUpdatingStudentData}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite o nome completo da sua mãe"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Nome do Pai <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.nomePai}
                      onChange={(e) => setStudentForm({ ...studentForm, nomePai: e.target.value })}
                      disabled={isUpdatingStudentData}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite o nome completo do seu pai"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Telefone de Contato <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      value={studentForm.telefone}
                      onChange={(e) => setStudentForm({ ...studentForm, telefone: formatPhone(e.target.value) })}
                      disabled={isUpdatingStudentData}
                      maxLength={15}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="(00) 00000-0000"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Endereço <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <textarea
                      value={studentForm.endereco}
                      onChange={(e) => setStudentForm({ ...studentForm, endereco: e.target.value })}
                      disabled={isUpdatingStudentData}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg outline-none resize-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite seu endereço completo"
                    />
                  </div>

                  <button
                    onClick={updateStudentData}
                    disabled={isUpdatingStudentData || !studentForm.name.trim() || !studentForm.nomeCompleto.trim() || !studentForm.cpf.trim() || !studentForm.dataNascimento.trim() || !studentForm.nomeMae.trim() || !studentForm.nomePai.trim() || !studentForm.telefone.trim() || !studentForm.endereco.trim()}
                    className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      background: 'var(--button-bg)',
                      color: 'var(--button-text)'
                    }}
                  >
                    {isUpdatingStudentData ? (
                      <>
                        <span className="material-icons animate-spin">refresh</span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <span className="material-icons">save</span>
                        Salvar Dados
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Campos para outros usuários */}
              {!isTeacher && !isAdmin && !isStudent && (
                <>
                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={nameForm.name}
                      onChange={(e) => setNameForm({ name: e.target.value })}
                      disabled={isUpdatingName}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      placeholder="Digite seu nome completo"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      disabled
                    />
                    <small className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      O email não pode ser alterado
                    </small>
                  </div>

                  <div>
                    <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Função
                    </label>
                    <input
                      type="text"
                      value={currentUser?.role || ''}
                      className="w-full px-4 py-2 rounded-lg outline-none"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      disabled
                    />
                  </div>

                  <button
                    onClick={updateName}
                    disabled={isUpdatingName || !nameForm.name.trim()}
                    className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{
                      background: 'var(--button-bg)',
                      color: 'var(--button-text)'
                    }}
                  >
                    {isUpdatingName ? (
                      <>
                        <span className="material-icons animate-spin">refresh</span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <span className="material-icons">save</span>
                        Salvar Nome
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Segurança */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: 'var(--panel-bg)' }}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span className="material-icons">security</span>
                Segurança
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Senha Atual
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  disabled={isUpdatingPassword}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    border: '1px solid var(--input-border)'
                  }}
                  placeholder="Digite sua senha atual"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  disabled={isUpdatingPassword}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    border: '1px solid var(--input-border)'
                  }}
                  placeholder="Digite sua nova senha"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  disabled={isUpdatingPassword}
                  className="w-full px-4 py-2 rounded-lg outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    border: '1px solid var(--input-border)'
                  }}
                  placeholder="Confirme sua nova senha"
                />
              </div>

              <button
                onClick={updatePassword}
                disabled={isUpdatingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: 'var(--button-bg)',
                  color: 'var(--button-text)'
                }}
              >
                {isUpdatingPassword ? (
                  <>
                    <span className="material-icons animate-spin">refresh</span>
                    Atualizando...
                  </>
                ) : (
                  <>
                    <span className="material-icons">lock</span>
                    Alterar Senha
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Notificações */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: 'var(--panel-bg)' }}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span className="material-icons">notifications</span>
                Notificações
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Notificações por Email
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Receba notificações importantes por email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                    disabled={isUpdatingNotifications}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" style={{ background: notificationSettings.emailNotifications ? 'var(--accent-color)' : 'var(--border-color)' }}></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Notificações Push
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Receba notificações instantâneas no navegador
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                    disabled={isUpdatingNotifications}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" style={{ background: notificationSettings.pushNotifications ? 'var(--accent-color)' : 'var(--border-color)' }}></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Lembretes de Tarefas
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Receba lembretes sobre tarefas pendentes
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.taskReminders}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, taskReminders: e.target.checked })}
                    disabled={isUpdatingNotifications}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" style={{ background: notificationSettings.taskReminders ? 'var(--accent-color)' : 'var(--border-color)' }}></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                    Notificações de Mensagens
                  </h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Receba notificações de novas mensagens no chat
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.messageNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, messageNotifications: e.target.checked })}
                    disabled={isUpdatingNotifications}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" style={{ background: notificationSettings.messageNotifications ? 'var(--accent-color)' : 'var(--border-color)' }}></div>
                </label>
              </div>

              <button
                onClick={updateNotifications}
                disabled={isUpdatingNotifications}
                className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                style={{
                  background: 'var(--button-bg)',
                  color: 'var(--button-text)'
                }}
              >
                {isUpdatingNotifications ? (
                  <>
                    <span className="material-icons animate-spin">refresh</span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <span className="material-icons">save</span>
                    Salvar Configurações
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Aparência */}
          <div className="rounded-xl shadow-lg p-6" style={{ background: 'var(--panel-bg)' }}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span className="material-icons">palette</span>
                Aparência
              </h2>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  currentTheme === 'light' ? 'border-blue-500' : 'border-transparent'
                }`}
                style={{ background: currentTheme === 'light' ? 'var(--accent-bg)' : 'var(--bg-secondary)' }}
              >
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={currentTheme === 'light'}
                  onChange={() => setTheme('light')}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <span className="material-icons">light_mode</span>
                  <span style={{ color: 'var(--text-primary)' }}>Tema Claro</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  currentTheme === 'dark' ? 'border-blue-500' : 'border-transparent'
                }`}
                style={{ background: currentTheme === 'dark' ? 'var(--accent-bg)' : 'var(--bg-secondary)' }}
              >
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={currentTheme === 'dark'}
                  onChange={() => setTheme('dark')}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <span className="material-icons">dark_mode</span>
                  <span style={{ color: 'var(--text-primary)' }}>Tema Escuro</span>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border-2 ${
                  currentTheme === 'auto' ? 'border-blue-500' : 'border-transparent'
                }`}
                style={{ background: currentTheme === 'auto' ? 'var(--accent-bg)' : 'var(--bg-secondary)' }}
              >
                <input
                  type="radio"
                  name="theme"
                  value="auto"
                  checked={currentTheme === 'auto'}
                  onChange={() => setTheme('auto')}
                  className="sr-only"
                />
                <div className="flex items-center gap-3">
                  <span className="material-icons">auto_mode</span>
                  <span style={{ color: 'var(--text-primary)' }}>Automático</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

