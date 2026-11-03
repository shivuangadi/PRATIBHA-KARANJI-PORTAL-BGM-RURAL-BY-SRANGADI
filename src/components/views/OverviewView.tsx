import React, { useState } from 'react';
import { UserRole, NavItemKey } from '../../types';
import { CLUSTERS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
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
  Sparkles,
  RotateCcw,
  AlertTriangle,
  Check,
  X,
  Database
} from 'lucide-react';

interface OverviewViewProps {
  currentRole: UserRole;
  onNavigate: (nav: NavItemKey) => void;
  selectedClusterId: string;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ currentRole, onNavigate, selectedClusterId }) => {
  const { 
    currentUser, 
    allStudents, 
    allJudges, 
    allSchools, 
    scoreEntries, 
    resetClusterData, 
    officialInfo, 
    firebaseConnected 
  } = useApp();

  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  // Determine active cluster
  const activeClusterId = currentUser?.clusterId || selectedClusterId;
  const activeCluster = CLUSTERS.find(c => c.id === activeClusterId) || CLUSTERS[0];

  // Scoped metrics for the active cluster
  const clusterStudents = allStudents.filter(s => s.clusterId === activeCluster.id);
  const clusterJudges = allJudges.filter(j => j.assignedClusterId === activeCluster.id);
  const clusterScores = scoreEntries.filter(s => s.clusterId === activeCluster.id);

  const handleConfirmReset = async () => {
    setIsResetting(true);
    const result = await resetClusterData(activeCluster.id);
    setIsResetting(false);
    setShowResetModal(false);
    setResetFeedback(result.message);
    setTimeout(() => setResetFeedback(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Reset Feedback Notification */}
      {resetFeedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{resetFeedback}</span>
          </div>
          <button 
            onClick={() => setResetFeedback(null)}
            className="p-1 hover:bg-emerald-100 rounded text-emerald-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner Greeting */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ಅಧಿಕೃತ ಆಡಳಿತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ • {officialInfo.academicYear}</span>
            {firebaseConnected && (
              <span className="inline-flex items-center gap-1 ml-2 px-1.5 py-0.2 text-[10px] bg-emerald-500/80 text-white rounded">
                <Database className="w-2.5 h-2.5" />
                <span>ಲೈವ್ ಕ್ಲೌಡ್</span>
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight">
            {officialInfo.eventNameKannada}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100 mt-1 max-w-2xl">
            {officialInfo.officeKannada} • {officialInfo.talukKannada}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-100 inline-block px-2.5 py-1 rounded-lg">
              ಪ್ರಸ್ತುತ ಕ್ಲಸ್ಟರ್: {activeCluster.nameKannada} ({activeCluster.code})
            </span>
            {currentUser?.role === 'crp' && (
              <span className="text-xs font-bold text-white bg-black/30 inline-block px-2.5 py-1 rounded-lg">
                ಸಿ.ಆರ್.ಪಿ: {currentUser.displayName}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('student-registration')}
            className="px-3.5 py-2 rounded-xl bg-white text-amber-900 hover:bg-amber-50 text-xs font-bold shadow-xs transition cursor-pointer"
          >
            + ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ
          </button>
          <button
            onClick={() => onNavigate('reports-printing')}
            className="px-3.5 py-2 rounded-xl bg-amber-800 text-white hover:bg-amber-900 text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>ವರದಿಗಳು / ಮುದ್ರಣ</span>
          </button>
        </div>
      </div>

      {/* Special Cluster Reset & Management Bar for CRP and Admin */}
      {(currentRole === 'crp' || currentRole === 'admin' || currentUser?.role === 'crp') && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-rose-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {activeCluster.nameKannada} ಕ್ಲಸ್ಟರ್ ನಿರ್ವಹಣೆ & ಡೇಟಾ ರಿಸೆಟ್
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              ಈ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ: <span className="font-bold text-slate-800">{clusterStudents.length}</span> ನೋಂದಾಯಿತ ಮಕ್ಕಳು, <span className="font-bold text-slate-800">{clusterJudges.length}</span> ನಿರ್ಣಾಯಕರು, <span className="font-bold text-slate-800">{clusterScores.length}</span> ಅಂಕ ನಮೂದುಗಳು ಇವೆ.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 hover:text-rose-800 font-bold text-xs flex items-center gap-2 transition cursor-pointer self-start md:self-auto shrink-0 shadow-2xs"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>ಕ್ಲಸ್ಟರ್ ಡೇಟಾ ರಿಸೆಟ್ (Reset Cluster Data)</span>
          </button>
        </div>
      )}

      {/* Primary KPI Metrics (Live from Firestore & State) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ಒಟ್ಟು ಕ್ಲಸ್ಟರ್‌ಗಳು</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{CLUSTERS.length}</p>
          <p className="text-[11px] text-purple-700 font-medium mt-1">ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ನೋಂದಾಯಿತ ಶಾಲೆಗಳು</span>
            <School className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{allSchools.length}</p>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">ಸರ್ಕಾರಿ ಹಾಗೂ ಖಾಸಗಿ ಶಾಲೆಗಳು</p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ಒಟ್ಟು ವಿದ್ಯಾರ್ಥಿ ಸ್ಪರ್ಧಿಗಳು</span>
            <GraduationCap className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{allStudents.length}</p>
          <p className="text-[11px] text-blue-700 font-medium mt-1">
            {clusterStudents.length > 0 ? `ಈ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ${clusterStudents.length}` : 'ಲೈವ್ ಕ್ಲೌಡ್ ನಮೂದು'}
          </p>
        </div>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">ನೇಮಕಗೊಂಡ ನಿರ್ಣಾಯಕರು</span>
            <Award className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{allJudges.length}</p>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            {clusterJudges.length > 0 ? `ಈ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ${clusterJudges.length}` : 'ವಿಷಯ ತಜ್ಞರ ಸಮಿತಿ'}
          </p>
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
                <p className="text-slate-600">ಕ್ಲಸ್ಟರ್ ಹಂತದ ಪ್ರಥಮ ಸ್ಥಾನ ಪಡೆದ ಮಕ್ಕಳು ಮಾತ್ರ ತಾಲೂಕು ಹಂತಕ್ಕೆ ಅರ್ಹರಾಗಿದ್ದಾರೆ.</p>
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
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-200 transition group cursor-pointer"
            >
              <p className="font-bold text-slate-800 group-hover:text-purple-800">1. ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿಗಳು</p>
            </button>

            <button
              onClick={() => onNavigate('school-registration')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition group cursor-pointer"
            >
              <p className="font-bold text-slate-800 group-hover:text-blue-800">2. ಶಾಲೆ ನೋಂದಣಿ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">DISE ಕೋಡ್ ಪರಿಶೀಲನೆ</p>
            </button>

            <button
              onClick={() => onNavigate('judge-appointment')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 transition group cursor-pointer"
            >
              <p className="font-bold text-slate-800 group-hover:text-amber-800">3. ನಿರ್ಣಾಯಕರ ನೇಮಕ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ಸ್ಪರ್ಧೆ & ಕೊಠಡಿ ನಿಯೋಜನೆ</p>
            </button>

            <button
              onClick={() => onNavigate('marks-consolidation')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition group cursor-pointer"
            >
              <p className="font-bold text-slate-800 group-hover:text-emerald-800">4. ಅಂಕ ಕ್ರೋಢೀಕರಣ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ಸ್ವಯಂಚಾಲಿತ ರ್ಯಾಂಕ್</p>
            </button>

            <button
              onClick={() => onNavigate('taluk-selection')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition group cursor-pointer"
            >
              <p className="font-bold text-slate-800 group-hover:text-indigo-800">5. ತಾಲೂಕು ಆಯ್ಕೆ ಪಟ್ಟಿ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">1st Rank ವಿಜೇತರ ಪಟ್ಟಿ</p>
            </button>

            <button
              onClick={() => onNavigate('reports-printing')}
              className="p-3 text-left rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition group cursor-pointer"
            >
              <p className="font-bold text-slate-800 group-hover:text-slate-900">6. ವರದಿಗಳು / ಮುದ್ರಣ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">ವಿಜೇತರ ಪಟ್ಟಿ PDF & ಶೇರ್</p>
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
            <p className="text-xs text-slate-500">
              {allStudents.length > 0 ? `ಒಟ್ಟು ${allStudents.length} ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳು` : 'ಇನ್ನೂ ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿಯಾಗಿಲ್ಲ (ಹೊಸದಾಗಿ ನೋಂದಾಯಿಸಿ)'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('student-registration')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
          >
            <span>+ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಾಯಿಸಿ</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {allStudents.length > 0 ? (
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
                {allStudents.slice(0, 6).map((st) => (
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
        ) : (
          <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
            <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">ಯಾವುದೇ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿಯಾಗಿಲ್ಲ</p>
            <p className="text-[11px] text-slate-400 mt-0.5">ಶಾಲಾ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು ಅಥವಾ ಸಿ.ಆರ್.ಪಿ ಲಾಗಿನ್ ಮೂಲಕ ಹೊಸ ಮಕ್ಕಳನ್ನು ನೋಂದಾಯಿಸಿ.</p>
          </div>
        )}
      </div>

      {/* Cluster Data Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-rose-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  ಕ್ಲಸ್ಟರ್ ಡೇಟಾ ರಿಸೆಟ್ ದೃಢೀಕರಣ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ಕ್ಲಸ್ಟರ್: <span className="font-bold text-rose-700">{activeCluster.nameKannada}</span> ({activeCluster.code})
                </p>
              </div>
            </div>

            <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-2">
              <p className="font-bold">
                ⚠️ ನೀವು ನಿಜವಾಗಿಯೂ ಈ ಕ್ಲಸ್ಟರ್‌ನ ಡೇಟಾವನ್ನು ಸಂಪೂರ್ಣವಾಗಿ ಅಳಿಸಲು (Reset) ಬಯಸುವಿರಾ?
              </p>
              <ul className="list-disc pl-4 space-y-1 text-rose-800 text-[11px]">
                <li>ಈ ಕ್ಲಸ್ಟರ್‌ನ ಎಲ್ಲಾ ನೋಂದಾಯಿತ ವಿದ್ಯಾರ್ಥಿಗಳ ಪಟ್ಟಿ ತೆರವುಗೊಳ್ಳುತ್ತದೆ.</li>
                <li>ಈ ಕ್ಲಸ್ಟರ್‌ಗೆ ನೇಮಕಗೊಂಡ ನಿರ್ಣಾಯಕರ ಪಟ್ಟಿ ತೆರವುಗೊಳ್ಳುತ್ತದೆ.</li>
                <li>ತೀರ್ಪುಗಾರರು ನಮೂದಿಸಿದ ಎಲ್ಲಾ ಅಂಕಗಳು ಹಾಗೂ ಶ್ರೇಯಾಂಕಗಳು ಅಳಿಸಲ್ಪಡುತ್ತವೆ.</li>
                <li>ಈ ಕ್ರಿಯೆಯನ್ನು Firebase ಕ್ಲೌಡ್‌ನಿಂದ ಹಿಂಪಡೆಯಲು ಸಾಧ್ಯವಿಲ್ಲ.</li>
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                ರದ್ದುಮಾಡಿ (Cancel)
              </button>

              <button
                type="button"
                disabled={isResetting}
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isResetting ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>ರಿಸೆಟ್ ಆಗುತ್ತಿದೆ...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>ಹೌದು, ಡೇಟಾ ರಿಸೆಟ್ ಮಾಡಿ</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
