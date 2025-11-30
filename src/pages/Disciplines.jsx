import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import { dataService } from '../services/dataService';
import Modal from '../components/Modal';

const Disciplines = () => {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Forçar atualização dos dados mockados
      const { mockDisciplines } = await import('../services/mockData.js');
      
      const existingDisciplines = localStorage.getItem('mockDisciplines');
      let disciplinesList = [];
      
      if (existingDisciplines) {
        disciplinesList = JSON.parse(existingDisciplines);
      }
      
      // Garantir que todas as disciplinas do mockData estejam presentes
      const nameMap = new Map(disciplinesList.map(d => [d.name, d]));
      mockDisciplines.forEach(mockDiscipline => {
        if (!nameMap.has(mockDiscipline.name)) {
          disciplinesList.push(mockDiscipline);
        } else {
          // Atualizar se necessário
          const index = disciplinesList.findIndex(d => d.id === nameMap.get(mockDiscipline.name).id);
          if (index !== -1) {
            disciplinesList[index] = { ...disciplinesList[index], ...mockDiscipline, id: disciplinesList[index].id };
          }
        }
      });
      
      disciplinesList.sort((a, b) => a.id - b.id);
      localStorage.setItem('mockDisciplines', JSON.stringify(disciplinesList));
      
      setDisciplines(disciplinesList);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback
      try {
        const disciplinesList = await dataService.getDisciplines();
        setDisciplines(disciplinesList);
      } catch (err) {
        console.error('Erro no fallback:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredDisciplines = disciplines.filter(discipline => {
    const searchLower = searchTerm.toLowerCase();
    return (
      discipline.name?.toLowerCase().includes(searchLower) ||
      discipline.description?.toLowerCase().includes(searchLower)
    );
  });

  const handleEdit = (discipline) => {
    setEditingDiscipline(discipline);
    setEditFormData({
      name: discipline.name || '',
      description: discipline.description || '',
      isActive: discipline.isActive !== undefined ? discipline.isActive : true
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingDiscipline) return;

    try {
      await dataService.updateDiscipline(editingDiscipline.id, editFormData);
      await loadData();
      setEditModalVisible(false);
      setEditingDiscipline(null);
      setEditFormData({});
    } catch (error) {
      console.error('Erro ao atualizar disciplina:', error);
      alert('Erro ao atualizar disciplina');
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingDiscipline(null);
    setEditFormData({});
  };

  const handleToggleActive = async (discipline) => {
    try {
      await dataService.updateDiscipline(discipline.id, {
        ...discipline,
        isActive: !discipline.isActive
      });
      await loadData();
    } catch (error) {
      console.error('Erro ao alterar status da disciplina:', error);
      alert('Erro ao alterar status da disciplina');
    }
  };

  const handleDeleteDiscipline = async (discipline) => {
    if (!window.confirm(`Tem certeza que deseja excluir a disciplina "${discipline.name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await dataService.deleteDiscipline(discipline.id);
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir disciplina:', error);
      alert('Erro ao excluir disciplina');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Sidebar />
        <MobileMenuButton />
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--accent-color)' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <MobileMenuButton />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Disciplinas
            </h1>
            <button
              onClick={loadData}
              className="px-4 py-2 rounded-lg font-semibold transition-all text-sm"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              Atualizar
            </button>
          </div>
          
          {/* Barra de busca */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
              style={{
                background: 'var(--input-bg)',
                color: 'var(--input-text)',
                border: '1px solid var(--input-border)'
              }}
            />
          </div>

          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Total: {filteredDisciplines.length} disciplina(s)
          </p>
        </div>

        {/* Cards de Disciplinas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDisciplines.length === 0 ? (
            <div 
              className="col-span-full rounded-xl shadow-lg p-8 text-center"
              style={{ background: 'var(--panel-bg)' }}
            >
              <p style={{ color: 'var(--text-secondary)' }}>
                Nenhuma disciplina encontrada
              </p>
            </div>
          ) : (
            filteredDisciplines.map((discipline) => (
              <div
                key={discipline.id}
                className="rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
                style={{ background: 'var(--panel-bg)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {discipline.name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    discipline.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {discipline.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="material-icons text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      description
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {discipline.description || 'Sem descrição'}
                    </span>
                  </div>
                  
                  {discipline.createdAt && (
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-sm" style={{ color: 'var(--text-secondary)' }}>
                        schedule
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Criada em: {new Date(discipline.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Botões de Ação */}
                <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(discipline)}
                      className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1"
                      style={{
                        background: 'var(--button-bg)',
                        color: 'var(--button-text)'
                      }}
                      title="Editar disciplina"
                    >
                      <span className="material-icons text-sm">edit</span>
                      Editar
                    </button>
                    <button
                      onClick={() => handleToggleActive(discipline)}
                      className={`px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 ${
                        discipline.isActive 
                          ? 'bg-yellow-500 hover:bg-yellow-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                      title={discipline.isActive ? 'Desativar disciplina' : 'Ativar disciplina'}
                    >
                      <span className="material-icons text-sm">
                        {discipline.isActive ? 'block' : 'check_circle'}
                      </span>
                      {discipline.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteDiscipline(discipline)}
                    className="w-full px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                    title="Excluir disciplina"
                  >
                    <span className="material-icons text-sm">delete</span>
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Edição de Disciplina */}
      <Modal
        visible={editModalVisible}
        type="info"
        title="Editar Disciplina"
        message=""
        onClose={handleCancelEdit}
      >
        {editingDiscipline && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Nome da Disciplina
              </label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
                placeholder="Ex: Matemática"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Descrição
              </label>
              <textarea
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
                placeholder="Ex: Álgebra e Geometria"
                rows="3"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={editFormData.isActive}
                onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="isActive" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Disciplina Ativa
              </label>
            </div>
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSaveEdit}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: 'var(--button-bg)',
                  color: 'var(--button-text)'
                }}
              >
                Salvar
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all"
                style={{
                  background: 'var(--text-secondary)',
                  color: 'var(--text-primary)'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Disciplines;

