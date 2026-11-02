import React, { useState } from 'react';
import { COMPETITION_EVENTS, CLUSTERS, STUDENTS } from '../../data/mockData';
import { CompetitionCategory } from '../../types';
import { 
  ClipboardList, 
  CheckCircle2, 
  Lock, 
  Printer, 
  Sparkles, 
  Save, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface ParticipantMarkState {
  chestNumber: string;
  studentName: string;
  schoolName: string;
  c1: number; // Presentation (max 25)
  c2: number; // Melody / Pronunciation (max 30)
  c3: number; // Artistry / Content (max 25)
  c4: number; // Time & Discipline (max 20)
  remarks: string;
  locked: boolean;
}

export const MarksEntryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategory>('junior');
  const [selectedEventId, setSelectedEventId] = useState('div1-ev-01');
  const [selectedClusterId, setSelectedClusterId] = useState(CLUSTERS[0].id);
  const [anonymousMode, setAnonymousMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Events filtered strictly for selected division
  const eventsForSelectedCategory = COMPETITION_EVENTS.filter(e => e.categoryId === selectedCategory);

  // Initial mock scores list for the current event
  const [marksData, setMarksData] = useState<ParticipantMarkState[]>([
    { chestNumber: 'HB-201', studentName: 'ಕುಮಾರಿ ಸನ್ನಿಧಿ ಮಲ್ಲಿಕಾರ್ಜುನ ಪಾಟೀಲ', schoolName: 'ಸ.ಹಿ.ಪ್ರಾ.ಶಾಲೆ ಹಿರೇಬಾಗೇವಾಡಿ', c1: 24, c2: 29, c3: 24, c4: 20, remarks: 'ಅತ್ಯುತ್ತಮ ರಾಗ ಮತ್ತು ಭಾವಪೂರ್ಣ ಪ್ರಸ್ತುತಿ', locked: false },
    { chestNumber: 'MR-201', studentName: 'ಕುಮಾರಿ ಪ್ರೇರಣಾ ಮಹಾಂತೇಶ ಚೌಗುಲೆ', schoolName: 'ಸರ್ಕಾರಿ ಸಂಯುಕ್ತ ಪ.ಪೂ ಕಾಲೇಜು ಮಾರಿಹಾಳ', c1: 22, c2: 27, c3: 22, c4: 19, remarks: 'ಉತ್ತಮ ಶ್ರುತಿ ಮತ್ತು ಲಯಬದ್ಧತೆ', locked: false },
    { chestNumber: 'SB-201', studentName: 'ಕುಮಾರ ಕಾರ್ತಿಕ ಈಶ್ವರ ಬಡಿಗೇರ', schoolName: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಸುಳೇಭಾವಿ', c1: 21, c2: 25, c3: 21, c4: 18, remarks: 'ಉತ್ತಮ ಪ್ರಯತ್ನ', locked: false },
    { chestNumber: 'KD-201', studentName: 'ಕುಮಾರಿ ದೀಪಾ ಆನಂದ ದೇಶಪಾಂಡೆ', schoolName: 'ಕರ್ನಾಟಕ ಪಬ್ಲಿಕ್ ಶಾಲೆ ಕಡೋಲಿ', c1: 23, c2: 26, c3: 22, c4: 19, remarks: 'ಭಾವಪೂರ್ಣ ಗಾಯನ', locked: false },
    { chestNumber: 'KK-201', studentName: 'ಕುಮಾರ ಗಣೇಶ ರಮೇಶ ಕುಂಬಾರ', schoolName: 'ಸರ್ಕಾರಿ ಮಾದರಿ ಪ್ರಾಥಮಿಕ ಶಾಲೆ ಕಾಕತಿ', c1: 20, c2: 24, c3: 20, c4: 18, remarks: 'ಉತ್ತಮ ಸಮಯಪಾಲನೆ', locked: false },
  ]);

  const activeEvent = COMPETITION_EVENTS.find(e => e.id === selectedEventId) || COMPETITION_EVENTS[0];
  const activeCluster = CLUSTERS.find(c => c.id === selectedClusterId) || CLUSTERS[0];

  const handleScoreChange = (chestNumber: string, field: 'c1' | 'c2' | 'c3' | 'c4', val: string) => {
    const num = Math.max(0, parseInt(val) || 0);
    setMarksData(prev =>
      prev.map(item => {
        if (item.chestNumber === chestNumber && !item.locked) {
          return { ...item, [field]: num };
        }
        return item;
      })
    );
    setIsSaved(false);
  };

  const handleRemarksChange = (chestNumber: string, remarks: string) => {
    setMarksData(prev =>
      prev.map(item =>
        item.chestNumber === chestNumber && !item.locked ? { ...item, remarks } : item
      )
    );
    setIsSaved(false);
  };

  const handleSaveMarks = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleLockAllMarks = () => {
    setMarksData(prev => prev.map(item => ({ ...item, locked: true })));
    setIsSaved(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 mb-1">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>ನೇರ ಮೌಲ್ಯಮಾಪನ ಶೀಟ್ (Live Scoring Sheet)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ಅಂಕಗಳ ನಮೂದು (Marks Entry)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ತೀರ್ಪುಗಾರರಿಂದ ಎದೆ ಸಂಖ್ಯೆ ಆಧಾರಿತ ನಾಲ್ಕು ಮಾನದಂಡಗಳ ಲೈವ್ ಅಂಕ ನಮೂದು ಮತ್ತು ಸಲ್ಲಿಕೆ
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setAnonymousMode(!anonymousMode)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition"
          >
            {anonymousMode ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
            <span>{anonymousMode ? 'ಹೆಸರು ತೋರಿಸಿ' : 'ಅನಾಮಧೇಯ ಮೋಡ್ (ಕೇವಲ ಎದೆ ಸಂಖ್ಯೆ)'}</span>
          </button>
          
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300 transition"
          >
            <Printer className="w-4 h-4" />
            <span>ಅಂಕಪಟ್ಟಿ ಮುದ್ರಿಸಿ</span>
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
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {divTab.label}
          </button>
        ))}
      </div>

      {/* Event and Cluster Selectors Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ಸ್ಪರ್ಧಾ ವಿಷಯ ಆಯ್ಕೆ ({eventsForSelectedCategory.length} ಅಧಿಕೃತ ಸ್ಪರ್ಧೆಗಳು):
          </label>
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-amber-500"
          >
            {eventsForSelectedCategory.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.nameKannada} {ev.isGroupEvent ? '(ಸಾಮೂಹಿಕ)' : '(ವೈಯಕ್ತಿಕ)'}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ (25 ಕ್ಲಸ್ಟರ್‌ಗಳು):</label>
          <select
            value={selectedClusterId}
            onChange={(e) => setSelectedClusterId(e.target.value)}
            className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-amber-500"
          >
            {CLUSTERS.map(c => (
              <option key={c.id} value={c.id}>
                {c.nameKannada} ಕ್ಲಸ್ಟರ್ ({c.code})
              </option>
            ))}
          </select>
        </div>

        <div className="bg-amber-100/60 p-3 rounded-lg border border-amber-200 flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span>ಗರಿಷ್ಠ ಅಂಕಗಳು: 100</span>
            <span>ಸಮಯ: {activeEvent.timeLimitMinutes} ನಿಮಿಷ</span>
          </div>
          <span className="text-[11px] text-amber-800 font-medium mt-0.5">
            ಮಾನದಂಡಗಳು: 25 + 30 + 25 + 20 = 100
          </span>
        </div>
      </div>

      {/* Feedback Banner */}
      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>ಅಂಕಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ! ಅಂತಿಮ ಕ್ರೋಢೀಕರಣಕ್ಕೆ ಅಂಕಗಳು ಲಭ್ಯವಿರುತ್ತವೆ.</span>
        </div>
      )}

      {/* Marks Scoring Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
            <tr>
              <th className="py-3 px-3">ಎದೆ ಸಂಖ್ಯೆ</th>
              {!anonymousMode && <th className="py-3 px-3">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು & ಶಾಲೆ</th>}
              <th className="py-3 px-3 text-center">
                <span>ಪ್ರಸ್ತುತಿ</span>
                <span className="block text-[10px] text-purple-700 font-normal">(ಗರಿಷ್ಠ 25)</span>
              </th>
              <th className="py-3 px-3 text-center">
                <span>ಶ್ರುತಿ / ಉಚ್ಚಾರಣೆ</span>
                <span className="block text-[10px] text-blue-700 font-normal">(ಗರಿಷ್ಠ 30)</span>
              </th>
              <th className="py-3 px-3 text-center">
                <span>ಕಲಾತ್ಮಕತೆ</span>
                <span className="block text-[10px] text-emerald-700 font-normal">(ಗರಿಷ್ಠ 25)</span>
              </th>
              <th className="py-3 px-3 text-center">
                <span>ಸಮಯಪಾಲನೆ</span>
                <span className="block text-[10px] text-amber-700 font-normal">(ಗರಿಷ್ಠ 20)</span>
              </th>
              <th className="py-3 px-3 text-center font-extrabold text-slate-900">
                <span>ಒಟ್ಟು ಅಂಕಗಳು</span>
                <span className="block text-[10px] text-slate-500 font-normal">(100 ರಲ್ಲಿ)</span>
              </th>
              <th className="py-3 px-3">ತೀರ್ಪುಗಾರರ ಅಭಿಪ್ರಾಯ</th>
              <th className="py-3 px-3 text-center">ಸ್ಥಿತಿ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {marksData.map((row) => {
              const total = (row.c1 || 0) + (row.c2 || 0) + (row.c3 || 0) + (row.c4 || 0);
              return (
                <tr key={row.chestNumber} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-amber-900 text-sm">
                    {row.chestNumber}
                  </td>

                  {!anonymousMode && (
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{row.studentName}</p>
                      <p className="text-[11px] text-slate-400 font-normal">{row.schoolName}</p>
                    </td>
                  )}

                  {/* Criteria 1 */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="25"
                      disabled={row.locked}
                      value={row.c1}
                      onChange={(e) => handleScoreChange(row.chestNumber, 'c1', e.target.value)}
                      className="w-16 py-1 px-2 text-center text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:bg-slate-100"
                    />
                  </td>

                  {/* Criteria 2 */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      disabled={row.locked}
                      value={row.c2}
                      onChange={(e) => handleScoreChange(row.chestNumber, 'c2', e.target.value)}
                      className="w-16 py-1 px-2 text-center text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                    />
                  </td>

                  {/* Criteria 3 */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="25"
                      disabled={row.locked}
                      value={row.c3}
                      onChange={(e) => handleScoreChange(row.chestNumber, 'c3', e.target.value)}
                      className="w-16 py-1 px-2 text-center text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100"
                    />
                  </td>

                  {/* Criteria 4 */}
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      disabled={row.locked}
                      value={row.c4}
                      onChange={(e) => handleScoreChange(row.chestNumber, 'c4', e.target.value)}
                      className="w-16 py-1 px-2 text-center text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100"
                    />
                  </td>

                  {/* Total */}
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-3 py-1 rounded-lg bg-amber-50 text-amber-900 font-extrabold text-sm border border-amber-200">
                      {total}
                    </span>
                  </td>

                  {/* Remarks */}
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      disabled={row.locked}
                      placeholder="ಷರಾ / ಅಭಿಪ್ರಾಯ..."
                      value={row.remarks}
                      onChange={(e) => handleRemarksChange(row.chestNumber, e.target.value)}
                      className="w-full py-1 px-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg disabled:bg-slate-100"
                    />
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-center">
                    {row.locked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" />
                        <span>ಲಾಕ್ ಆಗಿದೆ</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span>ನಮೂದು</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="text-xs text-slate-500">
          * ಒಟ್ಟು 100 ಅಂಕಗಳಲ್ಲಿ ನೀಡಲಾದ ಅಂಕಗಳ ಆಧಾರದಲ್ಲಿ ಮುಂದಿನ ಹಂತದಲ್ಲಿ <strong>ಅಂಕಗಳ ಕ್ರೋಢೀಕರಣ</strong> ಮಾಡಲಾಗುತ್ತದೆ.
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveMarks}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>ಅಂಕಗಳನ್ನು ಉಳಿಸಿ (Save Draft)</span>
          </button>

          <button
            onClick={handleLockAllMarks}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Lock className="w-4 h-4" />
            <span>ಅಂಕಗಳನ್ನು ಅಂತಿಮಗೊಳಿಸಿ ಲಾಕ್ ಮಾಡಿ</span>
          </button>
        </div>
      </div>

    </div>
  );
};
