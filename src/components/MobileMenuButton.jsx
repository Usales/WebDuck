const MobileMenuButton = () => {
  const toggleMenu = () => {
    if (window.toggleSidebar) {
      window.toggleSidebar();
    }
  };

  return (
    <button
      onClick={toggleMenu}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg transition-colors shadow-lg"
      style={{ 
        background: 'var(--panel-bg)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border-color)'
      }}
      aria-label="Toggle menu"
    >
      <span className="material-icons">menu</span>
    </button>
  );
};

export default MobileMenuButton;

