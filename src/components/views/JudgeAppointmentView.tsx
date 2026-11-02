import React, { useState } from 'react';
import { JUDGES, CLUSTERS, COMPETITION_EVENTS, OFFICIAL_INFO } from '../../data/mockData';
import { JudgeInfo } from '../../types';
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
  Building
} from 'lucide-react';

export const JudgeAppointmentView: React.FC = () => {
  const [judgesList, setJudgesList] = useState<JudgeInfo[]>(JUDGES);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJudgeForLetter, setSelectedJudgeForLetter] = useState<JudgeInfo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [institution, setInstitution] = useState('');
  const [phone, setPhone] = useState('');
  const [clusterId, setClusterId] = useState(CLUSTERS[0].id);
  const [assignedEvent, setAssignedEvent] = useState(COMPETITION_EVENTS[0].nameKannada);

  const filteredJudges = judgesList.filter((j) =>
    j.nameKannada.includes(searchTerm) ||
    j.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.assignedClusterName.includes(searchTerm) ||
    j.assignedEvents.some(ev => ev.includes(searchTerm))
  );

  const handleAppointJudge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    const clusterObj = CLUSTERS.find(c => c.id === clusterId) || CLUSTERS[0];
    const newJudge: JudgeInfo = {
      id: `jdg-${Date.now()}`,
      code: `J-BLG-0${judgesList.length + 1}`,
      nameKannada: name,
      designation: designation || 'ವಿಷಯ ತಜ್ಞರು',
      institution: institution || 'ಬೆಳಗಾವಿ',
      phone,
      assignedClusterId: clusterId,
      assignedClusterName: clusterObj.nameKannada,
      assignedEvents: [assignedEvent],
      status: 'ನೇಮಕಗೊಂಡಿದೆ',
    };

    setJudgesList(prev => [newJudge, ...prev]);
    setShowAddModal(false);
    setName('');
    setDesignation('');
    setInstitution('');
    setPhone('');
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
            ನಿರ್ಣಾಯಕರ ನೇಮಕಾತಿ (Judge Appointment)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026-27 ಸ್ಪರ್ಧೆಗಳಿಗೆ ಪರಿಣಿತ ತೀರ್ಪುಗಾರರ ಅಧಿಕೃತ ನೇಮಕಾತಿ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>ಹೊಸ ನಿರ್ಣಾಯಕರ ನೇಮಕ</span>
        </button>
      </div>

      {/* Search and Summary */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ನಿರ್ಣಾಯಕರ ಹೆಸರು / ನಿಯೋಜಿತ ಸ್ಪರ್ಧೆ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800"
          />
        </div>

        <div className="text-xs text-slate-600 font-semibold">
          ನೇಮಕಗೊಂಡ ಒಟ್ಟು ತೀರ್ಪುಗಾರರು: <strong className="text-purple-800">{judgesList.length}</strong>
        </div>
      </div>

      {/* Judges Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">ಕೋಡ್</th>
              <th className="py-3 px-4">ನಿರ್ಣಾಯಕರ ಹೆಸರು</th>
              <th className="py-3 px-4">ಹುದ್ದೆ & ಸಂಸ್ಥೆ</th>
              <th className="py-3 px-4">ದೂರವಾಣಿ</th>
              <th className="py-3 px-4">ನಿಯೋಜಿತ ಕ್ಲಸ್ಟರ್</th>
              <th className="py-3 px-4">ನಿಯೋಜಿತ ಸ್ಪರ್ಧೆಗಳು</th>
              <th className="py-3 px-4 text-center">ಆದೇಶ ಪತ್ರ</th>
              <th className="py-3 px-4 text-center">ಸ್ಥಿತಿ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredJudges.map((jdg) => (
              <tr key={jdg.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-purple-800">{jdg.code}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{jdg.nameKannada}</td>
                <td className="py-3 px-4 text-slate-700">
                  <p>{jdg.designation}</p>
                  <p className="text-[11px] text-slate-400 font-normal">{jdg.institution}</p>
                </td>
                <td className="py-3 px-4 font-mono text-slate-700">{jdg.phone}</td>
                <td className="py-3 px-4 font-semibold text-slate-800">{jdg.assignedClusterName}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {jdg.assignedEvents.map((ev, i) => (
                      <span key={i} className="bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {ev}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => setSelectedJudgeForLetter(jdg)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-md transition border border-purple-200"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>ಆದೇಶ ಪತ್ರ</span>
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-3 h-3" />
                    {jdg.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Appointment Letter Modal */}
      {selectedJudgeForLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-8 shadow-2xl border-2 border-slate-300 space-y-5">
            <div className="text-center border-b-2 border-slate-800 pb-4 relative">
              <button
                onClick={() => setSelectedJudgeForLetter(null)}
                className="absolute right-0 top-0 p-1 text-slate-400 hover:text-slate-600 no-print"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-xs font-bold text-red-700">ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಶಾಲಾ ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಕ್ಷರತಾ ಇಲಾಖೆ</span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                {OFFICIAL_INFO.officeKannada}
              </h3>
              <p className="text-xs font-bold text-amber-800 mt-0.5">
                ಅಧಿಕೃತ ತೀರ್ಪುಗಾರರ ನೇಮಕಾತಿ ಆದೇಶ ಪತ್ರ (Official Appointment Order)
              </p>
              <div className="mt-2 text-[11px] text-slate-500 font-mono flex justify-between">
                <span>ಸಂಖ್ಯೆ: ಬಿಇಒ/ಬೆಂಗ್ರಾ/ಪ್ರಕಾ/2026-27/{selectedJudgeForLetter.code}</span>
                <span>ದಿನಾಂಕ: {new Date().toLocaleDateString('kn-IN')}</span>
              </div>
            </div>

            <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
              <p>
                <strong>ಮಾನ್ಯರೇ / ಮಾನ್ಯರೇ,</strong><br />
                {selectedJudgeForLetter.nameKannada}, {selectedJudgeForLetter.designation}, {selectedJudgeForLetter.institution}.
              </p>
              <p>
                <strong>ವಿಷಯ:</strong> 2026 ಹಾಗೂ 27ನೇ ಸಾಲಿನ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಹಾಗೂ ಕಲೋತ್ಸವ ಸ್ಪರ್ಧೆಗಳಿಗೆ ನಿರ್ಣಾಯಕರಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸಲು ಕೋರಿಕೆ.
              </p>
              <p>
                ಮೇಲ್ಕಂಡ ವಿಷಯಕ್ಕೆ ಸಂಬಂಧಿಸಿದಂತೆ, ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು ವ್ಯಾಪ್ತಿಯ <strong>{selectedJudgeForLetter.assignedClusterName} ಕ್ಲಸ್ಟರ್</strong> ಕೇಂದ್ರದಲ್ಲಿ ನಡೆಯಲಿರುವ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಸ್ಪರ್ಧೆಗಳಲ್ಲಿ <strong>{selectedJudgeForLetter.assignedEvents.join(', ')}</strong> ಸ್ಪರ್ಧೆಗೆ ನಿಮ್ಮನ್ನು ತೀರ್ಪುಗಾರರನ್ನಾಗಿ ನೇಮಕ ಮಾಡಲಾಗಿದೆ. ತಾವು ನಿಗದಿತ ಸಮಯಕ್ಕೆ ಹಾಜರಾಗಿ ನಿರ್ಪಕ್ಷಪಾತ ಮೌಲ್ಯಮಾಪನ ನಡೆಸಿ ಸಹಕರಿಸಬೇಕಾಗಿ ಕೋರಿದೆ.
              </p>
            </div>

            <div className="pt-8 grid grid-cols-2 text-center text-xs text-slate-800 font-bold border-t border-slate-200">
              <div>
                <p className="text-slate-400 font-normal text-[10px] mb-6">[ಸ್ಥಳ: ಬೆಳಗಾವಿ]</p>
                <p>ಕ್ಷೇತ್ರ ಸಮನ್ವಯ ಅಧಿಕಾರಿಗಳು (BRC)</p>
                <p className="text-[10px] font-normal text-slate-500">ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ</p>
              </div>
              <div>
                <p className="text-slate-400 font-normal text-[10px] mb-6">[ಅಧಿಕೃತ ಮೊಹರು]</p>
                <p>ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳು (BEO)</p>
                <p className="text-[10px] font-normal text-slate-500">ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setSelectedJudgeForLetter(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                ಮುಚ್ಚಿ
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>ಆದೇಶ ಪತ್ರ ಮುದ್ರಿಸಿ (Print Order)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Judge Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">ಹೊಸ ನಿರ್ಣಾಯಕರ ನೇಮಕಾತಿ ನಮೂನೆ</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAppointJudge} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ತೀರ್ಪುಗಾರರ ಪೂರ್ಣ ಹೆಸರು:</label>
                <input
                  type="text"
                  required
                  placeholder="ಉದಾ: ಪ್ರೊ. ಶ್ರೀಕಾಂತ ಕಲಬುರ್ಗಿ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ಹುದ್ದೆ / ಪರಿಣತಿ:</label>
                <input
                  type="text"
                  placeholder="ಉದಾ: ಸಂಗೀತ ಪ್ರಾಧ್ಯಾಪಕರು"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ಸಂಸ್ಥೆ / ಕಾಲೇಜು / ಊರು:</label>
                <input
                  type="text"
                  placeholder="ಉದಾ: ಕರ್ನಾಟಕ ಕಲಾ ಮಹಾವಿದ್ಯಾಲಯ, ಬೆಳಗಾವಿ"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ಮೊಬೈಲ್ ದೂರವಾಣಿ ಸಂಖ್ಯೆ:</label>
                <input
                  type="tel"
                  required
                  placeholder="9448..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ನಿಯೋಜಿತ ಕ್ಲಸ್ಟರ್:</label>
                  <select
                    value={clusterId}
                    onChange={(e) => setClusterId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900"
                  >
                    {CLUSTERS.map(c => (
                      <option key={c.id} value={c.id}>{c.nameKannada}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ನಿಯೋಜಿತ ಸ್ಪರ್ಧೆ:</label>
                  <select
                    value={assignedEvent}
                    onChange={(e) => setAssignedEvent(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-slate-900"
                  >
                    {COMPETITION_EVENTS.map(ev => (
                      <option key={ev.id} value={ev.nameKannada}>
                        {ev.nameKannada} - {ev.categoryKannada} {ev.isGroupEvent ? '(ಸಾಮೂಹಿಕ)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
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
                  className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-800 text-white font-bold"
                >
                  ನೇಮಕಾತಿ ಆದೇಶ ಸಿದ್ಧಪಡಿಸಿ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
