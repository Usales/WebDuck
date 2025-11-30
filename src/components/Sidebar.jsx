import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentUser(authService.getCurrentUser());
    
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: '/home', icon: 'dashboard', label: 'Home' },
    { path: '/users', icon: 'people', label: 'Usuários' },
    { path: '/classrooms', icon: 'school', label: 'Salas' },
    { path: '/attendance', icon: 'check_circle', label: 'Frequência' },
    { path: '/disciplines', icon: 'menu_book', label: 'Disciplinas' },
    { path: '/notifications', icon: 'notifications', label: 'Notificações' },
    { path: '/tasks', icon: 'assignment', label: 'Tarefas' },
    { path: '/chat-hub', icon: 'chat', label: 'Conversas' },
    { path: '/settings', icon: 'settings', label: 'Configurações' }
  ];

  // Mostrar todas as opções do menu (demonstração)
  const visibleItems = menuItems;

  // Expor toggleSidebar globalmente para uso em outras páginas
  useEffect(() => {
    if (isMobile) {
      window.toggleSidebar = toggleSidebar;
    }
    return () => {
      if (window.toggleSidebar) {
        delete window.toggleSidebar;
      }
    };
  }, [isMobile]);

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}
      
      <aside 
        className={`fixed left-0 top-0 h-full z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        style={{ 
          background: 'var(--panel-bg)',
          color: 'var(--text-primary)',
          width: '256px'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between py-4 px-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <span className="text-2xl font-bold tracking-tight">EaDuck</span>
            {isMobile && (
              <button 
                onClick={closeSidebar}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <span className="material-icons">close</span>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {visibleItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="material-icons">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="px-4 pb-6 pt-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg font-semibold shadow transition-all"
              style={{
                background: 'linear-gradient(to right, #dc2626, #ef4444)',
                color: 'white'
              }}
              onMouseOver={(e) => e.target.style.background = 'linear-gradient(to right, #b91c1c, #dc2626)'}
              onMouseOut={(e) => e.target.style.background = 'linear-gradient(to right, #dc2626, #ef4444)'}
            >
              <span className="material-icons">logout</span>
              Sair
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

