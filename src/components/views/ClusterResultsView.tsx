import React, { useState } from 'react';
import { CLUSTERS } from '../../data/mockData';
import { CompetitionCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { OfficialConsolidationSheet } from '../common/OfficialConsolidationSheet';
import { SeniorWinnersReport } from '../reports/SeniorWinnersReport';
import { JuniorWinnersReport } from '../reports/JuniorWinnersReport';
import { 
  Trophy, 
  Printer, 
  Download, 
  Medal, 
  Sparkles, 
  CheckCircle2, 
  Award,
  Filter,
  School,
  FileText,
  LayoutGrid
} from 'lucide-react';

export const ClusterResultsView: React.FC = () => {
  const { scoreEntries, currentUser } = useApp();
  const [selectedClusterId, setSelectedClusterId] = useState(currentUser?.clusterId || CLUSTERS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategory>('junior');
  const [viewMode, setViewMode] = useState<'junior_report' | 'senior_report' | 'gov_sheet' | 'cards'>('junior_report');

  const activeCluster = CLUSTERS.find(c => c.id === selectedClusterId) || CLUSTERS[0];

  // Scoped score entries for this cluster & category
  const filteredScores = scoreEntries
    .filter(s => {
      const isClMatch = !s.clusterId || s.clusterId === selectedClusterId || s.clusterNameKannada === activeCluster.nameKannada;
      const isCatMatch = !s.categoryId || s.categoryId === selectedCategory;
      return isClMatch && isCatMatch;
    })
    .sort((a, b) => {
      if (a.rank && b.rank) return a.rank - b.rank;
      return (b.consolidatedAverage || 0) - (a.consolidatedAverage || 0);
    });

  const firstPlace = filteredScores.find(s => s.rank === 1) || filteredScores[0];
  const secondPlace = filteredScores.find(s => s.rank === 2) || filteredScores[1];
  const thirdPlace = filteredScores.find(s => s.rank === 3) || filteredScores[2];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 no-print">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಅಧಿಕೃತ ಪ್ರಕಟಣೆ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಫಲಿತಾಂಶಗಳು (Cluster Results)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {activeCluster.nameKannada} ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರದ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026-27 ಅಂತಿಮ ಫಲಿತಾಂಶ (1, 2 & 3ನೇ ಸ್ಥಾನ)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View mode toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 flex-wrap">
            <button
              onClick={() => setViewMode('junior_report')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'junior_report' ? 'bg-emerald-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>ಕಿರಿಯ ವಿಭಾಗದ ವಿಜೇತರು (ಚಿತ್ರದಂತೆ)</span>
            </button>
            <button
              onClick={() => setViewMode('senior_report')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'senior_report' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>ಹಿರಿಯ ವಿಭಾಗದ ವಿಜೇತರು (ಚಿತ್ರದಂತೆ)</span>
            </button>
            <button
              onClick={() => setViewMode('gov_sheet')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'gov_sheet' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ಎಲ್ಲಾ ವಿಭಾಗಗಳ ನಮೂನೆ</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                viewMode === 'cards' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>ಕಾರ್ಡ್ ವ್ಯೂವ್</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'junior_report' ? (
        <JuniorWinnersReport 
          initialClusterId={selectedClusterId}
        />
      ) : viewMode === 'senior_report' ? (
        <SeniorWinnersReport 
          initialClusterId={selectedClusterId}
        />
      ) : viewMode === 'gov_sheet' ? (
        <OfficialConsolidationSheet 
          initialClusterId={selectedClusterId}
          initialCategory={selectedCategory}
          initialMode="cluster_winners"
        />
      ) : (
        <>
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
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

          {filteredScores.length > 0 ? (
            <>
              {/* Podium Cards for Top 3 Winners */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                
                {/* 1st Place - Gold */}
                {firstPlace && (
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
                          ಎದೆ ಸಂಖ್ಯೆ: {firstPlace.chestNumber}
                        </span>
                        <h3 className="font-bold text-base text-slate-900 mt-1">
                          {firstPlace.studentNameKannada}
                        </h3>
                        <p className="text-xs text-slate-500">{firstPlace.schoolNameKannada}</p>
                      </div>

                      <div className="pt-2 border-t border-amber-200">
                        <p className="text-xs font-semibold text-amber-900">{firstPlace.eventNameKannada}</p>
                        <p className="text-lg font-extrabold text-amber-700 mt-0.5">{firstPlace.consolidatedAverage} / 10 ಅಂಕಗಳು</p>
                      </div>

                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಆಯ್ಕೆ</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2nd Place - Silver */}
                {secondPlace && (
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
                          {secondPlace.chestNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">
                          {secondPlace.studentNameKannada}
                        </h4>
                        <p className="text-xs text-slate-500">{secondPlace.schoolNameKannada}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-600">{secondPlace.eventNameKannada}</p>
                        <p className="text-base font-bold text-slate-800">{secondPlace.consolidatedAverage} / 10</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3rd Place - Bronze */}
                {thirdPlace && (
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
                          {thirdPlace.chestNumber}
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">
                          {thirdPlace.studentNameKannada}
                        </h4>
                        <p className="text-xs text-slate-500">{thirdPlace.schoolNameKannada}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-600">{thirdPlace.eventNameKannada}</p>
                        <p className="text-base font-bold text-slate-800">{thirdPlace.consolidatedAverage} / 10</p>
                      </div>
                    </div>
                  </div>
                )}

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
                        <th className="py-2.5 px-3 text-center">ಅಂತಿಮ ಅಂಕ (ಗರಿಷ್ಠ 10)</th>
                        <th className="py-2.5 px-3 text-center">ಫಲಿತಾಂಶ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {filteredScores.map((row, index) => (
                        <tr key={row.id || index} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-amber-900">
                            {row.rank === 1 ? '🥇 ಪ್ರಥಮ' : row.rank === 2 ? '🥈 ದ್ವಿತೀಯ' : row.rank === 3 ? '🥉 ತೃತೀಯ' : `${index + 1}ನೇ ಸ್ಥಾನ`}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{row.chestNumber}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{row.studentNameKannada}</td>
                          <td className="py-2.5 px-3">{row.schoolNameKannada}</td>
                          <td className="py-2.5 px-3">{row.eventNameKannada}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">{row.consolidatedAverage} / 10</td>
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
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-2">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">
                {activeCluster.nameKannada} ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ಇನ್ನೂ ಅಂಕಗಳ ಮೌಲ್ಯಮಾಪನ ನಡೆದಿಲ್ಲ
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                ನಿರ್ಣಾಯಕರು ತಮ್ಮ ಲಾಗಿನ್ ಮೂಲಕ ಸ್ಪರ್ಧೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಂಕಗಳನ್ನು ನಮೂದಿಸಿ ಸೇವ್ ಮಾಡಿದ ನಂತರ, ಇಲ್ಲಿ 1, 2 ಮತ್ತು 3ನೇ ಸ್ಥಾನ ಪಡೆದ ವಿಜೇತರ ವಿವರಗಳು ನೇರವಾಗಿ ಪ್ರದರ್ಶನಗೊಳ್ಳುತ್ತವೆ.
              </p>
            </div>
          )}
        </>
      )}

    </div>
  );
};
