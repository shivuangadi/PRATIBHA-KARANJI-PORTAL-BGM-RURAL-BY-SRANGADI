import React from 'react';
import { UserRole, NavItemKey } from '../../types';
import { OFFICIAL_INFO, CLUSTERS, STUDENTS, COMPETITION_EVENTS, JUDGES, CONSOLIDATED_RESULTS } from '../../data/mockData';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  ArrowRight,
  TrendingUp,
  School,
  Sparkles
} from 'lucide-react';

interface OverviewViewProps {
  currentRole: UserRole;
  onNavigate: (nav: NavItemKey) => void;
  selectedClusterId: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ currentRole, onNavigate, selectedClusterId }) => {
  const activeCluster = CLUSTERS.find(c => c.id === selectedClusterId);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ಅಧಿಕೃತ ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ • {OFFICIAL_INFO.academicYear}</span>
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight">
            {OFFICIAL_INFO.titleKannada}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
            {OFFICIAL_INFO.officeKannada}
          </p>
          {activeCluster && (
            <p className="text-xs font-bold text-amber-200 mt-2 bg-black/20 inline-block px-2.5 py-1 rounded">
              ಪ್ರಸ್ತುತ ಸಕ್ರಿಯ ಕ್ಲಸ್ಟರ್: {activeCluster.nameKannada} ({activeCluster.code})
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('student-registration')}
            className="px-3.5 py-2 rounded-xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-bold shadow-xs transition"
          >
            + ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ
          </button>
          <button
            onClick={() => onNavigate('reports-printing')}
            className="px-3.5 py-2 rounded-xl bg-amber-800 text-white hover:bg-amber-900 text-xs font-bold shadow-xs transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>ವರದಿಗಳು / ಮುದ್ರಣ</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ಒಟ್ಟು ಕ್ಲಸ್ಟರ್‌ಗಳು</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{CLUSTERS.length}</p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ವಲಯ</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ನೋಂದಾಯಿತ ಶಾಲೆಗಳು</span>
            <School className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">342</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">ಸರ್ಕಾರಿ, ಅನುದಾನಿತ ಹಾಗೂ ಖಾಸಗಿ</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ಒಟ್ಟು ವಿದ್ಯಾರ್ಥಿ ಸ್ಪರ್ಧಿಗಳು</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">2,485</p>
          <p className="text-[11px] text-blue-700 font-medium mt-1">SATS ಆಧಾರಿತ ಖಚಿತ ನೋಂದಣಿ</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ನೇಮಕಗೊಂಡ ನಿರ್ಣಾಯಕರು</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{JUDGES.length * 7}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">ವಿಷಯ ತಜ್ಞರ ಸಮಿತಿ</p>
        </div>
      </div>

      {/* Role specific quick guidance cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Key Stages Status */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600" />
              <span>ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026–27 ವೇಳಾಪಟ್ಟಿ ಪ್ರಗತಿ</span>
            </h3>
            <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              ಚಾಲ್ತಿಯಲ್ಲಿದೆ
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-bold text-emerald-950">ಹಂತ 1: ಶಾಲಾ ಮಟ್ಟದ ಪ್ರತಿಭಾ ಕಾರಂಜಿ</p>
                <p className="text-emerald-800">ಎಲ್ಲಾ ಶಾಲೆಗಳಲ್ಲಿ ಶಾಲಾ ಹಂತದ ಸ್ಪರ್ಧೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ಮುಕ್ತಾಯಗೊಂಡಿವೆ.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200">
              <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs">
                <p className="font-bold text-amber-950">ಹಂತ 2: ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಸ್ಪರ್ಧೆಗಳು (ಪ್ರಸ್ತುತ ಹಂತ)</p>
                <p className="text-amber-800">25 ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರಗಳಲ್ಲಿ ಸ್ಪರ್ಧೆಗಳು ನಡೆಯುತ್ತಿದ್ದು, ಲೈವ್ ಅಂಕ ನಮೂದು ಪ್ರಕ್ರಿಯೆ ಚಾಲ್ತಿಯಲ್ಲಿದೆ.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 opacity-80">
              <div className="w-4 h-4 rounded-full bg-slate-400 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">ಹಂತ 3: ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು ಮಟ್ಟದ ಸ್ಪರ್ಧೆ</p>
                <p className="text-slate-600">ಕ್ಲಸ್ಟರ್ ಹಂತದ ಪ್ರಥಮ ವಿಜೇತರಿಗೆ ದಿನಾಂಕ 15 ಡಿಸೆಂಬರ್ 2026 ರಿಂದ ಆರಂಭವಾಗಲಿದೆ.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Quick Navigation Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span>ತ್ವರಿತ ನಿರ್ವಹಣಾ ಶಾರ್ಟ್‌ಕಟ್‌ಗಳು</span>
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">ಅಧಿಕೃತ ಮಾಡ್ಯೂಲ್‌ಗಳು</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <button
              onClick={() => onNavigate('crp-registration')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 transition group"
            >
              <p className="font-bold text-slate-800 group-hover:text-purple-800">1. ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿಗಳು</p>
            </button>

            <button
              onClick={() => onNavigate('school-registration')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition group"
            >
              <p className="font-bold text-slate-800 group-hover:text-blue-800">2. ಶಾಲೆ ನೋಂದಣಿ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">DISE ಕೋಡ್ ಪರಿಶೀಲನೆ</p>
            </button>

            <button
              onClick={() => onNavigate('judge-appointment')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 transition group"
            >
              <p className="font-bold text-slate-800 group-hover:text-amber-800">3. ನಿರ್ಣಾಯಕರ ನೇಮಕ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ಸ್ಪರ್ಧೆ & ಕೊಠಡಿ ನಿಯೋಜನೆ</p>
            </button>

            <button
              onClick={() => onNavigate('marks-consolidation')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition group"
            >
              <p className="font-bold text-slate-800 group-hover:text-emerald-800">4. ಅಂಕ ಕ್ರೋಢೀಕರಣ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ಸ್ವಯಂಚಾಲಿತ ರ್ಯಾಂಕ್</p>
            </button>

            <button
              onClick={() => onNavigate('taluk-selection')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition group"
            >
              <p className="font-bold text-slate-800 group-hover:text-indigo-800">5. ತಾಲೂಕು ಆಯ್ಕೆ ಪಟ್ಟಿ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ಅರ್ಹ ಕಲಾವಿದರ ಪಟ್ಟಿ</p>
            </button>

            <button
              onClick={() => onNavigate('admin-settings')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition group"
            >
              <p className="font-bold text-slate-800 group-hover:text-slate-900">6. ಆಡಳಿತ ಸಂಯೋಜನೆ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ಪೋರ್ಟಲ್ ನಿಯಮಗಳು</p>
            </button>
          </div>
        </div>

      </div>

      {/* Recent Activity Table Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              ಇತ್ತೀಚಿನ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ ಮತ್ತು ಸ್ಪರ್ಧಾ ವಿವರ
            </h3>
            <p className="text-xs text-slate-500">ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ವಲಯದ ಇತ್ತೀಚಿನ ಸಲ್ಲಿಕೆಗಳು</p>
          </div>
          <button
            onClick={() => onNavigate('student-registration')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
          >
            <span>ಸಂಪೂರ್ಣ ಪಟ್ಟಿ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">ಎದೆ ಸಂಖ್ಯೆ</th>
                <th className="py-2.5 px-3">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
                <th className="py-2.5 px-3">ಶಾಲೆ</th>
                <th className="py-2.5 px-3">ಕ್ಲಸ್ಟರ್</th>
                <th className="py-2.5 px-3">ಸ್ಪರ್ಧಾ ವಿಭಾಗ</th>
                <th className="py-2.5 px-3">ಸ್ಥಿತಿ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {STUDENTS.slice(0, 5).map((st) => (
                <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-amber-800">{st.chestNumber}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{st.nameKannada}</td>
                  <td className="py-2.5 px-3">{st.schoolNameKannada}</td>
                  <td className="py-2.5 px-3">{st.clusterNameKannada}</td>
                  <td className="py-2.5 px-3 text-slate-700">{st.eventNameKannada}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      {st.status}
                    </span>
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
