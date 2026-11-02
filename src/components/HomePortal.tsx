import React, { useState } from 'react';
import { UserRole, NavItemKey, CompetitionCategory } from '../types';
import { OFFICIAL_INFO, CLUSTERS, COMPETITION_EVENTS } from '../data/mockData';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Award, 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Calendar, 
  Layers, 
  CheckCircle, 
  AlertCircle,
  Building,
  Music,
  BookOpen,
  Download,
  Info,
  ChevronRight
} from 'lucide-react';

interface HomePortalProps {
  onSelectRole: (role: UserRole, initialNav?: NavItemKey) => void;
  onDirectNav: (nav: NavItemKey) => void;
}

export const HomePortal: React.FC<HomePortalProps> = ({ onSelectRole, onDirectNav }) => {
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategory>('junior');

  const categoriesList: { id: CompetitionCategory; labelKannada: string; desc: string; icon: any }[] = [
    { id: 'junior', labelKannada: 'ವಿಭಾಗ 1: ಕಿರಿಯ ವಿಭಾಗ', desc: '1 ರಿಂದ 4ನೇ ತರಗತಿ (10 ಸ್ಪರ್ಧೆಗಳು)', icon: BookOpen },
    { id: 'senior', labelKannada: 'ವಿಭಾಗ 2: ಹಿರಿಯ ವಿಭಾಗ', desc: '5 ರಿಂದ 7ನೇ ತರಗತಿ (12 ಸ್ಪರ್ಧೆಗಳು)', icon: Music },
    { id: 'high_school', labelKannada: 'ವಿಭಾಗ 3: ಪ್ರೌಢ ವಿಭಾಗ', desc: '8 ರಿಂದ 12ನೇ ತರಗತಿ (13 ವೈಯಕ್ತಿಕ + 3 ಸಾಮೂಹಿಕ)', icon: Sparkles },
  ];

  const filteredEvents = COMPETITION_EVENTS.filter(e => e.categoryId === selectedCategory);

  return (
    <div className="space-y-10 pb-16">
      
      {/* 1. Official Banner & Hero Header */}
      <section className="bg-gradient-to-b from-amber-50/80 via-white to-white border-b border-amber-100/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          
          {/* Government Badge Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold border border-red-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            <span>{OFFICIAL_INFO.departmentKannada} • {OFFICIAL_INFO.departmentSubKannada}</span>
          </div>

          {/* Official Mandatory Headings */}
          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {OFFICIAL_INFO.officeKannada}
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-bold text-red-700">
              {OFFICIAL_INFO.eventNameKannada}
            </p>
            <div className="flex items-center justify-center gap-3 pt-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                ತಾಲೂಕು: {OFFICIAL_INFO.talukKannada}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
                ಶೈಕ್ಷಣಿಕ ವರ್ಷ: {OFFICIAL_INFO.academicYear}
              </span>
            </div>
          </div>

          {/* Intro Description */}
          <p className="max-w-3xl mx-auto text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
            ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ಶೈಕ್ಷಣಿಕ ವಲಯದ ಎಲ್ಲಾ ಸರ್ಕಾರಿ, ಅನುದಾನಿತ ಮತ್ತು ಅನುದಾನರಹಿತ ಶಾಲೆಗಳ ವಿದ್ಯಾರ್ಥಿಗಳಲ್ಲಿ ಸುಪ್ತವಾಗಿರುವ ಪ್ರತಿಭೆಗಳನ್ನು ಗುರುತಿಸಿ, ಪ್ರೋತ್ಸಾಹಿಸುವ ಡಿಜಿಟಲ್ ನೋಂದಣಿ, ಮೌಲ್ಯಮಾಪನ ಮತ್ತು ಫಲಿತಾಂಶ ನಿರ್ವಹಣಾ ಅಧಿಕೃತ ಪೋರ್ಟಲ್.
          </p>

          {/* Live Notification Ticker */}
          <div className="max-w-4xl mx-auto bg-amber-500/10 border border-amber-300/80 rounded-xl p-3 flex items-center gap-3 text-left shadow-xs">
            <span className="bg-amber-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shrink-0 uppercase tracking-wide">
              ತಾಜಾ ಮಾಹಿತಿ
            </span>
            <p className="text-xs sm:text-sm text-amber-950 font-medium truncate">
              📢 2026–27ನೇ ಸಾಲಿನ ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಸ್ಪರ್ಧೆಗಳ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ ಮತ್ತು ಹಾಲ್ ಟಿಕೆಟ್ ಮುದ್ರಣ ಪ್ರಕ್ರಿಯೆ ಚಾಲ್ತಿಯಲ್ಲಿದೆ. ಎಲ್ಲಾ ಶಾಲೆಗಳು ನಿಗದಿತ ದಿನಾಂಕದೊಳಗೆ ಪೂರ್ಣಗೊಳಿಸಲು ಸೂಚನೆ.
            </p>
          </div>

        </div>
      </section>

      {/* 2. THE 4 ROLE ENTRY SECTIONS (Primary Focus) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>ಪಾತ್ರಾಧಾರಿತ ಪ್ರವೇಶ ವಿಭಾಗಗಳು / Role Based Entry</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            ನಿಮ್ಮ ಪಾತ್ರವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಪ್ರವೇಶಿಸಿ
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ಕೆಳಗೆ ನೀಡಲಾದ ನಾಲ್ಕು ಅಧಿಕೃತ ವಿಭಾಗಗಳಲ್ಲಿ ನಿಮ್ಮ ಕಾರ್ಯವ್ಯಾಪ್ತಿಗೆ ಅನುಗುಣವಾದ ಕಾರ್ಡ್ ಕ್ಲಿಕ್ ಮಾಡಿ.
          </p>
        </div>

        {/* 4 Large Responsive Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Role 1: Admin */}
          <div className="bg-white rounded-2xl border-2 border-purple-200 hover:border-purple-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center ring-4 ring-purple-50 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  ಮುಖ್ಯ ನಿರ್ವಹಣೆ
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Role 1</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                  ಅಡ್ಮಿನ್ / ಬಿ.ಇ.ಒ ಕಾರ್ಯಾಲಯ
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳು ಹಾಗೂ ತಾಲೂಕು ನೋಡಲ್ ಅಧಿಕಾರಿಗಳ ಸಮಗ್ರ ನಿಯಂತ್ರಣ ವ್ಯವಸ್ಥೆ.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-purple-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>25 ಕ್ಲಸ್ಟರ್‌ಗಳು ಮತ್ತು ಸಿಆರ್‌ಪಿಗಳ ನಿರ್ವಹಣೆ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>3 ಅಧಿಕೃತ ವಿಭಾಗಗಳ (1-4, 5-7, 8-12) ನಿಯಂತ್ರಣ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>ಸಮಗ್ರ ವರದಿಗಳು, ಅಂಕಪಟ್ಟಿ ಮತ್ತು ಪ್ರಮಾಣಪತ್ರಗಳು</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50/70 border-t border-purple-100">
              <button
                onClick={() => onSelectRole('admin')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Role 2: CRP / Cluster User */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center ring-4 ring-emerald-50 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Users className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  ಕ್ಲಸ್ಟರ್ ಹಂತ
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Role 2</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  CRP / ಕ್ಲಸ್ಟರ್ ಬಳಕೆದಾರ
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  25 ಕ್ಲಸ್ಟರ್‌ಗಳ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿಗಳು (ಸಿ.ಆರ್.ಪಿ) ತಮ್ಮ ಕ್ಲಸ್ಟರ್ ವ್ಯಾಪ್ತಿಯ ಸ್ಪರ್ಧೆಗಳನ್ನು ನಿರ್ವಹಿಸಲು.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ವ್ಯಾಪ್ತಿಯ ಶಾಲೆಗಳ ನೋಂದಣಿ ಪರಿಶೀಲನೆ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ಸ್ಪರ್ಧಾ ಕೊಠಡಿ ಮತ್ತು ನಿರ್ಣಾಯಕರ ನಿಯೋಜನೆ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಫಲಿತಾಂಶ ಕ್ರೋಢೀಕರಣ</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/70 border-t border-emerald-100">
              <button
                onClick={() => onSelectRole('crp')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>ಕ್ಲಸ್ಟರ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Role 3: School */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 hover:border-blue-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center ring-4 ring-blue-50 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  ಶಾಲಾ ಹಂತ
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Role 3</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  ಶಾಲೆ / ಮುಖ್ಯಗುರುಗಳು
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  ಶಾಲಾ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು ಮತ್ತು ನಿಯೋಜಿತ ಶಿಕ್ಷಕರು ವಿದ್ಯಾರ್ಥಿಗಳನ್ನು ನಮೂದಿಸಲು.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-blue-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>SATS ಆಧಾರಿತ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>ಪ್ರವೇಶ ಪತ್ರ (Hall Ticket / Admit Card) ಮುದ್ರಣ</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>ಶಾಲಾ ಸಾಧಕರ ಪ್ರಶಂಸನಾ ಪ್ರಮಾಣಪತ್ರ</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50/70 border-t border-blue-100">
              <button
                onClick={() => onSelectRole('school')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>ಶಾಲಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಪ್ರವೇಶ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Role 4: Judge */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 hover:border-amber-500 hover:shadow-xl transition-all duration-200 flex flex-col justify-between overflow-hidden group">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-13 h-13 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center ring-4 ring-amber-50 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Award className="w-7 h-7" />
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  ಮೌಲ್ಯಮಾಪನ
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Role 4</span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  ನಿರ್ಣಾಯಕರು / ತೀರ್ಪುಗಾರರು
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  ಅಧಿಕೃತವಾಗಿ ನೇಮಕಗೊಂಡ ವಿಷಯ ತಜ್ಞರು ಮತ್ತು ತೀರ್ಪುಗಾರರ ಲೈವ್ ಅಂಕ ನಮೂದು.
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-amber-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>ಸ್ಪರ್ಧಾ ಕೋಡ್ / ಎದೆ ಸಂಖ್ಯೆ ಮೂಲಕ ಅಂಕ ನಮೂದು</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>ನಾಲ್ಕು ಮೌಲ್ಯಮಾಪನ ಮಾನದಂಡಗಳ ಸ್ಕೋರಿಂಗ್</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>ಡಿಜಿಟಲ್ ಸಹಿ ಮತ್ತು ಅಂಕಪಟ್ಟಿ ಸಲ್ಲಿಕೆ</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50/70 border-t border-amber-100">
              <button
                onClick={() => onSelectRole('judge')}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>ನಿರ್ಣಾಯಕರ ಪೋರ್ಟಲ್ ಪ್ರವೇಶ</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Official Taluk Statistics Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-700/80">
            <div>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು ಅಂಕಿ-ಅಂಶಗಳು
              </span>
              <h3 className="text-lg sm:text-xl font-bold mt-1 text-white">
                2026–27 ಸಾಲಿನ ಕಾರ್ಯಕ್ರಮ ಪ್ರಗತಿ ವಿವರ (25 ಕ್ಲಸ್ಟರ್‌ಗಳು)
              </h3>
            </div>
            <div className="text-xs text-slate-300 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700">
              ದಿನಾಂಕ: {new Date().toLocaleDateString('kn-IN')} | ಅಧಿಕೃತ JSON ಕಾನ್ಫಿಗ್ ಸಕ್ರಿಯ
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-400">25</p>
              <p className="text-xs text-slate-300 font-medium mt-1">ಶೈಕ್ಷಣಿಕ ಕ್ಲಸ್ಟರ್‌ಗಳು</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">3</p>
              <p className="text-xs text-slate-300 font-medium mt-1">ಅಧಿಕೃತ ಸ್ಪರ್ಧಾ ವಿಭಾಗಗಳು</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400">38</p>
              <p className="text-xs text-slate-300 font-medium mt-1">ಒಟ್ಟು ಅಧಿಕೃತ ಸ್ಪರ್ಧೆಗಳು</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-400">3,400+</p>
              <p className="text-xs text-slate-300 font-medium mt-1">ಭಾಗವಹಿಸುವ ವಿದ್ಯಾರ್ಥಿ ಕಲಾವಿದರು</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Navigation Modules Quick Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span>ಪೋರ್ಟಲ್‌ನ ಎಲ್ಲಾ 11 ಪ್ರಮುಖ ಮಾಡ್ಯೂಲ್‌ಗಳು</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                ಯಾವುದೇ ವಿಭಾಗದ UI ರಚನೆ ಮತ್ತು ವರದಿಗಳನ್ನು ನೇರವಾಗಿ ವೀಕ್ಷಿಸಲು ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಬಳಸಿ
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200 self-start sm:self-auto">
              ಸಂಪೂರ್ಣ UI ನ್ಯಾವಿಗೇಶನ್
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { key: 'crp-registration', label: 'ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ', role: 'admin' as UserRole, desc: 'CRP Registration' },
              { key: 'school-registration', label: 'ಶಾಲೆ ನೋಂದಣಿ', role: 'admin' as UserRole, desc: 'School Directory' },
              { key: 'student-registration', label: 'ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ', role: 'school' as UserRole, desc: 'Student Registration' },
              { key: 'judge-appointment', label: 'ನಿರ್ಣಾಯಕರ ನೇಮಕಾತಿ', role: 'admin' as UserRole, desc: 'Judge Appointment' },
              { key: 'judge-login', label: 'ನಿರ್ಣಾಯಕರ ಲಾಗಿನ್', role: 'judge' as UserRole, desc: 'Judge Portal' },
              { key: 'marks-entry', label: 'ಅಂಕಗಳ ನಮೂದು', role: 'judge' as UserRole, desc: 'Marks Entry' },
              { key: 'marks-consolidation', label: 'ಅಂಕಗಳ ಕ್ರೋಢೀಕರಣ', role: 'admin' as UserRole, desc: 'Consolidation' },
              { key: 'cluster-results', label: 'ಕ್ಲಸ್ಟರ್ ಫಲಿತಾಂಶಗಳು', role: 'crp' as UserRole, desc: 'Cluster Results' },
              { key: 'taluk-selection', label: 'ತಾಲೂಕು ಆಯ್ಕೆ ಪಟ್ಟಿ', role: 'admin' as UserRole, desc: 'Taluk Selection' },
              { key: 'reports-printing', label: 'ವರದಿಗಳು ಮತ್ತು ಮುದ್ರಣ', role: 'admin' as UserRole, desc: 'Reports & Print' },
              { key: 'admin-settings', label: 'ನಿರ್ವಾಹಕ ಸಂಯೋಜನೆ', role: 'admin' as UserRole, desc: 'Admin Settings' },
            ].map((mod) => (
              <button
                key={mod.key}
                onClick={() => {
                  onSelectRole(mod.role, mod.key as NavItemKey);
                }}
                className="p-3 text-left bg-slate-50 hover:bg-amber-50 rounded-xl border border-slate-200 hover:border-amber-300 transition group flex flex-col justify-between"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-800 group-hover:text-amber-800 leading-tight">
                    {mod.label}
                  </span>
                  <span className="block text-[10px] text-slate-400 group-hover:text-amber-600 mt-1">
                    {mod.desc}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200 group-hover:border-amber-200">
                  <span className="text-[10px] font-semibold text-slate-500">ವೀಕ್ಷಿಸಿ</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Competition Categories & Rules Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                ಸ್ಪರ್ಧಾ ಪಟ್ಟಿ ಹಾಗೂ ನಿಯಮಾವಳಿಗಳು
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ ವಿಭಾಗಗಳು
              </h3>
            </div>
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categoriesList.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cat.labelKannada}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events Grid for Selected Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((ev) => (
              <div 
                key={ev.id}
                className="bg-slate-50/70 rounded-xl p-4 border border-slate-200 hover:border-amber-300 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {ev.nameKannada}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 shrink-0">
                    {ev.maxMarks} ಅಂಕಗಳು
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span>ಗರಿಷ್ಠ ಸಮಯ: {ev.timeLimitMinutes} ನಿಮಿಷ</span>
                  <span>•</span>
                  <span>{ev.isGroupEvent ? 'ಸಮೂಹ ಸ್ಪರ್ಧೆ' : 'ವೈಯಕ್ತಿಕ ಸ್ಪರ್ಧೆ'}</span>
                </div>

                <div className="pt-2 border-t border-slate-200/70 text-xs text-slate-600 space-y-1">
                  <span className="font-semibold text-slate-700 block text-[11px]">ಕಡ್ಡಾಯ ನಿಯಮಗಳು:</span>
                  {ev.rulesKannada.map((rule, idx) => (
                    <p key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{rule}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Belagavi Rural Clusters Directory Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ಶೈಕ್ಷಣಿಕ ಕ್ಲಸ್ಟರ್‌ಗಳು (25 ಅಧಿಕೃತ ಕ್ಲಸ್ಟರ್ ವಿವರ)
              </h3>
              <p className="text-xs text-slate-500">
                ಪ್ರತಿಯೊಂದು ಕ್ಲಸ್ಟರ್‌ಗೆ ಗೊತ್ತುಪಡಿಸಿದ ಸಿ.ಆರ್.ಪಿ ಮತ್ತು ಶಾಲೆಗಳ ಮಾಹಿತಿ
              </p>
            </div>
            <button
              onClick={() => onSelectRole('admin', 'crp-registration')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>ಎಲ್ಲಾ ಸಿ.ಆರ್.ಪಿ ವಿವರ ನೋಡಿ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {CLUSTERS.map((cl) => (
              <div 
                key={cl.id} 
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{cl.code}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="ಸಕ್ರಿಯ" />
                </div>
                <h5 className="font-bold text-xs text-slate-900 mt-1">{cl.nameKannada}</h5>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{cl.crpName}</p>
                <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] text-slate-600">
                  <span>ಶಾಲೆಗಳು: {cl.totalSchools}</span>
                  <span className="font-semibold text-amber-700">{cl.registeredStudents} ವಿದ್ಯಾರ್ಥಿ</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Important Instructions & Schedule for Headmasters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/60 rounded-2xl border border-amber-200 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Info className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-sm sm:text-base text-amber-950">
                ಮುಖ್ಯಗುರುಗಳು ಮತ್ತು ಸಿ.ಆರ್.ಪಿ.ಗಳಿಗೆ ಮಹತ್ವದ ಮಾರ್ಗಸೂಚಿಗಳು (2026-27)
              </h4>
              <ul className="text-xs sm:text-sm text-amber-900 space-y-1.5 list-disc list-inside">
                <li>ಪ್ರತಿಯೊಬ್ಬ ವಿದ್ಯಾರ್ಥಿಯು ಗರಿಷ್ಠ 2 ವೈಯಕ್ತಿಕ ಸ್ಪರ್ಧೆಗಳು ಮತ್ತು 1 ಸಮೂಹ ಸ್ಪರ್ಧೆಯಲ್ಲಿ ಮಾತ್ರ ಭಾಗವಹಿಸಲು ಅವಕಾಶವಿದೆ.</li>
                <li>ಶಾಲೆಗಳು SATS ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸುವುದು ಕಡ್ಡಾಯವಾಗಿದ್ದು, ವಿದ್ಯಾರ್ಥಿಯ ಜನ್ಮ ದಿನಾಂಕವನ್ನು ಶಾಲಾ ದಾಖಲಾತಿ ಪ್ರಕಾರವೇ ದಾಖಲಿಸಬೇಕು.</li>
                <li>ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದಲ್ಲಿ ಪ್ರಥಮ ಸ್ಥಾನ ಪಡೆದ ವಿದ್ಯಾರ್ಥಿ ಮಾತ್ರ ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು ಮಟ್ಟದ ಸ್ಪರ್ಧೆಗೆ ಅರ್ಹತೆ ಪಡೆಯುತ್ತಾನೆ.</li>
                <li>ನಿರ್ಣಾಯಕರ ಅಂಕ ನಮೂದು ಡಿಜಿಟಲ್ ರೂಪದಲ್ಲಿಯೇ ನಡೆಯಲಿದ್ದು, ಮೌಲ್ಯಮಾಪನ ಮುಗಿದ ತಕ್ಷಣ ಸೀಲ್ ಮಾಡಿ ಸಲ್ಲಿಸುವುದು.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
