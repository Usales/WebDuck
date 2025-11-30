// Serviço de dados mockados

import { 
  mockUsers, 
  mockClassrooms, 
  mockTasks, 
  mockSubmissions, 
  mockNotifications, 
  mockDisciplines, 
  mockAttendance,
  mockChatMessages 
} from './mockData.js';

// Inicializar dados no localStorage se não existirem
const initMockData = () => {
  if (!localStorage.getItem('mockUsers')) {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem('mockClassrooms')) {
    localStorage.setItem('mockClassrooms', JSON.stringify(mockClassrooms));
  }
  if (!localStorage.getItem('mockTasks')) {
    localStorage.setItem('mockTasks', JSON.stringify(mockTasks));
  }
  if (!localStorage.getItem('mockSubmissions')) {
    localStorage.setItem('mockSubmissions', JSON.stringify(mockSubmissions));
  }
  if (!localStorage.getItem('mockNotifications')) {
    localStorage.setItem('mockNotifications', JSON.stringify(mockNotifications));
  }
  if (!localStorage.getItem('mockDisciplines')) {
    localStorage.setItem('mockDisciplines', JSON.stringify(mockDisciplines));
  }
  if (!localStorage.getItem('mockAttendance')) {
    localStorage.setItem('mockAttendance', JSON.stringify(mockAttendance));
  }
  if (!localStorage.getItem('mockChatMessages')) {
    localStorage.setItem('mockChatMessages', JSON.stringify(mockChatMessages));
  }
};

initMockData();

export const dataService = {
  // Usuários
  getUsers() {
    return Promise.resolve(JSON.parse(localStorage.getItem('mockUsers') || '[]'));
  },

  getUser(id) {
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    return Promise.resolve(users.find(u => u.id === id));
  },

  createUser(userData) {
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...userData,
      isActive: true
    };
    users.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(users));
    return Promise.resolve(newUser);
  },

  updateUser(id, userData) {
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...userData };
      localStorage.setItem('mockUsers', JSON.stringify(users));
      return Promise.resolve(users[index]);
    }
    return Promise.reject({ status: 404, message: 'Usuário não encontrado' });
  },

  deleteUser(id) {
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const filtered = users.filter(u => u.id !== id);
    localStorage.setItem('mockUsers', JSON.stringify(filtered));
    return Promise.resolve();
  },

  // Salas
  getClassrooms() {
    return Promise.resolve(JSON.parse(localStorage.getItem('mockClassrooms') || '[]'));
  },

  getClassroom(id) {
    const classrooms = JSON.parse(localStorage.getItem('mockClassrooms') || '[]');
    return Promise.resolve(classrooms.find(c => c.id === id));
  },

  createClassroom(classroomData) {
    const classrooms = JSON.parse(localStorage.getItem('mockClassrooms') || '[]');
    const newClassroom = {
      id: classrooms.length > 0 ? Math.max(...classrooms.map(c => c.id)) + 1 : 1,
      ...classroomData,
      isActive: true,
      createdAt: new Date().toISOString(),
      students: [],
      teachers: [],
      studentCount: 0,
      teacherNames: []
    };
    classrooms.push(newClassroom);
    localStorage.setItem('mockClassrooms', JSON.stringify(classrooms));
    return Promise.resolve(newClassroom);
  },

  updateClassroom(id, classroomData) {
    const classrooms = JSON.parse(localStorage.getItem('mockClassrooms') || '[]');
    const index = classrooms.findIndex(c => c.id === id);
    if (index !== -1) {
      classrooms[index] = { ...classrooms[index], ...classroomData };
      localStorage.setItem('mockClassrooms', JSON.stringify(classrooms));
      return Promise.resolve(classrooms[index]);
    }
    return Promise.reject({ status: 404, message: 'Sala não encontrada' });
  },

  // Tarefas
  getTasks() {
    return Promise.resolve(JSON.parse(localStorage.getItem('mockTasks') || '[]'));
  },

  getTask(id) {
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    return Promise.resolve(tasks.find(t => t.id === id));
  },

  createTask(taskData) {
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    const newTask = {
      id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      attachments: []
    };
    tasks.push(newTask);
    localStorage.setItem('mockTasks', JSON.stringify(tasks));
    return Promise.resolve(newTask);
  },

  updateTask(id, taskData) {
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...taskData };
      localStorage.setItem('mockTasks', JSON.stringify(tasks));
      return Promise.resolve(tasks[index]);
    }
    return Promise.reject({ status: 404, message: 'Tarefa não encontrada' });
  },

  // Submissões
  getSubmissions() {
    return Promise.resolve(JSON.parse(localStorage.getItem('mockSubmissions') || '[]'));
  },

  createSubmission(submissionData) {
    const submissions = JSON.parse(localStorage.getItem('mockSubmissions') || '[]');
    const newSubmission = {
      id: submissions.length > 0 ? Math.max(...submissions.map(s => s.id)) + 1 : 1,
      ...submissionData,
      submittedAt: new Date().toISOString()
    };
    submissions.push(newSubmission);
    localStorage.setItem('mockSubmissions', JSON.stringify(submissions));
    return Promise.resolve(newSubmission);
  },

  // Notificações
  getNotifications() {
    return Promise.resolve(JSON.parse(localStorage.getItem('mockNotifications') || '[]'));
  },

  // Disciplinas
  getDisciplines() {
    return Promise.resolve(JSON.parse(localStorage.getItem('mockDisciplines') || '[]'));
  },

  createDiscipline(disciplineData) {
    const disciplines = JSON.parse(localStorage.getItem('mockDisciplines') || '[]');
    const newDiscipline = {
      id: disciplines.length > 0 ? Math.max(...disciplines.map(d => d.id)) + 1 : 1,
      ...disciplineData,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    disciplines.push(newDiscipline);
    localStorage.setItem('mockDisciplines', JSON.stringify(disciplines));
    return Promise.resolve(newDiscipline);
  },

  // Frequência
  getAttendance() {
    return Promise.resolve(JSON.parse(localStorage.getItem('mockAttendance') || '[]'));
  },

  createAttendance(attendanceData) {
    const attendance = JSON.parse(localStorage.getItem('mockAttendance') || '[]');
    const newAttendance = {
      id: attendance.length > 0 ? Math.max(...attendance.map(a => a.id)) + 1 : 1,
      ...attendanceData
    };
    attendance.push(newAttendance);
    localStorage.setItem('mockAttendance', JSON.stringify(attendance));
    return Promise.resolve(newAttendance);
  },

  // Chat
  getChatMessages(classroomId) {
    const messages = JSON.parse(localStorage.getItem('mockChatMessages') || '[]');
    return Promise.resolve(messages.filter(m => m.classroomId === classroomId));
  },

  sendChatMessage(messageData) {
    const messages = JSON.parse(localStorage.getItem('mockChatMessages') || '[]');
    const newMessage = {
      id: messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1,
      ...messageData,
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    localStorage.setItem('mockChatMessages', JSON.stringify(messages));
    return Promise.resolve(newMessage);
  },

  // Dashboard
  getDashboardData() {
    const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
    const classrooms = JSON.parse(localStorage.getItem('mockClassrooms') || '[]');
    const tasks = JSON.parse(localStorage.getItem('mockTasks') || '[]');
    const notifications = JSON.parse(localStorage.getItem('mockNotifications') || '[]');

    return Promise.resolve({
      totalUsers: users.length,
      totalClassrooms: classrooms.length,
      totalTasks: tasks.length,
      totalNotifications: notifications.length,
      usersByRole: users.reduce((acc, u) => {
        acc[u.role] = (acc[u.role] || 0) + 1;
        return acc;
      }, {}),
      tasksByClassroom: classrooms.map(c => ({
        classroom: c.name,
        concluidas: tasks.filter(t => t.classroomId === c.id && t.status === 'CONCLUIDA').length,
        pendentes: tasks.filter(t => t.classroomId === c.id && !t.status).length,
        atrasadas: tasks.filter(t => t.classroomId === c.id && new Date(t.dueDate) < new Date() && !t.status).length
      }))
    });
  }
};

