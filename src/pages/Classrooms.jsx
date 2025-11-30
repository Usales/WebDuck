import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import { dataService } from '../services/dataService';
import Modal from '../components/Modal';

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [gradesModalVisible, setGradesModalVisible] = useState(false);
  const [addUsersModalVisible, setAddUsersModalVisible] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Forçar atualização dos dados mockados
      const { mockClassrooms } = await import('../services/mockData.js');
      
      const existingClassrooms = localStorage.getItem('mockClassrooms');
      let classroomsList = [];
      
      if (existingClassrooms) {
        classroomsList = JSON.parse(existingClassrooms);
      }
      
      // Garantir que todas as salas do mockData estejam presentes
      const nameMap = new Map(classroomsList.map(c => [c.name + c.academicYear, c]));
      mockClassrooms.forEach(mockClassroom => {
        const key = mockClassroom.name + mockClassroom.academicYear;
        if (!nameMap.has(key)) {
          classroomsList.push(mockClassroom);
        } else {
          // Atualizar se necessário
          const index = classroomsList.findIndex(c => c.id === nameMap.get(key).id);
          if (index !== -1) {
            classroomsList[index] = { ...classroomsList[index], ...mockClassroom, id: classroomsList[index].id };
          }
        }
      });
      
      classroomsList.sort((a, b) => a.id - b.id);
      localStorage.setItem('mockClassrooms', JSON.stringify(classroomsList));
      
      setClassrooms(classroomsList);
      
      // Carregar usuários também
      const usersList = await dataService.getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      // Fallback
      try {
        const [classroomsList, usersList] = await Promise.all([
          dataService.getClassrooms(),
          dataService.getUsers()
        ]);
        setClassrooms(classroomsList);
        setUsers(usersList);
      } catch (err) {
        console.error('Erro no fallback:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredClassrooms = classrooms.filter(classroom => {
    const searchLower = searchTerm.toLowerCase();
    return (
      classroom.name?.toLowerCase().includes(searchLower) ||
      classroom.academicYear?.toLowerCase().includes(searchLower)
    );
  });

  const getTeacherNames = (classroom) => {
    if (classroom.teacherNames && classroom.teacherNames.length > 0) {
      return classroom.teacherNames.join(', ');
    }
    if (classroom.teachers && classroom.teachers.length > 0) {
      return classroom.teachers.map(t => t.name || t.nomeCompleto).join(', ');
    }
    return 'Sem professores';
  };

  const getStudentCount = (classroom) => {
    if (classroom.studentCount !== undefined) {
      return classroom.studentCount;
    }
    if (classroom.students && Array.isArray(classroom.students)) {
      return classroom.students.length;
    }
    return 0;
  };

  const handleEdit = (classroom) => {
    setEditingClassroom(classroom);
    setEditFormData({
      name: classroom.name || '',
      academicYear: classroom.academicYear || '',
      isActive: classroom.isActive !== undefined ? classroom.isActive : true
    });
    setEditModalVisible(true);
  };

  const handleSaveEdit = async () => {
    if (!editingClassroom) return;

    try {
      await dataService.updateClassroom(editingClassroom.id, editFormData);
      await loadData();
      setEditModalVisible(false);
      setEditingClassroom(null);
      setEditFormData({});
    } catch (error) {
      console.error('Erro ao atualizar sala:', error);
      alert('Erro ao atualizar sala');
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingClassroom(null);
    setEditFormData({});
  };

  const handleToggleActive = async (classroom) => {
    try {
      await dataService.updateClassroom(classroom.id, {
        ...classroom,
        isActive: !classroom.isActive
      });
      await loadData();
    } catch (error) {
      console.error('Erro ao alterar status da sala:', error);
      alert('Erro ao alterar status da sala');
    }
  };

  const handleViewAttendance = (classroom) => {
    setSelectedClassroom(classroom);
    setAttendanceModalVisible(true);
  };

  const handleViewGrades = (classroom) => {
    setSelectedClassroom(classroom);
    setGradesModalVisible(true);
  };

  const handleAddUsers = (classroom) => {
    setSelectedClassroom(classroom);
    setAddUsersModalVisible(true);
  };

  const handleExportData = (classroom) => {
    try {
      const data = {
        sala: {
          id: classroom.id,
          nome: classroom.name,
          anoLetivo: classroom.academicYear,
          status: classroom.isActive ? 'Ativa' : 'Inativa',
          dataCriacao: classroom.createdAt
        },
        professores: classroom.teachers || [],
        alunos: classroom.students || [],
        totalAlunos: getStudentCount(classroom),
        totalProfessores: classroom.teachers?.length || 0
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dados_sala_${classroom.name.replace(/\s+/g, '_')}_${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleExportGrades = (classroom) => {
    try {
      // Simular dados de notas
      const grades = {
        sala: {
          id: classroom.id,
          nome: classroom.name,
          anoLetivo: classroom.academicYear
        },
        alunos: (classroom.students || []).map(student => ({
          id: student.id,
          nome: student.nomeCompleto || student.name,
          email: student.email,
          notas: [
            { disciplina: 'Matemática', nota: '8.5', data: '2024-01-15' },
            { disciplina: 'Português', nota: '7.0', data: '2024-01-20' },
            { disciplina: 'História', nota: '9.0', data: '2024-01-25' }
          ]
        })),
        dataExportacao: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(grades, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notas_sala_${classroom.name.replace(/\s+/g, '_')}_${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar notas:', error);
      alert('Erro ao exportar notas');
    }
  };

  const handleDeleteClassroom = async (classroom) => {
    if (!window.confirm(`Tem certeza que deseja excluir a sala "${classroom.name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      const classrooms = JSON.parse(localStorage.getItem('mockClassrooms') || '[]');
      const filtered = classrooms.filter(c => c.id !== classroom.id);
      localStorage.setItem('mockClassrooms', JSON.stringify(filtered));
      await loadData();
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      alert('Erro ao excluir sala');
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
              Salas de Aula
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
              placeholder="Buscar por nome ou ano letivo..."
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
            Total: {filteredClassrooms.length} sala(s)
          </p>
        </div>

        {/* Cards de Salas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.length === 0 ? (
            <div 
              className="col-span-full rounded-xl shadow-lg p-8 text-center"
              style={{ background: 'var(--panel-bg)' }}
            >
              <p style={{ color: 'var(--text-secondary)' }}>
                Nenhuma sala encontrada
              </p>
            </div>
          ) : (
            filteredClassrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="rounded-xl shadow-lg p-6 hover:scale-105 transition-transform"
                style={{ background: 'var(--panel-bg)' }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    {classroom.name}
                  </h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    classroom.isActive 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {classroom.isActive ? 'Ativa' : 'Inativa'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm" style={{ color: 'var(--text-secondary)' }}>
                      calendar_today
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Ano Letivo: {classroom.academicYear}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm" style={{ color: 'var(--text-secondary)' }}>
                      person
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Professores: {getTeacherNames(classroom)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="material-icons text-sm" style={{ color: 'var(--text-secondary)' }}>
                      people
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Alunos: {getStudentCount(classroom)}
                    </span>
                  </div>
                  
                  {classroom.createdAt && (
                    <div className="flex items-center gap-2">
                      <span className="material-icons text-sm" style={{ color: 'var(--text-secondary)' }}>
                        schedule
                      </span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Criada em: {new Date(classroom.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Botões de Ação */}
                <div className="mt-4 pt-4 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleViewAttendance(classroom)}
                      className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 bg-blue-500 hover:bg-blue-600 text-white"
                      title="Ver frequência"
                    >
                      <span className="material-icons text-sm">check_circle</span>
                      Frequência
                    </button>
                    <button
                      onClick={() => handleViewGrades(classroom)}
                      className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 bg-purple-500 hover:bg-purple-600 text-white"
                      title="Ver notas"
                    >
                      <span className="material-icons text-sm">grade</span>
                      Notas
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleAddUsers(classroom)}
                      className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 bg-green-500 hover:bg-green-600 text-white"
                      title="Adicionar usuários"
                    >
                      <span className="material-icons text-sm">person_add</span>
                      Adicionar
                    </button>
                    <button
                      onClick={() => handleEdit(classroom)}
                      className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1"
                      style={{
                        background: 'var(--button-bg)',
                        color: 'var(--button-text)'
                      }}
                      title="Editar sala"
                    >
                      <span className="material-icons text-sm">edit</span>
                      Editar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleExportData(classroom)}
                      className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white"
                      title="Exportar dados"
                    >
                      <span className="material-icons text-sm">download</span>
                      Exportar
                    </button>
                    <button
                      onClick={() => handleExportGrades(classroom)}
                      className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 bg-teal-500 hover:bg-teal-600 text-white"
                      title="Exportar notas"
                    >
                      <span className="material-icons text-sm">file_download</span>
                      Notas
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleActive(classroom)}
                      className={`px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 ${
                        classroom.isActive 
                          ? 'bg-yellow-500 hover:bg-yellow-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white`}
                      title={classroom.isActive ? 'Desativar sala' : 'Ativar sala'}
                    >
                      <span className="material-icons text-sm">
                        {classroom.isActive ? 'block' : 'check_circle'}
                      </span>
                      {classroom.isActive ? 'Desativar' : 'Ativar'}
                    </button>
                    <button
                      onClick={() => handleDeleteClassroom(classroom)}
                      className="px-3 py-2 rounded-lg font-semibold transition-all text-xs flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white"
                      title="Excluir sala"
                    >
                      <span className="material-icons text-sm">delete</span>
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Edição de Sala */}
      <Modal
        visible={editModalVisible}
        type="info"
        title="Editar Sala"
        message=""
        onClose={handleCancelEdit}
      >
        {editingClassroom && (
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Nome da Sala
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
                placeholder="Ex: Turma A - 2024"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                Ano Letivo
              </label>
              <input
                type="text"
                value={editFormData.academicYear}
                onChange={(e) => setEditFormData({ ...editFormData, academicYear: e.target.value })}
                className="w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none"
                style={{
                  background: 'var(--input-bg)',
                  color: 'var(--input-text)',
                  border: '1px solid var(--input-border)'
                }}
                placeholder="Ex: 2024"
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
                Sala Ativa
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

      {/* Modal de Frequência */}
      <Modal
        visible={attendanceModalVisible}
        type="info"
        title={`Frequência - ${selectedClassroom?.name || ''}`}
        message=""
        onClose={() => setAttendanceModalVisible(false)}
      >
        {selectedClassroom && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Aluno</th>
                    <th className="px-4 py-2 text-center" style={{ color: 'var(--text-secondary)' }}>Presenças</th>
                    <th className="px-4 py-2 text-center" style={{ color: 'var(--text-secondary)' }}>Faltas</th>
                    <th className="px-4 py-2 text-center" style={{ color: 'var(--text-secondary)' }}>Frequência</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedClassroom.students || []).length > 0 ? (
                    selectedClassroom.students.map((student) => {
                      const presencas = Math.floor(Math.random() * 20) + 15;
                      const faltas = Math.floor(Math.random() * 5);
                      const total = presencas + faltas;
                      const frequencia = total > 0 ? ((presencas / total) * 100).toFixed(1) : 0;
                      return (
                        <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                            {student.nomeCompleto || student.name}
                          </td>
                          <td className="px-4 py-2 text-center" style={{ color: 'var(--text-primary)' }}>
                            {presencas}
                          </td>
                          <td className="px-4 py-2 text-center" style={{ color: 'var(--text-primary)' }}>
                            {faltas}
                          </td>
                          <td className="px-4 py-2 text-center" style={{ color: 'var(--text-primary)' }}>
                            {frequencia}%
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-4 py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                        Nenhum aluno cadastrado nesta sala
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setAttendanceModalVisible(false)}
              className="w-full px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      {/* Modal de Notas */}
      <Modal
        visible={gradesModalVisible}
        type="info"
        title={`Notas - ${selectedClassroom?.name || ''}`}
        message=""
        onClose={() => setGradesModalVisible(false)}
      >
        {selectedClassroom && (
          <div className="space-y-4">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="sticky top-0" style={{ background: 'var(--panel-bg)' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th className="px-4 py-2 text-left" style={{ color: 'var(--text-secondary)' }}>Aluno</th>
                    <th className="px-4 py-2 text-center" style={{ color: 'var(--text-secondary)' }}>Matemática</th>
                    <th className="px-4 py-2 text-center" style={{ color: 'var(--text-secondary)' }}>Português</th>
                    <th className="px-4 py-2 text-center" style={{ color: 'var(--text-secondary)' }}>História</th>
                    <th className="px-4 py-2 text-center" style={{ color: 'var(--text-secondary)' }}>Média</th>
                  </tr>
                </thead>
                <tbody>
                  {(selectedClassroom.students || []).length > 0 ? (
                    selectedClassroom.students.map((student) => {
                      const notas = {
                        matematica: (Math.random() * 4 + 6).toFixed(1),
                        portugues: (Math.random() * 4 + 6).toFixed(1),
                        historia: (Math.random() * 4 + 6).toFixed(1)
                      };
                      const media = ((parseFloat(notas.matematica) + parseFloat(notas.portugues) + parseFloat(notas.historia)) / 3).toFixed(1);
                      return (
                        <tr key={student.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td className="px-4 py-2" style={{ color: 'var(--text-primary)' }}>
                            {student.nomeCompleto || student.name}
                          </td>
                          <td className="px-4 py-2 text-center" style={{ color: 'var(--text-primary)' }}>
                            {notas.matematica}
                          </td>
                          <td className="px-4 py-2 text-center" style={{ color: 'var(--text-primary)' }}>
                            {notas.portugues}
                          </td>
                          <td className="px-4 py-2 text-center" style={{ color: 'var(--text-primary)' }}>
                            {notas.historia}
                          </td>
                          <td className="px-4 py-2 text-center font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {media}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                        Nenhum aluno cadastrado nesta sala
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setGradesModalVisible(false)}
              className="w-full px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>

      {/* Modal de Adicionar Usuários */}
      <Modal
        visible={addUsersModalVisible}
        type="info"
        title={`Adicionar Usuários - ${selectedClassroom?.name || ''}`}
        message=""
        onClose={() => setAddUsersModalVisible(false)}
      >
        {selectedClassroom && (
          <div className="space-y-4">
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {users.filter(user => user.role === 'STUDENT' || user.role === 'TEACHER').map((user) => {
                  const isInClassroom = selectedClassroom.students?.some(s => s.id === user.id) || 
                                       selectedClassroom.teachers?.some(t => t.id === user.id);
                  return (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg"
                      style={{ background: 'var(--input-bg)' }}
                    >
                      <div>
                        <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                          {user.nomeCompleto || user.name}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                          {user.email} - {user.role === 'STUDENT' ? 'Aluno' : 'Professor'}
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            const classrooms = JSON.parse(localStorage.getItem('mockClassrooms') || '[]');
                            const index = classrooms.findIndex(c => c.id === selectedClassroom.id);
                            if (index !== -1) {
                              if (user.role === 'STUDENT') {
                                if (!classrooms[index].students) classrooms[index].students = [];
                                if (isInClassroom) {
                                  classrooms[index].students = classrooms[index].students.filter(s => s.id !== user.id);
                                  classrooms[index].studentCount = classrooms[index].students.length;
                                } else {
                                  classrooms[index].students.push(user);
                                  classrooms[index].studentCount = classrooms[index].students.length;
                                }
                              } else {
                                if (!classrooms[index].teachers) classrooms[index].teachers = [];
                                if (isInClassroom) {
                                  classrooms[index].teachers = classrooms[index].teachers.filter(t => t.id !== user.id);
                                } else {
                                  classrooms[index].teachers.push(user);
                                }
                                if (!classrooms[index].teacherNames) classrooms[index].teacherNames = [];
                                classrooms[index].teacherNames = classrooms[index].teachers.map(t => t.name || t.nomeCompleto);
                              }
                              localStorage.setItem('mockClassrooms', JSON.stringify(classrooms));
                              await loadData();
                              setSelectedClassroom(classrooms[index]);
                            }
                          } catch (error) {
                            console.error('Erro ao adicionar/remover usuário:', error);
                            alert('Erro ao atualizar sala');
                          }
                        }}
                        className={`px-3 py-1 rounded text-sm font-semibold transition-all ${
                          isInClassroom
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {isInClassroom ? 'Remover' : 'Adicionar'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              onClick={() => setAddUsersModalVisible(false)}
              className="w-full px-4 py-2 rounded-lg font-semibold transition-all"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              Fechar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Classrooms;

