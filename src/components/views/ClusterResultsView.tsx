import React, { useState } from 'react';
import { CLUSTERS, COMPETITION_EVENTS, CONSOLIDATED_RESULTS } from '../../data/mockData';
import { CompetitionCategory } from '../../types';
import { 
  Trophy, 
  Printer, 
  Download, 
  Medal, 
  Sparkles, 
  CheckCircle2, 
  Award,
  Filter,
  School
} from 'lucide-react';

export const ClusterResultsView: React.FC = () => {
  const [selectedClusterId, setSelectedClusterId] = useState(CLUSTERS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategory>('junior');

  const activeCluster = CLUSTERS.find(c => c.id === selectedClusterId) || CLUSTERS[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಅಧಿಕೃತ ಪ್ರಕಟಣೆ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಫಲಿತಾಂಶಗಳು (Cluster Results)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeCluster.nameKannada} ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರದ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026-27 ಅಂತಿಮ ಫಲಿತಾಂಶ (25 ಕ್ಲಸ್ಟರ್‌ಗಳು)
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
        >
          <Printer className="w-4 h-4" />
          <span>ಫಲಿತಾಂಶ ಪಟ್ಟಿ ಮುದ್ರಿಸಿ (PDF / Print)</span>
        </button>
      </div>

      {/* Cluster and Category Filter */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80">
          <label className="block text-xs font-bold text-slate-700 mb-1">ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ ಆಯ್ಕೆ (25 ಕ್ಲಸ್ಟರ್‌ಗಳು):</label>
          <select
            value={selectedClusterId}
            onChange={(e) => setSelectedClusterId(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-amber-500"
          >
            {CLUSTERS.map(c => (
              <option key={c.id} value={c.id}>{c.nameKannada} ಕ್ಲಸ್ಟರ್ ({c.code})</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: 'junior', label: 'ವಿಭಾಗ 1: ಕಿರಿಯ ವಿಭಾಗ (1-4)' },
            { id: 'senior', label: 'ವಿಭಾಗ 2: ಹಿರಿಯ ವಿಭಾಗ (5-7)' },
            { id: 'high_school', label: 'ವಿಭಾಗ 3: ಪ್ರೌಢ ವಿಭಾಗ (8-12)' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CompetitionCategory)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Podium Cards for Top 3 Winners */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* 1st Place - Gold */}
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl border-2 border-amber-300 p-5 shadow-sm relative overflow-hidden order-1 md:order-2 md:-translate-y-2">
          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-bl-xl shadow-xs">
            1ST RANK (ಪ್ರಥಮ)
          </div>

          <div className="text-center space-y-2 pt-2">
            <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center mx-auto shadow-md ring-4 ring-amber-100">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                ಎದೆ ಸಂಖ್ಯೆ: HB-201
              </span>
              <h3 className="font-bold text-base text-slate-900 mt-1">
                ಕುಮಾರಿ ಸನ್ನಿಧಿ ಮಲ್ಲಿಕಾರ್ಜುನ ಪಾಟೀಲ
              </h3>
              <p className="text-xs text-slate-500">ಸ.ಹಿ.ಪ್ರಾ.ಶಾಲೆ ಹಿರೇಬಾಗೇವಾಡಿ</p>
            </div>

            <div className="pt-2 border-t border-amber-200">
              <p className="text-xs font-semibold text-amber-900">ಭಾವಗೀತೆ ಗಾಯನ</p>
              <p className="text-lg font-extrabold text-amber-700 mt-0.5">95.5 / 100 ಅಂಕಗಳು</p>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಆಯ್ಕೆ</span>
            </div>
          </div>
        </div>

        {/* 2nd Place - Silver */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs order-2 md:order-1">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold text-slate-700">2ND RANK (ದ್ವಿತೀಯ)</span>
            <Medal className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center mx-auto font-extrabold">
              2
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                MR-201
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-1">
                ಕುಮಾರಿ ಪ್ರೇರಣಾ ಮಹಾಂತೇಶ ಚೌಗುಲೆ
              </h4>
              <p className="text-xs text-slate-500">ಸರ್ಕಾರಿ ಸಂಯುಕ್ತ ಪ.ಪೂ ಕಾಲೇಜು ಮಾರಿಹಾಳ</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600">ಭಾವಗೀತೆ ಗಾಯನ</p>
              <p className="text-base font-bold text-slate-800">90.0 / 100</p>
            </div>
          </div>
        </div>

        {/* 3rd Place - Bronze */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs order-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold text-amber-800">3RD RANK (ತೃತೀಯ)</span>
            <Medal className="w-5 h-5 text-amber-600" />
          </div>

          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto font-extrabold">
              3
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                SB-201
              </span>
              <h4 className="font-bold text-sm text-slate-900 mt-1">
                ಕುಮಾರ ಕಾರ್ತಿಕ ಈಶ್ವರ ಬಡಿಗೇರ
              </h4>
              <p className="text-xs text-slate-500">ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಸುಳೇಭಾವಿ</p>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600">ಭಾವಗೀತೆ ಗಾಯನ</p>
              <p className="text-base font-bold text-slate-800">86.5 / 100</p>
            </div>
          </div>
        </div>

      </div>

      {/* Full Event Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          {activeCluster.nameKannada} ಕ್ಲಸ್ಟರ್ ಸಂಪೂರ್ಣ ಮೆರಿಟ್ ಪಟ್ಟಿ
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">ಸ್ಥಾನ</th>
                <th className="py-2.5 px-3">ಎದೆ ಸಂಖ್ಯೆ</th>
                <th className="py-2.5 px-3">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
                <th className="py-2.5 px-3">ಶಾಲೆ</th>
                <th className="py-2.5 px-3">ಸ್ಪರ್ಧೆ</th>
                <th className="py-2.5 px-3 text-center">ಅಂತಿಮ ಅಂಕ</th>
                <th className="py-2.5 px-3 text-center">ಫಲಿತಾಂಶ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {CONSOLIDATED_RESULTS.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-amber-900">
                    {row.rank === 1 ? '🥇 ಪ್ರಥಮ' : row.rank === 2 ? '🥈 ದ್ವಿತೀಯ' : '🥉 ತೃತೀಯ'}
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{row.chestNumber}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{row.studentNameKannada}</td>
                  <td className="py-2.5 px-3">{row.schoolNameKannada}</td>
                  <td className="py-2.5 px-3">{row.eventNameKannada}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900">{row.consolidatedAverage}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.qualifiedForTaluk && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        ತಾಲೂಕು ಹಂತಕ್ಕೆ ಅರ್ಹತೆ
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
