import React, { useState } from 'react';
import { STUDENTS, COMPETITION_EVENTS, SCHOOLS, CLUSTERS } from '../../data/mockData';
import { CompetitionCategory, StudentParticipant } from '../../types';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Filter, 
  CheckCircle2, 
  CreditCard, 
  Printer, 
  Download, 
  X,
  FileBadge
} from 'lucide-react';

export const StudentRegistrationView: React.FC = () => {
  const [studentsList, setStudentsList] = useState<StudentParticipant[]>(STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCluster, setSelectedCluster] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAdmitCardStudent, setSelectedAdmitCardStudent] = useState<StudentParticipant | null>(null);

  // Form states
  const [satsId, setSatsId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState<'ಗಂಡು' | 'ಹೆಣ್ಣು'>('ಹೆಣ್ಣು');
  const [formCategory, setFormCategory] = useState<CompetitionCategory>('junior');
  const [grade, setGrade] = useState('3ನೇ ತರಗತಿ');
  const [schoolId, setSchoolId] = useState(SCHOOLS[0].id);
  const [formEventId, setFormEventId] = useState('div1-ev-01');
  const [mobile, setMobile] = useState('');

  // Strictly filter events for selected category from the central JSON configuration
  const eventsForSelectedCategory = COMPETITION_EVENTS.filter(e => e.categoryId === formCategory);

  const filteredStudents = studentsList.filter((st) => {
    const matchesSearch =
      st.nameKannada.includes(searchTerm) ||
      st.chestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.satsId.includes(searchTerm) ||
      st.schoolNameKannada.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || st.categoryId === selectedCategory;
    const matchesCluster = selectedCluster === 'all' || st.clusterId === selectedCluster;
    return matchesSearch && matchesCategory && matchesCluster;
  });

  const handleRegisterStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!satsId || !studentName) return;

    const schoolObj = SCHOOLS.find(s => s.id === schoolId) || SCHOOLS[0];
    const eventObj = COMPETITION_EVENTS.find(e => e.id === formEventId) || COMPETITION_EVENTS[0];
    const prefix = schoolObj.clusterNameKannada.substring(0, 2);
    const randomNum = Math.floor(100 + Math.random() * 899);

    const newStudent: StudentParticipant = {
      id: `st-${Date.now()}`,
      chestNumber: `${prefix}-${randomNum}`,
      satsId,
      nameKannada: studentName,
      nameEnglish: studentName,
      gender,
      schoolId,
      schoolNameKannada: schoolObj.nameKannada,
      clusterId: schoolObj.clusterId,
      clusterNameKannada: schoolObj.clusterNameKannada,
      grade,
      categoryId: formCategory,
      categoryKannada: eventObj.categoryKannada.split('(')[0].trim(),
      eventId: formEventId,
      eventNameKannada: eventObj.nameKannada,
      mobile: mobile || '9845000000',
      status: 'ಖಚಿತಗೊಂಡಿದೆ',
    };

    setStudentsList(prev => [newStudent, ...prev]);
    setShowAddModal(false);
    setSatsId('');
    setStudentName('');
    setMobile('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>SATS ಆಧಾರಿತ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ ಕೋಶ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ (Student Registration)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026-27 ಸ್ಪರ್ಧೆಗಳಿಗೆ ಭಾಗವಹಿಸುವ ವಿದ್ಯಾರ್ಥಿಗಳ ಅಧಿಕೃತ ನೋಂದಣಿ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>ಹೊಸ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ</span>
        </button>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'ಎಲ್ಲಾ ವಿಭಾಗಗಳು' },
          { id: 'junior', label: 'ವಿಭಾಗ 1: ಕಿರಿಯ ವಿಭಾಗ (1-4)' },
          { id: 'senior', label: 'ವಿಭಾಗ 2: ಹಿರಿಯ ವಿಭಾಗ (5-7)' },
          { id: 'high_school', label: 'ವಿಭಾಗ 3: ಪ್ರೌಢ ವಿಭಾಗ (8-12)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedCategory(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              selectedCategory === tab.id
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search and Secondary Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ಹೆಸರು / ಎದೆ ಸಂಖ್ಯೆ / SATS / ಶಾಲೆ ಹುಡುಕಿ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
          >
            <option value="all">ಎಲ್ಲಾ ಕ್ಲಸ್ಟರ್‌ಗಳು</option>
            {CLUSTERS.map(c => (
              <option key={c.id} value={c.id}>{c.nameKannada}</option>
            ))}
          </select>

          <span className="text-xs text-slate-600 font-semibold whitespace-nowrap">
            ಒಟ್ಟು: <strong className="text-slate-900">{filteredStudents.length}</strong> ವಿದ್ಯಾರ್ಥಿಗಳು
          </span>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">ಎದೆ ಸಂಖ್ಯೆ</th>
              <th className="py-3 px-3">SATS ಸಂಖ್ಯೆ</th>
              <th className="py-3 px-3">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
              <th className="py-3 px-3">ಲಿಂಗ / ತರಗತಿ</th>
              <th className="py-3 px-3">ಶಾಲೆಯ ಹೆಸರು</th>
              <th className="py-3 px-3">ಸ್ಪರ್ಧಾ ವಿಷಯ</th>
              <th className="py-3 px-3 text-center">ಹಾಲ್ ಟಿಕೆಟ್</th>
              <th className="py-3 px-3 text-center">ಸ್ಥಿತಿ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredStudents.map((st) => (
              <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-mono font-bold text-amber-800 bg-amber-50/50">
                  {st.chestNumber}
                </td>
                <td className="py-3 px-3 font-mono text-slate-600">{st.satsId}</td>
                <td className="py-3 px-3 font-bold text-slate-900">{st.nameKannada}</td>
                <td className="py-3 px-3">
                  <span className="text-slate-700">{st.gender}</span> • <span className="text-slate-500">{st.grade}</span>
                </td>
                <td className="py-3 px-3 max-w-xs truncate text-slate-700" title={st.schoolNameKannada}>
                  {st.schoolNameKannada}
                  <span className="block text-[10px] text-slate-400 font-normal">ಕ್ಲಸ್ಟರ್: {st.clusterNameKannada}</span>
                </td>
                <td className="py-3 px-3">
                  <span className="font-semibold text-slate-800">{st.eventNameKannada}</span>
                  <span className="block text-[10px] text-amber-700">{st.categoryKannada}</span>
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => setSelectedAdmitCardStudent(st)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition border border-blue-200"
                  >
                    <FileBadge className="w-3.5 h-3.5" />
                    <span>ವೀಕ್ಷಿಸಿ / ಮುದ್ರಿಸಿ</span>
                  </button>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    {st.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Admit Card / Hall Ticket Modal */}
      {selectedAdmitCardStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-amber-300 space-y-4">
            
            {/* Admit Card Header */}
            <div className="text-center border-b-2 border-dashed border-amber-300 pb-4 relative">
              <button
                onClick={() => setSelectedAdmitCardStudent(null)}
                className="absolute right-0 top-0 p-1 text-slate-400 hover:text-slate-600 no-print"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-[11px] font-bold text-red-700 tracking-wider uppercase">
                ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಶಾಲಾ ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಕ್ಷರತಾ ಇಲಾಖೆ
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳ ಕಾರ್ಯಾಲಯ, ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ
              </h3>
              <p className="text-xs font-bold text-amber-800">
                ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026–27 ಅಧಿಕೃತ ಪ್ರವೇಶ ಪತ್ರ (Hall Ticket)
              </p>
            </div>

            {/* Admit Card Body Details */}
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="col-span-2 space-y-2">
                <div>
                  <span className="text-slate-400 text-[10px] block">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedAdmitCardStudent.nameKannada}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 text-[10px] block">SATS ಐಡಿ:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedAdmitCardStudent.satsId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block">ಲಿಂಗ / ತರಗತಿ:</span>
                    <span className="font-bold text-slate-800">{selectedAdmitCardStudent.gender} ({selectedAdmitCardStudent.grade})</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ಶಾಲೆ:</span>
                  <span className="font-medium text-slate-800">{selectedAdmitCardStudent.schoolNameKannada}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ:</span>
                  <span className="font-semibold text-amber-800">{selectedAdmitCardStudent.clusterNameKannada} ಕ್ಲಸ್ಟರ್</span>
                </div>
              </div>

              {/* Chest Number Callout Box */}
              <div className="col-span-1 flex flex-col items-center justify-center p-3 rounded-xl bg-amber-50 border-2 border-amber-300 text-center">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">ಎದೆ ಸಂಖ್ಯೆ</span>
                <span className="text-xl font-extrabold text-amber-900 font-mono my-1">
                  {selectedAdmitCardStudent.chestNumber}
                </span>
                <span className="text-[9px] text-slate-500">ಸ್ಪರ್ಧಾ ಗುರುತು</span>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">ಭಾಗವಹಿಸುವ ಸ್ಪರ್ಧೆ:</span>
                <span className="font-bold text-slate-900">{selectedAdmitCardStudent.eventNameKannada}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500">ಸ್ಪರ್ಧಾ ವಿಭಾಗ:</span>
                <span className="font-semibold text-amber-700">{selectedAdmitCardStudent.categoryKannada}</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 grid grid-cols-2 text-center text-[10px] text-slate-600 font-semibold border-t border-slate-200">
              <div>
                <div className="h-8" />
                <p className="border-t border-slate-300 pt-1">ಮುಖ್ಯಗುರುಗಳ ಸಹಿ ಹಾಗೂ ಮೊಹರು</p>
              </div>
              <div>
                <div className="h-8" />
                <p className="border-t border-slate-300 pt-1">ತಾಲೂಕು ನೋಡಲ್ ಅಧಿಕಾರಿಗಳ ಸಹಿ</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setSelectedAdmitCardStudent(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                ಮುಚ್ಚಿ
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>ಮುದ್ರಿಸಿ (Print Hall Ticket)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">ಹೊಸ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ ನಮೂನೆ (2026-27)</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">SATS ವಿದ್ಯಾರ್ಥಿ ಐಡಿ (9 ಅಂಕಿ):</label>
                  <input
                    type="text"
                    required
                    placeholder="109845..."
                    value={satsId}
                    onChange={(e) => setSatsId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ಲಿಂಗ:</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  >
                    <option value="ಹೆಣ್ಣು">ಹೆಣ್ಣು (Female)</option>
                    <option value="ಗಂಡು">ಗಂಡು (Male)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ವಿದ್ಯಾರ್ಥಿಯ ಪೂರ್ಣ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ):</label>
                <input
                  type="text"
                  required
                  placeholder="ಉದಾ: ಕುಮಾರಿ ಸನ್ನಿಧಿ ಮಲ್ಲಿಕಾರ್ಜುನ ಪಾಟೀಲ"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ಸ್ಪರ್ಧಾ ಹಂತ / ವಿಭಾಗ:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const newCat = e.target.value as CompetitionCategory;
                      setFormCategory(newCat);
                      const matching = COMPETITION_EVENTS.filter(ev => ev.categoryId === newCat);
                      if (matching.length > 0) setFormEventId(matching[0].id);
                      if (newCat === 'junior') setGrade('3ನೇ ತರಗತಿ');
                      else if (newCat === 'senior') setGrade('6ನೇ ತರಗತಿ');
                      else setGrade('9ನೇ ತರಗತಿ');
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
                  >
                    <option value="junior">ವಿಭಾಗ 1 – 1ರಿಂದ 4ನೇ ತರಗತಿ (ಕಿರಿಯ ವಿಭಾಗ)</option>
                    <option value="senior">ವಿಭಾಗ 2 – 5ರಿಂದ 7ನೇ ತರಗತಿ (ಹಿರಿಯ ವಿಭಾಗ)</option>
                    <option value="high_school">ವಿಭಾಗ 3 – 8ರಿಂದ 12ನೇ ತರಗತಿ (ಪ್ರೌಢ ವಿಭಾಗ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ಪ್ರಸ್ತುತ ತರಗತಿ:</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900 font-medium"
                  >
                    {formCategory === 'junior' && (
                      <>
                        <option value="1ನೇ ತರಗತಿ">1ನೇ ತರಗತಿ</option>
                        <option value="2ನೇ ತರಗತಿ">2ನೇ ತರಗತಿ</option>
                        <option value="3ನೇ ತರಗತಿ">3ನೇ ತರಗತಿ</option>
                        <option value="4ನೇ ತರಗತಿ">4ನೇ ತರಗತಿ</option>
                      </>
                    )}
                    {formCategory === 'senior' && (
                      <>
                        <option value="5ನೇ ತರಗತಿ">5ನೇ ತರಗತಿ</option>
                        <option value="6ನೇ ತರಗತಿ">6ನೇ ತರಗತಿ</option>
                        <option value="7ನೇ ತರಗತಿ">7ನೇ ತರಗತಿ</option>
                      </>
                    )}
                    {formCategory === 'high_school' && (
                      <>
                        <option value="8ನೇ ತರಗತಿ">8ನೇ ತರಗತಿ</option>
                        <option value="9ನೇ ತರಗತಿ">9ನೇ ತರಗತಿ</option>
                        <option value="10ನೇ ತರಗತಿ">10ನೇ ತರಗತಿ</option>
                        <option value="11ನೇ ತರಗತಿ (ಪ.ಪೂ-1)">11ನೇ ತರಗತಿ (ಪ.ಪೂ-1)</option>
                        <option value="12ನೇ ತರಗತಿ (ಪ.ಪೂ-2)">12ನೇ ತರಗತಿ (ಪ.ಪೂ-2)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ಸ್ಪರ್ಧಾ ವಿಷಯ ({eventsForSelectedCategory.length} ಅಧಿಕೃತ ಸ್ಪರ್ಧೆಗಳು):
                </label>
                <select
                  value={formEventId}
                  onChange={(e) => setFormEventId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900 font-semibold"
                >
                  {eventsForSelectedCategory.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.nameKannada} {ev.isGroupEvent ? '(ಸಾಮೂಹಿಕ ಸ್ಪರ್ಧೆ)' : '(ವೈಯಕ್ತಿಕ)'}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  {formCategory === 'high_school'
                    ? 'ಗಮನಿಸಿ: ಪ್ರೌಢ ವಿಭಾಗದಲ್ಲಿ ಮಾತ್ರ 3 ಸಾಮೂಹಿಕ ಸ್ಪರ್ಧೆಗಳು (ಜನಪದ ನೃತ್ಯ, ಕ್ವಿಜ್, ಕವ್ವಾಲಿ) ಇರುತ್ತವೆ.'
                    : 'ಗಮನಿಸಿ: ವಿಭಾಗ 1 ಮತ್ತು 2ರಲ್ಲಿ ಕೇವಲ ವೈಯಕ್ತಿಕ ಸ್ಪರ್ಧೆಗಳು ಮಾತ್ರ ಇರುತ್ತವೆ.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ಪೋಷಕರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ:</label>
                  <input
                    type="tel"
                    placeholder="9845..."
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ಶಾಲೆ ಆಯ್ಕೆ:</label>
                  <select
                    value={schoolId}
                    onChange={(e) => setSchoolId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-900"
                  >
                    {SCHOOLS.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.nameKannada} ({s.clusterNameKannada} ಕ್ಲಸ್ಟರ್)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                💡 ವಿದ್ಯಾರ್ಥಿಯನ್ನು ನೋಂದಾಯಿಸಿದ ತಕ್ಷಣ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ವಿಶಿಷ್ಟ <strong>ಎದೆ ಸಂಖ್ಯೆ (Chest No)</strong> ನಿಗದಿಪಡಿಸಲಾಗುತ್ತದೆ.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  ರದ್ದುಮಾಡಿ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
