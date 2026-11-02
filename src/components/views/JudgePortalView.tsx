import React, { useState } from 'react';
import { JUDGES, COMPETITION_EVENTS, OFFICIAL_INFO } from '../../data/mockData';
import { NavItemKey } from '../../types';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  ShieldAlert, 
  Sparkles,
  ClipboardCheck,
  UserCheck
} from 'lucide-react';

interface JudgePortalViewProps {
  onNavigateToMarks: (nav: NavItemKey) => void;
}

export const JudgePortalView: React.FC<JudgePortalViewProps> = ({ onNavigateToMarks }) => {
  const [selectedJudgeId, setSelectedJudgeId] = useState(JUDGES[0].id);
  const currentJudge = JUDGES.find(j => j.id === selectedJudgeId) || JUDGES[0];

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>ಅಧಿಕೃತ ತೀರ್ಪುಗಾರರ ಮಂಡಳಿ • {OFFICIAL_INFO.academicYear}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
            ನಿರ್ಣಾಯಕರ ಲಾಗಿನ್ ಹಾಗೂ ಮೌಲ್ಯಮಾಪನ ಕೋಶ
          </h2>
          <p className="text-xs text-amber-100 mt-1 max-w-2xl">
            ಸ್ಪರ್ಧೆಗಳ ನೇರ ಮೌಲ್ಯಮಾಪನ, ಎದೆ ಸಂಖ್ಯೆ ಆಧಾರಿತ ಅಂಕಗಳ ನಮೂದು ಹಾಗೂ ಅಧಿಕೃತ ಅಂಕಪಟ್ಟಿ ಸಲ್ಲಿಕೆ ವ್ಯವಸ್ಥೆ.
          </p>
        </div>

        {/* Live Active Judge Switcher */}
        <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs w-full md:w-auto">
          <label className="block text-amber-200 font-bold mb-1 text-[11px]">
            ಸಕ್ರಿಯ ತೀರ್ಪುಗಾರರ ಆಯ್ಕೆ (ಪರೀಕ್ಷಾರ್ಥ ಪ್ರವೇಶ):
          </label>
          <select
            value={selectedJudgeId}
            onChange={(e) => setSelectedJudgeId(e.target.value)}
            className="w-full bg-amber-900/90 text-white border border-amber-400/50 rounded-lg py-1.5 px-3 font-semibold focus:outline-none"
          >
            {JUDGES.map(j => (
              <option key={j.id} value={j.id}>
                {j.nameKannada} ({j.code} - {j.assignedClusterName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Judge Identity Card */}
      <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-xl ring-4 ring-amber-50">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">{currentJudge.nameKannada}</h3>
                <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                  {currentJudge.code}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">{currentJudge.designation}</p>
              <p className="text-xs text-slate-400 font-normal">{currentJudge.institution} • ಮೊಬೈಲ್: {currentJudge.phone}</p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-200 sm:pl-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">ನಿಯೋಜಿತ ಕೇಂದ್ರ</span>
            <span className="text-sm font-bold text-emerald-800 block mt-0.5">
              {currentJudge.assignedClusterName} ಕ್ಲಸ್ಟರ್
            </span>
            <span className="text-[11px] text-slate-500 font-medium">ಕೊಠಡಿ ಸಂಖ್ಯೆ: 02 (ಸಂಗೀತ & ರಂಗ ಸಭಾಂಗಣ)</span>
          </div>
        </div>

        {/* Assigned Events Ready for Scoring */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-amber-600" />
              <span>ನಿಮಗೆ ನಿಗದಿಪಡಿಸಲಾದ ಸ್ಪರ್ಧಾ ಪಟ್ಟಿ (Assigned Events)</span>
            </h4>
            <span className="text-xs text-slate-500 font-medium">ಒಟ್ಟು: {currentJudge.assignedEvents.length} ಸ್ಪರ್ಧೆಗಳು</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentJudge.assignedEvents.map((eventName, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-amber-800 mb-1">
                    <span>ಸ್ಪರ್ಧಾ ಕೋಡ್: EV-0{idx + 1}</span>
                    <span className="bg-amber-200/80 px-2 py-0.5 rounded-full">100 ಅಂಕಗಳು</span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900 leading-snug">{eventName}</h5>
                  <p className="text-xs text-slate-600 mt-1">ಭಾಗವಹಿಸುವ ಸ್ಪರ್ಧಿಗಳು: 12 ನೋಂದಾಯಿತರು</p>
                </div>

                <button
                  onClick={() => onNavigateToMarks('marks-entry')}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
                >
                  <span>ಅಂಕ ನಮೂದಿಗೆ ಹೋಗಿ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official 100 Marks Evaluation Rubric */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-600" />
          <span>ಅಧಿಕೃತ 100 ಅಂಕಗಳ ಮೌಲ್ಯಮಾಪನ ಮಾನದಂಡಗಳು (Evaluation Criteria)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xl font-extrabold text-purple-700">25 ಅಂಕಗಳು</span>
            <h5 className="font-bold text-slate-900">1. ಪ್ರಸ್ತುತಿ ಹಾಗೂ ಹಾವಭಾವ</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              ವೇದಿಕೆ ಉಪಸ್ಥಿತಿ, ವೇಷಭೂಷಣ, ಆತ್ಮವಿಶ್ವಾಸ ಮತ್ತು ಅಭಿವ್ಯಕ್ತಿ.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xl font-extrabold text-blue-700">30 ಅಂಕಗಳು</span>
            <h5 className="font-bold text-slate-900">2. ಶ್ರುತಿ / ಲಯ / ಉಚ್ಚಾರಣೆ</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              ಸ್ಪಷ್ಟ ಕನ್ನಡ ಉಚ್ಚಾರಣೆ, ಸಾಹಿತ್ಯ ಶುದ್ಧಿ, ರಾಗ ಮತ್ತು ತಾಳ ನಿಖರತೆ.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xl font-extrabold text-emerald-700">25 ಅಂಕಗಳು</span>
            <h5 className="font-bold text-slate-900">3. ಕಲಾತ್ಮಕತೆ ಮತ್ತು ವಿಷಯ</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              ವಿಷಯದ ಆಳ, ಸೃಜನಶೀಲತೆ, ಮೌಲ್ಯಯುತ ಸಂದೇಶ ಮತ್ತು ಶ್ರೇಷ್ಠತೆ.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-xl font-extrabold text-amber-700">20 ಅಂಕಗಳು</span>
            <h5 className="font-bold text-slate-900">4. ಸಮಯಪಾಲನೆ ಹಾಗೂ ಶಿಸ್ತು</h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              ನಿಗದಿತ ನಿಮಿಷಗಳ ನಿಯಮ ಪಾಲನೆ, ರಂಗಶಿಸ್ತು ಹಾಗೂ ನಿಯಮಾವಳಿ ನಿಷ್ಠೆ.
            </p>
          </div>
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>ಸೂಚನೆ:</strong> ಮೌಲ್ಯಮಾಪನ ಸಮಯದಲ್ಲಿ ಸ್ಪರ್ಧಿಯ ಹೆಸರು ಅಥವಾ ಶಾಲೆಯನ್ನು ಪರಿಗಣಿಸದೆ ಕೇವಲ ಎದೆ ಸಂಖ್ಯೆ (Chest No) ಆಧಾರದಲ್ಲಿ ಮಾತ್ರ ಅಂಕಗಳನ್ನು ನಮೂದಿಸಬೇಕು. ಅಂಕಗಳನ್ನು ನಮೂದಿಸಿದ ನಂತರ ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿ ಲಾಕ್ ಮಾಡಿ ಸಹಿ ಸಲ್ಲಿಸಬೇಕು.
          </span>
        </div>
      </div>

    </div>
  );
};
