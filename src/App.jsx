import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import MobileMenuButton from './components/MobileMenuButton';

// Placeholder pages
const Users = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Usuários</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de gerenciamento de usuários (em desenvolvimento)</p>
    </div>
  </div>
);

// Placeholder pages
const Users = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Usuários</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de gerenciamento de usuários (em desenvolvimento)</p>
    </div>
  </div>
);

const Classrooms = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Salas de Aula</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de gerenciamento de salas (em desenvolvimento)</p>
    </div>
  </div>
);

const Tasks = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Tarefas</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de gerenciamento de tarefas (em desenvolvimento)</p>
    </div>
  </div>
);

const Notifications = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Notificações</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de notificações (em desenvolvimento)</p>
    </div>
  </div>
);

const ChatHub = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Conversas</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de chat (em desenvolvimento)</p>
    </div>
  </div>
);

const Attendance = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Frequência</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de frequência (em desenvolvimento)</p>
    </div>
  </div>
);

const Disciplines = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Disciplinas</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de disciplinas (em desenvolvimento)</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
    <Sidebar />
    <MobileMenuButton />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Configurações</h1>
      <p style={{ color: 'var(--text-secondary)' }}>Página de configurações (em desenvolvimento)</p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Inicializar tema
    const savedTheme = localStorage.getItem('theme') || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/classrooms"
          element={
            <ProtectedRoute>
              <Classrooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat-hub"
          element={
            <ProtectedRoute>
              <ChatHub />
            </ProtectedRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disciplines"
          element={
            <ProtectedRoute>
              <Disciplines />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
