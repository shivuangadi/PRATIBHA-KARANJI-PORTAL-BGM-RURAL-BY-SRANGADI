import React from 'react';
import { UserRole, NavItemKey } from '../types';
import { OFFICIAL_INFO } from '../data/mockData';
import { 
  Building2, 
  Home, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Award, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Menu, 
  X,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
  activeNav: NavItemKey;
  onNavSelect: (nav: NavItemKey) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleSelect,
  activeNav,
  onNavSelect,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { currentUser, logout, officialInfo } = useApp();
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return { label: 'ನಿರ್ವಾಹಕರು (Admin)', bg: 'bg-purple-100 text-purple-900 border-purple-300', icon: ShieldCheck };
      case 'crp':
        return { label: 'ಸಿ.ಆರ್.ಪಿ (ಕ್ಲಸ್ಟರ್)', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', icon: Users };
      case 'school':
        return { label: 'ಶಾಲಾ ಲಾಗಿನ್', bg: 'bg-blue-100 text-blue-900 border-blue-300', icon: GraduationCap };
      case 'judge':
        return { label: 'ನಿರ್ಣಾಯಕರು (Judges)', bg: 'bg-amber-100 text-amber-900 border-amber-300', icon: Award };
      default:
        return { label: 'ಸಾರ್ವಜನಿಕ ಪೋರ್ಟಲ್', bg: 'bg-slate-100 text-slate-800 border-slate-300', icon: Home };
    }
  };

  const currentBadge = getRoleBadge(currentRole);
  const CurrentIcon = currentBadge.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm no-print">
      {/* Topmost Gov Stripe */}
      <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 h-1.5 w-full" />

      {/* Main Official Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Karnataka Emblem & Title Branding */}
          <div 
            onClick={() => onRoleSelect('home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            {/* Emblem Circle */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center shrink-0 ring-2 ring-amber-200 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-full flex flex-col items-center justify-center text-center p-1">
                <span className="text-[10px] font-bold text-red-700 leading-none">ಕರ್ನಾಟಕ</span>
                <span className="text-[9px] font-bold text-amber-600 leading-none mt-0.5">ಸರ್ಕಾರ</span>
              </div>
            </div>

            {/* Department Titles */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-red-700 tracking-wide uppercase">
                  {officialInfo.departmentKannada}
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-400">•</span>
                <span className="hidden sm:inline-block text-xs font-medium text-slate-600">
                  {officialInfo.departmentSubKannada}
                </span>
              </div>

              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight">
                {officialInfo.officeKannada}
              </h1>

              <div className="flex items-center gap-2 mt-0.5 text-xs text-amber-800 font-medium">
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[11px] border border-amber-300">
                  {officialInfo.academicYear}
                </span>
                <span className="font-semibold text-slate-700">
                  {officialInfo.titleKannada}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Academic Year & Location info on desktop */}
            <div className="hidden xl:flex flex-col items-end text-xs text-slate-500 pr-2 border-r border-slate-200">
              <div className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>{officialInfo.talukKannada}, {officialInfo.districtKannada}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500">
                <Calendar className="w-3 h-3 text-amber-600" />
                <span>ಶೈಕ್ಷಣಿಕ ವರ್ಷ {officialInfo.academicYear}</span>
              </div>
            </div>

            {/* Current Active Role Badge & Logout */}
            {currentRole !== 'home' ? (
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${currentBadge.bg} shadow-xs`}>
                  <CurrentIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {currentUser?.displayName 
                      ? `${currentUser.displayName} (${currentUser.clusterName || currentUser.schoolName || currentBadge.label})` 
                      : currentBadge.label}
                  </span>
                </span>

                <button
                  onClick={() => onRoleSelect('home')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 cursor-pointer"
                  title="ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ"
                >
                  <Home className="w-3.5 h-3.5 text-slate-600" />
                  <span className="hidden md:inline">ಮುಖಪುಟ</span>
                </button>

                {currentUser && (
                  <button
                    onClick={() => {
                      logout();
                      onRoleSelect('home');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200 cursor-pointer"
                    title="ಖಾತೆಯಿಂದ ಲಾಗೌಟ್ ಆಗಿ"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-600" />
                    <span className="hidden md:inline">ಲಾಗೌಟ್</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                {currentUser && (
                  <span className="hidden lg:inline-flex text-xs font-bold text-slate-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                    ಲಾಗಿನ್: {currentUser.displayName}
                  </span>
                )}
                <div className="hidden sm:flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                  <span className="px-2 py-1 text-slate-500 font-medium">ಪ್ರವೇಶ:</span>
                  <button 
                    onClick={() => onRoleSelect('admin')} 
                    className="px-2 py-1 font-semibold rounded text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                  >
                    ಅಡ್ಮಿನ್
                  </button>
                  <button 
                    onClick={() => onRoleSelect('crp')} 
                    className="px-2 py-1 font-semibold rounded text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                  >
                    ಸಿ.ಆರ್.ಪಿ
                  </button>
                  <button 
                    onClick={() => onRoleSelect('school')} 
                    className="px-2 py-1 font-semibold rounded text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                  >
                    ಶಾಲೆ
                  </button>
                  <button 
                    onClick={() => onRoleSelect('judge')} 
                    className="px-2 py-1 font-semibold rounded text-amber-700 hover:bg-amber-50 transition cursor-pointer"
                  >
                    ನಿರ್ಣಾಯಕರು
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Navigation Toggle (when in dashboard mode) */}
            {currentRole !== 'home' && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
