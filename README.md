# EaDuck: Plataforma de Gestão e Comunicação Escolar 🦆📚

Bem-vindo ao **EaDuck - Versão Demonstrativa Web**, uma solução digital inovadora para revolucionar a gestão escolar! Esta é a versão web demonstrativa desenvolvida em React, que oferece uma prévia completa da interface e funcionalidades da plataforma original. Desenvolvido como projeto de conclusão do curso de Engenharia de Software na **FATESG SENAI**. 🚀

## Sobre o Projeto 🌟

O EaDuck nasceu para resolver desafios reais na educação, como a comunicação ineficiente e a complexidade na gestão de desempenho e materiais didáticos. Nosso objetivo? Criar uma plataforma acessível, segura e intuitiva que fortaleça a comunidade escolar e melhore a qualidade do ensino, focando na relação entre alunos e professores. 📊

### Sobre esta Versão Demonstrativa

Esta versão web é uma **demonstração funcional** da interface completa do EaDuck, desenvolvida para apresentação e testes de usabilidade. Ela utiliza dados mockados armazenados no localStorage, permitindo navegar por todas as funcionalidades sem necessidade de backend.

**⚠️ Importante**: Esta é uma versão demonstrativa sem backend real. Todos os dados são armazenados localmente no navegador e são resetados ao limpar o localStorage.

### Objetivos 🎯

| **Objetivo** | **Descrição** |
|--------------|---------------|
| Comunicação 📩 | Facilitar o fluxo de informações entre alunos, professores e gestores. |
| Desempenho 📈 | Simplificar o registro e acompanhamento do progresso acadêmico. |
| Recursos 📚 | Centralizar materiais didáticos em um único ambiente digital. |
| Gestão 🗂️ | Otimizar processos administrativos, como tarefas e eventos. |
| Engajamento 🤝 | Incentivar a participação ativa da comunidade escolar. |

## Diferenciais e Benefícios 🚀

- **Interface moderna e responsiva**: experiência fluida em qualquer dispositivo (desktop, tablet, mobile).
- **Tema claro/escuro**: alternância entre temas para melhor experiência visual.
- **Navegação intuitiva**: sidebar responsiva com menu hambúrguer para mobile.
- **Gestão centralizada**: controle total de usuários, turmas, tarefas e materiais.
- **Páginas completas**: todas as principais funcionalidades da plataforma original.
- **Design consistente**: interface seguindo os padrões visuais do projeto original.
- **Demonstração completa**: explore todas as funcionalidades sem necessidade de backend.

## Funcionalidades Implementadas ✨

### Autenticação 🔐
- ✅ **Login** - Sistema de autenticação simulado
- ✅ **Registro** - Cadastro de novos usuários
- ✅ **Recuperação de Senha** - Fluxo de recuperação de senha

### Gestão 👥
- ✅ **Usuários** - Listagem e gerenciamento de usuários
- ✅ **Salas de Aula** - Criação e gerenciamento de salas
- ✅ **Frequência** - Registro de presença dos alunos
- ✅ **Disciplinas** - Gerenciamento de disciplinas

### Acadêmico 📚
- ✅ **Tarefas** - Criação, visualização e gerenciamento de tarefas
- ✅ **Notificações** - Sistema de notificações em tempo real
- ✅ **Chat/Conversas** - Bate-papo integrado

### Configurações ⚙️
- ✅ **Configurações** - Tela completa com:
  - Informações pessoais (diferentes campos por perfil)
  - Segurança (alteração de senha)
  - Notificações (configurações de preferências)
  - Aparência (seleção de tema: claro, escuro, automático)

### Informações ℹ️
- ✅ **Créditos** - Página com informações da equipe e tecnologias utilizadas

## Tecnologias Utilizadas 🛠️

### Front-end 💻

| **Tecnologia** | **Versão** | **Finalidade** |
|----------------|------------|----------------|
| React | 19.x | Framework para construção da interface |
| Vite | - | Build tool e servidor de desenvolvimento |
| React Router DOM | - | Roteamento e navegação |
| Tailwind CSS | - | Framework CSS utilitário para estilização |
| Material Icons | - | Biblioteca de ícones |

### Características Técnicas 🔧

- **Build Tool**: Vite (build rápido e otimizado)
- **Gerenciamento de Estado**: React Hooks (useState, useEffect)
- **Armazenamento Local**: localStorage (dados mockados)
- **Temas**: Sistema de variáveis CSS para temas claro/escuro
- **Responsividade**: Design mobile-first com breakpoints Tailwind

## Equipe 💪

Desenvolvido com paixão por:

- **Gabriel Henriques Sales** - [GitHub](https://github.com/Usales) | Coimbra, Portugal  
  - Desenvolvedor Fullstack | Engenheiro de Software | Suporte de TI | Analista de Sistemas
  - Faculdade de Tecnologia SENAI de Desenvolvimento Gerencial

- **Pedro Augusto dos Santos Andrade** - [GitHub](https://github.com/PedroAugusto-sys) | Goiânia, Brasil
  - Software Engineering 🚀
  - Transformando ideias em código e código em soluções inovadoras
  - Faculdade de Tecnologia SENAI de Desenvolvimento Gerencial

- **Aleardo Cartocci Branquinho Senna** - [GitHub](https://github.com/Carttocci) | Goiânia, Brasil
  - Desenvolvedor Full Stack
  - Documentação e Suporte Técnico da Plataforma
  - Faculdade de Tecnologia SENAI de Desenvolvimento Gerencial

- **Orientadora**: Thielle Cathia de Paula dos Santos  

Agradecemos aos professores da FATESG e a todos que apoiaram essa jornada! 🙌

## Como Começar 🏁

### Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/eaduck/eaduck-demonstrativo.git

# Entre na pasta do projeto
cd eaduck-demonstrativo

# Instale as dependências
npm install
```

### Executando a Aplicação

```bash
# Inicie o servidor de desenvolvimento
npm run dev

# O projeto estará disponível em:
# http://localhost:5173
```

### Build para Produção

```bash
# Gerar build de produção
npm run build

# Os arquivos estarão na pasta 'dist'
```

### Preview da Build de Produção

```bash
# Visualizar build de produção localmente
npm run preview
```

## Credenciais de Demonstração 🔑

O sistema vem com usuários pré-configurados para demonstração:

### Administrador
- **Email:** `admin@eaduck.com` ou qualquer email do arquivo mockData.js
- **Senha:** Qualquer senha (sistema aceita qualquer senha para demonstração)

### Professor
- **Email:** `professor@eaduck.com` ou qualquer email do arquivo mockData.js
- **Senha:** Qualquer senha

### Estudante
- **Email:** `estudante@eaduck.com` ou qualquer email do arquivo mockData.js
- **Senha:** Qualquer senha

**Nota**: Em modo demonstrativo, o sistema aceita qualquer senha. Apenas verifica se o email existe na base de dados mockada.

## Estrutura do Projeto 📁

```
EaDuck-Demonstrativo/
├── public/                 # Arquivos estáticos
│   ├── favicon.png
│   └── [imagens dos desenvolvedores]
├── src/
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── Modal.jsx
│   │   └── ...
│   ├── pages/             # Páginas da aplicação
│   │   ├── Login.jsx
│   │   ├── Home.jsx
│   │   ├── Users.jsx
│   │   ├── Settings.jsx
│   │   ├── Credits.jsx
│   │   └── ...
│   ├── services/          # Serviços e lógica de negócio
│   │   ├── authService.js
│   │   ├── dataService.js
│   │   └── mockData.js
│   ├── App.jsx           # Componente principal
│   ├── main.jsx          # Ponto de entrada
│   └── index.css         # Estilos globais
├── package.json
└── README.md
```

## Estrutura de Dados Mockados 💾

Os dados são armazenados no localStorage com as seguintes chaves:

- `mockUsers` - Usuários do sistema (alunos, professores, admins)
- `mockClassrooms` - Salas de aula
- `mockTasks` - Tarefas acadêmicas
- `mockSubmissions` - Submissões de tarefas
- `mockNotifications` - Notificações do sistema
- `mockDisciplines` - Disciplinas cadastradas
- `mockAttendance` - Registros de frequência
- `mockChatMessages` - Mensagens do chat
- `eaduck_user` - Usuário atualmente logado
- `eaduck_token` - Token de autenticação simulado
- `theme` - Preferência de tema (light/dark/auto)
- `notificationSettings` - Configurações de notificações

## Recursos e Funcionalidades Específicas 🎯

### Tela de Configurações

A tela de configurações (`/settings`) oferece:

- **Informações Pessoais**: 
  - Campos específicos por perfil (ADMIN, TEACHER, STUDENT)
  - Formatação automática de CPF, telefone e data
  - Validação de campos obrigatórios

- **Segurança**:
  - Alteração de senha com confirmação
  - Validação de senha forte

- **Notificações**:
  - Configurações de preferências de notificação
  - Toggles para diferentes tipos de alertas

- **Aparência**:
  - Seleção de tema (Claro, Escuro, Automático)
  - Aplicação imediata das mudanças

### Tela de Créditos

A tela de créditos (`/credits`) apresenta:

- Informações sobre o projeto EaDuck
- Equipe de desenvolvimento com fotos e links do GitHub
- Tecnologias utilizadas
- Link para repositório do projeto

## Responsividade 📱

A interface é totalmente responsiva e se adapta a diferentes tamanhos de tela:

- **Desktop** (≥768px): Sidebar sempre visível à esquerda
- **Mobile** (<768px): Sidebar oculta em menu hambúrguer
- **Tablet**: Layout adaptado com sidebar recolhível

### Breakpoints Utilizados

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Temas 🎨

O sistema suporta três modos de tema:

1. **Tema Claro** (`light`): Interface com cores claras
2. **Tema Escuro** (`dark`): Interface com cores escuras
3. **Automático** (`auto`): Segue a preferência do sistema operacional

O tema pode ser alterado na tela de Configurações (`/settings`).

## Notas Importantes ⚠️

### Versão Demonstrativa

Esta é uma **versão demonstrativa** desenvolvida para:

- ✅ Apresentação do projeto
- ✅ Demonstração da interface e UX
- ✅ Testes de usabilidade
- ✅ Portfólio e showcase

### Limitações

- ❌ Não possui backend real
- ❌ Dados são armazenados apenas no localStorage
- ❌ Dados são perdidos ao limpar o cache do navegador
- ❌ Não há persistência entre diferentes dispositivos
- ❌ Algumas funcionalidades são placeholders (visuais)

### Comparação com Versão Original

| **Aspecto** | **Versão Original** | **Versão Demonstrativa** |
|-------------|---------------------|--------------------------|
| Backend | Spring Boot + PostgreSQL | Sem backend (localStorage) |
| Frontend | Angular 18 | React 19 + Vite |
| Autenticação | JWT real | Simulada |
| Persistência | Banco de dados | localStorage |
| WebSocket | STOMP/SockJS | Não implementado |
| PDF | iTextPDF | Não implementado |

## Planos Futuros 🔮

- [ ] Integração com backend real
- [ ] Implementação completa de WebSocket para chat
- [ ] Geração de PDFs (relatórios e boletins)
- [ ] Upload real de arquivos
- [ ] Notificações push reais
- [ ] PWA (Progressive Web App)
- [ ] Modo offline

## Scripts Disponíveis 📜

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Visualiza build de produção

# Lint (se configurado)
npm run lint         # Executa linter
```

## Deploy 🚀

Este projeto pode ser facilmente deployado em plataformas como:

- **Netlify** (recomendado para projetos React/Vite)
- **Vercel**
- **GitHub Pages**
- Qualquer servidor estático

### Deploy no Netlify

1. Conecte seu repositório ao Netlify
2. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Deploy automático!

## Licença 📄

Este é um projeto acadêmico desenvolvido como trabalho de conclusão de curso na FATESG SENAI.

## Agradecimentos 🙏

- FATESG SENAI pela oportunidade
- Todos os professores que contribuíram
- Comunidade open source pelas ferramentas utilizadas
- Todos que testaram e deram feedback

---

**EaDuck Team** | FATESG SENAI | 2025 🦆

**Versão Demonstrativa Web** | Desenvolvido com ❤️ em React + Vite
