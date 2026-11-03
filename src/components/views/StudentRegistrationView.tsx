import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPETITION_EVENTS, CLUSTERS, getEventsByCategory, OFFICIAL_INFO } from '../../data/mockData';
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
  FileBadge,
  Building,
  Edit2,
  Trash2,
  AlertCircle
} from 'lucide-react';

export const StudentRegistrationView: React.FC = () => {
  const { 
    currentUser, 
    visibleStudents, 
    visibleSchools, 
    registerStudent, 
    updateStudent, 
    deleteStudent,
    clusters 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentParticipant | null>(null);
  const [selectedAdmitCardStudent, setSelectedAdmitCardStudent] = useState<StudentParticipant | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const defaultSchoolId = visibleSchools[0]?.id || 'sch-01';
  const defaultClusterId = currentUser?.clusterId || clusters[0].id;

  const [satsId, setSatsId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gender, setGender] = useState<'ಗಂಡು' | 'ಹೆಣ್ಣು'>('ಹೆಣ್ಣು');
  const [formCategory, setFormCategory] = useState<CompetitionCategory>('junior');
  const [grade, setGrade] = useState('3ನೇ ತರಗತಿ');
  const [formSchoolId, setFormSchoolId] = useState(defaultSchoolId);
  const [formClusterId, setFormClusterId] = useState(defaultClusterId);
  const [formEventId, setFormEventId] = useState('div1-ev-01-kn');
  const [hasSecondEvent, setHasSecondEvent] = useState(false);
  const [formSecondaryEventId, setFormSecondaryEventId] = useState<string>('');
  const [mobile, setMobile] = useState('');

  // Events filtered strictly for formCategory
  const eventsForSelectedCategory = getEventsByCategory(formCategory);

  // Sync event when category changes
  const handleCategoryChange = (cat: CompetitionCategory) => {
    setFormCategory(cat);
    const evs = getEventsByCategory(cat);
    if (evs.length > 0) {
      setFormEventId(evs[0].id);
      if (evs.length > 1) {
        setFormSecondaryEventId(evs[1].id);
      }
    }
    if (cat === 'junior') setGrade('3ನೇ ತರಗತಿ');
    else if (cat === 'senior') setGrade('6ನೇ ತರಗತಿ');
    else setGrade('9ನೇ ತರಗತಿ');
  };

  // Filter students based on search, category and cluster filters
  const filteredStudents = visibleStudents.filter((st) => {
    const matchesSearch =
      st.nameKannada.includes(searchTerm) ||
      st.chestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      st.satsId.includes(searchTerm) ||
      st.schoolNameKannada.includes(searchTerm) ||
      st.eventNameKannada.includes(searchTerm) ||
      (st.secondaryEventNameKannada && st.secondaryEventNameKannada.includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || st.categoryId === selectedCategory;
    const matchesCluster = selectedClusterFilter === 'all' || st.clusterId === selectedClusterFilter;
    return matchesSearch && matchesCategory && matchesCluster;
  });

  const openAddModal = () => {
    setEditingStudent(null);
    setSatsId('');
    setStudentName('');
    setMobile('');
    setFormCategory('junior');
    setGrade('3ನೇ ತರಗತಿ');
    setFormSchoolId(currentUser?.schoolId || visibleSchools[0]?.id || 'sch-01');
    setFormClusterId(currentUser?.clusterId || clusters[0].id);
    const evs = getEventsByCategory('junior');
    if (evs.length > 0) setFormEventId(evs[0].id);
    setHasSecondEvent(false);
    setFormSecondaryEventId(evs.length > 1 ? evs[1].id : '');
    setShowAddModal(true);
    setErrorMessage(null);
  };

  const openEditModal = (st: StudentParticipant) => {
    setEditingStudent(st);
    setSatsId(st.satsId);
    setStudentName(st.nameKannada);
    setGender(st.gender);
    setFormCategory(st.categoryId);
    setGrade(st.grade);
    setFormSchoolId(st.schoolId);
    setFormClusterId(st.clusterId);
    setFormEventId(st.eventId);
    if (st.secondaryEventId) {
      setHasSecondEvent(true);
      setFormSecondaryEventId(st.secondaryEventId);
    } else {
      setHasSecondEvent(false);
      setFormSecondaryEventId('');
    }
    setMobile(st.mobile);
    setShowAddModal(true);
    setErrorMessage(null);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!studentName.trim()) {
      setErrorMessage('ದಯವಿಟ್ಟು ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.');
      return;
    }

    const schoolObj = visibleSchools.find((s) => s.id === formSchoolId) || 
      (currentUser?.role === 'school' ? {
        id: currentUser.schoolId || formSchoolId,
        nameKannada: currentUser.schoolName || 'ಶಾಲೆ',
        clusterId: currentUser.clusterId || formClusterId,
        clusterNameKannada: currentUser.clusterName || 'ಕ್ಲಸ್ಟರ್'
      } : visibleSchools[0]);

    const eventObj = COMPETITION_EVENTS.find((ev) => ev.id === formEventId) || eventsForSelectedCategory[0];
    const secondaryEventObj = hasSecondEvent && formSecondaryEventId
      ? COMPETITION_EVENTS.find((ev) => ev.id === formSecondaryEventId)
      : undefined;
    const clusterObj = clusters.find((c) => c.id === (schoolObj?.clusterId || formClusterId)) || clusters[0];

    if (editingStudent) {
      // Update Mode
      const updated: StudentParticipant = {
        ...editingStudent,
        nameKannada: studentName.trim(),
        nameEnglish: studentName.trim(),
        satsId: satsId.trim() || editingStudent.satsId,
        gender,
        grade,
        categoryId: formCategory,
        categoryKannada: eventObj.categoryKannada,
        eventId: formEventId,
        eventNameKannada: eventObj.nameKannada,
        secondaryEventId: hasSecondEvent ? secondaryEventObj?.id : undefined,
        secondaryEventNameKannada: hasSecondEvent ? secondaryEventObj?.nameKannada : undefined,
        mobile: mobile.trim() || editingStudent.mobile,
      };
      const res = updateStudent(updated);
      setToastMessage(res.message || 'ಮಾಹಿತಿ ನವೀಕರಿಸಲಾಗಿದೆ.');
    } else {
      // Register Mode
      const res = registerStudent({
        satsId: satsId.trim(),
        nameKannada: studentName.trim(),
        nameEnglish: studentName.trim(),
        gender,
        schoolId: schoolObj?.id || formSchoolId,
        schoolNameKannada: schoolObj?.nameKannada || 'ಶಾಲೆ',
        clusterId: clusterObj.id,
        clusterNameKannada: clusterObj.nameKannada,
        grade,
        categoryId: formCategory,
        categoryKannada: eventObj.categoryKannada,
        eventId: formEventId,
        eventNameKannada: eventObj.nameKannada,
        secondaryEventId: hasSecondEvent ? secondaryEventObj?.id : undefined,
        secondaryEventNameKannada: hasSecondEvent ? secondaryEventObj?.nameKannada : undefined,
        mobile: mobile.trim(),
      });
      if (res.success) {
        setToastMessage(res.message || 'ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ.');
      } else {
        setErrorMessage(res.message || 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ.');
        return;
      }
    }

    setShowAddModal(false);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`ನೀವು ನಿಜವಾಗಿಯೂ ವಿದ್ಯಾರ್ಥಿ "${name}" ಅವರ ನೋಂದಣಿಯನ್ನು ರದ್ದುಗೊಳಿಸಲು ಬಯಸುವಿರಾ?`)) {
      deleteStudent(id);
      setToastMessage(`ವಿದ್ಯಾರ್ಥಿ ${name} ಅವರ ನೋಂದಣಿಯನ್ನು ತೆಗೆದುಹಾಕಲಾಗಿದೆ.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
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
            {currentUser?.role === 'school'
              ? `${currentUser.schoolName} ಶಾಲೆಯ ಮಕ್ಕಳ ನೋಂದಣಿ, ಬದಲಾವಣೆ ಹಾಗೂ ಪ್ರವೇಶ ಪತ್ರ ಮುದ್ರಣ`
              : currentUser?.role === 'crp'
              ? `${currentUser.clusterName} ಕ್ಲಸ್ಟರ್ ವ್ಯಾಪ್ತಿಯ ಎಲ್ಲಾ ನೋಂದಾಯಿತ ಮಕ್ಕಳ ಮಾಹಿತಿ ಮತ್ತು ನಿರ್ವಹಣೆ`
              : 'ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕಿನ ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್‌ಗಳ ಸ್ಪರ್ಧಿಗಳ ಅಧಿಕೃತ ನೋಂದಣಿ ಪಟ್ಟಿ'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ಹೊಸ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ</span>
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Scope Info Card for School / CRP */}
      {currentUser?.role === 'school' && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
          <div>
            <span className="font-bold block">ನಿಮ್ಮ ಶಾಲಾ ವ್ಯಾಪ್ತಿ: {currentUser.schoolName}</span>
            <span className="text-blue-700">DISE: {currentUser.diseCode} • ಕ್ಲಸ್ಟರ್: {currentUser.clusterName}</span>
          </div>
          <span className="bg-white text-blue-800 font-bold px-3 py-1 rounded-lg border border-blue-300">
            ಶಾಲಾ ಲಾಗಿನ್ ಸಕ್ರಿಯವಾಗಿದೆ
          </span>
        </div>
      )}

      {currentUser?.role === 'crp' && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <div>
            <span className="font-bold block">ನಿಮ್ಮ ಕ್ಲಸ್ಟರ್ ವ್ಯಾಪ್ತಿ: {currentUser.clusterName}</span>
            <span className="text-emerald-700">ಸಿ.ಆರ್.ಪಿ: {currentUser.displayName}</span>
          </div>
          <span className="bg-white text-emerald-800 font-bold px-3 py-1 rounded-lg border border-emerald-300">
            ಕ್ಲಸ್ಟರ್ ವ್ಯಾಪ್ತಿಯ ಶಾಲೆಗಳು & ಮಕ್ಕಳು
          </span>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ವಿದ್ಯಾರ್ಥಿ ಹೆಸರು / ಎದೆ ಸಂಖ್ಯೆ / SATS..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Division Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700"
          >
            <option value="all">ಎಲ್ಲಾ ವಿಭಾಗಗಳು (All)</option>
            <option value="junior">ವಿಭಾಗ 1 (1-4ನೇ ತರಗತಿ)</option>
            <option value="senior">ವಿಭಾಗ 2 (5-7ನೇ ತರಗತಿ)</option>
            <option value="high_school">ವಿಭಾಗ 3 (8-12ನೇ ತರಗತಿ)</option>
          </select>

          {/* Cluster Filter (for Admin) */}
          {currentUser?.role === 'admin' && (
            <select
              value={selectedClusterFilter}
              onChange={(e) => setSelectedClusterFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-700"
            >
              <option value="all">ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್‌ಗಳು</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameKannada} ({c.nameEnglish})
                </option>
              ))}
            </select>
          )}

          <div className="text-xs text-slate-500 ml-auto md:ml-0 font-medium">
            ನೋಂದಾಯಿತ ಮಕ್ಕಳು: <strong className="text-slate-800">{filteredStudents.length}</strong>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ಎದೆ ಸಂಖ್ಯೆ</th>
                <th className="py-3 px-4">ವಿದ್ಯಾರ್ಥಿ ಹೆಸರು & SATS</th>
                <th className="py-3 px-4">ಶಾಲೆ & ಕ್ಲಸ್ಟರ್</th>
                <th className="py-3 px-4">ತರಗತಿ & ವಿಭಾಗ</th>
                <th className="py-3 px-4">ನೋಂದಾಯಿತ ಸ್ಪರ್ಧೆ (Event)</th>
                <th className="py-3 px-4 text-center">ಕ್ರಿಯೆಗಳು</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((st) => (
                  <tr key={st.id} className="hover:bg-amber-50/40 transition">
                    
                    {/* Chest Number */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        {st.chestNumber}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{st.nameKannada}</p>
                      <span className="text-[10px] font-mono text-slate-400">
                        SATS: {st.satsId} • {st.gender}
                      </span>
                    </td>

                    {/* School & Cluster */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{st.schoolNameKannada}</p>
                      <span className="inline-block text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 mt-0.5 font-semibold">
                        {st.clusterNameKannada}
                      </span>
                    </td>

                    {/* Grade & Division */}
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{st.grade}</p>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {st.categoryId === 'junior' ? 'ವಿಭಾಗ 1 (1-4)' :
                         st.categoryId === 'senior' ? 'ವಿಭಾಗ 2 (5-7)' :
                         'ವಿಭಾಗ 3 (8-12)'}
                      </span>
                    </td>

                    {/* Event Name */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          {st.eventNameKannada}
                        </span>
                        {st.secondaryEventNameKannada && (
                          <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                            + ಸ್ಪರ್ಧೆ 2: {st.secondaryEventNameKannada}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Hall Ticket Button */}
                        <button
                          onClick={() => setSelectedAdmitCardStudent(st)}
                          className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 transition cursor-pointer"
                          title="ಹಾಲ್ ಟಿಕೆಟ್ ಮುದ್ರಿಸಿ"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Button (Allowed for School and CRP) */}
                        <button
                          onClick={() => openEditModal(st)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition cursor-pointer"
                          title="ಮಾಹಿತಿ ತಿದ್ದುಪಡಿ / ಬದಲಾವಣೆ"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(st.id, st.nameKannada)}
                          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 transition cursor-pointer"
                          title="ನೋಂದಣಿ ರದ್ದುಗೊಳಿಸಿ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ. ಮೇಲೆ ನೀಡಿರುವ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ನೋಂದಾಯಿಸಿ.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            <div className="bg-gradient-to-r from-amber-600 to-amber-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold">
                    {editingStudent ? 'ವಿದ್ಯಾರ್ಥಿ ಮಾಹಿತಿ ಬದಲಾವಣೆ (Edit Student)' : 'ಹೊಸ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ (New Student Registration)'}
                  </h3>
                  <p className="text-xs text-amber-200 mt-0.5">
                    ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026-27 ಸ್ಪರ್ಧಾ ಭಾಗವಹಿಸುವಿಕೆಯ ವಿವರ
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* School & Cluster Scoping */}
              {currentUser?.role === 'school' ? (
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs space-y-1">
                  <p className="font-bold text-blue-900">ಶಾಲೆ: {currentUser.schoolName}</p>
                  <p className="text-blue-700">ಕ್ಲಸ್ಟರ್: {currentUser.clusterName} • DISE: {currentUser.diseCode}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ಶಾಲೆ ಆಯ್ಕೆಮಾಡಿ *</label>
                    <select
                      value={formSchoolId}
                      onChange={(e) => setFormSchoolId(e.target.value)}
                      className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      {visibleSchools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nameKannada} ({s.clusterNameKannada})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ಕ್ಲಸ್ಟರ್</label>
                    <select
                      value={formClusterId}
                      onChange={(e) => setFormClusterId(e.target.value)}
                      disabled={currentUser?.role === 'crp'}
                      className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      {clusters.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nameKannada} ({c.nameEnglish})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ಕುಮಾರ / ಕುಮಾರಿ..."
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    SATS ಸಂಖ್ಯೆ (Student SATS ID)
                  </label>
                  <input
                    type="text"
                    placeholder="9 ಅಂಕಿಗಳ SATS ID"
                    value={satsId}
                    onChange={(e) => setSatsId(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ಲಿಂಗ (Gender)</label>
                  <div className="flex gap-4 pt-1 text-xs">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'ಗಂಡು'}
                        onChange={() => setGender('ಗಂಡು')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>ಗಂಡು (Boy)</span>
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === 'ಹೆಣ್ಣು'}
                        onChange={() => setGender('ಹೆಣ್ಣು')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                      <span>ಹೆಣ್ಣು (Girl)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ಪೋಷಕರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</label>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-mono text-slate-800"
                  />
                </div>
              </div>

              {/* Division Selection */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ಸ್ಪರ್ಧಾ ವಿಭಾಗ ಆಯ್ಕೆಮಾಡಿ (Select Division):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleCategoryChange('junior')}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formCategory === 'junior'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ವಿಭಾಗ 1 (1-4)
                    <span className="block text-[10px] font-normal text-slate-500">ಕಿರಿಯ ವಿಭಾಗ (10 ಸ್ಪರ್ಧೆ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCategoryChange('senior')}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formCategory === 'senior'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ವಿಭಾಗ 2 (5-7)
                    <span className="block text-[10px] font-normal text-slate-500">ಹಿರಿಯ ವಿಭಾಗ (12 ಸ್ಪರ್ಧೆ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCategoryChange('high_school')}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                      formCategory === 'high_school'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ವಿಭಾಗ 3 (8-12)
                    <span className="block text-[10px] font-normal text-slate-500">ಪ್ರೌಢ ವಿಭಾಗ (16 ಸ್ಪರ್ಧೆ)</span>
                  </button>
                </div>
              </div>

              {/* Grade and Event Selection (Dynamically Filtered for Selected Category) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ತರಗತಿ (Class / Grade) *</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    {formCategory === 'junior' ? (
                      <>
                        <option value="1ನೇ ತರಗತಿ">1ನೇ ತರಗತಿ</option>
                        <option value="2ನೇ ತರಗತಿ">2ನೇ ತರಗತಿ</option>
                        <option value="3ನೇ ತರಗತಿ">3ನೇ ತರಗತಿ</option>
                        <option value="4ನೇ ತರಗತಿ">4ನೇ ತರಗತಿ</option>
                      </>
                    ) : formCategory === 'senior' ? (
                      <>
                        <option value="5ನೇ ತರಗತಿ">5ನೇ ತರಗತಿ</option>
                        <option value="6ನೇ ತರಗತಿ">6ನೇ ತರಗತಿ</option>
                        <option value="7ನೇ ತರಗತಿ">7ನೇ ತರಗತಿ</option>
                      </>
                    ) : (
                      <>
                        <option value="8ನೇ ತರಗತಿ">8ನೇ ತರಗತಿ</option>
                        <option value="9ನೇ ತರಗತಿ">9ನೇ ತರಗತಿ</option>
                        <option value="10ನೇ ತರಗತಿ">10ನೇ ತರಗತಿ</option>
                        <option value="11ನೇ ತರಗತಿ (ಪಿಯುಸಿ 1)">11ನೇ ತರಗತಿ (ಪಿಯುಸಿ 1)</option>
                        <option value="12ನೇ ತರಗತಿ (ಪಿಯುಸಿ 2)">12ನೇ ತರಗತಿ (ಪಿಯುಸಿ 2)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ಸ್ಪರ್ಧೆ-1 (ಮುಖ್ಯ ಸ್ಪರ್ಧೆ / Primary Event) *
                  </label>
                  <select
                    value={formEventId}
                    onChange={(e) => {
                      const newEvId = e.target.value;
                      setFormEventId(newEvId);
                      if (formSecondaryEventId === newEvId) {
                        const otherEv = eventsForSelectedCategory.find(ev => ev.id !== newEvId);
                        setFormSecondaryEventId(otherEv ? otherEv.id : '');
                      }
                    }}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 font-semibold text-slate-900"
                  >
                    {eventsForSelectedCategory.map((ev) => (
                      <option key={ev.id} value={ev.id}>
                        {ev.nameKannada} {ev.isGroupEvent ? '(ಸಾಮೂಹಿಕ)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Event-2 (Optional) Checkbox & Dropdown */}
              <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/40 space-y-2.5">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={hasSecondEvent}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setHasSecondEvent(checked);
                      if (checked && (!formSecondaryEventId || formSecondaryEventId === formEventId)) {
                        const otherEv = eventsForSelectedCategory.find(ev => ev.id !== formEventId);
                        if (otherEv) setFormSecondaryEventId(otherEv.id);
                      }
                    }}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-950 block">
                      ಹೆಚ್ಚುವರಿ ಸ್ಪರ್ಧೆ ಸೇರಿಸಿ (ಸ್ಪರ್ಧೆ-2) (ಐಚ್ಛಿಕ / Optional)
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      ಒಂದೇ ಮಗು ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಸ್ಪರ್ಧೆಯಲ್ಲಿ ಭಾಗವಹಿಸಿದರೆ ಮತ್ತೊಮ್ಮೆ ನೋಂದಾಯಿಸುವ ಬದಲು ಸ್ಪರ್ಧೆ-2 ಆಯ್ಕೆಮಾಡಿ
                    </span>
                  </div>
                </label>

                {hasSecondEvent && (
                  <div className="pt-2 border-t border-amber-200/80">
                    <label className="block text-xs font-bold text-amber-900 mb-1">
                      ಸ್ಪರ್ಧೆ-2 (ಎರಡನೇ ಸ್ಪರ್ಧೆ / Secondary Event) ಆಯ್ಕೆಮಾಡಿ *
                    </label>
                    <select
                      value={formSecondaryEventId}
                      onChange={(e) => setFormSecondaryEventId(e.target.value)}
                      className="w-full py-2 px-3 text-xs border border-amber-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 font-semibold text-slate-900 shadow-2xs"
                    >
                      <option value="">-- ಸ್ಪರ್ಧೆ-2 ಆಯ್ಕೆಮಾಡಿ --</option>
                      {eventsForSelectedCategory
                        .filter((ev) => ev.id !== formEventId)
                        .map((ev) => (
                          <option key={ev.id} value={ev.id}>
                            {ev.nameKannada} {ev.isGroupEvent ? '(ಸಾಮೂಹಿಕ)' : ''}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  ರದ್ದುಮಾಡಿ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  {editingStudent ? 'ನವೀಕರಿಸಿ & ಉಳಿಸಿ' : 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Hall Ticket / Admit Card Modal */}
      {selectedAdmitCardStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border-2 border-slate-900 p-6 my-8 print:p-0 print:border-none print:shadow-none">
            
            <button
              onClick={() => setSelectedAdmitCardStudent(null)}
              className="absolute right-3 top-3 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center print:hidden cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Admit Card Header */}
            <div className="text-center pb-3 border-b-2 border-slate-900 space-y-0.5">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                {OFFICIAL_INFO.departmentKannada}
              </span>
              <h3 className="text-xs font-extrabold text-slate-900">
                {OFFICIAL_INFO.officeKannada}
              </h3>
              <p className="text-[11px] font-bold text-red-700">
                {OFFICIAL_INFO.titleKannada}
              </p>
              <p className="text-[10px] text-slate-500 font-semibold">
                ಪ್ರವೇಶ ಪತ್ರ / ಹಾಲ್ ಟಿಕೆಟ್ (HALL TICKET 2026-27)
              </p>
            </div>

            {/* Chest Number Big Display */}
            <div className="my-4 p-3 bg-amber-50 rounded-xl border border-amber-300 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block">
                ಅಧಿಕೃತ ಎದೆ ಸಂಖ್ಯೆ (CHEST NUMBER)
              </span>
              <span className="text-2xl font-black font-mono text-amber-950 block mt-0.5">
                {selectedAdmitCardStudent.chestNumber}
              </span>
            </div>

            {/* Student Details Grid */}
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">ವಿದ್ಯಾರ್ಥಿ ಹೆಸರು:</span>
                <span className="font-bold text-slate-900">{selectedAdmitCardStudent.nameKannada}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">SATS ಸಂಖ್ಯೆ:</span>
                <span className="font-mono font-bold text-slate-800">{selectedAdmitCardStudent.satsId}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">ಶಾಲೆ:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[220px] truncate">{selectedAdmitCardStudent.schoolNameKannada}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ:</span>
                <span className="font-bold text-emerald-800">{selectedAdmitCardStudent.clusterNameKannada}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500 font-medium">ವಿಭಾಗ & ತರಗತಿ:</span>
                <span className="font-semibold text-slate-800">{selectedAdmitCardStudent.grade} ({selectedAdmitCardStudent.categoryKannada})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 bg-amber-50/50 p-1.5 rounded">
                <span className="text-amber-900 font-bold">ಸ್ಪರ್ಧೆ-1 (ಮುಖ್ಯ):</span>
                <span className="font-bold text-amber-950">{selectedAdmitCardStudent.eventNameKannada}</span>
              </div>
              {selectedAdmitCardStudent.secondaryEventNameKannada && (
                <div className="flex justify-between py-1 border-b border-slate-200 bg-blue-50/50 p-1.5 rounded">
                  <span className="text-blue-900 font-bold">ಸ್ಪರ್ಧೆ-2 (ಹೆಚ್ಚುವರಿ):</span>
                  <span className="font-bold text-blue-950">{selectedAdmitCardStudent.secondaryEventNameKannada}</span>
                </div>
              )}
            </div>

            {/* Signatures */}
            <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-[10px]">
              <div className="text-center">
                <div className="w-20 h-6 mx-auto" />
                <p className="font-bold text-slate-900">ಶಾಲಾ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು</p>
                <p className="text-slate-400">(ಸಹಿ ಹಾಗೂ ಮೊಹರು)</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-6 mx-auto" />
                <p className="font-bold text-slate-900">ಸಿ.ಆರ್.ಪಿ / ನೋಡಲ್ ಅಧಿಕಾರಿಗಳು</p>
                <p className="text-slate-400">ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ</p>
              </div>
            </div>

            {/* Print Button */}
            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end gap-2 print:hidden">
              <button
                onClick={() => setSelectedAdmitCardStudent(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                ಮುಚ್ಚಿ
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>ಹಾಲ್ ಟಿಕೆಟ್ ಪ್ರಿಂಟ್</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
