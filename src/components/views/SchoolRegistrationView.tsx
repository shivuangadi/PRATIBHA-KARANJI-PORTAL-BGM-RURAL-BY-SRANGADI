import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CLUSTERS } from '../../data/mockData';
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
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export const SchoolRegistrationView: React.FC = () => {
  const { 
    currentUser, 
    visibleSchools, 
    registerSchool, 
    clusters 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form states
  const activeCluster = currentUser?.clusterId || clusters[0].id;
  const [diseCode, setDiseCode] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [clusterId, setClusterId] = useState(activeCluster);
  const [schoolType, setSchoolType] = useState<'ಸರ್ಕಾರಿ' | 'ಅನುದಾನಿತ' | 'ಅನುದಾನರಹಿತ'>('ಸರ್ಕಾರಿ');
  const [headMaster, setHeadMaster] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const filteredSchools = visibleSchools.filter((s) => {
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
    setErrorMessage(null);

    if (!diseCode || !schoolName || !headMaster) {
      setErrorMessage('ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕಡ್ಡಾಯ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.');
      return;
    }

    const clusterObj = clusters.find(c => c.id === (currentUser?.clusterId || clusterId)) || clusters[0];
    const res = registerSchool({
      diseCode: diseCode.trim(),
      nameKannada: schoolName.trim(),
      nameEnglish: schoolName.trim(),
      clusterId: clusterObj.id,
      clusterNameKannada: clusterObj.nameKannada,
      schoolType,
      headMasterName: headMaster.trim(),
      headMasterPhone: phone.trim() || '9448000000',
      username: username.trim() || diseCode.trim(),
      password: password.trim() || diseCode.trim().slice(-4) || '1234',
    });

    if (res.success) {
      setToastMessage(res.message || 'ಶಾಲಾ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ.');
      setShowAddModal(false);
      setDiseCode('');
      setSchoolName('');
      setHeadMaster('');
      setPhone('');
      setUsername('');
      setPassword('');
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      setErrorMessage(res.message || 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ.');
    }
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
            {currentUser?.role === 'crp'
              ? `${currentUser.clusterName} ಕ್ಲಸ್ಟರ್ ವ್ಯಾಪ್ತಿಯ ಶಾಲೆಗಳ ಪರಿಶೀಲನೆ ಮತ್ತು ಹೊಸ ಶಾಲಾ ಸೇರ್ಪಡೆ`
              : currentUser?.role === 'school'
              ? `${currentUser.schoolName} ಶಾಲೆಯ ಅಧಿಕೃತ ವಿವರ`
              : 'ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕಿನ ಪ್ರಾಥಮಿಕ ಮತ್ತು ಪ್ರೌಢಶಾಲೆಗಳ DISE ಕೋಡ್ ಸಹಿತ ನೋಂದಣಿ ವಿವರ'}
          </p>
        </div>

        {currentUser?.role !== 'school' && (
          <button
            onClick={() => {
              setShowAddModal(true);
              setErrorMessage(null);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>ಹೊಸ ಶಾಲೆ ನೋಂದಣಿ</span>
          </button>
        )}
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Scope banner */}
      {currentUser?.role === 'crp' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
          <span className="font-bold">
            ನಿಮ್ಮ ನಿಯೋಜಿತ ಕ್ಲಸ್ಟರ್ ವ್ಯಾಪ್ತಿಯ ಶಾಲೆಗಳು: {currentUser.clusterName}
          </span>
          <span className="text-emerald-700 font-semibold">
            ಶಾಲೆಗಳ ಸಂಖ್ಯೆ: {visibleSchools.length}
          </span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ಶಾಲೆಯ ಹೆಸರು / DISE ಕೋಡ್ / ಮುಖ್ಯಗುರುಗಳು..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {currentUser?.role === 'admin' && (
            <select
              value={selectedClusterFilter}
              onChange={(e) => setSelectedClusterFilter(e.target.value)}
              className="py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
            >
              <option value="all">ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್‌ಗಳು</option>
              {clusters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameKannada} ({c.nameEnglish})
                </option>
              ))}
            </select>
          )}

          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          >
            <option value="all">ಎಲ್ಲಾ ಶಾಲಾ ವಿಧಗಳು</option>
            <option value="ಸರ್ಕಾರಿ">ಸರ್ಕಾರಿ ಶಾಲೆಗಳು</option>
            <option value="ಅನುದಾನಿತ">ಅನುದಾನಿತ ಶಾಲೆಗಳು</option>
            <option value="ಅನುದಾನರಹಿತ">ಅನುದಾನರಹಿತ ಶಾಲೆಗಳು</option>
          </select>
        </div>
      </div>

      {/* Schools Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">DISE ಕೋಡ್</th>
                <th className="py-3 px-4">ಶಾಲೆಯ ಹೆಸರು</th>
                <th className="py-3 px-4">ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ</th>
                <th className="py-3 px-4">ಶಾಲಾ ವಿಧ</th>
                <th className="py-3 px-4">ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು & ಸಂಪರ್ಕ</th>
                <th className="py-3 px-4 text-center">ಸ್ಥಿತಿ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <tr key={school.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {school.diseCode}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{school.nameKannada}</p>
                      <span className="text-[10px] text-slate-400">{school.nameEnglish}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {school.clusterNameKannada}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        school.schoolType === 'ಸರ್ಕಾರಿ'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : school.schoolType === 'ಅನುದಾನಿತ'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}>
                        {school.schoolType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800">{school.headMasterName}</p>
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{school.headMasterPhone}</span>
                      </p>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>ದೃಢೀಕರಿಸಲಾಗಿದೆ</span>
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    ಯಾವುದೇ ಶಾಲಾ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add School Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold">ಹೊಸ ಶಾಲೆ ನೋಂದಣಿ (New School Registration)</h3>
                  <p className="text-xs text-blue-200 mt-0.5">DISE ಕೋಡ್ ಹಾಗೂ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ವಿವರ</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSchool} className="p-6 space-y-3.5 max-h-[75vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ (Cluster) *
                </label>
                {currentUser?.role === 'crp' ? (
                  <input
                    type="text"
                    disabled
                    value={`${currentUser.clusterName} ಕ್ಲಸ್ಟರ್`}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-slate-100 text-slate-800 font-bold"
                  />
                ) : (
                  <select
                    value={clusterId}
                    onChange={(e) => setClusterId(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                  >
                    {clusters.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nameKannada} ({c.nameEnglish})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ಶಾಲೆಯ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ) *</label>
                <input
                  type="text"
                  required
                  placeholder="ಉದಾ: ಸರ್ಕಾರಿ ಮಾದರಿ ಪ್ರಾಥಮಿಕ ಶಾಲೆ..."
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">DISE ಕೋಡ್ (11 ಅಂಕಿಗಳು) *</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="29010200..."
                    value={diseCode}
                    onChange={(e) => setDiseCode(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ಶಾಲೆಯ ವಿಧ</label>
                  <select
                    value={schoolType}
                    onChange={(e) => setSchoolType(e.target.value as any)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="ಸರ್ಕಾರಿ">ಸರ್ಕಾರಿ</option>
                    <option value="ಅನುದಾನಿತ">ಅನುದಾನಿತ</option>
                    <option value="ಅನುದಾನರಹಿತ">ಅನುದಾನರಹಿತ</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಹೆಸರು *</label>
                  <input
                    type="text"
                    required
                    placeholder="ಶ್ರೀ / ಶ್ರೀಮತಿ..."
                    value={headMaster}
                    onChange={(e) => setHeadMaster(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-ಅಂಕಿಯ ಮೊಬೈಲ್"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

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
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  ಶಾಲೆಯನ್ನು ನೋಂದಾಯಿಸಿ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
