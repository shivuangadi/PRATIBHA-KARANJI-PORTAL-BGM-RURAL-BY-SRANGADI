import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CLUSTERS, COMPETITION_EVENTS, OFFICIAL_INFO, getEventsByCategory } from '../../data/mockData';
import { JudgeInfo, CompetitionCategory } from '../../types';
import { 
  UserCheck, 
  Search, 
  Plus, 
  Phone, 
  FileText, 
  Printer, 
  Award, 
  CheckCircle2, 
  X,
  Building,
  CheckSquare,
  Square,
  AlertCircle,
  KeyRound
} from 'lucide-react';

export const JudgeAppointmentView: React.FC = () => {
  const { 
    currentUser, 
    visibleJudges, 
    registerJudge, 
    allJudges, 
    clusters 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJudgeForLetter, setSelectedJudgeForLetter] = useState<JudgeInfo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');

  // Form states
  const activeClusterId = currentUser?.clusterId || CLUSTERS[0].id;
  const [targetClusterId, setTargetClusterId] = useState(activeClusterId);
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<CompetitionCategory>('junior');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Division events dynamically loaded
  const divisionEvents = getEventsByCategory(selectedDivision);

  // Toggle single event checkbox
  const handleToggleEvent = (eventName: string) => {
    setSelectedEvents((prev) =>
      prev.includes(eventName)
        ? prev.filter((e) => e !== eventName)
        : [...prev, eventName]
    );
  };

  // Select all / clear all events for selected division
  const handleSelectAllDivisionEvents = () => {
    const allNames = divisionEvents.map((e) => e.nameKannada);
    setSelectedEvents(allNames);
  };

  const handleClearDivisionEvents = () => {
    setSelectedEvents([]);
  };

  // Filter judges based on search and role scoping
  const displayJudges = visibleJudges.filter((j) =>
    j.nameKannada.includes(searchTerm) ||
    j.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.assignedClusterName.includes(searchTerm) ||
    j.institution.includes(searchTerm) ||
    j.assignedEvents.some((ev) => ev.includes(searchTerm))
  );

  const handleAppointJudge = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorToast('');
    setSuccessToast('');

    if (!name.trim()) {
      setErrorToast('ದಯವಿಟ್ಟು ನಿರ್ಣಾಯಕರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorToast('ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ (ಇದು ಅವರ ಲಾಗಿನ್ ಪಾಸ್‌ವರ್ಡ್ ಆಗಿರುತ್ತದೆ).');
      return;
    }
    if (selectedEvents.length === 0) {
      setErrorToast('ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ಸ್ಪರ್ಧೆಯ ಮುಂದೆ ಚೆಕ್‌ಬಾಕ್ಸ್ ಆಯ್ಕೆಮಾಡಿ.');
      return;
    }

    const clusterToUse = currentUser?.clusterId || targetClusterId;
    const clusterObj = clusters.find((c) => c.id === clusterToUse) || clusters[0];

    const res = registerJudge({
      nameKannada: name.trim(),
      designation: designation.trim() || 'ವಿಷಯ ತಜ್ಞರು / ಶಿಕ್ಷಕರು',
      institution: institution.trim() || 'ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ',
      phone: phone.trim(),
      assignedClusterId: clusterToUse,
      assignedClusterName: clusterObj.nameKannada,
      categoryId: selectedDivision,
      assignedEvents: selectedEvents,
    });

    if (res.success) {
      setSuccessToast(res.message || 'ನಿರ್ಣಾಯಕರ ನೇಮಕಾತಿ ಯಶಸ್ವಿಯಾಗಿದೆ!');
      setShowAddModal(false);
      setName('');
      setDesignation('');
      setInstitution('');
      setPhone('');
      setSelectedEvents([]);
      setTimeout(() => setSuccessToast(''), 4000);
    } else {
      setErrorToast(res.message || 'ನೇಮಕಾತಿ ವಿಫಲವಾಗಿದೆ.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>ಮೌಲ್ಯಮಾಪನ ಮಂಡಳಿ ಹಾಗೂ ತೀರ್ಪುಗಾರರು</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ನಿರ್ಣಾಯಕರ ನೋಂದಣಿ & ನೇಮಕಾತಿ (Judge Appointment)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentUser?.role === 'crp' 
              ? `${currentUser.clusterName || 'ಕ್ಲಸ್ಟರ್'} ವ್ಯಾಪ್ತಿಯ ಸ್ಪರ್ಧೆಗಳಿಗೆ ನಿರ್ಣಾಯಕರನ್ನು ನೋಂದಾಯಿಸಿ (ಅವರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೇ ಲಾಗಿನ್ ಪಾಸ್‌ವರ್ಡ್)`
              : 'ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026-27 ಸ್ಪರ್ಧೆಗಳಿಗೆ ಪರಿಣಿತ ತೀರ್ಪುಗಾರರ ಅಧಿಕೃತ ನೇಮಕಾತಿ ಪಟ್ಟಿ'}
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddModal(true);
            setErrorToast('');
            setSelectedEvents([]);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>ಹೊಸ ನಿರ್ಣಾಯಕರ ನೋಂದಣಿ</span>
        </button>
      </div>

      {/* Success / Error Toasts */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Search and Cluster Scope Indicator */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ನಿರ್ಣಾಯಕರ ಹೆಸರು / ಶಾಲೆ / ಸ್ಪರ್ಧೆ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          {currentUser?.role === 'crp' && (
            <span className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-lg border border-emerald-200">
              ನಿಮ್ಮ ಕ್ಲಸ್ಟರ್: {currentUser.clusterName}
            </span>
          )}
          <span className="text-slate-500 font-medium">
            ಒಟ್ಟು ನೇಮಕಗೊಂಡ ನಿರ್ಣಾಯಕರು: <strong className="text-slate-800">{displayJudges.length}</strong>
          </span>
        </div>
      </div>

      {/* Judges Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ಕೋಡ್ & ಹೆಸರು</th>
                <th className="py-3 px-4">ಹುದ್ದೆ & ಶಾಲೆ/ಸಂಸ್ಥೆ</th>
                <th className="py-3 px-4">ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ</th>
                <th className="py-3 px-4">ಲಾಗಿನ್ ಮೊಬೈಲ್ (ಪಾಸ್‌ವರ್ಡ್)</th>
                <th className="py-3 px-4">ನಿಯೋಜಿತ ಸ್ಪರ್ಧೆಗಳು (Assigned Events)</th>
                <th className="py-3 px-4 text-center">ಕ್ರಿಯೆಗಳು</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {displayJudges.length > 0 ? (
                displayJudges.map((judge) => (
                  <tr key={judge.id} className="hover:bg-purple-50/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 font-mono font-bold flex items-center justify-center text-[10px]">
                          {judge.code.slice(-2)}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{judge.nameKannada}</p>
                          <span className="text-[10px] font-mono text-slate-400">{judge.code}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{judge.designation}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        <span>{judge.institution}</span>
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {judge.assignedClusterName}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono">
                      <div className="inline-flex items-center gap-1 text-[11px] text-purple-900 bg-purple-50 px-2 py-1 rounded border border-purple-200">
                        <KeyRound className="w-3 h-3 text-purple-600" />
                        <span className="font-bold">{judge.phone}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {judge.assignedEvents.map((ev, i) => (
                          <span
                            key={i}
                            className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                          >
                            {ev}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setSelectedJudgeForLetter(judge)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-purple-100 text-purple-700 border border-slate-300 font-medium text-[11px] transition cursor-pointer"
                        title="ನೇಮಕಾತಿ ಆದೇಶ ಪತ್ರ ಮುದ್ರಿಸಿ"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>ಆದೇಶ ಪತ್ರ</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    ಯಾವುದೇ ನಿರ್ಣಾಯಕರು ಕಂಡುಬಂದಿಲ್ಲ. ಮೇಲೆ ನೀಡಿರುವ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ಹೊಸ ನಿರ್ಣಾಯಕರನ್ನು ನೋಂದಾಯಿಸಿ.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Register New Judge with Checkbox Multiple Event Selection */}
      {/* User Specification:
          "Crp ಅವರು ತಮ್ಮ ಲಾಗಿನ್ನ ನಲ್ಲಿ ನಿರ್ಣಾಯಕರನ್ನು ನೋದಾಯಿಸುತ್ತಾರೆ. (ನಿರ್ಣಾಯಕರ ಹೆಸರು,ಹುದ್ದೆ,ಶಾಲೆ ಹೆಸರು, mobile no ಹಾಕಿ
           ನಂತರ ವಿಭಾಗ ಮತ್ತು ಸ್ಪರ್ಧೆಯನ್ನು ಶಯ್ಕೆ ಮಾಡಬೇಕು( ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಸ್ಪರ್ಧೆಗಳಿಗೆ ನಿಯೋಜಿಸಲು ಅನುಕುಇಲವಾಗುವಂತೆ ಸ್ಪರ್ಧೆಗಳ ಮುಂದೆ ಚೆಕ್ ಬಾಕ್ಸ್ ನೀಡು." */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold">ಹೊಸ ನಿರ್ಣಾಯಕರ ನೇಮಕಾತಿ / Judge Registration</h3>
                  <p className="text-xs text-purple-200 mt-0.5">
                    ತೀರ್ಪುಗಾರರ ವಿವರ ಹಾಗೂ ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಸ್ಪರ್ಧೆಗಳಿಗೆ ಚೆಕ್‌ಬಾಕ್ಸ್ ಮೂಲಕ ನಿಯೋಜನೆ
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

            {/* Modal Body Form */}
            <form onSubmit={handleAppointJudge} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {errorToast && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorToast}</span>
                </div>
              )}

              {/* 1. Target Cluster */}
              {currentUser?.role === 'crp' ? (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                  <span className="font-bold text-emerald-900">ನಿಯೋಜಿತ ಕ್ಲಸ್ಟರ್:</span>
                  <span className="font-bold text-emerald-800 bg-white px-3 py-1 rounded border border-emerald-300">
                    {currentUser.clusterName} ({currentUser.username})
                  </span>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ (Cluster) *
                  </label>
                  <select
                    value={targetClusterId}
                    onChange={(e) => setTargetClusterId(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-purple-500"
                  >
                    {clusters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.nameKannada} ({c.nameEnglish})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* 2. Personal Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ನಿರ್ಣಾಯಕರ ಹೆಸರು (Judge Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ಶ್ರೀ / ಶ್ರೀಮತಿ / ಡಾ..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (Login Password) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-purple-300 bg-purple-50/40 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono text-slate-800"
                  />
                  <span className="text-[10px] text-purple-700 block mt-0.5">
                    * ಈ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೇ ನಿರ್ಣಾಯಕರ ಲಾಗಿನ್ ಪಾಸ್‌ವರ್ಡ್ ಆಗಿರುತ್ತದೆ.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ಹುದ್ದೆ (Designation) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ಉದಾ: ಸಹ ಶಿಕ್ಷಕರು / ಸಂಗೀತ ತಜ್ಞರು / ಉಪನ್ಯಾಸಕರು"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ಶಾಲೆಯ ಹೆಸರು / ಸಂಸ್ಥೆ (School / Institution) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ಉದಾ: ಸ.ಪ್ರೌ.ಶಾಲೆ ಬೆಳಗುಂದಿ / ಲಲಿತಕಲಾ ಸಂಸ್ಥೆ"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-800"
                  />
                </div>
              </div>

              {/* 3. Division Selector */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select Division):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDivision('junior');
                      setSelectedEvents([]);
                    }}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                      selectedDivision === 'junior'
                        ? 'border-purple-600 bg-purple-100 text-purple-900 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ವಿಭಾಗ 1 (1-4)
                    <span className="block text-[10px] font-normal text-slate-500">ಕಿರಿಯ ವಿಭಾಗ (10 ಸ್ಪರ್ಧೆ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDivision('senior');
                      setSelectedEvents([]);
                    }}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                      selectedDivision === 'senior'
                        ? 'border-purple-600 bg-purple-100 text-purple-900 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ವಿಭಾಗ 2 (5-7)
                    <span className="block text-[10px] font-normal text-slate-500">ಹಿರಿಯ ವಿಭಾಗ (12 ಸ್ಪರ್ಧೆ)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDivision('high_school');
                      setSelectedEvents([]);
                    }}
                    className={`py-2 px-2 text-center rounded-xl border text-xs font-bold transition cursor-pointer ${
                      selectedDivision === 'high_school'
                        ? 'border-purple-600 bg-purple-100 text-purple-900 shadow-xs'
                        : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    ವಿಭಾಗ 3 (8-12)
                    <span className="block text-[10px] font-normal text-slate-500">ಪ್ರೌಢ ವಿಭಾಗ (16 ಸ್ಪರ್ಧೆ)</span>
                  </button>
                </div>
              </div>

              {/* 4. Multi-Event Checkbox Selection (Direct User Mandate) */}
              {/* User Requirement:
                  "ಸ್ಪರ್ಧೆಯನ್ನು ಶಯ್ಕೆ ಮಾಡಬೇಕು( ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಸ್ಪರ್ಧೆಗಳಿಗೆ ನಿಯೋಜಿಸಲು ಅನುಕುಇಲವಾಗುವಂತೆ ಸ್ಪರ್ಧೆಗಳ ಮುಂದೆ ಚೆಕ್ ಬಾಕ್ಸ್ ನೀಡು." */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block">
                      ಸ್ಪರ್ಧೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select Events with Checkboxes) *
                    </label>
                    <span className="text-[11px] text-purple-700">
                      ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಸ್ಪರ್ಧೆಗಳಿಗೆ ನಿಯೋಜಿಸಲು ಚೆಕ್‌ಬಾಕ್ಸ್‌ಗಳನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ (ಆಯ್ಕೆ: {selectedEvents.length})
                    </span>
                  </div>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={handleSelectAllDivisionEvents}
                      className="text-purple-700 hover:underline font-bold cursor-pointer"
                    >
                      ಎಲ್ಲವನ್ನೂ ಆಯ್ಕೆಮಾಡಿ
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={handleClearDivisionEvents}
                      className="text-slate-500 hover:underline cursor-pointer"
                    >
                      ತೆರವುಗೊಳಿಸಿ
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-52 overflow-y-auto p-3 bg-slate-50 border border-slate-300 rounded-xl">
                  {divisionEvents.map((ev) => {
                    const isChecked = selectedEvents.includes(ev.nameKannada);
                    return (
                      <label
                        key={ev.id}
                        onClick={() => handleToggleEvent(ev.nameKannada)}
                        className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer select-none transition ${
                          isChecked
                            ? 'bg-purple-50 border-purple-400 text-purple-950 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent label onClick
                          className="mt-0.5 w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                        />
                        <div className="flex-1 leading-tight">
                          <span>{ev.nameKannada}</span>
                          {ev.isGroupEvent && (
                            <span className="ml-1.5 px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[10px] rounded font-medium">
                              ಸಾಮೂಹಿಕ
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  ರದ್ದುಮಾಡಿ
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  ನಿರ್ಣಾಯಕರನ್ನು ನೋಂದಾಯಿಸಿ & ಉಳಿಸಿ
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Appointment Letter Modal for Printing */}
      {selectedJudgeForLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-300 p-8 my-8 print:p-0 print:border-none print:shadow-none">
            
            <button
              onClick={() => setSelectedJudgeForLetter(null)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center print:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                {OFFICIAL_INFO.departmentKannada}
              </span>
              <h3 className="text-sm font-extrabold text-slate-900">
                {OFFICIAL_INFO.officeKannada}
              </h3>
              <p className="text-xs font-bold text-red-700">
                {OFFICIAL_INFO.eventNameKannada}
              </p>
              <p className="text-[11px] text-slate-600">
                ಶೈಕ್ಷಣಿಕ ವರ್ಷ: {OFFICIAL_INFO.academicYear} • ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ: <strong>{selectedJudgeForLetter.assignedClusterName}</strong>
              </p>
            </div>

            {/* Letter Body */}
            <div className="my-6 space-y-4 text-xs text-slate-800 leading-relaxed">
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>ಸಂಖ್ಯೆ: ಬಿಇಒ/ಬೆಂಗ್ರಾ/ಪ್ರಕಾ/ತೀರ್ಪು-0{selectedJudgeForLetter.code.slice(-2)}/2026-27</span>
                <span>ದಿನಾಂಕ: {new Date().toLocaleDateString('kn-IN')}</span>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200">
                <span className="text-[10px] font-bold text-purple-700 uppercase">ಸ್ವೀಕೃತಿದಾರರು:</span>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedJudgeForLetter.nameKannada}</p>
                <p className="text-slate-600">{selectedJudgeForLetter.designation}, {selectedJudgeForLetter.institution}</p>
                <p className="font-mono text-slate-700">ಸಂಪರ್ಕ: {selectedJudgeForLetter.phone} (ಲಾಗಿನ್ ಪಾಸ್‌ವರ್ಡ್)</p>
              </div>

              <p className="text-center font-bold text-slate-900 underline text-xs">
                ವಿಷಯ: 2026–27ನೇ ಸಾಲಿನ ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಸ್ಪರ್ಧೆಗಳಿಗೆ ನಿರ್ಣಾಯಕರಾಗಿ ನೇಮಕಗೊಂಡಿರುವ ಕುರಿತು.
              </p>

              <p>
                ಮಾನ್ಯರೇ/ಮಾನ್ಯರೆ, ಮೇಲ್ಕಂಡ ವಿಷಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ, ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ವಲಯದ <strong>{selectedJudgeForLetter.assignedClusterName}</strong> ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರದಲ್ಲಿ ನಡೆಯಲಿರುವ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಸ್ಪರ್ಧೆಗಳಿಗೆ ತಮ್ಮನ್ನು ಅಧಿಕೃತ ತೀರ್ಪುಗಾರರಾಗಿ (Judge) ನೇಮಿಸಲಾಗಿದೆ.
              </p>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">ನಿಮಗೆ ನಿಯೋಜಿಸಲಾದ ಅಧಿಕೃತ ಸ್ಪರ್ಧೆಗಳು:</span>
                <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-medium">
                  {selectedJudgeForLetter.assignedEvents.map((ev, idx) => (
                    <li key={idx} className="font-semibold text-purple-900">{ev}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-300 text-[11px] text-amber-900">
                <strong>ಲಾಗಿನ್ ಸೂಚನೆ:</strong> ವೆಬ್ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ತೀರ್ಪುಗಾರರ ಲಾಗಿನ್ ಆಯ್ಕೆಮಾಡಿ, ನಿಮ್ಮ ಕ್ಲಸ್ಟರ್ ಹಾಗೂ ನಿಮ್ಮ ಹೆಸರನ್ನು ಆಯ್ಕೆ ಮಾಡಿ, ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ <strong>{selectedJudgeForLetter.phone}</strong> ಅನ್ನು ಪಾಸ್‌ವರ್ಡ್ ಆಗಿ ನಮೂದಿಸಿ ಅಂಕಗಳನ್ನು ಸೇವ್ ಮಾಡಬಹುದು.
              </div>
            </div>

            {/* Letter Signatures */}
            <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end text-xs">
              <div className="text-center">
                <div className="w-24 h-10 mx-auto" />
                <p className="font-bold text-slate-900">ಸಿ.ಆರ್.ಪಿ ಕಾರ್ಯಾಲಯ</p>
                <p className="text-[10px] text-slate-500">{selectedJudgeForLetter.assignedClusterName} ಕ್ಲಸ್ಟರ್</p>
              </div>

              <div className="text-center">
                <div className="w-24 h-10 mx-auto" />
                <p className="font-bold text-slate-900">{OFFICIAL_INFO.beoName}</p>
                <p className="text-[10px] text-slate-500">{OFFICIAL_INFO.beoDesignation}</p>
              </div>
            </div>

            {/* Modal Print Action */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3 print:hidden">
              <button
                onClick={() => setSelectedJudgeForLetter(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                ಮುಚ್ಚಿ
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>ಆದೇಶ ಪತ್ರ ಮುದ್ರಿಸಿ (Print Order)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
