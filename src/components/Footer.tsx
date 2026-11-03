import React from 'react';
import { useApp } from '../context/AppContext';
import { Phone, Mail, MapPin, Award, CheckCircle2, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { officialInfo } = useApp();
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto border-t border-slate-800 no-print">
      {/* Top Banner Accent */}
      <div className="bg-gradient-to-r from-red-600 via-amber-500 to-red-600 h-1 w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Official Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-bold text-xs text-center p-1">
                ಕ.ಸಂ
              </div>
              <div>
                <h3 className="text-white font-bold text-sm leading-tight">
                  {officialInfo.departmentKannada}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {officialInfo.departmentSubKannada}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {officialInfo.officeKannada}
            </p>

            <div className="inline-block bg-slate-800 px-3 py-1.5 rounded text-[11px] text-amber-300 border border-slate-700">
              {officialInfo.eventNameKannada}
            </div>
          </div>

          {/* Column 2: Key Officials */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>ಅಧಿಕಾರಿಗಳ ವಿವರ</span>
            </h4>
            
            <div className="text-xs space-y-2">
              <div>
                <p className="font-semibold text-slate-200">{officialInfo.beoName}</p>
                <p className="text-slate-400 text-[11px]">{officialInfo.beoDesignation}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">{officialInfo.brcName}</p>
                <p className="text-slate-400 text-[11px]">{officialInfo.brcDesignation}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">{officialInfo.nodalOfficer}</p>
                <p className="text-slate-400 text-[11px]">ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಉಸ್ತುವಾರಿ ಕೋಶ</p>
              </div>
            </div>
          </div>

          {/* Column 3: Contact & Helpdesk */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>ಸಂಪರ್ಕ ಮತ್ತು ಸಹಾಯವಾಣಿ</span>
            </h4>

            <ul className="text-xs space-y-2.5 text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{officialInfo.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{officialInfo.helpline}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{officialInfo.email}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Competition Levels */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <Award className="w-3.5 h-3.5 text-yellow-400" />
              <span>ಸ್ಪರ್ಧಾ ಹಂತಗಳು (2026-27)</span>
            </h4>

            <ul className="text-xs space-y-1.5 text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>1. ಶಾಲಾ ಮಟ್ಟದ ಸ್ಪರ್ಧೆಗಳು</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಪ್ರತಿಭಾ ಕಾರಂಜಿ</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>3. ತಾಲೂಕು ಮಟ್ಟದ ಸ್ಪರ್ಧೆಗಳು (ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>4. ಜಿಲ್ಲಾ ಹಾಗೂ ರಾಜ್ಯ ಮಟ್ಟದ ಕಲೋತ್ಸವ</span>
              </li>
            </ul>
            <p className="text-[11px] text-amber-300/80 pt-1">
              * ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಪ್ರಥಮ ಸ್ಥಾನ ಪಡೆದ ವಿದ್ಯಾರ್ಥಿಗಳು ನೇರ ಆಯ್ಕೆ.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026–2027 ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳ ಕಾರ್ಯಾಲಯ, ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ. ಸರ್ವ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.
          </p>
          <p className="flex items-center gap-1">
            <span>ಕರ್ನಾಟಕ ಶಾಲಾ ಶಿಕ್ಷಣ ಪೋರ್ಟಲ್ ತಂತ್ರಜ್ಞಾನ ವ್ಯವಸ್ಥೆ</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
