import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import Modal from '../components/Modal';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterClassroomId, setFilterClassroomId] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Resumo
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalConcluidas, setTotalConcluidas] = useState(0);
  const [totalPendentes, setTotalPendentes] = useState(0);
  const [totalAtrasadas, setTotalAtrasadas] = useState(0);

  // Modal de criação
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    classroomId: undefined,
    type: 'TAREFA',
    discipline: undefined
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [dueDateError, setDueDateError] = useState(false);

  // Modal de edição
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDiscipline, setEditDiscipline] = useState(undefined);

  // Modal de submissões
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);

  // Modal de avaliação
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [evalSubmission, setEvalSubmission] = useState(null);
  const [evalGrade, setEvalGrade] = useState(null);
  const [evalFeedback, setEvalFeedback] = useState('');

  // Modal de submissão (aluno)
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedTaskForSubmit, setSelectedTaskForSubmit] = useState(null);
  const [submitContent, setSubmitContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Modal de alunos
  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedTaskStudents, setSelectedTaskStudents] = useState([]);

  // Erros
  const [showEditErrorModal, setShowEditErrorModal] = useState(false);
  const [editErrorModalMessage, setEditErrorModalMessage] = useState('');
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
  const [deleteErrorModalMessage, setDeleteErrorModalMessage] = useState('');

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'image/jpeg',
    'image/png',
    'application/zip',
    'application/x-rar-compressed'
  ];
  const maxFileSize = 8 * 1024 * 1024; // 8MB

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filterStatus, filterClassroomId, filterType, searchTerm, submissions]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksList, classroomsList, submissionsList, disciplinesList] = await Promise.all([
        dataService.getTasks(),
        dataService.getClassrooms(),
        dataService.getSubmissions(),
        dataService.getDisciplines()
      ]);
      setTasks(tasksList);
      setClassrooms(classroomsList);
      setSubmissions(submissionsList);
      setDisciplines(disciplinesList);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = tasks.filter(task => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || (
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
      const statusMatch = filterStatus === 'all' || getTaskStatus(task) === filterStatus;
      const classroomMatch = filterClassroomId === 'all' || task.classroomId === parseInt(filterClassroomId);
      const typeMatch = filterType === 'all' || task.type === filterType;
      return matchesSearch && statusMatch && classroomMatch && typeMatch;
    });
    setFilteredTasks(filtered);
    updateResumo(filtered);
  };

  const updateResumo = (tasksList) => {
    setTotalTasks(tasksList.length);
    setTotalConcluidas(tasksList.filter(t => getTaskStatus(t) === 'concluida').length);
    setTotalPendentes(tasksList.filter(t => getTaskStatus(t) === 'pendente').length);
    setTotalAtrasadas(tasksList.filter(t => getTaskStatus(t) === 'atrasada').length);
  };

  const getTaskStatus = (task) => {
    const today = new Date();
    const due = new Date(task.dueDate);
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    const taskSubmissions = submissions.filter(s => s.taskId === task.id);
    let hasSubmission = false;
    if (currentUser?.role === 'STUDENT') {
      hasSubmission = taskSubmissions.some(s => s.studentId === currentUser.id);
    } else {
      hasSubmission = taskSubmissions.length > 0;
    }
    if (hasSubmission) return 'concluida';
    if (today > due) return 'atrasada';
    return 'pendente';
  };

  const getTaskTypeIcon = (type) => {
    switch (type) {
      case 'TAREFA': return 'assignment';
      case 'PROVA': return 'quiz';
      case 'FORUM': return 'forum';
      case 'NOTIFICACAO': return 'notifications';
      default: return 'assignment';
    }
  };

  const getTaskTypeColor = (type) => {
    switch (type) {
      case 'TAREFA': return 'bg-blue-600';
      case 'PROVA': return 'bg-red-600';
      case 'FORUM': return 'bg-green-600';
      case 'NOTIFICACAO': return 'bg-yellow-600';
      default: return 'bg-blue-600';
    }
  };

  const getTaskTypeLabel = (type) => {
    switch (type) {
      case 'TAREFA': return 'Tarefa';
      case 'PROVA': return 'Prova';
      case 'FORUM': return 'Fórum';
      case 'NOTIFICACAO': return 'Notificação';
      default: return 'Tarefa';
    }
  };

  const isAdminOrTeacher = () => {
    return currentUser?.role === 'ADMIN' || currentUser?.role === 'TEACHER';
  };

  // Criação de tarefa
  const openCreateModal = () => {
    setShowCreateModal(true);
    setTaskForm({
      title: '',
      description: '',
      dueDate: '',
      classroomId: undefined,
      type: 'TAREFA',
      discipline: undefined
    });
    setSelectedFiles([]);
    setFileErrors([]);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTaskForm({
      title: '',
      description: '',
      dueDate: '',
      classroomId: undefined,
      type: 'TAREFA',
      discipline: undefined
    });
    setSelectedFiles([]);
    setFileErrors([]);
  };

  const onTaskFileSelected = (event) => {
    const files = Array.from(event.target.files);
    validateAndAddFiles(files);
  };

  const validateAndAddFiles = (files) => {
    const errors = [];
    const validFiles = [];

    files.forEach(file => {
      if (!allowedFileTypes.includes(file.type)) {
        errors.push(`Tipo de arquivo não suportado: ${file.name}`);
        return;
      }
      if (file.size > maxFileSize) {
        errors.push(`Arquivo muito grande: ${file.name} (máx. 8MB)`);
        return;
      }
      validFiles.push(file);
    });

    setFileErrors(errors);
    setSelectedFiles([...selectedFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('word')) return '📝';
    if (fileType?.includes('excel')) return '📊';
    if (fileType?.includes('powerpoint')) return '📈';
    if (fileType?.includes('zip') || fileType?.includes('rar')) return '📦';
    return '📎';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const createTask = async () => {
    setDueDateError(false);

    if (!taskForm.title || !taskForm.title.trim()) {
      alert('Por favor, preencha o título da tarefa.');
      return;
    }

    if (!taskForm.classroomId) {
      alert('Por favor, selecione uma turma.');
      return;
    }

    if (!taskForm.dueDate) {
      setDueDateError(true);
      return;
    }

    try {
      let dueDate = taskForm.dueDate;
      if (dueDate && dueDate.length === 10) {
        dueDate = dueDate + 'T00:00:00';
      }

      const newTask = await dataService.createTask({
        title: taskForm.title,
        description: taskForm.description,
        dueDate: dueDate,
        classroomId: taskForm.classroomId,
        type: taskForm.type,
        discipline: taskForm.discipline
      });

      // Nota: Upload de arquivos seria feito aqui em uma implementação real
      // Por enquanto, apenas criamos a tarefa

      await loadData();
      closeCreateModal();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      alert('Erro ao criar tarefa');
    }
  };

  // Edição de tarefa
  const startEdit = (task) => {
    if (!task.id) return;
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditDiscipline(task.discipline);
    if (task.dueDate) {
      const date = new Date(task.dueDate);
      setEditDueDate(date.toISOString().slice(0, 10));
    } else {
      setEditDueDate('');
    }
  };

  const cancelEdit = () => {
    setEditTaskId(null);
  };

  const saveEdit = async (task) => {
    if (!task.id) return;

    if (!editTitle || !editTitle.trim()) {
      setEditErrorModalMessage('Por favor, preencha o título da tarefa.');
      setShowEditErrorModal(true);
      return;
    }

    try {
      let dueDate = editDueDate;
      if (dueDate && dueDate.length === 10) {
        dueDate = dueDate + 'T00:00:00';
      }

      await dataService.updateTask(task.id, {
        title: editTitle,
        description: editDescription,
        dueDate: dueDate,
        type: task.type,
        discipline: editDiscipline
      });

      await loadData();
      setEditTaskId(null);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      setEditErrorModalMessage('Erro ao atualizar tarefa: ' + (error.message || 'Erro desconhecido'));
      setShowEditErrorModal(true);
    }
  };

  // Exclusão de tarefa
  const deleteTask = async (task) => {
    if (!task.id) return;
    if (!window.confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      return;
    }

    try {
      await dataService.deleteTask(task.id);
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      setDeleteErrorModalMessage('Erro ao excluir tarefa.');
      setShowDeleteErrorModal(true);
    }
  };

  // Submissões
  const openSubmissionsModal = (task) => {
    setSelectedTask(task);
    setFilteredSubmissions(submissions.filter(s => s.taskId === task.id));
    setShowSubmissionsModal(true);
  };

  const closeSubmissionsModal = () => {
    setShowSubmissionsModal(false);
    setSelectedTask(null);
  };

  const openEvalModal = (sub) => {
    setEvalSubmission(sub);
    setEvalGrade(sub.grade ?? null);
    setEvalFeedback(sub.feedback ?? '');
    setShowEvalModal(true);
  };

  const closeEvalModal = () => {
    setShowEvalModal(false);
    setEvalSubmission(null);
    setEvalGrade(null);
    setEvalFeedback('');
  };

  const saveEvaluation = async () => {
    if (!evalSubmission) return;

    try {
      const submissionsList = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
      const index = submissionsList.findIndex(s => s.id === evalSubmission.id);
      if (index !== -1) {
        submissionsList[index] = {
          ...submissionsList[index],
          grade: evalGrade,
          feedback: evalFeedback,
          evaluatedAt: new Date().toISOString()
        };
        localStorage.setItem('mockSubmissions', JSON.stringify(submissionsList));
        await loadData();
        closeEvalModal();
      }
    } catch (error) {
      console.error('Erro ao avaliar submissão:', error);
    }
  };

  // Submissão de tarefa (aluno)
  const openSubmitModal = (task) => {
    setSelectedTaskForSubmit(task);
    setShowSubmitModal(true);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(false);
    setSelectedTaskForSubmit(null);
    setSubmitContent('');
    setSelectedFile(null);
    setFileError('');
    setSubmitSuccess(false);
  };

  const onFileSelected = (event) => {
    const input = event.target;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!allowedFileTypes.includes(file.type)) {
        setFileError('Tipo de arquivo não permitido. Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, ZIP, RAR');
        setSelectedFile(null);
        input.value = '';
        return;
      }
      if (file.size > maxFileSize) {
        setFileError('O arquivo é muito grande. Tamanho máximo permitido: 8MB');
        setSelectedFile(null);
        input.value = '';
        return;
      }
      setFileError('');
      setSelectedFile(file);
    }
  };

  const submitTask = async () => {
    if (!selectedTaskForSubmit?.id) return;
    if (fileError) return;

    try {
      await dataService.createSubmission({
        taskId: selectedTaskForSubmit.id,
        studentId: currentUser.id,
        studentName: currentUser.nomeCompleto || currentUser.name,
        studentEmail: currentUser.email,
        content: submitContent,
        fileUrl: selectedFile ? selectedFile.name : null
      });

      setSubmitSuccess(true);
      await loadData();
      setTimeout(() => {
        closeSubmitModal();
      }, 2000);
    } catch (error) {
      console.error('Erro ao enviar tarefa:', error);
      setFileError('Erro ao enviar tarefa.');
    }
  };

  // Alunos
  const openStudentsModal = async (task) => {
    setSelectedTask(task);
    setShowStudentsModal(true);
    try {
      const classroom = await dataService.getClassroom(task.classroomId);
      const students = (classroom?.students || []).map(student => {
        const submission = submissions.find(s => s.studentId === student.id && s.taskId === task.id);
        return {
          email: student.email,
          name: student.nomeCompleto || student.name,
          submitted: !!submission,
          submission: submission
        };
      });
      setSelectedTaskStudents(students);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
    }
  };

  const closeStudentsModal = () => {
    setShowStudentsModal(false);
    setSelectedTaskStudents([]);
  };

  const getSubmissionStatus = (submission) => {
    if (!submission) return 'Pendente';
    if (submission.grade !== null && submission.grade !== undefined) return `Avaliado (${submission.grade})`;
    return 'Enviado';
  };

  const getSubmissionStatusClass = (submission) => {
    if (!submission) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    if (submission.grade !== null && submission.grade !== undefined) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
  };

  const getSubmissionsForTask = (taskId) => {
    if (!taskId) return [];
    return submissions.filter(s => s.taskId === taskId);
  };

  const getMyGradeForTask = (taskId) => {
    if (!taskId || !currentUser) return null;
    const mySubmission = submissions.find(s =>
      s.taskId === taskId &&
      s.studentId === currentUser.id
    );
    return mySubmission?.grade !== undefined && mySubmission?.grade !== null ? mySubmission.grade : null;
  };

  const hasGradeForTask = (taskId) => {
    return getMyGradeForTask(taskId) !== null;
  };

  const getMySubmissionFeedback = (taskId) => {
    if (!taskId || !currentUser) return null;
    const mySubmission = submissions.find(s =>
      s.taskId === taskId &&
      s.studentId === currentUser.id
    );
    return mySubmission?.feedback || null;
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
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Tarefas
            </h1>
            {isAdminOrTeacher() && (
              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded-lg font-semibold transition-all text-sm flex items-center gap-2"
                style={{
                  background: 'var(--button-bg)',
                  color: 'var(--button-text)'
                }}
              >
                <span className="material-icons text-sm">add</span>
                Nova Tarefa
              </button>
            )}
          </div>

          {/* Filtros */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none mb-4"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    border: '1px solid var(--input-border)'
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="pendente">Pendentes</option>
                  <option value="concluida">Concluídas</option>
                  <option value="atrasada">Atrasadas</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Sala
                </label>
                <select
                  value={filterClassroomId}
                  onChange={(e) => setFilterClassroomId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                  style={{
                    background: 'var(--input-bg)',
                    color: 'var(--input-text)',
                    border: '1px solid var(--input-border)'
                  }}
                >
                  <option value="all">Todas</option>
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
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
                  <option value="all">Todos</option>
                  <option value="TAREFA">Tarefas</option>
                  <option value="PROVA">Provas</option>
                  <option value="FORUM">Fóruns</option>
                  <option value="NOTIFICACAO">Notificações</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl shadow-lg p-4" style={{ background: 'var(--panel-bg)' }}>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalTasks}</div>
            </div>
            <div className="rounded-xl shadow-lg p-4" style={{ background: 'var(--panel-bg)' }}>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Concluídas</div>
              <div className="text-2xl font-bold text-green-500">{totalConcluidas}</div>
            </div>
            <div className="rounded-xl shadow-lg p-4" style={{ background: 'var(--panel-bg)' }}>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Pendentes</div>
              <div className="text-2xl font-bold text-yellow-500">{totalPendentes}</div>
            </div>
            <div className="rounded-xl shadow-lg p-4" style={{ background: 'var(--panel-bg)' }}>
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Atrasadas</div>
              <div className="text-2xl font-bold text-red-500">{totalAtrasadas}</div>
            </div>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.length === 0 ? (
            <div
              className="col-span-full rounded-xl shadow-lg p-8 text-center"
              style={{ background: 'var(--panel-bg)' }}
            >
              <p style={{ color: 'var(--text-secondary)' }}>
                Nenhuma tarefa encontrada
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
                style={{ background: 'var(--panel-bg)' }}
              >
                {/* Header do Card */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`${getTaskTypeColor(task.type)} text-white p-2 rounded-lg`}>
                    <span className="material-icons">{getTaskTypeIcon(task.type)}</span>
                  </div>
                  <div className="flex-1">
                    {editTaskId === task.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full px-2 py-1 rounded text-sm font-bold mb-2"
                        style={{
                          background: 'var(--input-bg)',
                          color: 'var(--input-text)',
                          border: '1px solid var(--input-border)'
                        }}
                      />
                    ) : (
                      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {task.title}
                      </h3>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <span className={`${getTaskTypeColor(task.type)} text-white px-2 py-1 rounded text-xs font-medium`}>
                        {getTaskTypeLabel(task.type)}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        getTaskStatus(task) === 'pendente'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : getTaskStatus(task) === 'atrasada'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {getTaskStatus(task) === 'pendente' ? 'Pendente' : (getTaskStatus(task) === 'atrasada' ? 'Atrasada' : 'Concluída')}
                      </span>
                      {getTaskStatus(task) === 'concluida' && hasGradeForTask(task.id) && currentUser?.role === 'STUDENT' && (
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                          ⭐ Nota: {getMyGradeForTask(task.id)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Body do Card */}
                <div className="mb-4">
                  {editTaskId === task.id ? (
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full px-2 py-1 rounded text-sm mb-2"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        border: '1px solid var(--input-border)'
                      }}
                      rows="3"
                    />
                  ) : (
                    <p className="text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-icons text-sm" style={{ color: 'var(--text-secondary)' }}>
                      event
                    </span>
                    {editTaskId === task.id ? (
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="px-2 py-1 rounded text-sm"
                        style={{
                          background: 'var(--input-bg)',
                          color: 'var(--input-text)',
                          border: '1px solid var(--input-border)'
                        }}
                      />
                    ) : (
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                  {task.discipline && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-icons text-sm" style={{ color: 'var(--text-secondary)' }}>
                        menu_book
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        {task.discipline}
                      </span>
                    </div>
                  )}
                  {getTaskStatus(task) === 'concluida' && hasGradeForTask(task.id) && currentUser?.role === 'STUDENT' && (
                    <div className="mt-2 p-2 rounded-lg bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border border-yellow-600/30">
                      <div className="flex items-center gap-2">
                        <span className="material-icons text-yellow-400 text-sm">star</span>
                        <div className="flex-1">
                          <div className="text-yellow-400 font-bold text-sm">
                            Sua Nota: {getMyGradeForTask(task.id)}
                          </div>
                          {getMySubmissionFeedback(task.id) && (
                            <div className="text-gray-300 text-xs mt-1 italic">
                              Feedback: {getMySubmissionFeedback(task.id)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-icons text-sm" style={{ color: 'var(--text-secondary)' }}>
                          attach_file
                        </span>
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          Anexos ({task.attachments.length})
                        </span>
                      </div>
                    </div>
                  )}
                  {isAdminOrTeacher() && (
                    <div className="mt-2">
                      <button
                        onClick={() => openStudentsModal(task)}
                        className="text-xs px-2 py-1 rounded flex items-center gap-1"
                        style={{
                          background: 'var(--button-bg)',
                          color: 'var(--button-text)'
                        }}
                      >
                        <span className="material-icons text-sm">people</span>
                        Ver Alunos ({getSubmissionsForTask(task.id).length})
                      </button>
                    </div>
                  )}
                </div>

                {/* Ações do Card */}
                <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                  {editTaskId === task.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(task)}
                        className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <span className="material-icons text-sm">check</span>
                        Salvar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white"
                      >
                        <span className="material-icons text-sm">close</span>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      {isAdminOrTeacher() && (
                        <>
                          <button
                            onClick={() => startEdit(task)}
                            className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center gap-1"
                            style={{
                              background: 'var(--button-bg)',
                              color: 'var(--button-text)'
                            }}
                          >
                            <span className="material-icons text-sm">edit</span>
                            Editar
                          </button>
                          <button
                            onClick={() => deleteTask(task)}
                            className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                          >
                            <span className="material-icons text-sm">delete</span>
                            Excluir
                          </button>
                          <button
                            onClick={() => openSubmissionsModal(task)}
                            className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center gap-1 bg-purple-500 hover:bg-purple-600 text-white"
                          >
                            <span className="material-icons text-sm">assignment_turned_in</span>
                            Submissões
                          </button>
                        </>
                      )}
                      {!isAdminOrTeacher() && getTaskStatus(task) !== 'concluida' && (
                        <button
                          onClick={() => openSubmitModal(task)}
                          className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white"
                        >
                          <span className="material-icons text-sm">upload_file</span>
                          Enviar
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Nova Tarefa */}
      <Modal
        visible={showCreateModal}
        type="info"
        title="Nova Tarefa"
        message=""
        onClose={closeCreateModal}
      >
        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Título
            </label>
            <input
              type="text"
              value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              placeholder="Ex: Tarefa de Matemática"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Descrição
            </label>
            <textarea
              value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              rows="4"
              placeholder="Descreva a tarefa..."
            />
          </div>
          <div>
            <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Data de Entrega
            </label>
            <input
              type="date"
              value={taskForm.dueDate}
              onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
              className={`w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none ${
                dueDateError ? 'border-red-500' : ''
              }`}
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: dueDateError ? '2px solid red' : '1px solid var(--input-border)'
              }}
            />
            {dueDateError && (
              <div className="text-red-400 text-sm mt-1">Preencha a data de entrega corretamente.</div>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Turma
            </label>
            <select
              value={taskForm.classroomId || ''}
              onChange={(e) => setTaskForm({ ...taskForm, classroomId: e.target.value ? parseInt(e.target.value) : undefined })}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            >
              <option value="">Selecione a turma</option>
              {classrooms.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Tipo
            </label>
            <select
              value={taskForm.type}
              onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value })}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            >
              <option value="TAREFA">Tarefa</option>
              <option value="PROVA">Prova</option>
              <option value="FORUM">Fórum</option>
              <option value="NOTIFICACAO">Notificação</option>
            </select>
          </div>
          {isAdminOrTeacher() && (
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Disciplina (opcional)
              </label>
              <select
                value={taskForm.discipline || ''}
                onChange={(e) => setTaskForm({ ...taskForm, discipline: e.target.value || undefined })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              >
                <option value="">Selecione uma disciplina</option>
                {disciplines.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Anexar Documentos (opcional)
            </label>
            <input
              type="file"
              multiple
              onChange={onTaskFileSelected}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            />
            {selectedFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded" style={{ background: 'var(--input-bg)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
                      {getFileIcon(file.type)} {file.name} ({formatFileSize(file.size)})
                    </span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            {fileErrors.length > 0 && (
              <div className="mt-2 space-y-1">
                {fileErrors.map((error, index) => (
                  <div key={index} className="text-red-400 text-sm">{error}</div>
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={createTask}
              className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              Criar
            </button>
            <button
              onClick={closeCreateModal}
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
      </Modal>

      {/* Modal de Submissões */}
      <Modal
        visible={showSubmissionsModal}
        type="info"
        title={`Submissões - ${selectedTask?.title || ''}`}
        message=""
        onClose={closeSubmissionsModal}
      >
        {filteredSubmissions.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>Nenhuma submissão encontrada.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Aluno</th>
                  <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>E-mail</th>
                  <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Conteúdo</th>
                  <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Nota</th>
                  <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Feedback</th>
                  <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                      {sub.studentName}
                    </td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                      {sub.studentEmail}
                    </td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                      {sub.content || '-'}
                    </td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                      {sub.grade !== null && sub.grade !== undefined ? (
                        <span className="font-bold text-green-400">{sub.grade}</span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>-</span>
                      )}
                    </td>
                    <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                      {sub.feedback ? (
                        <span className="italic text-blue-300 text-sm">{sub.feedback}</span>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>-</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {isAdminOrTeacher() && (
                        <button
                          onClick={() => openEvalModal(sub)}
                          className="text-yellow-400 hover:text-yellow-600"
                          title="Avaliar submissão"
                        >
                          <span className="material-icons text-sm">rate_review</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      {/* Modal de Avaliação */}
      <Modal
        visible={showEvalModal}
        type="info"
        title="Avaliar Submissão"
        message=""
        onClose={closeEvalModal}
      >
        {evalSubmission && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg" style={{ background: 'var(--input-bg)' }}>
              <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
                <span className="font-semibold">Aluno:</span> {evalSubmission.studentEmail || 'N/A'}
              </p>
              {evalSubmission.grade !== null && evalSubmission.grade !== undefined && (
                <p className="text-sm text-green-400">
                  <span className="font-semibold">Nota Atual:</span> {evalSubmission.grade}
                </p>
              )}
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Nota (0 a 10)
              </label>
              <input
                type="number"
                value={evalGrade || ''}
                onChange={(e) => setEvalGrade(e.target.value ? parseFloat(e.target.value) : null)}
                min="0"
                max="10"
                step="0.1"
                className="w-full px-4 py-3 rounded-lg text-lg font-semibold focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '2px solid var(--input-border)'
                }}
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Feedback
              </label>
              <textarea
                value={evalFeedback}
                onChange={(e) => setEvalFeedback(e.target.value)}
                rows="4"
                className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '2px solid var(--input-border)'
                }}
                placeholder="Digite o feedback para o aluno..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeEvalModal}
                className="px-6 py-2 rounded-lg font-medium transition-colors"
                style={{
                  background: 'var(--text-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={saveEvaluation}
                className="px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <span className="material-icons text-sm">save</span>
                Salvar Avaliação
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de Submissão (Aluno) */}
      <Modal
        visible={showSubmitModal}
        type="info"
        title={`Enviar Tarefa - ${selectedTaskForSubmit?.title || ''}`}
        message=""
        onClose={closeSubmitModal}
      >
        {!submitSuccess ? (
          <form onSubmit={(e) => { e.preventDefault(); submitTask(); }} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Comentário (opcional)
              </label>
              <textarea
                value={submitContent}
                onChange={(e) => setSubmitContent(e.target.value)}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
                rows="4"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Arquivo
              </label>
              <input
                type="file"
                onChange={onFileSelected}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
              />
              <div className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                Tipos permitidos: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, JPG, PNG, ZIP, RAR.<br />
                Tamanho máximo: 8MB.
              </div>
              {fileError && (
                <div className="mt-2 text-red-400 text-sm">{fileError}</div>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white"
            >
              Enviar
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <span className="material-icons text-green-400 text-5xl mb-2">check_circle</span>
            <div className="text-green-400 text-lg font-semibold mb-2">Tarefa enviada com sucesso!</div>
            <div className="text-sm text-center mb-4" style={{ color: 'var(--text-secondary)' }}>
              Você receberá um e-mail de confirmação.<br />
              O professor será avisado e irá avaliar sua atividade em breve.
            </div>
            <button
              onClick={closeSubmitModal}
              className="px-4 py-2 rounded-lg font-semibold transition-all bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white mt-2"
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      {/* Modal de Alunos */}
      <Modal
        visible={showStudentsModal}
        type="info"
        title={`Alunos - ${selectedTask?.title || ''}`}
        message=""
        onClose={closeStudentsModal}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>E-mail do Aluno</th>
                <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {selectedTaskStudents.length === 0 ? (
                <tr>
                  <td colSpan="2" className="px-4 py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                    Nenhum aluno encontrado
                  </td>
                </tr>
              ) : (
                selectedTaskStudents.map((student, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                      {student.email}
                    </td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSubmissionStatusClass(student.submission)}`}>
                        {getSubmissionStatus(student.submission)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Modal>

      {/* Modal de Erro de Edição */}
      <Modal
        visible={showEditErrorModal}
        type="error"
        title="Erro ao editar tarefa"
        message={editErrorModalMessage}
        onClose={() => setShowEditErrorModal(false)}
      />

      {/* Modal de Erro de Exclusão */}
      <Modal
        visible={showDeleteErrorModal}
        type="error"
        title="Erro ao excluir tarefa"
        message={deleteErrorModalMessage}
        onClose={() => setShowDeleteErrorModal(false)}
      />
    </div>
  );
};

export default Tasks;

