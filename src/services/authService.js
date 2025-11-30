// Serviço de autenticação simulado

import { mockUsers } from './mockData.js';

const STORAGE_KEY = 'eaduck_user';
const STORAGE_TOKEN = 'eaduck_token';

// Garantir que os dados mockados sejam inicializados
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('mockUsers')) {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  }
}

export const authService = {
  // Simular login - aceita qualquer senha
  login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Garantir que os dados mockados estejam inicializados
          if (!localStorage.getItem('mockUsers')) {
            localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
          }
          
          const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
          const user = users.find(u => u.email === email);
          
          if (user && user.isActive) {
            // Aceita qualquer senha - apenas verifica se o email existe
            const token = `mock_token_${user.id}_${Date.now()}`;
            const userData = { ...user };
            delete userData.password;
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
            localStorage.setItem(STORAGE_TOKEN, token);
            
            resolve({ user: userData, token });
          } else if (user && !user.isActive) {
            reject({ status: 401, message: 'Usuário inativo' });
          } else {
            reject({ status: 401, message: 'E-mail não encontrado. Verifique se o e-mail está correto ou crie uma conta.' });
          }
        } catch (error) {
          console.error('Erro no login:', error);
          reject({ status: 500, message: 'Erro ao processar login. Tente novamente.' });
        }
      }, 500);
    });
  },

  // Simular registro
  register(userData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const exists = users.find(u => u.email === userData.email);
        
        if (exists) {
          reject({ status: 400, message: 'E-mail já cadastrado' });
          return;
        }
        
        // Garantir que o ID seja único
        const maxId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) : 0;
        const newUser = {
          id: maxId + 1,
          ...userData,
          isActive: true,
          role: userData.role || 'STUDENT'
        };
        
        users.push(newUser);
        localStorage.setItem('mockUsers', JSON.stringify(users));
        
        const token = `mock_token_${newUser.id}_${Date.now()}`;
        const userResponse = { ...newUser };
        delete userResponse.password;
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userResponse));
        localStorage.setItem(STORAGE_TOKEN, token);
        
        resolve({ user: userResponse, token });
      }, 500);
    });
  },

  // Logout
  logout() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_TOKEN);
  },

  // Obter usuário atual
  getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar se está autenticado
  isAuthenticated() {
    return !!localStorage.getItem(STORAGE_TOKEN);
  },

  // Obter token
  getToken() {
    return localStorage.getItem(STORAGE_TOKEN);
  }
};

