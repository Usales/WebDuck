import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Modal from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const [email, setEmail] = useState('eaduck@example.com');
  const [password, setPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const duckLogoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Se já estiver autenticado, redirecionar
    if (authService.isAuthenticated()) {
      navigate('/home');
    }

    // Animação do pato
    setTimeout(() => {
      if (duckLogoRef.current) {
        duckLogoRef.current.classList.add('continuous-bounce');
      }
    }, 1500);
  }, [navigate]);

  const showModal = (type, title, message) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showModal('error', 'Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showModal('error', 'Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    showModal('loading', '', 'Autenticando...');

    try {
      const result = await authService.login(email, password);
      setLoading(false);
      closeModal();
      navigate('/home');
    } catch (err) {
      setLoading(false);
      let message = err.message || 'E-mail não encontrado.';
      
      if (err.status === 401) {
        if (err.message?.toLowerCase().includes('inativo')) {
          message = 'Sua conta está inativa. Entre em contato com o administrador.';
        } else {
          message = err.message || 'E-mail não encontrado.';
        }
      } else if (err.status === 0) {
        message = 'Não foi possível conectar ao servidor.';
      }
      
      showModal('error', 'Erro de autenticação', message);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div 
        className="rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center transition-colors duration-300"
        style={{ background: 'var(--panel-bg)' }}
      >
        <div className="mb-6 flex flex-col items-center mt-8">
          <div className="mb-4 duck-container">
            <img 
              ref={duckLogoRef}
              src="/favicon.png" 
              alt="EaDuck Logo" 
              className="w-16 h-16 duck-animation"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Login EaDuck
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Conecte-se à sua conta para acessar o painel
          </p>
        </div>

        <form className="w-full px-8 pb-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1" style={{ color: 'var(--text-secondary)' }}>
              E-mail
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)',
                  fontWeight: 300,
                  fontStyle: 'italic'
                }}
                placeholder="eaduck@example.com"
                required
                autoComplete="off"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1" style={{ color: 'var(--text-secondary)' }}>
              Senha
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
                placeholder="********"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                style={{ color: 'var(--text-primary)' }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.94 17.94A10.06 10.06 0 0112 19.5c-5 0-9.27-3.11-11-7.5a10.44 10.44 0 012.73-4.11l1.43 1.43A8.44 8.44 0 003 12c1.73 4.39 6 7.5 11 7.5 1.61 0 3.13-.31 4.5-.86l1.44 1.44a1 1 0 001.41-1.41l-16-16A1 1 0 003.05 3.05l1.44 1.44A10.44 10.44 0 0112 4.5c5 0 9.27 3.11 11 7.5a10.44 10.44 0 01-2.73 4.11l-1.43-1.43A8.44 8.44 0 0021 12c-1.73-4.39-6-7.5-11-7.5-1.61 0-3.13.31-4.5.86L3.05 3.05a1 1 0 00-1.41 1.41l16 16a1 1 0 001.41-1.41z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zm0 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-10a4 4 0 100 8 4 4 0 000-8z"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 font-semibold shadow-md transition-all rounded-lg disabled:opacity-50"
            style={{
              background: 'var(--button-bg)',
              color: 'var(--button-text)'
            }}
          >
            Entrar
          </button>

          <div className="flex flex-col items-center mt-4 space-y-1">
            <Link to="/forgot-password" className="text-sm hover:underline" style={{ color: 'var(--link-color)' }}>
              Esqueceu sua senha?
            </Link>
            <Link to="/register" className="text-sm hover:underline" style={{ color: 'var(--link-color)' }}>
              Não tem uma conta? Cadastre-se
            </Link>
          </div>
        </form>
      </div>

      <Modal
        visible={modalVisible}
        type={modalType}
        title={modalTitle}
        message={modalMessage}
        onClose={closeModal}
      />
    </div>
  );
};

export default Login;

