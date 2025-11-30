# EaDuck - Versão Demonstrativa Web

Esta é uma versão demonstrativa web do sistema EaDuck, desenvolvida em React com Vite. Esta versão **não possui backend** e utiliza dados mockados armazenados no localStorage para demonstração.

## 🚀 Características

- ✅ Interface completa com todas as telas principais
- ✅ Sistema de autenticação simulado
- ✅ Dados mockados para demonstração
- ✅ Tema claro/escuro
- ✅ Design responsivo
- ✅ Navegação completa entre páginas

## 📋 Páginas Implementadas

### Autenticação
- ✅ Login
- ✅ Registro
- ✅ Recuperação de Senha

### Páginas Principais
- ✅ Dashboard (Home)
- ✅ Usuários (placeholder)
- ✅ Salas de Aula (placeholder)
- ✅ Tarefas (placeholder)
- ✅ Notificações (placeholder)
- ✅ Chat/Conversas (placeholder)
- ✅ Frequência (placeholder)
- ✅ Disciplinas (placeholder)
- ✅ Configurações (placeholder)

## 🔐 Credenciais de Teste

O sistema vem com usuários pré-configurados para demonstração:

### Administrador
- **Email:** `admin@eaduck.com`
- **Senha:** `admin123`

### Professor
- **Email:** `professor@eaduck.com`
- **Senha:** `prof123`

### Estudante
- **Email:** `estudante@eaduck.com`
- **Senha:** `est123`

## 🛠️ Tecnologias

- **React 19** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento
- **Tailwind CSS** - Estilização
- **Material Icons** - Ícones

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

## 📝 Notas Importantes

⚠️ **Esta é uma versão demonstrativa:**
- Não há backend real - todos os dados são armazenados no localStorage
- As funcionalidades estão parcialmente implementadas (algumas páginas são placeholders)
- Os dados são resetados ao limpar o localStorage
- Não há persistência real de dados entre sessões

## 🎨 Temas

O sistema suporta tema claro e escuro, que pode ser alternado através do botão no canto superior direito das páginas de autenticação.

## 📱 Responsividade

A interface é totalmente responsiva e se adapta a diferentes tamanhos de tela:
- Desktop: Sidebar sempre visível
- Mobile: Sidebar em menu hambúrguer

## 🔄 Estrutura de Dados Mockados

Os dados são armazenados no localStorage com as seguintes chaves:
- `mockUsers` - Usuários do sistema
- `mockClassrooms` - Salas de aula
- `mockTasks` - Tarefas
- `mockSubmissions` - Submissões de tarefas
- `mockNotifications` - Notificações
- `mockDisciplines` - Disciplinas
- `mockAttendance` - Registros de frequência
- `mockChatMessages` - Mensagens de chat

## 📄 Licença

Este é um projeto demonstrativo criado para fins de apresentação.
