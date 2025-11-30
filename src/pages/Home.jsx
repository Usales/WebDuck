import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import { dataService } from '../services/dataService';
import { authService } from '../services/authService';

const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalClassrooms: 0,
    totalNotifications: 0,
    totalTasks: 0,
    usersByRole: {},
    tasksByClassroom: []
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const data = await dataService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-color)' }}></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <MobileMenuButton />
      <div 
        className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28"
        style={{ background: 'var(--bg-primary)' }}
      >
        <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
            style={{ background: 'var(--panel-bg)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-icons text-blue-400">people</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Total de Usuários
              </p>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {dashboardData.totalUsers}
            </h2>
          </div>

          <div 
            className="rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
            style={{ background: 'var(--panel-bg)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-icons text-green-400">school</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Total de Salas
              </p>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {dashboardData.totalClassrooms}
            </h2>
          </div>

          <div 
            className="rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
            style={{ background: 'var(--panel-bg)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-icons text-yellow-400">notifications</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Notificações
              </p>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {dashboardData.totalNotifications}
            </h2>
          </div>

          <div 
            className="rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
            style={{ background: 'var(--panel-bg)' }}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="material-icons text-red-400">assignment</span>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Tarefas Pendentes
              </p>
            </div>
            <h2 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {dashboardData.totalTasks}
            </h2>
          </div>
        </div>

        {/* Gráficos Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div 
            className="rounded-xl shadow-lg p-6 flex flex-col items-center"
            style={{ background: 'var(--panel-bg)' }}
          >
            <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
              Tarefas - Feitas x Para Fazer
            </h3>
            <div className="w-full h-56 flex items-center justify-center">
              <p style={{ color: 'var(--text-secondary)' }}>Gráfico de Tarefas (Demonstração)</p>
            </div>
          </div>

          <div 
            className="rounded-xl shadow-lg p-6 flex flex-col items-center"
            style={{ background: 'var(--panel-bg)' }}
          >
            <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
              Tipos de Notificações
            </h3>
            <div className="w-full h-56 flex items-center justify-center">
              <p style={{ color: 'var(--text-secondary)' }}>Gráfico de Notificações (Demonstração)</p>
            </div>
          </div>

          <div 
            className="rounded-xl shadow-lg p-6 flex flex-col items-center md:col-span-2 lg:col-span-1"
            style={{ background: 'var(--panel-bg)' }}
          >
            <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
              Salas com Mais Tarefas
            </h3>
            <div className="w-full h-56 flex items-center justify-center">
              <p style={{ color: 'var(--text-secondary)' }}>Gráfico de Salas (Demonstração)</p>
            </div>
          </div>
        </div>

        {/* Mensagem de Boas-vindas */}
        <div 
          className="rounded-xl shadow-lg p-6 flex flex-col items-center justify-center"
          style={{ background: 'var(--panel-bg)' }}
        >
          <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>
            Bem-vindo ao EaDuck!
          </h3>
          <p className="text-center" style={{ color: 'var(--text-secondary)' }}>
            Gerencie usuários, salas, notificações e tarefas de forma centralizada e moderna.
            <br className="hidden md:block" />
            Os dados são atualizados automaticamente.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

