import React, { useState } from 'react';
import { COMPETITION_EVENTS, CLUSTERS, CONSOLIDATED_RESULTS } from '../../data/mockData';
import { ScoreEntry, CompetitionCategory } from '../../types';
import { 
  FileCheck, 
  Trophy, 
  Sparkles, 
  Printer, 
  Download, 
  CheckCircle2, 
  Lock,
  Filter,
  Medal,
  Award
} from 'lucide-react';

export const MarksConsolidationView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategory>('junior');
  const [selectedEventId, setSelectedEventId] = useState('div1-ev-01');
  const [selectedClusterId, setSelectedClusterId] = useState('all');
  const [resultsList, setResultsList] = useState<ScoreEntry[]>(CONSOLIDATED_RESULTS);
  const [isLocked, setIsLocked] = useState(false);

  const eventsForSelectedCategory = COMPETITION_EVENTS.filter(e => e.categoryId === selectedCategory);
  const activeEvent = COMPETITION_EVENTS.find(e => e.id === selectedEventId) || eventsForSelectedCategory[0];

  const filteredResults = resultsList.filter(r => {
    const matchesEvent = r.eventId === selectedEventId;
    return matchesEvent;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 mb-1">
            <FileCheck className="w-3.5 h-3.5" />
            <span>ಬಹು-ತೀರ್ಪುಗಾರರ ಅಂಕಗಳ ಕ್ರೋಢೀಕರಣ ಹಾಗೂ ಶ್ರೇಯಾಂಕ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ಅಂಕಗಳ ಕ್ರೋಢೀಕರಣ (Marks Consolidation)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ಎಲ್ಲಾ ತೀರ್ಪುಗಾರರ ಅಂಕಗಳನ್ನು ಸಂಯೋಜಿಸಿ ಸರಾಸರಿ ಅಂಕ ಹಾಗೂ ಅಧಿಕೃತ ರ್ಯಾಂಕ್ (1, 2, 3) ನಿರ್ಧಾರ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition"
          >
            <Printer className="w-4 h-4" />
            <span>ಕ್ರೋಢೀಕೃತ ರಿಜಿಸ್ಟರ್ ಮುದ್ರಿಸಿ</span>
          </button>
        </div>
      </div>

      {/* Division Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'junior', label: 'ವಿಭಾಗ 1: ಕಿರಿಯ ವಿಭಾಗ (1-4)' },
          { id: 'senior', label: 'ವಿಭಾಗ 2: ಹಿರಿಯ ವಿಭಾಗ (5-7)' },
          { id: 'high_school', label: 'ವಿಭಾಗ 3: ಪ್ರೌಢ ವಿಭಾಗ (8-12)' },
        ].map((divTab) => (
          <button
            key={divTab.id}
            onClick={() => {
              const cat = divTab.id as CompetitionCategory;
              setSelectedCategory(cat);
              const matching = COMPETITION_EVENTS.filter(e => e.categoryId === cat);
              if (matching.length > 0) setSelectedEventId(matching[0].id);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedCategory === divTab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {divTab.label}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ಸ್ಪರ್ಧಾ ವಿಷಯ ({eventsForSelectedCategory.length} ಅಧಿಕೃತ ಸ್ಪರ್ಧೆಗಳು):
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            {eventsForSelectedCategory.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.nameKannada} {ev.isGroupEvent ? '(ಸಾಮೂಹಿಕ)' : '(ವೈಯಕ್ತಿಕ)'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ಕ್ಲಸ್ಟರ್ ವ್ಯಾಪ್ತಿ (25 ಕ್ಲಸ್ಟರ್‌ಗಳು):</label>
          <select
            value={selectedClusterId}
            onChange={(e) => setSelectedClusterId(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್‌ಗಳು</option>
            {CLUSTERS.map(c => (
              <option key={c.id} value={c.id}>{c.nameKannada} ಕ್ಲಸ್ಟರ್ ({c.code})</option>
            ))}
          </select>
        </div>

        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 flex flex-col justify-center">
          <span className="text-xs font-bold text-emerald-950 flex items-center gap-1">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>ಅಧಿಕೃತ ಆಯ್ಕೆ ನಿಯಮಾವಳಿ</span>
          </span>
          <span className="text-[11px] text-emerald-800 mt-0.5">
            ಕ್ಲಸ್ಟರ್ ಹಂತದಲ್ಲಿ <strong>ಪ್ರಥಮ ಸ್ಥಾನ (1st Rank)</strong> ಪಡೆದ ಸ್ಪರ್ಧಿ ಮಾತ್ರ ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಅರ್ಹ.
          </span>
        </div>
      </div>

      {/* Consolidation Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">ರ್ಯಾಂಕ್</th>
              <th className="py-3 px-3">ಎದೆ ಸಂಖ್ಯೆ</th>
              <th className="py-3 px-3">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
              <th className="py-3 px-3">ಶಾಲೆಯ ಹೆಸರು</th>
              <th className="py-3 px-3">ಕ್ಲಸ್ಟರ್</th>
              <th className="py-3 px-3 text-center">ನಿರ್ಣಾಯಕರು 1</th>
              <th className="py-3 px-3 text-center">ನಿರ್ಣಾಯಕರು 2</th>
              <th className="py-3 px-3 text-center font-extrabold text-slate-900 bg-amber-50">
                ಸರಾಸರಿ ಅಂಕ (100)
              </th>
              <th className="py-3 px-3 text-center">ತಾಲೂಕು ಅರ್ಹತೆ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredResults.map((item) => {
              const j1 = item.judgeScores[0]?.total || 0;
              const j2 = item.judgeScores[1]?.total || j1;
              return (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3">
                    {item.rank === 1 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                        <Medal className="w-3.5 h-3.5 text-amber-600" />
                        <span>ಪ್ರಥಮ (1st)</span>
                      </span>
                    )}
                    {item.rank === 2 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-800">
                        <span>ದ್ವಿತೀಯ (2nd)</span>
                      </span>
                    )}
                    {item.rank === 3 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900">
                        <span>ತೃತೀಯ (3rd)</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-900 text-sm">
                    {item.chestNumber}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">{item.studentNameKannada}</td>
                  <td className="py-3 px-3 text-slate-700">{item.schoolNameKannada}</td>
                  <td className="py-3 px-3 font-semibold text-slate-800">{item.clusterNameKannada}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-purple-800">{j1}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-blue-800">{j2}</td>
                  <td className="py-3 px-3 text-center font-extrabold text-slate-900 bg-amber-50/70 text-sm">
                    {item.consolidatedAverage.toFixed(1)}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.qualifiedForTaluk ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>ಆಯ್ಕೆಯಾಗಿದ್ದಾರೆ</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">ಅರ್ಹವಾಗಿಲ್ಲ</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Lock and Finalize Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>ಎಲ್ಲಾ ಅಂಕಗಳು ತೀರ್ಪುಗಾರರ ಮಂಡಳಿಯಿಂದ ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿವೆ.</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLocked(true)}
            disabled={isLocked}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs shadow-xs transition ${
              isLocked
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isLocked ? 'ಫಲಿತಾಂಶ ಲಾಕ್ ಮಾಡಲಾಗಿದೆ' : 'ಫಲಿತಾಂಶ ಅಂತಿಮಗೊಳಿಸಿ ಲಾಕ್ ಮಾಡಿ'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
