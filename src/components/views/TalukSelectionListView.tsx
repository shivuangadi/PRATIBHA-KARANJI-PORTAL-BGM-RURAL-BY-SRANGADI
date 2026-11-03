import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CLUSTERS } from '../../data/mockData';
import { OfficialConsolidationSheet } from '../common/OfficialConsolidationSheet';
import { 
  Sparkles, 
  Printer, 
  Download, 
  Search, 
  Award, 
  CheckCircle2, 
  MapPin, 
  FileCheck,
  X,
  FileText,
  LayoutGrid
} from 'lucide-react';

export const TalukSelectionListView: React.FC = () => {
  const { scoreEntries, officialInfo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('all');
  const [selectedCertificateStudent, setSelectedCertificateStudent] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'gov_sheet' | 'cards'>('gov_sheet');

  // Filter only 1st rankers who are qualified for taluk level from live scoreEntries
  const talukQualified = scoreEntries.filter(r => (r.rank === 1 || r.qualifiedForTaluk));

  const filteredList = talukQualified.filter(r => {
    const matchesSearch =
      r.studentNameKannada.includes(searchTerm) ||
      r.schoolNameKannada.includes(searchTerm) ||
      r.chestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.eventNameKannada.includes(searchTerm);
    const matchesCluster = selectedClusterFilter === 'all' || r.clusterNameKannada === selectedClusterFilter;
    return matchesSearch && matchesCluster;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ತಾಲೂಕು ಮಟ್ಟದ ಸ್ಪರ್ಧಾ ಕೋಶ • ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ತಾಲೂಕು ಆಯ್ಕೆ ಪಟ್ಟಿ (Taluk Selection List)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ಕ್ಲಸ್ಟರ್ ಹಂತದ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಸ್ಪರ್ಧೆಗಳಲ್ಲಿ <strong>ಪ್ರಥಮ ಸ್ಥಾನ</strong> ಗಳಿಸಿ, ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಅಧಿಕೃತವಾಗಿ ಆಯ್ಕೆಯಾದ ಬಾಲಪ್ರತಿಭೆಗಳ ಪಟ್ಟಿ
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('gov_sheet')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'gov_sheet' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ಅಧಿಕೃತ ಸರ್ಕಾರಿ ನಮೂನೆ</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'cards' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>ಕಾರ್ಡ್ ವ್ಯೂವ್</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'gov_sheet' ? (
        <OfficialConsolidationSheet 
          initialCategory="junior"
          initialMode="taluk_selection"
        />
      ) : (
        <>
          {/* Highlights Bar */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು ಮಟ್ಟದ ಕಾರ್ಯಕ್ರಮ
          </span>
          <h3 className="text-base sm:text-lg font-bold text-white">
            ದಿನಾಂಕ: 15 & 16 ಡಿಸೆಂಬರ್ 2026 | ಸ್ಥಳ: ಬಿ.ಇ.ಒ ಕಚೇರಿ ಸಭಾಂಗಣ, ಬೆಳಗಾವಿ
          </h3>
          <p className="text-xs text-slate-300">
            ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್‌ಗಳಿಂದ ಪ್ರಥಮ ಸ್ಥಾನ ಗಳಿಸಿದ ವಿದ್ಯಾರ್ಥಿಗಳು ಜೊತೆಗಾರ ಶಿಕ್ಷಕರೊಂದಿಗೆ ಹಾಜರಾಗುವುದು.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 px-4 py-2.5 rounded-xl border border-white/20">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-amber-400">{talukQualified.length * 9}</p>
            <p className="text-[10px] text-slate-300 font-medium">ಅರ್ಹ ವಿದ್ಯಾರ್ಥಿಗಳು</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="ಆಯ್ಕೆಯಾದ ವಿದ್ಯಾರ್ಥಿ / ಸ್ಪರ್ಧೆ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedClusterFilter}
            onChange={(e) => setSelectedClusterFilter(e.target.value)}
            className="py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800"
          >
            <option value="all">ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್‌ಗಳು</option>
            {CLUSTERS.map(c => (
              <option key={c.id} value={c.nameKannada}>{c.nameKannada} ಕ್ಲಸ್ಟರ್</option>
            ))}
          </select>
        </div>
      </div>

      {/* Qualified Taluk Students Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">ಕ್ರ.ಸಂ</th>
              <th className="py-3 px-3">ಎದೆ ಸಂಖ್ಯೆ</th>
              <th className="py-3 px-3">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
              <th className="py-3 px-3">ಶಾಲೆಯ ಹೆಸರು</th>
              <th className="py-3 px-3">ಆಯ್ಕೆಯಾದ ಕ್ಲಸ್ಟರ್</th>
              <th className="py-3 px-3">ಸ್ಪರ್ಧಾ ವಿಷಯ</th>
              <th className="py-3 px-3 text-center">ಗಳಿಸಿದ ಅಂಕ (ಗರಿಷ್ಠ 10)</th>
              <th className="py-3 px-3 text-center">ಪ್ರಮಾಣಪತ್ರ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredList.map((row, idx) => (
              <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-500">{idx + 1}</td>
                <td className="py-3 px-3 font-mono font-bold text-indigo-900 bg-indigo-50/50">
                  {row.chestNumber}
                </td>
                <td className="py-3 px-3 font-bold text-slate-900">{row.studentNameKannada}</td>
                <td className="py-3 px-3 text-slate-700">{row.schoolNameKannada}</td>
                <td className="py-3 px-3 font-semibold text-emerald-800">{row.clusterNameKannada} ಕ್ಲಸ್ಟರ್</td>
                <td className="py-3 px-3 font-medium text-slate-800">{row.eventNameKannada}</td>
                <td className="py-3 px-3 text-center font-bold text-slate-900">{row.consolidatedAverage} / 10</td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => setSelectedCertificateStudent(row)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition border border-indigo-200"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>ಅರ್ಹತಾ ಪ್ರಮಾಣಪತ್ರ</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}

      {/* Official Certificate Modal */}
      {selectedCertificateStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-2xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border-4 border-amber-400 space-y-6 relative">
            
            <button
              onClick={() => setSelectedCertificateStudent(null)}
              className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-600 no-print"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Border Ornament */}
            <div className="text-center space-y-2 border-b-2 border-amber-300 pb-4">
              <span className="text-xs font-bold text-red-700 tracking-widest uppercase">
                ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಶಾಲಾ ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಕ್ಷರತಾ ಇಲಾಖೆ
              </span>
              <h2 className="text-lg font-extrabold text-slate-900">
                {officialInfo.officeKannada}
              </h2>
              <h1 className="text-2xl font-serif font-bold text-amber-800 tracking-wide mt-1">
                ಪ್ರಶಂಸನಾ ಹಾಗೂ ಅರ್ಹತಾ ಪ್ರಮಾಣ ಪತ್ರ
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                2026 ಹಾಗೂ 27ನೇ ಸಾಲಿನ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಹಾಗೂ ಕಲೋತ್ಸವ
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-4 text-xs sm:text-sm text-slate-800 leading-relaxed px-4">
              <p>
                <strong>{selectedCertificateStudent.schoolNameKannada}</strong> ಶಾಲೆಯ ವಿದ್ಯಾರ್ಥಿಯಾದ{' '}
                <strong className="text-lg font-bold text-amber-900 border-b border-amber-400 pb-0.5 inline-block">
                  {selectedCertificateStudent.studentNameKannada}
                </strong>{' '}
                (ಎದೆ ಸಂಖ್ಯೆ: {selectedCertificateStudent.chestNumber}) ಇವರು 2026–27ನೇ ಸಾಲಿನ{' '}
                <strong>{selectedCertificateStudent.clusterNameKannada} ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ</strong> ಸ್ಪರ್ಧೆಗಳಲ್ಲಿ{' '}
                <strong>"{selectedCertificateStudent.eventNameKannada}"</strong> ಸ್ಪರ್ಧೆಯಲ್ಲಿ ಭಾಗವಹಿಸಿ{' '}
                <strong className="text-amber-700 font-extrabold">ಪ್ರಥಮ ಸ್ಥಾನ (1st Place)</strong> ಗಳಿಸಿ,{' '}
                <strong>ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು ಮಟ್ಟದ ಸ್ಪರ್ಧೆಗೆ ಅರ್ಹತೆ</strong> ಪಡೆದಿರುತ್ತಾರೆ ಎಂದು ಈ ಮೂಲಕ ಪ್ರಮಾಣೀಕರಿಸಲಾಗಿದೆ.
              </p>
            </div>

            {/* Certificate Signatures */}
            <div className="pt-8 grid grid-cols-3 text-center text-xs text-slate-700 font-bold border-t border-amber-200">
              <div>
                <p className="h-6" />
                <p className="border-t border-slate-300 pt-1">ಸಿ.ಆರ್.ಪಿ (ಕ್ಲಸ್ಟರ್)</p>
                <p className="text-[10px] text-slate-400 font-normal">{selectedCertificateStudent.clusterNameKannada}</p>
              </div>
              <div>
                <p className="h-6" />
                <p className="border-t border-slate-300 pt-1">ಕ್ಷೇತ್ರ ಸಮನ್ವಯಾಧಿಕಾರಿಗಳು</p>
                <p className="text-[10px] text-slate-400 font-normal">ಬಿ.ಆರ್.ಸಿ. ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ</p>
              </div>
              <div>
                <p className="h-6" />
                <p className="border-t border-slate-300 pt-1">ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳು</p>
                <p className="text-[10px] text-slate-400 font-normal">ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 no-print">
              <button
                type="button"
                onClick={() => setSelectedCertificateStudent(null)}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
              >
                ಮುಚ್ಚಿ
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>ಪ್ರಮಾಣಪತ್ರ ಮುದ್ರಿಸಿ (Print Certificate)</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
