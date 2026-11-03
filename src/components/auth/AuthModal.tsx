import React, { useState, useEffect } from 'react';
import { UserRole, CompetitionCategory } from '../../types';
import { useApp } from '../../context/AppContext';
import { CLUSTERS } from '../../data/mockData';
import { 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Award, 
  X, 
  Lock, 
  User, 
  Phone, 
  Building, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Copy,
  Check,
  Share2,
  Key
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  role: UserRole | null;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, role, onClose, onSuccess }) => {
  const { 
    loginAsAdmin, 
    loginAsCrp, 
    loginAsSchool, 
    loginAsJudge, 
    registerCrp, 
    registerSchool,
    allJudges,
    crpAccounts,
    schoolAccounts
  } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin Login State (Default credentials: admin / admin123)
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');

  // CRP Login State
  const [crpUsername, setCrpUsername] = useState('');
  const [crpPassword, setCrpPassword] = useState('');

  // CRP Registration State
  const [regCrpCluster, setRegCrpCluster] = useState(CLUSTERS[0].id);
  const [regCrpName, setRegCrpName] = useState('');
  const [regCrpDesignation, setRegCrpDesignation] = useState('ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ (CRP)');
  const [regCrpPhone, setRegCrpPhone] = useState('');
  const [regCrpEmail, setRegCrpEmail] = useState('');
  const [regCrpUsername, setRegCrpUsername] = useState('');
  const [regCrpPassword, setRegCrpPassword] = useState('');

  // Display Credentials info after CRP Registration
  const [registeredCrpInfo, setRegisteredCrpInfo] = useState<{
    username: string;
    password: string;
    crpName: string;
    clusterNameKannada: string;
    phone: string;
  } | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // School Login State
  const [schoolDiseOrUser, setSchoolDiseOrUser] = useState('');
  const [schoolPassword, setSchoolPassword] = useState('');

  // School Registration State
  const [regSchoolCluster, setRegSchoolCluster] = useState(CLUSTERS[0].id);
  const [regSchoolName, setRegSchoolName] = useState('');
  const [regSchoolDise, setRegSchoolDise] = useState('');
  const [regSchoolType, setRegSchoolType] = useState<'ಸರ್ಕಾರಿ' | 'ಅನುದಾನಿತ' | 'ಅನುದಾನರಹಿತ'>('ಸರ್ಕಾರಿ');
  const [regHeadMasterName, setRegHeadMasterName] = useState('');
  const [regHeadMasterPhone, setRegHeadMasterPhone] = useState('');
  const [regSchoolUsername, setRegSchoolUsername] = useState('');
  const [regSchoolPassword, setRegSchoolPassword] = useState('');

  // Judge Login State (Exact User Specification)
  // "ನಿರ್ಣಾಯಕರು ತಮ್ಮ cluster ಆಯ್ಕೆಮಾಡಿ, ಅದರಲ್ಲಿ ತಮ್ಮ ಹೆಸರನ್ನು ಆಯ್ಕೆ ಮಾಡಿ (ಅವರ ನೋಂದಾಯಿತ ಮೋಬೈಲ್ ನಂಬರ್ ಪಾಸವರ್ಡ ಅಗಿರಬೇಕು) ಲಾಗಿನ್ ಆಗುತ್ತಾರೆ."
  const [judgeSelectedCluster, setJudgeSelectedCluster] = useState(CLUSTERS[0].id);
  const [judgeSelectedName, setJudgeSelectedName] = useState('');
  const [judgeMobilePassword, setJudgeMobilePassword] = useState('');

  // Judges in currently selected cluster
  const clusterJudges = allJudges.filter((j) => j.assignedClusterId === judgeSelectedCluster);

  // Sync first judge name when cluster changes
  useEffect(() => {
    if (clusterJudges.length > 0) {
      setJudgeSelectedName(clusterJudges[0].nameKannada);
    } else {
      setJudgeSelectedName('');
    }
  }, [judgeSelectedCluster, allJudges]);

  // Reset errors when modal opens or switches role
  useEffect(() => {
    setErrorMessage('');
    setSuccessMessage('');
    setActiveTab('login');
  }, [isOpen, role]);

  if (!isOpen || !role || role === 'home') return null;

  // Copy & WhatsApp sharing for newly registered CRP credentials
  const copyToClipboard = (text: string, field: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      // fallback
    }
  };

  const shareCredentialsWhatsApp = () => {
    if (!registeredCrpInfo) return;
    const text = `🎉 *ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026-27 - ಸಿ.ಆರ್.ಪಿ ಲಾಗಿನ್ ವಿವರಗಳು*\n\n🏛️ ಕ್ಲಸ್ಟರ್: *${registeredCrpInfo.clusterNameKannada}*\n👤 ಸಿ.ಆರ್.ಪಿ ಹೆಸರು: *${registeredCrpInfo.crpName}*\n📱 ಮೊಬೈಲ್: *${registeredCrpInfo.phone}*\n\n🔑 *ಬಳಕೆದಾರ ಹೆಸರು (Username)*: ${registeredCrpInfo.username}\n🔒 *ಪಾಸ್‌ವರ್ಡ್ (Password)*: ${registeredCrpInfo.password}\n\n🌐 ಅಧಿಕೃತ ಪೋರ್ಟಲ್: ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026–27`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Handlers
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginAsAdmin(adminUsername, adminPassword);
    if (res.success) {
      onSuccess('admin');
      onClose();
    } else {
      setErrorMessage(res.message || 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ.');
    }
  };

  const handleCrpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginAsCrp(crpUsername, crpPassword);
    if (res.success) {
      onSuccess('crp');
      onClose();
    } else {
      setErrorMessage(res.message || 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ.');
    }
  };

  const handleCrpRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const clusterObj = CLUSTERS.find(c => c.id === regCrpCluster);
    const res = registerCrp({
      clusterId: regCrpCluster,
      clusterNameKannada: clusterObj?.nameKannada || '',
      crpName: regCrpName,
      designation: regCrpDesignation,
      phone: regCrpPhone,
      email: regCrpEmail,
      username: regCrpUsername,
      password: regCrpPassword,
    });

    if (res.success) {
      setSuccessMessage('ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ! ನಿಮ್ಮ ಲಾಗಿನ್ ವಿವರಗಳನ್ನು ಕೆಳಗೆ ನೀಡಲಾಗಿದೆ.');
      setCrpUsername(regCrpUsername);
      setCrpPassword(regCrpPassword);
      setRegisteredCrpInfo({
        username: res.account?.username || regCrpUsername,
        password: res.account?.password || regCrpPassword,
        crpName: res.account?.crpName || regCrpName,
        clusterNameKannada: clusterObj?.nameKannada || '',
        phone: res.account?.phone || regCrpPhone,
      });
    } else {
      setErrorMessage(res.message || 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ.');
    }
  };

  const handleSchoolLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = loginAsSchool(schoolDiseOrUser, schoolPassword);
    if (res.success) {
      onSuccess('school');
      onClose();
    } else {
      setErrorMessage(res.message || 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ.');
    }
  };

  const handleSchoolRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    const clusterObj = CLUSTERS.find(c => c.id === regSchoolCluster);
    const res = registerSchool({
      clusterId: regSchoolCluster,
      clusterNameKannada: clusterObj?.nameKannada || '',
      diseCode: regSchoolDise,
      nameKannada: regSchoolName,
      schoolType: regSchoolType,
      headMasterName: regHeadMasterName,
      headMasterPhone: regHeadMasterPhone,
      username: regSchoolUsername,
      password: regSchoolPassword,
    });

    if (res.success) {
      setSuccessMessage(res.message || 'ಶಾಲಾ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!');
      setSchoolDiseOrUser(regSchoolDise || regSchoolUsername);
      setSchoolPassword(regSchoolPassword);
      setTimeout(() => {
        setActiveTab('login');
        setSuccessMessage('ನೋಂದಣಿ ಪೂರ್ಣಗೊಂಡಿದೆ. ಈಗ ಲಾಗಿನ್ ಆಗಿ.');
      }, 1000);
    } else {
      setErrorMessage(res.message || 'ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ.');
    }
  };

  const handleJudgeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!judgeSelectedCluster) {
      setErrorMessage('ದಯವಿಟ್ಟು ಕ್ಲಸ್ಟರ್ ಆಯ್ಕೆಮಾಡಿ.');
      return;
    }
    if (!judgeSelectedName) {
      setErrorMessage('ದಯವಿಟ್ಟು ತೀರ್ಪುಗಾರರ ಹೆಸರನ್ನು ಆಯ್ಕೆಮಾಡಿ.');
      return;
    }
    if (!judgeMobilePassword) {
      setErrorMessage('ದಯವಿಟ್ಟು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಪಾಸ್‌ವರ್ಡ್ ಆಗಿ ನಮೂದಿಸಿ.');
      return;
    }

    const res = loginAsJudge(judgeSelectedCluster, judgeSelectedName, judgeMobilePassword);
    if (res.success) {
      onSuccess('judge');
      onClose();
    } else {
      setErrorMessage(res.message || 'ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ.');
    }
  };

  const autofillDemoCrp = (cId: string) => {
    const cluster = CLUSTERS.find(c => c.id === cId) || CLUSTERS[0];
    const acc = crpAccounts.find(a => a.clusterId === cId);
    if (acc) {
      setCrpUsername(acc.username);
      setCrpPassword(acc.password);
    } else {
      setCrpUsername(`crp_${cluster.nameEnglish.toLowerCase().replace(/[^a-z0-9]/g, '')}`);
      setCrpPassword('crp01');
    }
  };

  const autofillDemoSchool = (dise: string, pass: string) => {
    setSchoolDiseOrUser(dise);
    setSchoolPassword(pass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Ribbon */}
        <div className={`p-5 text-white ${
          role === 'admin' ? 'bg-gradient-to-r from-purple-700 to-purple-900' :
          role === 'crp' ? 'bg-gradient-to-r from-emerald-700 to-emerald-900' :
          role === 'school' ? 'bg-gradient-to-r from-blue-700 to-blue-900' :
          'bg-gradient-to-r from-amber-600 to-amber-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                {role === 'admin' && <ShieldCheck className="w-6 h-6" />}
                {role === 'crp' && <Users className="w-6 h-6" />}
                {role === 'school' && <GraduationCap className="w-6 h-6" />}
                {role === 'judge' && <Award className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-white/80 block">
                  {role === 'admin' ? 'ನಿರ್ವಾಹಕರ ಪ್ರವೇಶ' :
                   role === 'crp' ? 'ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ (CRP)' :
                   role === 'school' ? 'ಶಾಲಾ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು' :
                   'ತೀರ್ಪುಗಾರರ ಮಂಡಳಿ'}
                </span>
                <h3 className="text-lg font-bold">
                  {role === 'admin' ? 'ಅಡ್ಮಿನ್ ಲಾಗಿನ್ / Admin Login' :
                   role === 'crp' ? 'ಸಿ.ಆರ್.ಪಿ ಲಾಗಿನ್ & ನೋಂದಣಿ' :
                   role === 'school' ? 'ಶಾಲಾ ಲಾಗಿನ್ & ನೋಂದಣಿ' :
                   'ನಿರ್ಣಾಯಕರ ಲಾಗಿನ್ / Judge Login'}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher for CRP and School */}
        {(role === 'crp' || role === 'school') && (
          <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
            <button
              onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'login'
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>ಲಾಗಿನ್ (Sign In)</span>
            </button>
            <button
              onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition cursor-pointer ${
                activeTab === 'register'
                  ? 'border-emerald-600 text-emerald-800 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>ಹೊಸ ಬಳಕೆದಾರ ನೋಂದಣಿ (Register)</span>
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. ADMIN LOGIN */}
          {role === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 text-xs text-purple-900 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-purple-700" />
                  <p className="font-bold">ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳು ಹಾಗೂ ತಾಲೂಕು ನೋಡಲ್ ಕಚೇರಿ</p>
                </div>
                <p className="text-purple-700">ಎಲ್ಲಾ 25 ಕ್ಲಸ್ಟರ್‌ಗಳು, ಶಾಲೆಗಳು ಮತ್ತು ಅಂಕಗಳ ಸಮಗ್ರ ನಿಯಂತ್ರಣ.</p>

                {/* Default Admin Credentials Notice */}
                <div className="bg-white p-2.5 rounded-lg border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-purple-600 block">ಡೀಫಾಲ್ಟ್ ಅಡ್ಮಿನ್ ಲಾಗಿನ್ ವಿವರಗಳು:</span>
                    <span className="font-mono text-xs font-bold text-slate-800">
                      ಬಳಕೆದಾರ ಹೆಸರು: <span className="text-purple-700">admin</span> | ಪಾಸ್‌ವರ್ಡ್: <span className="text-purple-700">admin123</span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminUsername('admin');
                      setAdminPassword('admin123');
                    }}
                    className="px-2.5 py-1 text-[11px] font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 rounded transition cursor-pointer self-start sm:self-auto shrink-0"
                  >
                    ಸ್ವಯಂ ಭರ್ತಿ ಮಾಡಿ
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ಬಳಕೆದಾರ ಹೆಸರು (Username)</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ಪಾಸ್‌ವರ್ಡ್ (Password)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 font-mono font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಪ್ರವೇಶಿಸಿ
              </button>
            </form>
          )}

          {/* 2. CRP LOGIN & REGISTRATION */}
          {role === 'crp' && (
            <>
              {activeTab === 'login' ? (
                <form onSubmit={handleCrpLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ಸಿ.ಆರ್.ಪಿ ಬಳಕೆದಾರ ಹೆಸರು (Username)
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="ಉದಾ: crp_belagundi ಅಥವಾ ಕ್ಲಸ್ಟರ್ ಕೋಡ್"
                        value={crpUsername}
                        onChange={(e) => setCrpUsername(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ಪಾಸ್‌ವರ್ಡ್ (Password)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ"
                        value={crpPassword}
                        onChange={(e) => setCrpPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    ಸಿ.ಆರ್.ಪಿ ಲಾಗಿನ್ ಆಗಿ (Sign In)
                  </button>

                  {/* Registered CRPs Quick Select (if any) */}
                  {crpAccounts.length > 0 && (
                    <div className="pt-3 border-t border-slate-200">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1">ನೋಂದಾಯಿತ ಸಿ.ಆರ್.ಪಿ ಖಾತೆಗಳು:</span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200">
                        {crpAccounts.map((acc) => (
                          <button
                            key={acc.id}
                            type="button"
                            onClick={() => {
                              setCrpUsername(acc.username);
                              setCrpPassword(acc.password);
                            }}
                            className="px-2 py-1 text-[10px] bg-white border border-slate-300 rounded hover:border-emerald-500 text-slate-700 font-medium cursor-pointer"
                          >
                            {acc.clusterNameKannada} ({acc.crpName})
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              ) : (
                /* CRP Registration: Show Credentials Summary after registration or show Registration Form */
                registeredCrpInfo ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <h4 className="text-sm">ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ!</h4>
                      </div>
                      
                      <p className="text-xs text-slate-600">
                        ದಯವಿಟ್ಟು ಈ ಕೆಳಗಿನ ನಿಮ್ಮ ಅಧಿಕೃತ ಲಾಗಿನ್ ವಿವರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಬರೆದಿಟ್ಟುಕೊಳ್ಳಿ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಸೇವ್ ಮಾಡಿಕೊಳ್ಳಿ:
                      </p>

                      <div className="space-y-2 bg-white p-3 rounded-lg border border-emerald-200 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">ಕ್ಲಸ್ಟರ್:</span>
                          <span className="font-bold text-slate-900">{registeredCrpInfo.clusterNameKannada}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">ಸಿ.ಆರ್.ಪಿ ಹೆಸರು:</span>
                          <span className="font-bold text-slate-900">{registeredCrpInfo.crpName}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">ಮೊಬೈಲ್ ಸಂಖ್ಯೆ:</span>
                          <span className="font-bold text-slate-900">{registeredCrpInfo.phone}</span>
                        </div>

                        {/* Username with Copy */}
                        <div className="flex justify-between items-center py-2 bg-emerald-50/70 px-2.5 rounded-lg border border-emerald-200">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-900 block">ಬಳಕೆದಾರ ಹೆಸರು (Username):</span>
                            <span className="font-mono font-extrabold text-sm text-emerald-800">{registeredCrpInfo.username}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(registeredCrpInfo.username, 'username')}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded shadow-2xs transition cursor-pointer"
                          >
                            {copiedField === 'username' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'username' ? 'ನಕಲಿಸಲಾಗಿದೆ' : 'ಕಾಪಿ'}</span>
                          </button>
                        </div>

                        {/* Password with Copy */}
                        <div className="flex justify-between items-center py-2 bg-emerald-50/70 px-2.5 rounded-lg border border-emerald-200">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-900 block">ಪಾಸ್‌ವರ್ಡ್ (Password):</span>
                            <span className="font-mono font-extrabold text-sm text-emerald-800">{registeredCrpInfo.password}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(registeredCrpInfo.password, 'password')}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded shadow-2xs transition cursor-pointer"
                          >
                            {copiedField === 'password' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedField === 'password' ? 'ನಕಲಿಸಲಾಗಿದೆ' : 'ಕಾಪಿ'}</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-1">
                        <button
                          type="button"
                          onClick={shareCredentialsWhatsApp}
                          className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಸೇವ್ ಮಾಡಿ</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setCrpUsername(registeredCrpInfo.username);
                            setCrpPassword(registeredCrpInfo.password);
                            setActiveTab('login');
                          }}
                          className="flex-1 py-2 px-3 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>ಈಗಲೇ ಲಾಗಿನ್ ಆಗಿ (Sign In)</span>
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setRegisteredCrpInfo(null);
                        setRegCrpName('');
                        setRegCrpPhone('');
                        setRegCrpUsername('');
                        setRegCrpPassword('');
                      }}
                      className="w-full py-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                    >
                      + ಮತ್ತೊಂದು ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ ಮಾಡಿ (Register Another)
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCrpRegister} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        ಅಧಿಕೃತ ಕ್ಲಸ್ಟರ್ ಆಯ್ಕೆಮಾಡಿ (Select Cluster) *
                      </label>
                      <select
                        value={regCrpCluster}
                        onChange={(e) => setRegCrpCluster(e.target.value)}
                        className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500"
                      >
                        {CLUSTERS.map((cl) => (
                          <option key={cl.id} value={cl.id}>
                            {cl.code} - {cl.nameKannada} ({cl.nameEnglish})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ಸಿ.ಆರ್.ಪಿ ಹೆಸರು *</label>
                        <input
                          type="text"
                          required
                          placeholder="ಶ್ರೀ / ಶ್ರೀಮತಿ..."
                          value={regCrpName}
                          onChange={(e) => setRegCrpName(e.target.value)}
                          className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="10-ಅಂಕಿಯ ಮೊಬೈಲ್"
                          value={regCrpPhone}
                          onChange={(e) => setRegCrpPhone(e.target.value)}
                          className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ಹುದ್ದೆ (Designation)</label>
                      <input
                        type="text"
                        value={regCrpDesignation}
                        onChange={(e) => setRegCrpDesignation(e.target.value)}
                        className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-bold text-emerald-800 mb-1">
                          ಬಳಕೆದಾರ ಹೆಸರು ಸೃಜಿಸಿ (Username) *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="ಉದಾ: crp_belagundi"
                          value={regCrpUsername}
                          onChange={(e) => setRegCrpUsername(e.target.value)}
                          className="w-full py-2 px-3 text-xs border border-emerald-300 bg-emerald-50/50 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-emerald-800 mb-1">
                          ಪಾಸ್‌ವರ್ಡ್ ಸೃಜಿಸಿ (Password) *
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="ಕನಿಷ್ಠ 4 ಅಕ್ಷರಗಳು"
                          value={regCrpPassword}
                          onChange={(e) => setRegCrpPassword(e.target.value)}
                          className="w-full py-2 px-3 text-xs border border-emerald-300 bg-emerald-50/50 rounded-lg focus:ring-2 focus:ring-emerald-500 font-mono"
                        />
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 pt-1">
                      * ನೀವು ಸೃಜಿಸುವ ಈ Username ಮತ್ತು Password ಬಳಸಿ ನಂತರ ಲಾಗಿನ್ ಆಗಬಹುದು. ನೋಂದಣಿ ಪೂರ್ಣಗೊಂಡ ತಕ್ಷಣ ಲಾಗಿನ್ ವಿವರಗಳನ್ನು ಪರದೆಯ ಮೇಲೆ ಪ್ರದರ್ಶಿಸಲಾಗುವುದು.
                    </p>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                    >
                      ಸಿ.ಆರ್.ಪಿ ಖಾತೆ ನೋಂದಾಯಿಸಿ (Register CRP)
                    </button>
                  </form>
                )
              )}
            </>
          )}

          {/* 3. SCHOOL LOGIN & REGISTRATION */}
          {role === 'school' && (
            <>
              {activeTab === 'login' ? (
                <form onSubmit={handleSchoolLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ಶಾಲಾ DISE ಕೋಡ್ ಅಥವಾ Username
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        required
                        placeholder="11-ಅಂಕಿಯ DISE ಕೋಡ್ (ಉದಾ: 29010200101)"
                        value={schoolDiseOrUser}
                        onChange={(e) => setSchoolDiseOrUser(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ಪಾಸ್‌ವರ್ಡ್ (Password)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ"
                        value={schoolPassword}
                        onChange={(e) => setSchoolPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    ಶಾಲಾ ಲಾಗಿನ್ ಆಗಿ (School Sign In)
                  </button>

                  {/* Demo Quick Pick */}
                  <div className="pt-3 border-t border-slate-200">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1">ಪರೀಕ್ಷಾರ್ಥ ಶಾಲೆಗಳು (Demo Schools):</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 rounded-lg border border-slate-200">
                      <button
                        type="button"
                        onClick={() => autofillDemoSchool('29010200101', '0101')}
                        className="px-2 py-1 text-[10px] bg-white border border-slate-300 rounded hover:border-blue-500 text-slate-700 cursor-pointer"
                      >
                        ಸ.ಮಾ.ಪ್ರಾ.ಶಾಲೆ ಅರಳಿಕಟ್ಟಿ
                      </button>
                      <button
                        type="button"
                        onClick={() => autofillDemoSchool('29010200201', '0201')}
                        className="px-2 py-1 text-[10px] bg-white border border-slate-300 rounded hover:border-blue-500 text-slate-700 cursor-pointer"
                      >
                        ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ ಬಾಳೇಕುಂದ್ರಿ
                      </button>
                      <button
                        type="button"
                        onClick={() => autofillDemoSchool('29010200301', '0301')}
                        className="px-2 py-1 text-[10px] bg-white border border-slate-300 rounded hover:border-blue-500 text-slate-700 cursor-pointer"
                      >
                        ಸ.ಹಿ.ಪ್ರಾ.ಶಾಲೆ ಬೆಳಗುಂದಿ
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* School Self-Registration Form */
                /* Requirement: "ಅದೇ ರೀತಿ ಶಾಲೆಯ ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು ಕೂಡ ತಮ್ಮನ್ನು ತಾವು ನೋಂದಾಯಿಸಿಕೊಳ್ಳಬೇಕು ಮತ್ತು ಮಕ್ಕಳನ್ನು ನೋಂದಾಯಿಸಬೇಕು. ಇವರು ತಮ್ಮ ಶಾಲೆಯ ಮಕ್ಕಳ ಮಾಹಿತಿಯನ್ನು ಮಾತ್ರ ನೋಡುವಂತಿರಬೇಕು ಹಾಗೂ ತಮ್ಮ ಮಕ್ಕಳ ಮಾಹಿತಿಯನ್ನು ಬದಲಾಯಿಸಬಹುದು." */
                <form onSubmit={handleSchoolRegister} className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ಶಾಲೆ ವ್ಯಾಪ್ತಿಯ ಕ್ಲಸ್ಟರ್ (Select Cluster) *
                    </label>
                    <select
                      value={regSchoolCluster}
                      onChange={(e) => setRegSchoolCluster(e.target.value)}
                      className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                    >
                      {CLUSTERS.map((cl) => (
                        <option key={cl.id} value={cl.id}>
                          {cl.nameKannada} ({cl.nameEnglish})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ಶಾಲೆಯ ಪೂರ್ಣ ಹೆಸರು (School Name) *</label>
                    <input
                      type="text"
                      required
                      placeholder="ಉದಾ: ಸರ್ಕಾರಿ ಮಾದರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ..."
                      value={regSchoolName}
                      onChange={(e) => setRegSchoolName(e.target.value)}
                      className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">DISE ಕೋಡ್ (11 ಅಂಕಿಗಳು) *</label>
                      <input
                        type="text"
                        required
                        maxLength={11}
                        placeholder="290102..."
                        value={regSchoolDise}
                        onChange={(e) => setRegSchoolDise(e.target.value)}
                        className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ಶಾಲೆಯ ವಿಧ</label>
                      <select
                        value={regSchoolType}
                        onChange={(e) => setRegSchoolType(e.target.value as any)}
                        className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white"
                      >
                        <option value="ಸರ್ಕಾರಿ">ಸರ್ಕಾರಿ</option>
                        <option value="ಅನುದಾನಿತ">ಅನುದಾನಿತ</option>
                        <option value="ಅನುದಾನರಹಿತ">ಅನುದಾನರಹಿತ</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ಮುಖ್ಯೋಪಾಧ್ಯಾಯರ ಹೆಸರು *</label>
                      <input
                        type="text"
                        required
                        placeholder="ಶ್ರೀ / ಶ್ರೀಮತಿ..."
                        value={regHeadMasterName}
                        onChange={(e) => setRegHeadMasterName(e.target.value)}
                        className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">ಮೊಬೈಲ್ ಸಂಖ್ಯೆ *</label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="10-ಅಂಕಿಯ ಮೊಬೈಲ್"
                        value={regHeadMasterPhone}
                        onChange={(e) => setRegHeadMasterPhone(e.target.value)}
                        className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-blue-800 mb-1">
                        ಬಳಕೆದಾರ ಹೆಸರು ಸೃಜಿಸಿ (Username) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ಉದಾ: school_dise ಅಥವಾ ಹೆಸರು"
                        value={regSchoolUsername}
                        onChange={(e) => setRegSchoolUsername(e.target.value)}
                        className="w-full py-2 px-3 text-xs border border-blue-300 bg-blue-50/50 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-800 mb-1">
                        ಪಾಸ್‌ವರ್ಡ್ ಸೃಜಿಸಿ (Password) *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="ಕನಿಷ್ಠ 4 ಅಕ್ಷರಗಳು"
                        value={regSchoolPassword}
                        onChange={(e) => setRegSchoolPassword(e.target.value)}
                        className="w-full py-2 px-3 text-xs border border-blue-300 bg-blue-50/50 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 pt-1">
                    * ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು ಲಾಗಿನ್ ಆದ ನಂತರ ತಮ್ಮ ಶಾಲೆಯ ಮಕ್ಕಳನ್ನು ಮಾತ್ರ ನೋಂದಾಯಿಸಬಹುದು ಮತ್ತು ವೀಕ್ಷಿಸಬಹುದು.
                  </p>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    ಶಾಲಾ ಖಾತೆ ನೋಂದಾಯಿಸಿ (Register School)
                  </button>
                </form>
              )}
            </>
          )}

          {/* 4. JUDGE LOGIN */}
          {/* User Specification verbatim:
              "ನಿರ್ಣಾಯಕರು ತಮ್ಮ cluster ಆಯ್ಕೆಮಾಡಿ, ಅದರಲ್ಲಿ ತಮ್ಮ ಹೆಸರನ್ನು ಆಯ್ಕೆ ಮಾಡಿ (ಅವರ ನೋಂದಾಯಿತ ಮೋಬೈಲ್ ನಂಬರ್ ಪಾಸವರ್ಡ ಅಗಿರಬೇಕು) ಲಾಗಿನ್ ಆಗುತ್ತಾರೆ.
               ಅವರು ಲಾಗಿನ್ನ ಆದ ನಂತರ ತಮಗೆ ನಿಗದಿಪಡಿಸಿದ ಸ್ಪರ್ಧೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ಅಂಕಗಳನ್ನು ನಮೂದಿಸಿ ಸೇವ್ ಮಾಡಬೇಕು." */}
          {role === 'judge' && (
            <form onSubmit={handleJudgeLogin} className="space-y-4">
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <p className="font-bold">ತೀರ್ಪುಗಾರರ ಅಧಿಕೃತ ಲಾಗಿನ್ ವ್ಯವಸ್ಥೆ</p>
                <p className="text-amber-800">
                  ನಿಮ್ಮ ಕ್ಲಸ್ಟರ್ ಆಯ್ಕೆಮಾಡಿ, ನಿಮ್ಮ ಹೆಸರನ್ನು ಕ್ಲಿಕ್ ಮಾಡಿ, ಮತ್ತು ಸಿ.ಆರ್.ಪಿ ನೋಂದಾಯಿಸಿರುವ ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಪಾಸ್‌ವರ್ಡ್ ಆಗಿ ನಮೂದಿಸಿ.
                </p>
              </div>

              {/* Step 1: Select Cluster */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. ಸ್ಪರ್ಧಾ ಕ್ಲಸ್ಟರ್ ಆಯ್ಕೆಮಾಡಿ (Select Cluster) *
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <select
                    value={judgeSelectedCluster}
                    onChange={(e) => setJudgeSelectedCluster(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {CLUSTERS.map((cl) => (
                      <option key={cl.id} value={cl.id}>
                        {cl.code} - {cl.nameKannada} ({cl.nameEnglish})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Select Judge Name (filtered to that cluster) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. ನಿಮ್ಮ ಹೆಸರನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select Judge Name) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  {clusterJudges.length > 0 ? (
                    <select
                      value={judgeSelectedName}
                      onChange={(e) => setJudgeSelectedName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-slate-900"
                    >
                      {clusterJudges.map((j) => (
                        <option key={j.id} value={j.nameKannada}>
                          {j.nameKannada} ({j.code} - {j.institution})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="w-full pl-9 pr-3 py-2 text-xs border border-amber-300 bg-amber-50/70 rounded-lg text-amber-800">
                      ಈ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ಇನ್ನೂ ನಿರ್ಣಾಯಕರ ನೇಮಕವಾಗಿಲ್ಲ. ಸಿ.ಆರ್.ಪಿ ಲಾಗಿನ್ ಮೂಲಕ ನೋಂದಾಯಿಸಿ.
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Password = Registered Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. ಪಾಸ್‌ವರ್ಡ್ (ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    maxLength={10}
                    placeholder="10-ಅಂಕಿಯ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ"
                    value={judgeMobilePassword}
                    onChange={(e) => setJudgeMobilePassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  💡 ಸಿ.ಆರ್.ಪಿ ಅವರು ನಿಮ್ಮನ್ನು ನೋಂದಾಯಿಸುವಾಗ ನೀಡಿದ 10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯೇ ನಿಮ್ಮ ಅಧಿಕೃತ ಪಾಸ್‌ವರ್ಡ್ ಆಗಿದೆ.
                </p>
              </div>

              {/* Quick autofill for active demo judges */}
              {clusterJudges.length > 0 && (
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 block mb-1">ಶೀಘ್ರ ಪರೀಕ್ಷಾರ್ಥ ಪಾಸ್‌ವರ್ಡ್ (Demo Mobile):</span>
                  <div className="flex flex-wrap gap-2">
                    {clusterJudges.map((j) => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => {
                          setJudgeSelectedName(j.nameKannada);
                          setJudgeMobilePassword(j.phone);
                        }}
                        className="px-2 py-1 text-[11px] bg-white border border-amber-300 text-amber-900 rounded font-mono hover:bg-amber-100 transition cursor-pointer"
                      >
                        {j.nameKannada}: {j.phone}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={clusterJudges.length === 0}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                ನಿರ್ಣಾಯಕರ ಮೌಲ್ಯಮಾಪನ ಕೋಶಕ್ಕೆ ಪ್ರವೇಶಿಸಿ
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
