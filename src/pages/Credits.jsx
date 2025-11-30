import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';

const Credits = () => {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <MobileMenuButton />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="material-icons">info</span>
            Créditos
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Informações sobre o projeto e desenvolvedores
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl">
          {/* Project Card */}
          <div className="rounded-xl shadow-lg p-8 mb-6" style={{ background: 'var(--panel-bg)' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-5xl">🦆</div>
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  EaDuck
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Plataforma de Ensino a Distância
                </p>
              </div>
            </div>

            <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              O EaDuck é uma plataforma completa de gerenciamento educacional desenvolvida para facilitar 
              o aprendizado a distância. Com recursos modernos e intuitivos, oferece uma experiência completa 
              para estudantes, professores e administradores.
            </p>

            {/* GitHub Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-lg font-semibold transition-all hover:transform hover:scale-105"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)',
                textDecoration: 'none'
              }}
            >
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>Ver no GitHub</span>
            </a>
          </div>

          {/* Team Section */}
          <div className="rounded-xl shadow-lg p-8 mb-6" style={{ background: 'var(--panel-bg)' }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="material-icons">people</span>
              Equipe de Desenvolvimento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Developer Card 1 - Gabriel Sales */}
              <div 
                className="rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105"
                style={{ 
                  background: 'var(--panel-bg)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div className="flex flex-col items-center gap-4 mb-4">
                  <img
                    src="/104046747.jpg"
                    alt="Gabriel Sales"
                    className="w-24 h-24 rounded-full object-cover border-4 shadow-md"
                    style={{ borderColor: 'var(--accent-color)' }}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Gabriel Sales
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Faculdade de Tecnologia SENAI de Desenvolvimento Gerencial
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-center mb-3">
                    <p className="text-xs font-medium flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <span className="material-icons text-sm">location_on</span>
                      Coimbra, Portugal
                    </p>
                  </div>
                  <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    Desenvolvedor Fullstack | Engenheiro de Software | Suporte de TI | Analista de Sistemas
                  </p>
                </div>

                <a
                  href="https://github.com/Usales"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                  style={{ 
                    background: 'var(--button-bg)',
                    color: 'var(--button-text)',
                    textDecoration: 'none'
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>

              {/* Developer Card 2 - Pedro Augusto */}
              <div 
                className="rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105"
                style={{ 
                  background: 'var(--panel-bg)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div className="flex flex-col items-center gap-4 mb-4">
                  <img
                    src="/81486320.jpg"
                    alt="Pedro Augusto"
                    className="w-24 h-24 rounded-full object-cover border-4 shadow-md"
                    style={{ borderColor: 'var(--accent-color)' }}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Pedro Augusto
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Faculdade de Tecnologia SENAI de Desenvolvimento Gerencial
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-center mb-3">
                    <p className="text-xs font-medium flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <span className="material-icons text-sm">location_on</span>
                      Goiânia, Brasil
                    </p>
                  </div>
                  <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    Transformando ideias em código e código em soluções inovadoras
                  </p>
                </div>

                <a
                  href="https://github.com/PedroAugusto-sys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                  style={{ 
                    background: 'var(--button-bg)',
                    color: 'var(--button-text)',
                    textDecoration: 'none'
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>

              {/* Developer Card 3 - Aleardo Cartocci */}
              <div 
                className="rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-105"
                style={{ 
                  background: 'var(--panel-bg)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div className="flex flex-col items-center gap-4 mb-4">
                  <img
                    src="/89143361.jpg"
                    alt="Aleardo Cartocci"
                    className="w-24 h-24 rounded-full object-cover border-4 shadow-md"
                    style={{ borderColor: 'var(--accent-color)' }}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Aleardo Cartocci
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      Faculdade de Tecnologia SENAI de Desenvolvimento Gerencial
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mb-4" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="text-center mb-3">
                    <p className="text-xs font-medium flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      <span className="material-icons text-sm">location_on</span>
                      Goiânia, Brasil
                    </p>
                  </div>
                  <p className="text-sm text-center leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    Documentação e Suporte Técnico da Plataforma
                  </p>
                </div>

                <a
                  href="https://github.com/Carttocci"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:scale-105"
                  style={{ 
                    background: 'var(--button-bg)',
                    color: 'var(--button-text)',
                    textDecoration: 'none'
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>

          {/* Technologies Section */}
          <div className="rounded-xl shadow-lg p-8" style={{ background: 'var(--panel-bg)' }}>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <span className="material-icons">code</span>
              Tecnologias Utilizadas
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'React',
                'Angular',
                'Spring Boot',
                'Java',
                'TypeScript',
                'JavaScript',
                'Tailwind CSS',
                'PostgreSQL'
              ].map((tech) => (
                <div
                  key={tech}
                  className="p-3 rounded-lg text-center font-medium"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              © {new Date().getFullYear()} EaDuck. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;

