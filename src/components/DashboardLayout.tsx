import React from 'react';
import { UserRole, NavItemKey } from '../types';
import { OFFICIAL_INFO, CLUSTERS } from '../data/mockData';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  Award,
  Building,
  UserCheck,
  ClipboardList,
  Trophy,
  Printer,
  Settings,
  ChevronRight,
  LogOut,
  SlidersHorizontal,
  Home,
  CheckCircle2,
  FileCheck,
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';

interface DashboardLayoutProps {
  currentRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
  activeNav: NavItemKey;
  onNavSelect: (nav: NavItemKey) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  selectedClusterId: string;
  onSelectClusterId: (id: string) => void;
  children: React.ReactNode;
}

interface MenuItemDef {
  key: NavItemKey;
  labelKannada: string;
  labelEnglish: string;
  icon: any;
  allowedRoles: UserRole[];
  badge?: string;
}

export const NAV_ITEMS: MenuItemDef[] = [
  {
    key: 'overview',
    labelKannada: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ಮುಖ್ಯಾಂಶಗಳು',
    labelEnglish: 'Overview',
    icon: Layers,
    allowedRoles: ['admin', 'crp', 'school', 'judge'],
  },
  {
    key: 'crp-registration',
    labelKannada: 'ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ',
    labelEnglish: 'CRP Registration',
    icon: Users,
    allowedRoles: ['admin'],
    badge: '25 ಕ್ಲಸ್ಟರ್',
  },
  {
    key: 'school-registration',
    labelKannada: 'ಶಾಲೆ ನೋಂದಣಿ',
    labelEnglish: 'School Registration',
    icon: Building,
    allowedRoles: ['admin', 'crp'],
    badge: '342 ಶಾಲೆ',
  },
  {
    key: 'student-registration',
    labelKannada: 'ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ',
    labelEnglish: 'Student Registration',
    icon: GraduationCap,
    allowedRoles: ['admin', 'crp', 'school'],
    badge: 'SATS ಆಧಾರಿತ',
  },
  {
    key: 'judge-appointment',
    labelKannada: 'ನಿರ್ಣಾಯಕರ ನೇಮಕಾತಿ',
    labelEnglish: 'Judge Appointment',
    icon: UserCheck,
    allowedRoles: ['admin', 'crp'],
  },
  {
    key: 'judge-login',
    labelKannada: 'ನಿರ್ಣಾಯಕರ ಲಾಗಿನ್ / ಪೋರ್ಟಲ್',
    labelEnglish: 'Judge Login',
    icon: Award,
    allowedRoles: ['admin', 'judge'],
    badge: 'ಲೈವ್',
  },
  {
    key: 'marks-entry',
    labelKannada: 'ಅಂಕಗಳ ನಮೂದು',
    labelEnglish: 'Marks Entry',
    icon: ClipboardList,
    allowedRoles: ['admin', 'judge', 'crp'],
  },
  {
    key: 'marks-consolidation',
    labelKannada: 'ಅಂಕಗಳ ಕ್ರೋಢೀಕರಣ',
    labelEnglish: 'Marks Consolidation',
    icon: FileCheck,
    allowedRoles: ['admin', 'crp'],
    badge: 'ಆಟೋ ರ್ಯಾಂಕ್',
  },
  {
    key: 'cluster-results',
    labelKannada: 'ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಫಲಿತಾಂಶಗಳು',
    labelEnglish: 'Cluster Results',
    icon: Trophy,
    allowedRoles: ['admin', 'crp', 'school'],
  },
  {
    key: 'taluk-selection',
    labelKannada: 'ತಾಲೂಕು ಆಯ್ಕೆ ಪಟ್ಟಿ',
    labelEnglish: 'Taluk Selection List',
    icon: Sparkles,
    allowedRoles: ['admin', 'crp'],
    badge: '1st Rank Only',
  },
  {
    key: 'reports-printing',
    labelKannada: 'ವರದಿಗಳು ಮತ್ತು ಮುದ್ರಣ',
    labelEnglish: 'Reports and Printing',
    icon: Printer,
    allowedRoles: ['admin', 'crp', 'school', 'judge'],
  },
  {
    key: 'admin-settings',
    labelKannada: 'ನಿರ್ವಾಹಕ ಸಂಯೋಜನೆಗಳು',
    labelEnglish: 'Admin Settings',
    icon: Settings,
    allowedRoles: ['admin'],
  },
];

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentRole,
  onRoleSelect,
  activeNav,
  onNavSelect,
  mobileMenuOpen,
  setMobileMenuOpen,
  selectedClusterId,
  onSelectClusterId,
  children,
}) => {
  // Filter nav items visible to the current role (admin can view all 11 modules)
  const availableNavItems = NAV_ITEMS.filter((item) => {
    if (currentRole === 'admin') return true;
    return item.allowedRoles.includes(currentRole);
  });

  const getRoleHeaderInfo = () => {
    switch (currentRole) {
      case 'admin':
        return {
          title: 'ನಿರ್ವಾಹಕರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (Admin)',
          sub: 'ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳ ಕಾರ್ಯಾಲಯ, ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ',
          color: 'purple',
          icon: ShieldCheck,
          badge: 'ತಾಲೂಕು ಆಡಳಿತಾಧಿಕಾರಿ',
        };
      case 'crp':
        return {
          title: 'ಸಿ.ಆರ್.ಪಿ / ಕ್ಲಸ್ಟರ್ ಬಳಕೆದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
          sub: 'ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿಗಳ ನಿರ್ವಹಣಾ ಕೋಶ',
          color: 'emerald',
          icon: Users,
          badge: 'ಕ್ಲಸ್ಟರ್ ಹಂತ',
        };
      case 'school':
        return {
          title: 'ಶಾಲಾ ಬಳಕೆದಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ (ಮುಖ್ಯಗುರುಗಳು)',
          sub: 'ಶಾಲಾ ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ ಮತ್ತು ಪ್ರವೇಶ ಪತ್ರ ನಿರ್ವಹಣೆ',
          color: 'blue',
          icon: GraduationCap,
          badge: 'ಶಾಲಾ ಹಂತ',
        };
      case 'judge':
        return {
          title: 'ನಿರ್ಣಾಯಕರ ಮೌಲ್ಯಮಾಪನ ಪೋರ್ಟಲ್ (Judges)',
          sub: 'ಸ್ಪರ್ಧೆಗಳ ನೇರ ಅಂಕ ನಮೂದು ಹಾಗೂ ಪರಿಶೀಲನೆ ವ್ಯವಸ್ಥೆ',
          color: 'amber',
          icon: Award,
          badge: 'ತೀರ್ಪುಗಾರರ ಮಂಡಳಿ',
        };
      default:
        return {
          title: 'ಪೋರ್ಟಲ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
          sub: OFFICIAL_INFO.officeKannada,
          color: 'slate',
          icon: Layers,
          badge: 'ಸಾಮಾನ್ಯ ಪ್ರವೇಶ',
        };
    }
  };

  const roleInfo = getRoleHeaderInfo();
  const ActiveRoleIcon = roleInfo.icon;

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col">
      {/* Sub-Header Context Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-2.5 shadow-2xs no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Breadcrumb & Current View */}
          <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
            <button
              onClick={() => onRoleSelect('home')}
              className="flex items-center gap-1 font-semibold text-slate-700 hover:text-amber-700 transition"
            >
              <Home className="w-3.5 h-3.5" />
              <span>ಮುಖಪುಟ</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">
              {roleInfo.badge}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {NAV_ITEMS.find((n) => n.key === activeNav)?.labelKannada || 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'}
            </span>
          </div>

          {/* Quick Role Switcher Pill Bar for Stage 1 Testing */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
              ಪಾತ್ರ ಬದಲಿಸಿ:
            </span>
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => onRoleSelect('admin')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  currentRole === 'admin'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-700'
                }`}
              >
                1. ಅಡ್ಮಿನ್
              </button>
              <button
                onClick={() => onRoleSelect('crp')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  currentRole === 'crp'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                2. ಸಿ.ಆರ್.ಪಿ
              </button>
              <button
                onClick={() => onRoleSelect('school')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  currentRole === 'school'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-blue-700'
                }`}
              >
                3. ಶಾಲೆ
              </button>
              <button
                onClick={() => onRoleSelect('judge')}
                className={`px-2.5 py-1 rounded-md font-semibold transition ${
                  currentRole === 'judge'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-amber-700'
                }`}
              >
                4. ನಿರ್ಣಾಯಕರು
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Main App Body with Sidebar + Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Left Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden sticky top-24">
            
            {/* Role Header Banner in Sidebar */}
            <div className={`p-4 border-b ${
              currentRole === 'admin' ? 'bg-purple-50 border-purple-100 text-purple-900' :
              currentRole === 'crp' ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
              currentRole === 'school' ? 'bg-blue-50 border-blue-100 text-blue-900' :
              'bg-amber-50 border-amber-100 text-amber-900'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                  currentRole === 'admin' ? 'bg-purple-600 text-white' :
                  currentRole === 'crp' ? 'bg-emerald-600 text-white' :
                  currentRole === 'school' ? 'bg-blue-600 text-white' :
                  'bg-amber-600 text-white'
                }`}>
                  <ActiveRoleIcon className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h2 className="text-xs font-bold truncate leading-tight">{roleInfo.title}</h2>
                  <p className="text-[11px] opacity-80 truncate mt-0.5">{roleInfo.badge}</p>
                </div>
              </div>

              {/* Cluster Selector for CRP or Filter for Admin */}
              {(currentRole === 'admin' || currentRole === 'crp') && (
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    ಕ್ಲಸ್ಟರ್ ಆಯ್ಕೆ:
                  </label>
                  <select
                    value={selectedClusterId}
                    onChange={(e) => onSelectClusterId(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg py-1.5 px-2.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="all">ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್‌ಗಳು (ಸಮಗ್ರ)</option>
                    {CLUSTERS.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.nameKannada} ({cl.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Menu Items List */}
            <div className="p-3 space-y-1">
              <span className="block px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ನ್ಯಾವಿಗೇಶನ್ ಮೆನು
              </span>

              {availableNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => onNavSelect(item.key)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{item.labelKannada}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-amber-700 text-amber-100'
                          : 'bg-slate-200/80 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions inside Sidebar */}
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={() => onRoleSelect('home')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-xl border border-slate-300 transition"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>ಮುಖಪುಟಕ್ಕೆ ನಿರ್ಗಮಿಸಿ</span>
              </button>
            </div>

          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            {/* Drawer Body */}
            <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-900">{roleInfo.title}</h2>
                  <p className="text-[11px] text-amber-700 font-medium">{roleInfo.badge}</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  ✕
                </button>
              </div>

              <div className="p-3 space-y-1 flex-1">
                {availableNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onNavSelect(item.key);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.labelKannada}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
                <button
                  onClick={() => {
                    onRoleSelect('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 text-xs font-bold text-slate-700 bg-white rounded-lg border border-slate-300"
                >
                  ಮುಖಪುಟಕ್ಕೆ ಮರಳಿ
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Main Content Pane */}
        <main className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
};
