import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { COMPETITION_EVENTS, CLUSTERS } from '../../data/mockData';
import { 
  Settings, 
  Building2, 
  Save, 
  CheckCircle2, 
  ShieldCheck, 
  Database, 
  Calendar, 
  Sliders, 
  Sparkles,
  Info
} from 'lucide-react';

export const AdminSettingsView: React.FC = () => {
  const { officialInfo, updateOfficialInfo } = useApp();

  const [beoName, setBeoName] = useState(officialInfo.beoName);
  const [brcName, setBrcName] = useState(officialInfo.brcName);
  const [nodalOfficer, setNodalOfficer] = useState(officialInfo.nodalOfficer);
  const [helpline, setHelpline] = useState(officialInfo.helpline);
  const [address, setAddress] = useState(officialInfo.address);
  const [academicYear, setAcademicYear] = useState(officialInfo.academicYear || '2026–27');
  const [maxIndividualEvents, setMaxIndividualEvents] = useState(2);
  const [maxGroupEvents, setMaxGroupEvents] = useState(1);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setBeoName(officialInfo.beoName);
    setBrcName(officialInfo.brcName);
    setNodalOfficer(officialInfo.nodalOfficer);
    setHelpline(officialInfo.helpline);
    setAddress(officialInfo.address);
    setAcademicYear(officialInfo.academicYear || '2026–27');
  }, [officialInfo]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateOfficialInfo({
      beoName,
      brcName,
      nodalOfficer,
      helpline,
      address,
      academicYear,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3500);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 mb-1">
            <Settings className="w-3.5 h-3.5 text-slate-600" />
            <span>ವ್ಯವಸ್ಥಾ ಸಂರಚನೆ ಹಾಗೂ ಆಡಳಿತ ನಿಯಮಗಳು</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            ನಿರ್ವಾಹಕ ಸಂಯೋಜನೆಗಳು (Admin Settings)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ ತಾಲೂಕು ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026-27 ನ ಮೂಲ ಸಂಯೋಜನೆಗಳು
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>ಸಂಯೋಜನೆಗಳನ್ನು ಉಳಿಸಲಾಗಿದೆ!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Section 1: Official Heading & Office Information */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Building2 className="w-4 h-4 text-purple-600" />
            <span>ಅಧಿಕೃತ ಕಚೇರಿ ಹಾಗೂ ಮುಖ್ಯಸ್ಥರ ವಿವರ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳ ಹೆಸರು (BEO):
              </label>
              <input
                type="text"
                value={beoName}
                onChange={(e) => setBeoName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ಕ್ಷೇತ್ರ ಸಮನ್ವಯಾಧಿಕಾರಿಗಳ ಹೆಸರು (BRC):
              </label>
              <input
                type="text"
                value={brcName}
                onChange={(e) => setBrcName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ಪ್ರತಿಭಾ ಕಾರಂಜಿ ನೋಡಲ್ ಅಧಿಕಾರಿಗಳ ಹೆಸರು:
              </label>
              <input
                type="text"
                value={nodalOfficer}
                onChange={(e) => setNodalOfficer(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ಸಹಾಯವಾಣಿ / ದೂರವಾಣಿ ಸಂಖ್ಯೆಗಳು:
              </label>
              <input
                type="text"
                value={helpline}
                onChange={(e) => setHelpline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                ಕಚೇರಿಯ ಅಧಿಕೃತ ವಿಳಾಸ:
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Competition Rules & Quota */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>ಸ್ಪರ್ಧಾ ಕೋಟಾ ಮತ್ತು ವಿದ್ಯಾರ್ಥಿ ನಿಯಮಾವಳಿ</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">ಶೈಕ್ಷಣಿಕ ವರ್ಷ:</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ವೈಯಕ್ತಿಕ ಸ್ಪರ್ಧೆಗಳ ಗರಿಷ್ಠ ಮಿತಿ (ಪ್ರತಿ ವಿದ್ಯಾರ್ಥಿಗೆ):
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={maxIndividualEvents}
                onChange={(e) => setMaxIndividualEvents(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                ಸಮೂಹ ಸ್ಪರ್ಧೆಗಳ ಗರಿಷ್ಠ ಮಿತಿ (ಪ್ರತಿ ವಿದ್ಯಾರ್ಥಿಗೆ):
              </label>
              <input
                type="number"
                min="1"
                max="3"
                value={maxGroupEvents}
                onChange={(e) => setMaxGroupEvents(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-bold focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Central JSON Configuration & 25 Clusters Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>ಕೇಂದ್ರ JSON ಕಾನ್ಫಿಗರೇಶನ್ (Central JSON Configuration) - 3 ವಿಭಾಗಗಳು & 38 ಸ್ಪರ್ಧೆಗಳು</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">ವಿಭಾಗ 1 (1-4ನೇ ತರಗತಿ)</span>
              <h4 className="font-bold text-xs text-slate-900 mt-2">ಕಿರಿಯ ವಿಭಾಗ (10 ಸ್ಪರ್ಧೆಗಳು)</h4>
              <p className="text-[11px] text-slate-500 mt-1">ಕೇವಲ ವೈಯಕ್ತಿಕ ಸ್ಪರ್ಧೆಗಳು (ಸಾಮೂಹಿಕ ಸ್ಪರ್ಧೆಗಳು ಇರಬಾರದು)</p>
              <ul className="text-[10px] text-slate-600 mt-2 space-y-0.5 list-disc list-inside">
                <li>ಕಂಠಪಾಠ, ಧಾರ್ಮಿಕ ಪಠಣ, ದೇಶಭಕ್ತಿ ಗೀತೆ</li>
                <li>ಭಾವ-ವೇಷ, ಕಥೆ ಹೇಳುವುದು, ಚಿತ್ರಕಲೆ</li>
                <li>ಅಭಿನಯ ಗೀತೆ, ಕ್ಲೇ ಮಾಡೆಲಿಂಗ್, ಭಕ್ತಿ ಗೀತೆ, ಆಶು ಭಾಷಣ</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">ವಿಭಾಗ 2 (5-7ನೇ ತರಗತಿ)</span>
              <h4 className="font-bold text-xs text-slate-900 mt-2">ಹಿರಿಯ ವಿಭಾಗ (12 ಸ್ಪರ್ಧೆಗಳು)</h4>
              <p className="text-[11px] text-slate-500 mt-1">ಕೇವಲ ವೈಯಕ್ತಿಕ ಸ್ಪರ್ಧೆಗಳು (ಸಾಮೂಹಿಕ ಸ್ಪರ್ಧೆಗಳು ಇರಬಾರದು)</p>
              <ul className="text-[10px] text-slate-600 mt-2 space-y-0.5 list-disc list-inside">
                <li>ಕಂಠಪಾಠ, ಧಾರ್ಮಿಕ ಪಠಣ, ದೇಶಭಕ್ತಿ ಗೀತೆ, ಪ್ರಬಂಧ</li>
                <li>ಕಥೆ, ಚಿತ್ರಕಲೆ, ಅಭಿನಯ ಗೀತೆ, ಕ್ಲೇ ಮಾಡೆಲಿಂಗ್</li>
                <li>ಭಕ್ತಿ ಗೀತೆ, ಆಶು ಭಾಷಣ, ಕವನ/ವಚನ ವಾಚನ, ಮಿಮಿಕ್ರಿ</li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">ವಿಭಾಗ 3 (8-12ನೇ ತರಗತಿ)</span>
              <h4 className="font-bold text-xs text-slate-900 mt-2">ಪ್ರೌಢ ವಿಭಾಗ (13 ವೈಯಕ್ತಿಕ + 3 ಸಾಮೂಹಿಕ)</h4>
              <p className="text-[11px] text-slate-500 mt-1">13 ವೈಯಕ್ತಿಕ + 3 ಅಧಿಕೃತ ಸಾಮೂಹಿಕ ಸ್ಪರ್ಧೆಗಳು</p>
              <ul className="text-[10px] text-slate-600 mt-2 space-y-0.5 list-disc list-inside">
                <li>13 ವೈಯಕ್ತಿಕ: ಕಂಠಪಾಠ, ಧಾರ್ಮಿಕ ಪಠಣ, ಜನಪದ ಗೀತೆ, ಭಾವಗೀತೆ, ಭರತನಾಟ್ಯ, ಪ್ರಬಂಧ, ಚಿತ್ರಕಲೆ, ಮಿಮಿಕ್ರಿ, ಚರ್ಚಾಸ್ಪರ್ಧೆ, ರಂಗೋಲಿ, ಗಝಲ್, ಕವನ ವಾಚನ, ಆಶು ಭಾಷಣ</li>
                <li className="font-bold text-amber-800">3 ಸಾಮೂಹಿಕ: ಜನಪದ ನೃತ್ಯ, ಕ್ವಿಜ್, ಕವ್ವಾಲಿ</li>
              </ul>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
            <span>ಕೇಂದ್ರ ಫೈಲ್ ಸ್ಥಳ: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-300">/src/config/competitionConfig.json</code></span>
            <span className="text-emerald-700 font-bold">ಎಲ್ಲಾ Form ಗಳಲ್ಲಿ ಏಕರೂಪವಾಗಿ ಬಳಸಲಾಗುತ್ತಿದೆ</span>
          </div>
        </div>

        {/* Section 4: Stage 1 Architecture & Firebase Integration Readiness */}
        <div className="bg-amber-50/70 rounded-xl border border-amber-200 p-5 space-y-3">
          <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-700" />
            <span>ಹಂತ 1 ಪೂರ್ಣತೆ & ಫೈರ್‌ಬೇಸ್ (Firebase) ಸನ್ನದ್ಧತೆ</span>
          </h3>
          <p className="text-amber-900 leading-relaxed text-xs">
            ಈ ಮೊದಲ ಹಂತದಲ್ಲಿ (Stage 1) ಅಪ್ಲಿಕೇಶನ್‌ನ 4 ಪಾತ್ರಗಳು (Admin, CRP, ಶಾಲೆ, ನಿರ್ಣಾಯಕರು), 25 ಕ್ಲಸ್ಟರ್‌ಗಳು ಹಾಗೂ ಎಲ್ಲಾ 11 ಮಾಡ್ಯೂಲ್‌ಗಳ ಸಂಪೂರ್ಣ UI ರಚನೆ ಮತ್ತು ನ್ಯಾವಿಗೇಶನ್ ವ್ಯವಸ್ಥೆಯನ್ನು ನಿರ್ಮಿಸಲಾಗಿದೆ. ಬಳಕೆದಾರರ ಆದೇಶದಂತೆ ನಕಲಿ ಡೇಟಾಬೇಸ್/ಲಾಗಿನ್ ಬದಲು ಮುಂದಿನ ಹಂತದಲ್ಲಿ ನೈಜ Firebase Authentication ಹಾಗೂ Firestore ಸಂಗ್ರಹಣೆಯನ್ನು ಸುಲಭವಾಗಿ ಅಳವಡಿಸಲು ಇಂಟರ್‌ಫೇಸ್‌ಗಳು ಹಾಗೂ ಮಾದರಿಗಳು ಸಿದ್ಧವಾಗಿವೆ.
          </p>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition"
          >
            <Save className="w-4 h-4" />
            <span>ಸಂಯೋಜನೆಗಳನ್ನು ಉಳಿಸಿ (Save Settings)</span>
          </button>
        </div>

      </form>

    </div>
  );
};
