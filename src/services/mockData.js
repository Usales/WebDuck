// Dados mockados para demonstração

export const mockUsers = [
  {
    id: 1,
    email: 'admin@eaduck.com',
    password: 'admin123',
    name: 'Admin',
    nomeCompleto: 'Administrador Sistema',
    cpf: '000.000.000-00',
    role: 'ADMIN',
    isActive: true
  },
  {
    id: 2,
    email: 'professor@eaduck.com',
    password: 'prof123',
    name: 'Prof. Silva',
    nomeCompleto: 'João Silva',
    cpf: '111.111.111-11',
    role: 'TEACHER',
    isActive: true,
    titulacao: 'Doutor'
  },
  {
    id: 3,
    email: 'estudante@eaduck.com',
    password: 'est123',
    name: 'Maria',
    nomeCompleto: 'Maria Santos',
    cpf: '222.222.222-22',
    role: 'STUDENT',
    isActive: true,
    dataNascimento: '2005-05-15',
    nomeMae: 'Ana Santos',
    nomePai: 'Carlos Santos',
    telefone: '(11) 99999-9999',
    endereco: 'Rua Exemplo, 123'
  }
];

export const mockClassrooms = [
  {
    id: 1,
    name: 'Turma A - 2024',
    academicYear: '2024',
    isActive: true,
    createdAt: '2024-01-15',
    teachers: [mockUsers[1]],
    students: [mockUsers[2]],
    studentCount: 1,
    teacherNames: ['Prof. Silva']
  },
  {
    id: 2,
    name: 'Turma B - 2024',
    academicYear: '2024',
    isActive: true,
    createdAt: '2024-01-20',
    teachers: [mockUsers[1]],
    students: [],
    studentCount: 0,
    teacherNames: ['Prof. Silva']
  }
];

export const mockTasks = [
  {
    id: 1,
    title: 'Tarefa de Matemática',
    description: 'Resolver exercícios do capítulo 5',
    dueDate: '2024-12-31T23:59:59',
    createdAt: '2024-12-01T10:00:00',
    type: 'TAREFA',
    discipline: 'Matemática',
    classroomId: 1,
    classroomName: 'Turma A - 2024',
    createdById: 2,
    createdByName: 'Prof. Silva',
    attachments: []
  },
  {
    id: 2,
    title: 'Projeto de História',
    description: 'Pesquisa sobre o Brasil Colonial',
    dueDate: '2024-12-25T23:59:59',
    createdAt: '2024-11-15T10:00:00',
    type: 'PROJETO',
    discipline: 'História',
    classroomId: 1,
    classroomName: 'Turma A - 2024',
    createdById: 2,
    createdByName: 'Prof. Silva',
    attachments: []
  }
];

export const mockSubmissions = [
  {
    id: 1,
    taskId: 1,
    studentId: 3,
    studentName: 'Maria Santos',
    studentEmail: 'estudante@eaduck.com',
    content: 'Exercícios resolvidos conforme solicitado.',
    submittedAt: '2024-12-15T14:30:00',
    grade: 8.5,
    feedback: 'Bom trabalho!',
    evaluatedAt: '2024-12-16T10:00:00'
  }
];

export const mockNotifications = [
  {
    id: 1,
    title: 'Nova Tarefa',
    message: 'Uma nova tarefa foi atribuída à sua turma',
    notificationType: 'TAREFA',
    createdAt: '2024-12-01T10:00:00',
    isRead: false
  },
  {
    id: 2,
    title: 'Aviso Importante',
    message: 'Reunião de pais marcada para próxima semana',
    notificationType: 'AVISO',
    createdAt: '2024-11-28T09:00:00',
    isRead: false
  }
];

export const mockDisciplines = [
  {
    id: 1,
    name: 'Matemática',
    description: 'Álgebra e Geometria',
    isActive: true,
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: 2,
    name: 'História',
    description: 'História do Brasil',
    isActive: true,
    createdAt: '2024-01-01T00:00:00'
  },
  {
    id: 3,
    name: 'Português',
    description: 'Gramática e Literatura',
    isActive: true,
    createdAt: '2024-01-01T00:00:00'
  }
];

export const mockAttendance = [
  {
    id: 1,
    date: '2024-12-15',
    status: 'PRESENTE',
    arrivalTime: '08:00:00',
    studentId: 3,
    studentName: 'Maria Santos',
    classroomId: 1,
    classroomName: 'Turma A - 2024',
    discipline: 'Matemática',
    period: 'MANHA'
  }
];

export const mockChatMessages = [
  {
    id: 1,
    type: 'CHAT',
    content: 'Olá, pessoal!',
    sender: 'professor@eaduck.com',
    senderName: 'Prof. Silva',
    senderRole: 'TEACHER',
    classroomId: 1,
    createdAt: '2024-12-15T10:00:00',
    isMine: false
  },
  {
    id: 2,
    type: 'CHAT',
    content: 'Bom dia, professor!',
    sender: 'estudante@eaduck.com',
    senderName: 'Maria Santos',
    senderRole: 'STUDENT',
    classroomId: 1,
    createdAt: '2024-12-15T10:05:00',
    isMine: true
  }
];

