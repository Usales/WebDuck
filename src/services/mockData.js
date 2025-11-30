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
  },
  {
    id: 4,
    email: 'eaduck@example.com',
    password: 'senha123',
    name: 'EaDuck',
    nomeCompleto: 'EaDuck Administrador',
    cpf: '333.333.333-33',
    role: 'ADMIN',
    isActive: true,
    dataNascimento: '2000-01-01',
    nomeMae: 'Mãe Exemplo',
    nomePai: 'Pai Exemplo',
    telefone: '(11) 88888-8888',
    endereco: 'Rua Exemplo, 456'
  },
  {
    id: 5,
    email: 'professor1@eaduck.com',
    password: 'prof123',
    name: 'Prof. Oliveira',
    nomeCompleto: 'Carlos Oliveira',
    cpf: '444.444.444-44',
    role: 'TEACHER',
    isActive: true,
    titulacao: 'Mestre'
  },
  {
    id: 6,
    email: 'professor2@eaduck.com',
    password: 'prof123',
    name: 'Prof. Costa',
    nomeCompleto: 'Ana Costa',
    cpf: '555.555.555-55',
    role: 'TEACHER',
    isActive: true,
    titulacao: 'Doutora'
  },
  {
    id: 7,
    email: 'pedro.augusto@eaduck.com',
    password: '1234',
    name: 'Pedro',
    nomeCompleto: 'Pedro Augusto',
    cpf: '666.666.666-66',
    role: 'DEV',
    isActive: true,
    dataNascimento: '2006-03-20',
    nomeMae: 'Maria Augusto',
    nomePai: 'José Augusto',
    telefone: '(11) 77777-7777',
    endereco: 'Rua das Flores, 789'
  },
  {
    id: 8,
    email: 'gabriel.sales@eaduck.com',
    password: '1234',
    name: 'Gabriel',
    nomeCompleto: 'Gabriel Sales',
    cpf: '777.777.777-77',
    role: 'DEV',
    isActive: true,
    dataNascimento: '2005-08-15',
    nomeMae: 'Patricia Sales',
    nomePai: 'Roberto Sales',
    telefone: '(11) 66666-6666',
    endereco: 'Avenida Principal, 321'
  },
  {
    id: 9,
    email: 'aleardo.cartocci@eaduck.com',
    password: '1234',
    name: 'Aleardo',
    nomeCompleto: 'Aleardo Cartocci',
    cpf: '888.888.888-88',
    role: 'DEV',
    isActive: true,
    dataNascimento: '2006-11-10',
    nomeMae: 'Sandra Cartocci',
    nomePai: 'Luiz Cartocci',
    telefone: '(11) 55555-5555',
    endereco: 'Rua Central, 654'
  },
  {
    id: 10,
    email: 'aluno4@eaduck.com',
    password: '1234',
    name: 'Lucas',
    nomeCompleto: 'Lucas Ferreira',
    cpf: '999.999.999-99',
    role: 'STUDENT',
    isActive: true,
    dataNascimento: '2005-07-25',
    nomeMae: 'Juliana Ferreira',
    nomePai: 'Marcos Ferreira',
    telefone: '(11) 44444-4444',
    endereco: 'Rua Nova, 987'
  },
  {
    id: 11,
    email: 'aluno5@eaduck.com',
    password: '1234',
    name: 'Sofia',
    nomeCompleto: 'Sofia Almeida',
    cpf: '101.101.101-10',
    role: 'STUDENT',
    isActive: true,
    dataNascimento: '2006-02-14',
    nomeMae: 'Fernanda Almeida',
    nomePai: 'Ricardo Almeida',
    telefone: '(11) 33333-3333',
    endereco: 'Avenida das Palmeiras, 147'
  },
  {
    id: 12,
    email: 'aluno6@eaduck.com',
    password: '1234',
    name: 'Rafael',
    nomeCompleto: 'Rafael Martins',
    cpf: '202.202.202-20',
    role: 'STUDENT',
    isActive: true,
    dataNascimento: '2005-09-30',
    nomeMae: 'Camila Martins',
    nomePai: 'Paulo Martins',
    telefone: '(11) 22222-2222',
    endereco: 'Rua dos Jardins, 258'
  },
  {
    id: 13,
    email: 'aluno7@eaduck.com',
    password: '1234',
    name: 'Isabella',
    nomeCompleto: 'Isabella Rodrigues',
    cpf: '303.303.303-30',
    role: 'STUDENT',
    isActive: true,
    dataNascimento: '2006-04-18',
    nomeMae: 'Beatriz Rodrigues',
    nomePai: 'Felipe Rodrigues',
    telefone: '(11) 11111-1111',
    endereco: 'Rua das Acácias, 369'
  }
];

export const mockClassrooms = [
  {
    id: 1,
    name: 'Turma A - 2024',
    academicYear: '2024',
    isActive: true,
    createdAt: '2024-01-15T00:00:00',
    teachers: [mockUsers[1]],
    students: [mockUsers[2], mockUsers[6], mockUsers[7], mockUsers[8]],
    studentCount: 4,
    teacherNames: ['Prof. Silva']
  },
  {
    id: 2,
    name: 'Turma B - 2024',
    academicYear: '2024',
    isActive: true,
    createdAt: '2024-01-20T00:00:00',
    teachers: [mockUsers[4], mockUsers[5]],
    students: [mockUsers[9], mockUsers[10], mockUsers[11]],
    studentCount: 3,
    teacherNames: ['Prof. Oliveira', 'Prof. Costa']
  },
  {
    id: 3,
    name: 'Turma C - 2024',
    academicYear: '2024',
    isActive: true,
    createdAt: '2024-02-01T00:00:00',
    teachers: [mockUsers[1]],
    students: [mockUsers[12], mockUsers[13]],
    studentCount: 2,
    teacherNames: ['Prof. Silva']
  },
  {
    id: 4,
    name: 'Turma D - 2024',
    academicYear: '2024',
    isActive: true,
    createdAt: '2024-02-10T00:00:00',
    teachers: [mockUsers[4]],
    students: [],
    studentCount: 0,
    teacherNames: ['Prof. Oliveira']
  },
  {
    id: 5,
    name: 'Turma E - 2024',
    academicYear: '2024',
    isActive: true,
    createdAt: '2024-02-15T00:00:00',
    teachers: [mockUsers[5]],
    students: [mockUsers[3]],
    studentCount: 1,
    teacherNames: ['Prof. Costa']
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

