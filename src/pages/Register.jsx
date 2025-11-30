import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Modal from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('info');
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const duckLogoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Animação do pato
    setTimeout(() => {
      if (duckLogoRef.current) {
        duckLogoRef.current.classList.add('continuous-bounce');
      }
    }, 1500);
  }, []);

  const showModal = (type, title, message) => {
    setModalType(type);
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name) {
      showModal('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showModal('error', 'Erro', 'As senhas não coincidem.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showModal('error', 'Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);
    showModal('loading', '', 'Criando conta...');

    try {
      await authService.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: 'STUDENT' // Apenas alunos podem se registrar
      });
      closeModal();
      showModal('success', 'Sucesso', 'Conta criada com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (err) {
      setLoading(false);
      showModal('error', 'Erro', err.message || 'Erro ao criar conta. Tente novamente.');
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
            Criar Conta
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Registre-se para acessar o EaDuck
          </p>
        </div>

        <form className="w-full px-8 pb-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1" style={{ color: 'var(--text-secondary)' }}>
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-1" style={{ color: 'var(--text-secondary)' }}>
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-1" style={{ color: 'var(--text-secondary)' }}>
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-1" style={{ color: 'var(--text-secondary)' }}>
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              required
            />
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
            Criar Conta
          </button>

          <div className="flex justify-center mt-4">
            <Link to="/login" className="text-sm hover:underline" style={{ color: 'var(--link-color)' }}>
              Já tem uma conta? Faça login
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

export default Register;

