import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MobileMenuButton from '../components/MobileMenuButton';
import { dataService } from '../services/dataService';

const Attendance = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [viewMode, setViewMode] = useState('register'); // 'register' | 'view'
  const [attendances, setAttendances] = useState([]);
  const [allAttendances, setAllAttendances] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [discipline, setDiscipline] = useState('');
  const [period, setPeriod] = useState('MANHA');
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Filtros para visualização
  const [disciplineFilter, setDisciplineFilter] = useState('');
  const [studentFilter, setStudentFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Histórico
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState(null);
  const [studentHistory, setStudentHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  
  // Resumo
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    loadClassrooms();
    loadDisciplines();
  }, []);

  useEffect(() => {
    if (selectedClassroom && viewMode === 'register') {
      loadAttendance();
    }
  }, [selectedClassroom, currentDate, viewMode]);

  const loadClassrooms = async () => {
    try {
      setLoading(true);
      const classroomsList = await dataService.getClassrooms();
      setClassrooms(classroomsList);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDisciplines = async () => {
    try {
      const disciplinesList = await dataService.getDisciplines();
      setDisciplines(disciplinesList);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  };

  const selectClassroom = (classroom) => {
    setSelectedClassroom(classroom);
    setViewMode('register');
    loadAttendance();
  };

  const loadAttendance = async () => {
    if (!selectedClassroom) return;
    
    setLoading(true);
    const dateStr = formatDateForApi(currentDate);
    
    try {
      const classroom = await dataService.getClassroom(selectedClassroom.id);
      const students = classroom.students || [];
      
      // Carregar frequências existentes do localStorage
      const cachedKey = `attendance_${selectedClassroom.id}_${dateStr}`;
      const cached = localStorage.getItem(cachedKey);
      let existingAttendances = [];
      
      if (cached) {
        try {
          const cacheData = JSON.parse(cached);
          existingAttendances = cacheData.bulk?.students || [];
        } catch (e) {
          console.error('Erro ao ler cache:', e);
        }
      }
      
      // Criar lista de frequências para todos os alunos
      const attendanceList = students.map((student, index) => {
        const existing = existingAttendances.find(a => a.studentId === student.id);
        return {
          id: existing?.id || `temp_${student.id}_${dateStr}`,
          classroomId: selectedClassroom.id,
          classroomName: selectedClassroom.name,
          studentId: student.id,
          studentName: student.nomeCompleto || student.name || student.email,
          date: dateStr,
          status: existing?.status || 'PRESENT',
          arrivalTime: existing?.arrivalTime || '',
          observations: existing?.observations || '',
          discipline: existing?.discipline || discipline,
          period: existing?.period || period
        };
      });
      
      setAttendances(attendanceList);
      calculateSummary(attendanceList);
    } catch (error) {
      console.error('Erro ao carregar frequência:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllAttendances = async () => {
    if (!selectedClassroom) return;
    
    setLoading(true);
    try {
      // Carregar todas as frequências do localStorage
      const keys = Object.keys(localStorage);
      const attendanceKeys = keys.filter(key => 
        key.startsWith(`attendance_${selectedClassroom.id}_`)
      );
      
      const allAttendancesList = [];
      attendanceKeys.forEach(key => {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const cacheData = JSON.parse(cached);
            if (cacheData.bulk?.students) {
              cacheData.bulk.students.forEach(student => {
                allAttendancesList.push({
                  ...student,
                  classroomId: selectedClassroom.id,
                  classroomName: selectedClassroom.name,
                  date: cacheData.bulk.date,
                  discipline: cacheData.bulk.discipline,
                  period: cacheData.bulk.period
                });
              });
            }
          }
        } catch (e) {
          console.error('Erro ao processar cache:', e);
        }
      });
      
      // Buscar nomes dos alunos
      const classroom = await dataService.getClassroom(selectedClassroom.id);
      const students = classroom.students || [];
      
      const attendancesWithNames = allAttendancesList.map(att => {
        const student = students.find(s => s.id === att.studentId);
        return {
          ...att,
          studentName: student?.nomeCompleto || student?.name || student?.email || 'Aluno'
        };
      });
      
      setAllAttendances(attendancesWithNames);
    } catch (error) {
      console.error('Erro ao carregar frequências:', error);
    } finally {
      setLoading(false);
    }
  };

  const previousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const nextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const onDateChange = (e) => {
    const dateStr = e.target.value;
    if (dateStr) {
      setCurrentDate(new Date(dateStr));
    }
  };

  const formatDateForApi = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getDateInputValue = () => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const updateAttendanceStatus = (attendance, status) => {
    if (!canEditAttendance(attendance)) {
      alert('Não é possível editar frequências após 1 dia da data de registro.');
      return;
    }
    
    const updated = attendances.map(att => 
      att.id === attendance.id 
        ? { ...att, status, arrivalTime: status !== 'LATE' ? '' : (att.arrivalTime || getCurrentTime()) }
        : att
    );
    setAttendances(updated);
    calculateSummary(updated);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  };

  const saveAttendance = async () => {
    if (!selectedClassroom) return;
    
    setSaving(true);
    const dateStr = formatDateForApi(currentDate);
    
    const bulk = {
      classroomId: selectedClassroom.id,
      date: dateStr,
      discipline: discipline || undefined,
      period: period,
      students: attendances.map(att => ({
        studentId: att.studentId,
        status: att.status.toUpperCase(),
        arrivalTime: att.arrivalTime || undefined,
        observations: att.observations || undefined
      }))
    };
    
    // Salvar no localStorage
    const cacheKey = `attendance_${selectedClassroom.id}_${dateStr}`;
    const cacheData = {
      bulk: bulk,
      timestamp: Date.now(),
      synced: false
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    
    alert('Frequência salva com sucesso!');
    setSaving(false);
    loadAttendance();
  };

  const calculateSummary = (attendanceList) => {
    const list = attendanceList || attendances;
    const total = list.length;
    const present = list.filter(a => a.status === 'PRESENT').length;
    const absent = list.filter(a => a.status === 'ABSENT').length;
    const late = list.filter(a => a.status === 'LATE').length;
    
    setTotalStudents(total);
    setPresentCount(present);
    setAbsentCount(absent);
    setLateCount(late);
    setAttendancePercentage(total > 0 ? (present * 100 / total) : 0);
  };

  const backToClassrooms = () => {
    setSelectedClassroom(null);
    setAttendances([]);
    setAllAttendances([]);
    setDiscipline('');
    setPeriod('MANHA');
    setViewMode('register');
    setDisciplineFilter('');
    setStudentFilter('');
    setDateFilter('');
    setSelectedStudentForHistory(null);
    setStudentHistory([]);
    setShowHistoryModal(false);
  };

  const viewAttendance = (classroom) => {
    setSelectedClassroom(classroom);
    setViewMode('view');
    loadAllAttendances();
  };

  const canEditAttendance = (attendance) => {
    if (!attendance.date) return true;
    const attendanceDate = new Date(attendance.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    attendanceDate.setHours(0, 0, 0, 0);
    const diffTime = today.getTime() - attendanceDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  const canEditCurrentDate = () => {
    const dateStr = formatDateForApi(currentDate);
    const attendanceDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    attendanceDate.setHours(0, 0, 0, 0);
    const diffTime = attendanceDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  const formatDateDisplayFromString = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT': return '✔';
      case 'ABSENT': return '✘';
      case 'LATE': return '⏱';
      default: return '';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PRESENT': return 'Presente';
      case 'ABSENT': return 'Ausente';
      case 'LATE': return 'Atrasado';
      default: return '-';
    }
  };

  const filteredAttendances = allAttendances.filter(att => {
    if (disciplineFilter && att.discipline !== disciplineFilter) return false;
    if (studentFilter && att.studentId.toString() !== studentFilter) return false;
    if (dateFilter) {
      const attDate = new Date(att.date);
      const filterDate = new Date(dateFilter);
      attDate.setHours(0, 0, 0, 0);
      filterDate.setHours(0, 0, 0, 0);
      if (attDate.getTime() !== filterDate.getTime()) return false;
    }
    return true;
  }).sort((a, b) => {
    if (a.studentId !== b.studentId) return a.studentId - b.studentId;
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  const uniqueDisciplines = [...new Set(allAttendances.map(a => a.discipline).filter(Boolean))].sort();
  const uniqueStudents = [...new Map(allAttendances.map(a => [a.studentId, a.studentName])).entries()]
    .map(([id, name]) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const isNewStudentRow = (index) => {
    if (index === 0) return true;
    const current = filteredAttendances[index];
    const previous = filteredAttendances[index - 1];
    return current?.studentId !== previous?.studentId;
  };

  const viewStudentHistory = (studentId) => {
    setSelectedStudentForHistory(studentId);
    setShowHistoryModal(true);
    const history = allAttendances
      .filter(att => att.studentId === studentId)
      .sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB.getTime() - dateA.getTime();
      });
    setStudentHistory(history);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedStudentForHistory(null);
    setStudentHistory([]);
  };

  const getStudentNameById = (studentId) => {
    const student = uniqueStudents.find(s => s.id === studentId);
    return student?.name || 'Aluno';
  };

  const exportToPdf = () => {
    if (!selectedClassroom) return;
    
    try {
      const dateStr = formatDateForApi(currentDate);
      const data = {
        sala: {
          nome: selectedClassroom.name,
          anoLetivo: selectedClassroom.academicYear
        },
        data: formatDateDisplay(currentDate),
        disciplina: discipline || 'Não especificada',
        periodo: period === 'MANHA' ? 'Manhã' : period === 'TARDE' ? 'Tarde' : 'Integral',
        alunos: attendances.map((att, index) => ({
          numero: index + 1,
          nome: att.studentName,
          status: getStatusLabel(att.status),
          horario: att.arrivalTime || '-',
          observacoes: att.observations || '-'
        })),
        resumo: {
          total: totalStudents,
          presentes: presentCount,
          ausentes: absentCount,
          atrasados: lateCount,
          percentual: attendancePercentage.toFixed(2) + '%'
        }
      };

      // Criar conteúdo HTML para PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Frequência - ${selectedClassroom.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; text-align: center; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .resumo { margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; }
            .resumo h3 { margin-top: 0; }
            .resumo-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
          </style>
        </head>
        <body>
          <h1>Ficha de Frequência</h1>
          <div class="info">
            <p><strong>Sala:</strong> ${data.sala.nome}</p>
            <p><strong>Ano Letivo:</strong> ${data.sala.anoLetivo}</p>
            <p><strong>Data:</strong> ${data.data}</p>
            <p><strong>Disciplina:</strong> ${data.disciplina}</p>
            <p><strong>Período:</strong> ${data.periodo}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Nome do Aluno</th>
                <th>Status</th>
                <th>Horário</th>
                <th>Observações</th>
              </tr>
            </thead>
            <tbody>
              ${data.alunos.map(aluno => `
                <tr>
                  <td>${aluno.numero}</td>
                  <td>${aluno.nome}</td>
                  <td>${aluno.status}</td>
                  <td>${aluno.horario}</td>
                  <td>${aluno.observacoes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="resumo">
            <h3>Resumo da Frequência</h3>
            <div class="resumo-grid">
              <div><strong>Total de Alunos:</strong> ${data.resumo.total}</div>
              <div><strong>Presentes:</strong> ${data.resumo.presentes}</div>
              <div><strong>Ausentes:</strong> ${data.resumo.ausentes}</div>
              <div><strong>Atrasados:</strong> ${data.resumo.atrasados}</div>
              <div><strong>Percentual de Presença:</strong> ${data.resumo.percentual}</div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Criar blob e fazer download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `frequencia_${selectedClassroom.name.replace(/\s+/g, '_')}_${dateStr.replace(/-/g, '')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Tentar abrir em nova janela para impressão
      const printWindow = window.open(url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar frequência. Tente novamente.');
    }
  };

  // Lista de Salas
  if (!selectedClassroom) {
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Sidebar />
        <MobileMenuButton />
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Frequência
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Selecione uma sala para registrar a frequência
              </p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <p style={{ color: 'var(--text-secondary)' }}>Carregando salas...</p>
              </div>
            )}

            {!loading && classrooms.length === 0 && (
              <div className="text-center py-12">
                <p style={{ color: 'var(--text-secondary)' }}>Nenhuma sala disponível</p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  Você precisa ter acesso a pelo menos uma sala para registrar frequências.
                </p>
              </div>
            )}

            {!loading && classrooms.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {classrooms.map((classroom) => (
                  <div
                    key={classroom.id}
                    className="rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:scale-105"
                    style={{ 
                      background: 'var(--panel-bg)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {classroom.name}
                      </h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Série / Ano:</span>
                        <span style={{ color: 'var(--text-primary)' }}>{classroom.academicYear || '-'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Alunos:</span>
                        <span style={{ color: 'var(--text-primary)' }}>{classroom.studentCount || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span style={{ color: 'var(--text-secondary)' }}>Professor:</span>
                        <span style={{ color: 'var(--text-primary)' }}>
                          {classroom.teacherNames?.[0] || classroom.teachers?.[0]?.name || '-'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                      <button
                        onClick={() => selectClassroom(classroom)}
                        className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        style={{
                          background: 'var(--accent-color)',
                          color: 'white'
                        }}
                      >
                        <span className="material-icons text-sm">edit</span>
                        Registrar Frequência
                      </button>
                      <button
                        onClick={() => viewAttendance(classroom)}
                        className="w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        style={{
                          background: 'var(--button-bg)',
                          color: 'var(--button-text)'
                        }}
                      >
                        <span className="material-icons text-sm">visibility</span>
                        Ver Frequência
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Visualização de Frequências
  if (viewMode === 'view') {
    return (
      <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        <Sidebar />
        <MobileMenuButton />
        <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <button
                onClick={backToClassrooms}
                className="flex items-center gap-2 px-4 py-2 rounded-lg mb-4 transition-all"
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                <span className="material-icons text-sm">arrow_back</span>
                Voltar
              </button>
              <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Histórico de Frequências
              </h1>
              <div className="flex gap-4 text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                <span><strong style={{ color: 'var(--text-primary)' }}>Nome da Sala:</strong> {selectedClassroom.name}</span>
                <span><strong style={{ color: 'var(--text-primary)' }}>Ano Letivo:</strong> {selectedClassroom.academicYear}</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Visualize todas as frequências registradas de todos os alunos em dias anteriores
              </p>
            </div>

            {loading && (
              <div className="text-center py-12">
                <p style={{ color: 'var(--text-secondary)' }}>Carregando frequências...</p>
              </div>
            )}

            {!loading && filteredAttendances.length === 0 && (
              <div className="text-center py-12">
                <p style={{ color: 'var(--text-secondary)' }}>Nenhuma frequência encontrada com os filtros selecionados.</p>
              </div>
            )}

            {!loading && filteredAttendances.length > 0 && (
              <div className="rounded-xl shadow-lg p-6" style={{ background: 'var(--panel-bg)' }}>
                {/* Filtros */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex flex-col gap-1 min-w-[200px]">
                    <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Data</label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        borderColor: 'var(--border-color)'
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-[200px]">
                    <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Disciplina</label>
                    <select
                      value={disciplineFilter}
                      onChange={(e) => setDisciplineFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <option value="">Todas</option>
                      {uniqueDisciplines.map(disc => (
                        <option key={disc} value={disc}>{disc}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 min-w-[200px]">
                    <label className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Aluno</label>
                    <select
                      value={studentFilter}
                      onChange={(e) => setStudentFilter(e.target.value)}
                      className="px-3 py-2 rounded-lg border"
                      style={{
                        background: 'var(--input-bg)',
                        color: 'var(--input-text)',
                        borderColor: 'var(--border-color)'
                      }}
                    >
                      <option value="">Todos</option>
                      {uniqueStudents.map(student => (
                        <option key={student.id} value={student.id}>{student.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setDateFilter('');
                        setDisciplineFilter('');
                        setStudentFilter('');
                      }}
                      className="px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                      style={{
                        background: 'var(--button-bg)',
                        color: 'var(--button-text)'
                      }}
                    >
                      <span className="material-icons text-sm">clear</span>
                      Limpar Filtros
                    </button>
                  </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[1200px]">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        <th className="px-3 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>
                          NOME DO ALUNO
                        </th>
                        <th className="px-3 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>
                          DISCIPLINA
                        </th>
                        <th className="px-3 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>
                          DATA
                        </th>
                        <th className="px-3 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>
                          PERÍODO
                        </th>
                        <th className="px-3 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>
                          STATUS
                        </th>
                        <th className="px-3 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>
                          HORÁRIO
                        </th>
                        <th className="px-3 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>
                          OBSERVAÇÕES
                        </th>
                        <th className="px-3 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>
                          AÇÕES
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendances.map((attendance, index) => (
                        <tr key={`${attendance.studentId}_${attendance.date}_${index}`} className="hover:bg-opacity-50" style={{ borderBottom: isNewStudentRow(index) ? '1px solid var(--border-color)' : 'none' }}>
                          <td className="px-3 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>
                            {isNewStudentRow(index) ? attendance.studentName : ''}
                          </td>
                          <td className="px-3 py-3" style={{ color: 'var(--text-primary)' }}>{attendance.discipline || '-'}</td>
                          <td className="px-3 py-3" style={{ color: 'var(--text-primary)' }}>{formatDateDisplayFromString(attendance.date)}</td>
                          <td className="px-3 py-3" style={{ color: 'var(--text-primary)' }}>{attendance.period || '-'}</td>
                          <td className="px-3 py-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              attendance.status === 'PRESENT' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              attendance.status === 'ABSENT' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {getStatusIcon(attendance.status)} {getStatusLabel(attendance.status)}
                            </span>
                          </td>
                          <td className="px-3 py-3" style={{ color: 'var(--text-primary)' }}>{attendance.arrivalTime || '-'}</td>
                          <td className="px-3 py-3" style={{ color: 'var(--text-primary)' }}>{attendance.observations || '-'}</td>
                          <td className="px-3 py-3">
                            <button
                              onClick={() => viewStudentHistory(attendance.studentId)}
                              className="p-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-all"
                              title="Ver histórico"
                            >
                              <span className="material-icons text-sm">history</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Ações na Visualização */}
            {!loading && filteredAttendances.length > 0 && (
              <div className="flex flex-col md:flex-row gap-4 justify-center mt-6">
                <button
                  onClick={exportToPdf}
                  className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-purple-500 text-white hover:bg-purple-600"
                >
                  <span className="material-icons text-sm">picture_as_pdf</span>
                  Emitir PDF
                </button>
                <button
                  onClick={() => {
                    setViewMode('register');
                    loadAttendance();
                  }}
                  className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: 'var(--button-bg)',
                    color: 'var(--button-text)'
                  }}
                >
                  <span className="material-icons text-sm">edit</span>
                  Editar Frequência
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Histórico */}
        {showHistoryModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={closeHistoryModal}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              style={{ background: 'var(--panel-bg)', color: 'var(--text-primary)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <div>
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    Histórico de Frequência
                  </h2>
                  {selectedStudentForHistory && (
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {getStudentNameById(selectedStudentForHistory)}
                    </p>
                  )}
                </div>
                <button
                  onClick={closeHistoryModal}
                  className="p-2 rounded hover:bg-opacity-50 transition-all"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <span className="material-icons">close</span>
                </button>
              </div>
              <div className="p-6">
                {studentHistory.length === 0 ? (
                  <p className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                    Nenhum registro de frequência encontrado.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ background: 'var(--bg-secondary)' }}>
                          <th className="px-4 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>DATA</th>
                          <th className="px-4 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>DISCIPLINA</th>
                          <th className="px-4 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>PERÍODO</th>
                          <th className="px-4 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>STATUS</th>
                          <th className="px-4 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>HORÁRIO</th>
                          <th className="px-4 py-3 text-left font-semibold uppercase text-xs" style={{ color: 'var(--text-primary)' }}>OBSERVAÇÕES</th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentHistory.map((record, index) => (
                          <tr key={index} className="hover:bg-opacity-50" style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{formatDateDisplayFromString(record.date)}</td>
                            <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{record.discipline || '-'}</td>
                            <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{record.period || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                                record.status === 'PRESENT' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                record.status === 'ABSENT' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              }`}>
                                {getStatusIcon(record.status)} {getStatusLabel(record.status)}
                              </span>
                            </td>
                            <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{record.arrivalTime || '-'}</td>
                            <td className="px-4 py-3" style={{ color: 'var(--text-primary)' }}>{record.observations || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Ficha de Presença
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <MobileMenuButton />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pt-16 md:pt-28">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <button
              onClick={backToClassrooms}
              className="flex items-center gap-2 px-4 py-2 rounded-lg mb-4 transition-all"
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              <span className="material-icons text-sm">arrow_back</span>
              Voltar
            </button>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Ficha de Frequência - {selectedClassroom.name}
            </h1>
          </div>

          {/* Navegação de Data */}
          <div className="flex items-center justify-between gap-4 mb-6 p-4 rounded-xl" style={{ background: 'var(--panel-bg)' }}>
            <button
              onClick={previousDay}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              <span className="material-icons text-sm">chevron_left</span>
              <span className="hidden sm:inline">Anterior</span>
            </button>
            <div className="flex items-center gap-4 flex-1 justify-center">
              <input
                type="date"
                value={getDateInputValue()}
                onChange={onDateChange}
                className="px-3 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              />
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formatDateDisplay(currentDate)}
              </span>
            </div>
            <button
              onClick={nextDay}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              <span className="hidden sm:inline">Próximo</span>
              <span className="material-icons text-sm">chevron_right</span>
            </button>
          </div>

          {/* Informações da Ficha */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Disciplina (opcional):
              </label>
              <select
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <option value="">Selecione uma disciplina</option>
                {disciplines.map(disc => (
                  <option key={disc.id} value={disc.name}>{disc.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Período:
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
                style={{
                  background: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <option value="MANHA">Manhã</option>
                <option value="TARDE">Tarde</option>
                <option value="INTEGRAL">Integral</option>
              </select>
            </div>
          </div>

          {/* Tabela de Presença */}
          {loading ? (
            <div className="text-center py-12">
              <p style={{ color: 'var(--text-secondary)' }}>Carregando frequência...</p>
            </div>
          ) : (
            <div className="rounded-xl shadow-lg p-4 mb-6 overflow-x-auto" style={{ background: 'var(--panel-bg)' }}>
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr style={{ background: 'var(--bg-secondary)' }}>
                    <th className="px-3 py-3 text-center font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Nº</th>
                    <th className="px-3 py-3 text-left font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Nome do Aluno</th>
                    <th className="px-3 py-3 text-center font-semibold text-xs hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>Presente (✔)</th>
                    <th className="px-3 py-3 text-center font-semibold text-xs hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>Ausente (✘)</th>
                    <th className="px-3 py-3 text-center font-semibold text-xs hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>Atrasado (⏱)</th>
                    <th className="px-3 py-3 text-center font-semibold text-xs" style={{ color: 'var(--text-primary)' }}>Status</th>
                    <th className="px-3 py-3 text-center font-semibold text-xs hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>Horário</th>
                    <th className="px-3 py-3 text-left font-semibold text-xs hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>Observações</th>
                  </tr>
                </thead>
                <tbody>
                  {attendances.map((attendance, index) => (
                    <tr key={attendance.id} className="hover:bg-opacity-50" style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td className="px-3 py-3 text-center font-semibold" style={{ color: 'var(--text-primary)' }}>{index + 1}</td>
                      <td className="px-3 py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{attendance.studentName}</td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <button
                          onClick={() => updateAttendanceStatus(attendance, 'PRESENT')}
                          disabled={!canEditAttendance(attendance)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            attendance.status === 'PRESENT'
                              ? 'bg-green-500 text-white border-green-500'
                              : 'border-gray-300 text-green-500 hover:bg-green-50'
                          }`}
                          title={canEditAttendance(attendance) ? 'Presente' : 'Não é possível editar após 1 dia'}
                        >
                          ✔
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <button
                          onClick={() => updateAttendanceStatus(attendance, 'ABSENT')}
                          disabled={!canEditAttendance(attendance)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            attendance.status === 'ABSENT'
                              ? 'bg-red-500 text-white border-red-500'
                              : 'border-gray-300 text-red-500 hover:bg-red-50'
                          }`}
                          title={canEditAttendance(attendance) ? 'Ausente' : 'Não é possível editar após 1 dia'}
                        >
                          ✘
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        <button
                          onClick={() => updateAttendanceStatus(attendance, 'LATE')}
                          disabled={!canEditAttendance(attendance)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            attendance.status === 'LATE'
                              ? 'bg-yellow-500 text-white border-yellow-500'
                              : 'border-gray-300 text-yellow-500 hover:bg-yellow-50'
                          }`}
                          title={canEditAttendance(attendance) ? 'Atrasado' : 'Não é possível editar após 1 dia'}
                        >
                          ⏱
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center md:hidden">
                        <div className="flex gap-1 justify-center">
                          <button
                            onClick={() => updateAttendanceStatus(attendance, 'PRESENT')}
                            disabled={!canEditAttendance(attendance)}
                            className={`w-7 h-7 rounded border transition-all text-sm ${
                              attendance.status === 'PRESENT'
                                ? 'bg-green-500 text-white border-green-500'
                                : 'border-gray-300 text-green-500'
                            }`}
                          >
                            ✔
                          </button>
                          <button
                            onClick={() => updateAttendanceStatus(attendance, 'ABSENT')}
                            disabled={!canEditAttendance(attendance)}
                            className={`w-7 h-7 rounded border transition-all text-sm ${
                              attendance.status === 'ABSENT'
                                ? 'bg-red-500 text-white border-red-500'
                                : 'border-gray-300 text-red-500'
                            }`}
                          >
                            ✘
                          </button>
                          <button
                            onClick={() => updateAttendanceStatus(attendance, 'LATE')}
                            disabled={!canEditAttendance(attendance)}
                            className={`w-7 h-7 rounded border transition-all text-sm ${
                              attendance.status === 'LATE'
                                ? 'bg-yellow-500 text-white border-yellow-500'
                                : 'border-gray-300 text-yellow-500'
                            }`}
                          >
                            ⏱
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center hidden md:table-cell">
                        {attendance.status === 'LATE' ? (
                          <input
                            type="time"
                            value={attendance.arrivalTime}
                            onChange={(e) => {
                              const updated = attendances.map(att =>
                                att.id === attendance.id ? { ...att, arrivalTime: e.target.value } : att
                              );
                              setAttendances(updated);
                            }}
                            className="px-2 py-1 rounded border text-sm"
                            style={{
                              background: 'var(--bg-primary)',
                              color: 'var(--text-primary)',
                              borderColor: 'var(--border-color)'
                            }}
                          />
                        ) : (
                          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <input
                          type="text"
                          value={attendance.observations}
                          onChange={(e) => {
                            const updated = attendances.map(att =>
                              att.id === attendance.id ? { ...att, observations: e.target.value } : att
                            );
                            setAttendances(updated);
                          }}
                          placeholder="Observações..."
                          className="w-full px-2 py-1 rounded border text-sm"
                          style={{
                            background: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            borderColor: 'var(--border-color)'
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Resumo */}
          <div className="rounded-xl shadow-lg p-6 mb-6" style={{ background: 'var(--panel-bg)' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Resumo da Frequência
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Total de Alunos</div>
                <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalStudents}</div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Presentes</div>
                <div className="text-2xl font-bold text-green-500">{presentCount}</div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Ausentes</div>
                <div className="text-2xl font-bold text-red-500">{absentCount}</div>
              </div>
              <div className="p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <div className="text-xs uppercase mb-1" style={{ color: 'var(--text-secondary)' }}>Atrasados</div>
                <div className="text-2xl font-bold text-yellow-500">{lateCount}</div>
              </div>
              <div className="p-4 rounded-lg md:col-span-1 col-span-2" style={{ background: 'var(--accent-color)', color: 'white' }}>
                <div className="text-xs uppercase mb-1">Percentual de Presença</div>
                <div className="text-2xl font-bold">{attendancePercentage.toFixed(2)}%</div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col md:flex-row gap-4 justify-center flex-wrap">
            <button
              onClick={saveAttendance}
              disabled={saving || !canEditCurrentDate()}
              className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: saving || !canEditCurrentDate() ? 'var(--text-secondary)' : 'var(--accent-color)',
                color: 'white'
              }}
              title={!canEditCurrentDate() ? 'Você pode registrar frequências para hoje ou até 7 dias no futuro' : 'Salvar frequência'}
            >
              <span className="material-icons text-sm">save</span>
              {saving ? 'Salvando...' : 'Salvar Frequência'}
            </button>
            <button
              onClick={() => viewAttendance(selectedClassroom)}
              className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              <span className="material-icons text-sm">visibility</span>
              Ver Frequência
            </button>
            <button
              onClick={exportToPdf}
              className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-purple-500 text-white hover:bg-purple-600"
            >
              <span className="material-icons text-sm">picture_as_pdf</span>
              Emitir PDF
            </button>
            <button
              onClick={() => {
                setViewMode('register');
                loadAttendance();
              }}
              className="px-6 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
              style={{
                background: 'var(--button-bg)',
                color: 'var(--button-text)'
              }}
            >
              <span className="material-icons text-sm">edit</span>
              Editar Frequência
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;

