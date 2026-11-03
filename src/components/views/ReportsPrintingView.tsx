import React, { useState } from 'react';
import { OFFICIAL_INFO, CLUSTERS, COMPETITION_EVENTS, STUDENTS, CONSOLIDATED_RESULTS } from '../../data/mockData';
import { 
  Printer, 
  FileText, 
  Download, 
  Layers, 
  CreditCard, 
  Trophy, 
  Calendar, 
  Building,
  CheckCircle2,
  Filter
} from 'lucide-react';

import { SeniorWinnersReport } from '../reports/SeniorWinnersReport';
import { JuniorWinnersReport } from '../reports/JuniorWinnersReport';

export const ReportsPrintingView: React.FC = () => {
  const [selectedReportType, setSelectedReportType] = useState<'junior_winners' | 'senior_winners' | 'tabulation' | 'winners' | 'admit' | 'schedule'>('junior_winners');
  const [selectedCluster, setSelectedCluster] = useState(CLUSTERS[0].id);

  const activeCluster = CLUSTERS.find(c => c.id === selectedCluster) || CLUSTERS[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 mb-1">
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>ಅಧಿಕೃತ ದಾಖಲಾತಿ ಹಾಗೂ ಮುದ್ರಣ ಕೋಶ</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ವರದಿಗಳು ಮತ್ತು ಮುದ್ರಣ (Reports & Printing)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026-27 ಎಲ್ಲಾ ನಮೂನೆಗಳು, ಅಂಕಪಟ್ಟಿಗಳು ಹಾಗೂ ಪ್ರಮಾಣಪತ್ರಗಳ ಮುದ್ರಣ
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-md transition"
        >
          <Printer className="w-4 h-4 text-amber-400" />
          <span>ಮುದ್ರಣ ಆದೇಶ ನೀಡಿ (Print Document)</span>
        </button>
      </div>

      {/* Report Format Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          { id: 'junior_winners', label: '1. ಕಿರಿಯ ವಿಭಾಗದ ವಿಜೇತರು', sub: 'ಚಿತ್ರದಂತೆ ನಮೂನೆ (1-4)', icon: Trophy, isNew: true },
          { id: 'senior_winners', label: '2. ಹಿರಿಯ ವಿಭಾಗದ ವಿಜೇತರು', sub: 'ಚಿತ್ರದಂತೆ ನಮೂನೆ (5-7)', icon: Trophy, isNew: true },
          { id: 'tabulation', label: '3. ಅಂಕ ಕ್ರೋಢೀಕರಣ ರಿಜಿಸ್ಟರ್', sub: 'Multi-Judge Tabulation', icon: FileText },
          { id: 'winners', label: '4. ವಿಜೇತರ ಅಂತಿಮ ಪಟ್ಟಿ', sub: 'Cluster Winner Roster', icon: Layers },
          { id: 'admit', label: '5. ಪ್ರವೇಶ ಪತ್ರಗಳ ಕಟ್ಟು', sub: 'Admit Cards Batch', icon: CreditCard },
          { id: 'schedule', label: '6. ವೇಳಾಪಟ್ಟಿ & ಕೊಠಡಿ', sub: 'Schedule & Rooms', icon: Calendar },
        ].map((rep) => {
          const Icon = rep.icon;
          const isActive = selectedReportType === rep.id;
          return (
            <button
              key={rep.id}
              onClick={() => setSelectedReportType(rep.id as any)}
              className={`p-3.5 rounded-xl text-left border transition relative cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-amber-600'}`} />
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                {rep.isNew && !isActive && (
                  <span className="text-[9px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.5 rounded-full">
                    ಅಧಿಕೃತ
                  </span>
                )}
              </div>
              <p className="font-bold text-xs leading-tight">{rep.label}</p>
              <p className={`text-[10px] mt-0.5 ${isActive ? 'text-amber-100' : 'text-slate-400'}`}>
                {rep.sub}
              </p>
            </button>
          );
        })}
      </div>

      {/* Filter Options */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-slate-700">ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ:</label>
          <select
            value={selectedCluster}
            onChange={(e) => setSelectedCluster(e.target.value)}
            className="py-1.5 px-3 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-semibold"
          >
            {CLUSTERS.map(c => (
              <option key={c.id} value={c.id}>{c.nameKannada} ಕ್ಲಸ್ಟರ್</option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          A4 ಸೈಜ್ ಪೋರ್ಟ್ರೇಟ್ / ಲ್ಯಾಂಡ್‌ಸ್ಕೇಪ್ ಪ್ರಿಂಟ್‌ಗೆ ಸಿದ್ಧಪಡಿಸಲಾಗಿದೆ.
        </div>
      </div>

      {/* Printable Sheet Canvas Preview or Isolated Official Reports */}
      {selectedReportType === 'junior_winners' ? (
        <JuniorWinnersReport initialClusterId={selectedCluster} />
      ) : selectedReportType === 'senior_winners' ? (
        <SeniorWinnersReport initialClusterId={selectedCluster} />
      ) : (
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Document Header in Print */}
        <div className="text-center border-b-2 border-slate-800 pb-4 space-y-1">
          <span className="text-xs font-bold text-red-700 uppercase tracking-widest">
            ಕರ್ನಾಟಕ ಸರ್ಕಾರ • ಶಾಲಾ ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಕ್ಷರತಾ ಇಲಾಖೆ
          </span>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            {OFFICIAL_INFO.officeKannada}
          </h2>
          <p className="text-xs font-bold text-amber-800">
            {OFFICIAL_INFO.eventNameKannada}
          </p>
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium pt-2 border-t border-slate-200 mt-2">
            <span>ಕ್ಲಸ್ಟರ್: <strong>{activeCluster.nameKannada}</strong></span>
            <span>ಶೈಕ್ಷಣಿಕ ವರ್ಷ: <strong>{OFFICIAL_INFO.academicYear}</strong></span>
            <span>ದಿನಾಂಕ: <strong>{new Date().toLocaleDateString('kn-IN')}</strong></span>
          </div>
        </div>

        {/* Dynamic Content based on selectedReportType */}
        {selectedReportType === 'tabulation' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase">
              ಅಧಿಕೃತ ಅಂಕ ಕ್ರೋಢೀಕರಣ ಮತ್ತು ತೀರ್ಪುಗಾರರ ಮೌಲ್ಯಮಾಪನ ದಾಖಲಾತಿ ವಹಿ (Tabulation Register)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="border border-slate-300 p-2">ಎದೆ ಸಂಖ್ಯೆ</th>
                    <th className="border border-slate-300 p-2">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
                    <th className="border border-slate-300 p-2">ಶಾಲೆಯ ಹೆಸರು</th>
                    <th className="border border-slate-300 p-2">ಸ್ಪರ್ಧಾ ವಿಷಯ</th>
                    <th className="border border-slate-300 p-2 text-center">ನಿರ್ಣಾಯಕರು 1</th>
                    <th className="border border-slate-300 p-2 text-center">ನಿರ್ಣಾಯಕರು 2</th>
                    <th className="border border-slate-300 p-2 text-center">ಸರಾಸರಿ ಅಂಕ (ಗರಿಷ್ಠ 10)</th>
                    <th className="border border-slate-300 p-2 text-center">ಶ್ರೇಯಾಂಕ</th>
                  </tr>
                </thead>
                <tbody>
                  {CONSOLIDATED_RESULTS.map((r) => (
                    <tr key={r.id} className="border-b border-slate-200">
                      <td className="border border-slate-300 p-2 font-mono font-bold">{r.chestNumber}</td>
                      <td className="border border-slate-300 p-2 font-semibold">{r.studentNameKannada}</td>
                      <td className="border border-slate-300 p-2 text-slate-600">{r.schoolNameKannada}</td>
                      <td className="border border-slate-300 p-2">{r.eventNameKannada}</td>
                      <td className="border border-slate-300 p-2 text-center">{r.judgeScores[0]?.total}</td>
                      <td className="border border-slate-300 p-2 text-center">{r.judgeScores[1]?.total || r.judgeScores[0]?.total}</td>
                      <td className="border border-slate-300 p-2 text-center font-bold">{r.consolidatedAverage} / 10</td>
                      <td className="border border-slate-300 p-2 text-center font-bold">
                        {r.rank === 1 ? 'ಪ್ರಥಮ (1st)' : r.rank === 2 ? 'ದ್ವಿತೀಯ (2nd)' : 'ತೃತೀಯ (3rd)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReportType === 'winners' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase">
              ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಅಧಿಕೃತ ವಿಜೇತರ ಅಂತಿಮ ಪಟ್ಟಿ (Official Winners Roster)
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="border border-slate-300 p-2">ಸ್ಥಾನ</th>
                    <th className="border border-slate-300 p-2">ಎದೆ ಸಂಖ್ಯೆ</th>
                    <th className="border border-slate-300 p-2">ಸ್ಪರ್ಧಿಯ ಹೆಸರು</th>
                    <th className="border border-slate-300 p-2">ಶಾಲೆ & ಕ್ಲಸ್ಟರ್</th>
                    <th className="border border-slate-300 p-2">ಸ್ಪರ್ಧೆ</th>
                    <th className="border border-slate-300 p-2 text-center">ತಾಲೂಕು ಹಂತದ ಅರ್ಹತೆ</th>
                  </tr>
                </thead>
                <tbody>
                  {CONSOLIDATED_RESULTS.map((w) => (
                    <tr key={w.id} className="border-b border-slate-200">
                      <td className="border border-slate-300 p-2 font-bold">
                        {w.rank === 1 ? '🥇 ಪ್ರಥಮ' : w.rank === 2 ? '🥈 ದ್ವಿತೀಯ' : '🥉 ತೃತೀಯ'}
                      </td>
                      <td className="border border-slate-300 p-2 font-mono font-bold">{w.chestNumber}</td>
                      <td className="border border-slate-300 p-2 font-bold">{w.studentNameKannada}</td>
                      <td className="border border-slate-300 p-2">{w.schoolNameKannada}</td>
                      <td className="border border-slate-300 p-2">{w.eventNameKannada}</td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-emerald-800">
                        {w.qualifiedForTaluk ? 'ಆಯ್ಕೆಯಾಗಿದೆ' : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReportType === 'admit' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase">
              ವಿದ್ಯಾರ್ಥಿ ಪ್ರವೇಶ ಪತ್ರಗಳ ಸಾರಾಂಶ (Admit Cards Roster for Printing)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STUDENTS.slice(0, 4).map((st) => (
                <div key={st.id} className="p-3 border-2 border-dashed border-slate-300 rounded-xl space-y-1.5 text-xs">
                  <div className="flex items-center justify-between border-b pb-1">
                    <span className="font-bold text-amber-900">{st.chestNumber}</span>
                    <span className="text-[10px] text-slate-500">SATS: {st.satsId}</span>
                  </div>
                  <p className="font-bold text-slate-900">{st.nameKannada}</p>
                  <p className="text-slate-600 text-[11px]">{st.schoolNameKannada}</p>
                  <p className="text-slate-700 font-semibold">{st.eventNameKannada}</p>
                  {st.secondaryEventNameKannada && (
                    <p className="text-blue-700 font-medium text-[10px]">+ {st.secondaryEventNameKannada}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReportType === 'schedule' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase">
              ಸ್ಪರ್ಧಾ ವೇಳಾಪಟ್ಟಿ ಹಾಗೂ ಕೊಠಡಿ ನಿಯೋಜನೆ (Timetable & Room Schedule)
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span>ಕೊಠಡಿ 01 (ಮುಖ್ಯ ಸಭಾಂಗಣ): <strong>ಭಾವಗೀತೆ, ಭಕ್ತಿಗೀತೆ, ಶಾಸ್ತ್ರೀಯ ಗಾಯನ</strong></span>
                <span className="font-bold">ಬೆಳಿಗ್ಗೆ 09:30 ರಿಂದ 01:00</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span>ಕೊಠಡಿ 02 (ರಂಗ ಮಂದಿರ): <strong>ಏಕಪಾತ್ರಾಭಿನಯ, ನಾಟಕ, ಜಾನಪದ ನೃತ್ಯ</strong></span>
                <span className="font-bold">ಬೆಳಿಗ್ಗೆ 10:00 ರಿಂದ 01:30</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between">
                <span>ಕೊಠಡಿ 03 (ಕಲಾ ಕೊಠಡಿ): <strong>ಚಿತ್ರಕಲೆ, ಕ್ಲೇ ಮಾಡೆಲಿಂಗ್, ರಂಗೋಲಿ</strong></span>
                <span className="font-bold">ಮಧ್ಯಾಹ್ನ 02:00 ರಿಂದ 04:30</span>
              </div>
            </div>
          </div>
        )}

        {/* Signatures at the bottom */}
        <div className="pt-10 grid grid-cols-3 text-center text-xs text-slate-800 font-bold border-t border-slate-300">
          <div>
            <p className="h-8" />
            <p className="border-t border-slate-400 pt-1">ತೀರ್ಪುಗಾರರ ಸಹಿ</p>
          </div>
          <div>
            <p className="h-8" />
            <p className="border-t border-slate-400 pt-1">ಸಿ.ಆರ್.ಪಿ (ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ)</p>
          </div>
          <div>
            <p className="h-8" />
            <p className="border-t border-slate-400 pt-1">ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳು / ಬಿ.ಆರ್.ಸಿ</p>
          </div>
        </div>

      </div>
      )}

    </div>
  );
};
