import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/Modal';
import ThemeToggle from '../components/ThemeToggle';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const duckLogoRef = useRef(null);

  useEffect(() => {
    // Animação do pato
    setTimeout(() => {
      if (duckLogoRef.current) {
        duckLogoRef.current.classList.add('continuous-bounce');
      }
    }, 1500);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setModalVisible(true);
      return;
    }

    setLoading(true);
    // Simular envio de email
    setTimeout(() => {
      setLoading(false);
      setModalVisible(true);
    }, 1000);
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
            Recuperar Senha
          </h1>
          <p className="text-sm mt-1 text-center px-4" style={{ color: 'var(--text-secondary)' }}>
            Digite seu e-mail para receber instruções de recuperação
          </p>
        </div>

        <form className="w-full px-8 pb-8" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1" style={{ color: 'var(--text-secondary)' }}>
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
              placeholder="seu@email.com"
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
            {loading ? 'Enviando...' : 'Enviar Instruções'}
          </button>

          <div className="flex justify-center mt-4">
            <Link to="/login" className="text-sm hover:underline" style={{ color: 'var(--link-color)' }}>
              Voltar para o login
            </Link>
          </div>
        </form>
      </div>

      <Modal
        visible={modalVisible}
        type="info"
        title="Instruções Enviadas"
        message="Se o e-mail estiver cadastrado, você receberá instruções para recuperar sua senha. (Demonstração - sem envio real)"
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default ForgotPassword;

