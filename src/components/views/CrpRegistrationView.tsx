import React, { useState } from 'react';
import { CLUSTERS } from '../../data/mockData';
import { ClusterInfo } from '../../types';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Building, 
  CheckCircle2, 
  Edit3, 
  Download,
  Filter,
  UserCheck,
  X
} from 'lucide-react';

export const CrpRegistrationView: React.FC = () => {
  const [clustersList, setClustersList] = useState<ClusterInfo[]>(CLUSTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCrp, setSelectedCrp] = useState<ClusterInfo | null>(null);

  // Form states for adding or editing
  const [formClusterName, setFormClusterName] = useState('');
  const [formCrpName, setFormCrpName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSchools, setFormSchools] = useState(24);

  const filteredClusters = clustersList.filter(
    (c) =>
      c.nameKannada.includes(searchTerm) ||
      c.crpName.includes(searchTerm) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCrp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCrpName || !formClusterName) return;

    if (selectedCrp) {
      // Edit mode
      setClustersList(prev =>
        prev.map(c =>
          c.id === selectedCrp.id
            ? { ...c, nameKannada: formClusterName, crpName: formCrpName, crpPhone: formPhone, totalSchools: Number(formSchools) }
            : c
        )
      );
    } else {
      // Add mode
      const newCluster: ClusterInfo = {
        id: `c-${Date.now()}`,
        code: `BLG-RUR-${clustersList.length + 1}`,
        nameKannada: formClusterName,
        nameEnglish: formClusterName,
        crpName: formCrpName,
        crpPhone: formPhone || '9845000000',
        totalSchools: Number(formSchools) || 20,
        registeredStudents: 0,
      };
      setClustersList(prev => [...prev, newCluster]);
    }

    setShowAddModal(false);
    setSelectedCrp(null);
    setFormClusterName('');
    setFormCrpName('');
    setFormPhone('');
  };

  const openEditModal = (crp: ClusterInfo) => {
    setSelectedCrp(crp);
    setFormClusterName(crp.nameKannada);
    setFormCrpName(crp.crpName);
    setFormPhone(crp.crpPhone);
    setFormSchools(crp.totalSchools);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿಗಳ ನಿರ್ವಹಣೆ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ (CRP Registration)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕಿನ ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿಗಳ (CRP) ಪಟ್ಟಿ ಹಾಗೂ ಸಂಪರ್ಕ ವಿವರ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCrp(null);
              setFormClusterName('');
              setFormCrpName('');
              setFormPhone('');
              setFormSchools(24);
              setShowAddModal(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>ಹೊಸ ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ</span>
          </button>
        </div>
      </div>

      {/* Search and Summary Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ಕ್ಲಸ್ಟರ್ ಅಥವಾ ಸಿ.ಆರ್.ಪಿ ಹೆಸರು ಹುಡುಕಿ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-600 font-semibold w-full sm:w-auto justify-between sm:justify-end">
          <span>ಒಟ್ಟು ಕ್ಲಸ್ಟರ್‌ಗಳು: <strong className="text-slate-900">{clustersList.length}</strong></span>
          <span>•</span>
          <span>ನಿಯೋಜಿತ ಶಾಲೆಗಳು: <strong className="text-emerald-800">342</strong></span>
        </div>
      </div>

      {/* CRP Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-4">ಕ್ಲಸ್ಟರ್ ಕೋಡ್</th>
              <th className="py-3 px-4">ಕ್ಲಸ್ಟರ್ ಹೆಸರು</th>
              <th className="py-3 px-4">ಸಿ.ಆರ್.ಪಿ ಹೆಸರು</th>
              <th className="py-3 px-4">ಮೊಬೈಲ್ ಸಂಖ್ಯೆ</th>
              <th className="py-3 px-4 text-center">ವ್ಯಾಪ್ತಿಯ ಶಾಲೆಗಳು</th>
              <th className="py-3 px-4 text-center">ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳು</th>
              <th className="py-3 px-4 text-center">ಕ್ರಮಗಳು</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredClusters.map((cl) => (
              <tr key={cl.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-emerald-800">{cl.code}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{cl.nameKannada}</td>
                <td className="py-3 px-4 text-slate-800 font-medium">{cl.crpName}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1.5 text-slate-700 font-mono">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    {cl.crpPhone}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold">
                    {cl.totalSchools}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">
                    {cl.registeredStudents}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => openEditModal(cl)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-md transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>ಸಂಪಾದಿಸಿ</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit CRP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {selectedCrp ? 'ಸಿ.ಆರ್.ಪಿ ವಿವರ ಸಂಪಾದಿಸಿ' : 'ಹೊಸ ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCrp} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ಕ್ಲಸ್ಟರ್ ಹೆಸರು (ಕನ್ನಡದಲ್ಲಿ):
                </label>
                <input
                  type="text"
                  required
                  placeholder="ಉದಾ: ಹಿರೇಬಾಗೇವಾಡಿ"
                  value={formClusterName}
                  onChange={(e) => setFormClusterName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ಸಿ.ಆರ್.ಪಿ ಪೂರ್ಣ ಹೆಸರು:
                </label>
                <input
                  type="text"
                  required
                  placeholder="ಉದಾ: ಶ್ರೀ ಎಸ್. ಕೆ. ಹಿರೇಮಠ"
                  value={formCrpName}
                  onChange={(e) => setFormCrpName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ಮೊಬೈಲ್ ದೂರವಾಣಿ ಸಂಖ್ಯೆ:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ಉದಾ: 9845112233"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  ಕ್ಲಸ್ಟರ್ ವ್ಯಾಪ್ತಿಯ ಒಟ್ಟು ಶಾಲೆಗಳ ಸಂಖ್ಯೆ:
                </label>
                <input
                  type="number"
                  min="1"
                  value={formSchools}
                  onChange={(e) => setFormSchools(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 text-slate-900"
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
                  className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  {selectedCrp ? 'ಬದಲಾವಣೆ ಉಳಿಸಿ' : 'ನೋಂದಾಯಿಸಿ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
