import React, { useState } from 'react';
import { SCHOOLS, CLUSTERS } from '../../data/mockData';
import { SchoolInfo } from '../../types';
import { 
  Building, 
  Search, 
  Plus, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Filter,
  GraduationCap,
  X,
  FileSpreadsheet
} from 'lucide-react';

export const SchoolRegistrationView: React.FC = () => {
  const [schoolsList, setSchoolsList] = useState<SchoolInfo[]>(SCHOOLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [diseCode, setDiseCode] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [clusterId, setClusterId] = useState(CLUSTERS[0].id);
  const [schoolType, setSchoolType] = useState<'ಸರ್ಕಾರಿ' | 'ಅನುದಾನಿತ' | 'ಅನುದಾನರಹಿತ'>('ಸರ್ಕಾರಿ');
  const [headMaster, setHeadMaster] = useState('');
  const [phone, setPhone] = useState('');

  const filteredSchools = schoolsList.filter((s) => {
    const matchesSearch =
      s.nameKannada.includes(searchTerm) ||
      s.diseCode.includes(searchTerm) ||
      s.headMasterName.includes(searchTerm);
    const matchesCluster = selectedClusterFilter === 'all' || s.clusterId === selectedClusterFilter;
    const matchesType = selectedTypeFilter === 'all' || s.schoolType === selectedTypeFilter;
    return matchesSearch && matchesCluster && matchesType;
  });

  const handleAddSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diseCode || !schoolName || !headMaster) return;

    const clusterObj = CLUSTERS.find(c => c.id === clusterId) || CLUSTERS[0];
    const newSchool: SchoolInfo = {
      id: `sch-${Date.now()}`,
      diseCode,
      nameKannada: schoolName,
      nameEnglish: schoolName,
      clusterId,
      clusterNameKannada: clusterObj.nameKannada,
      schoolType,
      headMasterName: headMaster,
      headMasterPhone: phone || '9448000000',
      totalParticipants: 0,
      status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    };

    setSchoolsList(prev => [newSchool, ...prev]);
    setShowAddModal(false);
    setDiseCode('');
    setSchoolName('');
    setHeadMaster('');
    setPhone('');
  };

  const toggleVerify = (schoolId: string) => {
    setSchoolsList(prev =>
      prev.map(s =>
        s.id === schoolId
          ? { ...s, status: s.status === 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' ? 'ಬಾಕಿ ಇದೆ' : 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' }
          : s
      )
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 mb-1">
            <Building className="w-3.5 h-3.5" />
            <span>ಶಾಲಾ ನಿರ್ದೇಶಿಕೆ ಮತ್ತು ದೃಢೀಕರಣ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ಶಾಲೆ ನೋಂದಣಿ (School Registration)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕಿನ ಪ್ರಾಥಮಿಕ ಮತ್ತು ಪ್ರೌಢಶಾಲೆಗಳ DISE ಕೋಡ್ ಸಹಿತ ನೋಂದಣಿ ವಿವರ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>ಹೊಸ ಶಾಲೆ ಸೇರ್ಪಡೆ</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ಶಾಲೆ ಹೆಸರು / DISE ಕೋಡ್..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div>
          <select
            value={selectedClusterFilter}
            onChange={(e) => setSelectedClusterFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ಎಲ್ಲಾ ಕ್ಲಸ್ಟರ್‌ಗಳು</option>
            {CLUSTERS.map((cl) => (
              <option key={cl.id} value={cl.id}>
                {cl.nameKannada} ಕ್ಲಸ್ಟರ್
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">ಎಲ್ಲಾ ಶಾಲಾ ಪ್ರಕಾರಗಳು</option>
            <option value="ಸರ್ಕಾರಿ">ಸರ್ಕಾರಿ ಶಾಲೆಗಳು</option>
            <option value="ಅನುದಾನಿತ">ಅನುದಾನಿತ ಶಾಲೆಗಳು</option>
            <option value="ಅನುದಾನರಹಿತ">ಅನುದಾನರಹಿತ ಶಾಲೆಗಳು</option>
          </select>
        </div>

        <div className="flex items-center justify-end text-xs text-slate-600 font-semibold px-2">
          <span>ತೋರಿಸಲಾಗುತ್ತಿದೆ: <strong className="text-slate-900">{filteredSchools.length}</strong> ಶಾಲೆಗಳು</span>
        </div>
      </div>

      {/* Schools Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">DISE ಕೋಡ್</th>
              <th className="py-3 px-4">ಶಾಲೆಯ ಹೆಸರು</th>
              <th className="py-3 px-4">ಕ್ಲಸ್ಟರ್</th>
              <th className="py-3 px-4">ಪ್ರಕಾರ</th>
              <th className="py-3 px-4">ಮುಖ್ಯಗುರುಗಳ ವಿವರ</th>
              <th className="py-3 px-4 text-center">ಸ್ಪರ್ಧಿಗಳು</th>
              <th className="py-3 px-4 text-center">ಸ್ಥಿತಿ</th>
              <th className="py-3 px-4 text-center">ಕ್ರಮ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredSchools.map((sch) => (
              <tr key={sch.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-blue-800">{sch.diseCode}</td>
                <td className="py-3 px-4 font-bold text-slate-900 max-w-xs">{sch.nameKannada}</td>
                <td className="py-3 px-4 text-slate-700">{sch.clusterNameKannada}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sch.schoolType === 'ಸರ್ಕಾರಿ' ? 'bg-emerald-100 text-emerald-800' :
                    sch.schoolType === 'ಅನುದಾನಿತ' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {sch.schoolType}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-slate-800">{sch.headMasterName}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 font-mono">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {sch.headMasterPhone}
                  </p>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                    {sch.totalParticipants}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    sch.status === 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sch.status === 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {sch.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleVerify(sch.id)}
                    className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                  >
                    ಸ್ಥಿತಿ ಬದಲಿಸಿ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">ಹೊಸ ಶಾಲೆ ನೋಂದಣಿ</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSchool} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">DISE ಕೋಡ್ (11 ಅಂಕಿಗಳು):</label>
                  <input
                    type="text"
                    required
                    placeholder="29010200..."
                    value={diseCode}
                    onChange={(e) => setDiseCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ಕ್ಲಸ್ಟರ್ ಆಯ್ಕೆ:</label>
                  <select
                    value={clusterId}
                    onChange={(e) => setClusterId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    {CLUSTERS.map((cl) => (
                      <option key={cl.id} value={cl.id}>{cl.nameKannada}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ಶಾಲೆಯ ಪೂರ್ಣ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ):</label>
                <input
                  type="text"
                  required
                  placeholder="ಉದಾ: ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ಹಿರೇಬಾಗೇವಾಡಿ"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ಶಾಲಾ ಪ್ರಕಾರ:</label>
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    <option value="ಸರ್ಕಾರಿ">ಸರ್ಕಾರಿ ಶಾಲೆ</option>
                    <option value="ಅನುದಾನಿತ">ಅನುದಾನಿತ ಶಾಲೆ</option>
                    <option value="ಅನುದಾನರಹಿತ">ಅನುದಾನರಹಿತ ಶಾಲೆ</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ಮುಖ್ಯಗುರುಗಳ ದೂರವಾಣಿ:</label>
                  <input
                    type="tel"
                    required
                    placeholder="9448..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ಮುಖ್ಯಗುರುಗಳ ಪೂರ್ಣ ಹೆಸರು:</label>
                <input
                  type="text"
                  required
                  placeholder="ಉದಾ: ಶ್ರೀ ಎಂ. ಬಿ. ಪಾಟೀಲ"
                  value={headMaster}
                  onChange={(e) => setHeadMaster(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
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
                  className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold"
                >
                  ಶಾಲೆ ಸೇರಿಸಿ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
