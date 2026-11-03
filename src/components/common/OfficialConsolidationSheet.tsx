import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CLUSTERS, COMPETITION_EVENTS } from '../../data/mockData';
import { CompetitionCategory } from '../../types';
import { 
  Printer, 
  Share2, 
  Download, 
  CheckCircle2, 
  Award, 
  Sparkles, 
  Filter,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { 
  exportConsolidationPdf, 
  exportConsolidationImage, 
  shareConsolidationWhatsApp 
} from '../../utils/consolidationPdfHelper';

export interface OfficialConsolidationSheetProps {
  initialClusterId?: string;
  initialCategory?: CompetitionCategory;
  initialMode?: 'cluster_winners' | 'taluk_selection';
  readOnly?: boolean;
}

interface EventRowDef {
  code: string;
  name: string;
  isGroup?: boolean;
}

// 1. Official event definitions matching the exact government paper forms
// Kanthapatha in all divisions includes: Kannada, English, Hindi, Urdu, Marathi, Tulu, Tamil, Telugu
const JUNIOR_EVENTS: EventRowDef[] = [
  { code: '1a', name: 'ಕಂಠಪಾಠ ಕನ್ನಡ' },
  { code: '1b', name: 'ಕಂಠಪಾಠ ಆಂಗ್ಲ' },
  { code: '1c', name: 'ಕಂಠಪಾಠ ಹಿಂದಿ' },
  { code: '1d', name: 'ಕಂಠಪಾಠ ಉರ್ದು' },
  { code: '1e', name: 'ಕಂಠಪಾಠ ಮರಾಠಿ' },
  { code: '1f', name: 'ಕಂಠಪಾಠ ತುಳು' },
  { code: '1g', name: 'ಕಂಠಪಾಠ ತಮಿಳು' },
  { code: '1h', name: 'ಕಂಠಪಾಠ ತೆಲುಗು' },
  { code: '2a', name: 'ಧಾರ್ಮಿಕ ಪಠಣ ಸಂಸ್ಕೃತ' },
  { code: '2b', name: 'ಧಾರ್ಮಿಕ ಪಠಣ ಅರೇಬಿಕ್' },
  { code: '3', name: 'ದೇಶಭಕ್ತಿಗೀತೆ' },
  { code: '4', name: 'ಛದ್ಮವೇಷ' },
  { code: '5', name: 'ಕಥೆಹೇಳುವುದು' },
  { code: '6', name: 'ಚಿತ್ರಕಲೆ' },
  { code: '7', name: 'ಅಭಿನಯ ಗೀತೆ' },
  { code: '8', name: 'ಕ್ಲೇ ಮಾಡೆಲಿಂಗ್' },
  { code: '9', name: 'ಭಕ್ತಿಗೀತೆ' },
  { code: '10', name: 'ಆಶುಭಾಷಣ' },
];

const SENIOR_EVENTS: EventRowDef[] = [
  { code: '1a', name: 'ಕಂಠಪಾಠ ಕನ್ನಡ' },
  { code: '1b', name: 'ಕಂಠಪಾಠ ಆಂಗ್ಲ' },
  { code: '1c', name: 'ಕಂಠಪಾಠ ಹಿಂದಿ' },
  { code: '1d', name: 'ಕಂಠಪಾಠ ಉರ್ದು' },
  { code: '1e', name: 'ಕಂಠಪಾಠ ಮರಾಠಿ' },
  { code: '1f', name: 'ಕಂಠಪಾಠ ತುಳು' },
  { code: '1g', name: 'ಕಂಠಪಾಠ ತಮಿಳು' },
  { code: '1h', name: 'ಕಂಠಪಾಠ ತೆಲುಗು' },
  { code: '2a', name: 'ಧಾರ್ಮಿಕ ಪಠಣ ಸಂಸ್ಕೃತ' },
  { code: '2b', name: 'ಧಾರ್ಮಿಕ ಪಠಣ ಅರೇಬಿಕ್' },
  { code: '3', name: 'ದೇಶಭಕ್ತಿಗೀತೆ' },
  { code: '4', name: 'ಪ್ರಬಂಧ ರಚನೆ' },
  { code: '5', name: 'ಕಥೆಹೇಳುವುದು' },
  { code: '6', name: 'ಚಿತ್ರಕಲೆ' },
  { code: '7', name: 'ಅಭಿನಯ ಗೀತೆ' },
  { code: '8', name: 'ಕ್ಲೇ ಮಾಡೆಲಿಂಗ್' },
  { code: '9', name: 'ಭಕ್ತಿಗೀತೆ' },
  { code: '10', name: 'ಆಶುಭಾಷಣ' },
  { code: '11', name: 'ಪದ್ಯ/ಕವನವಾಚನ' },
  { code: '12', name: 'ಮಿಮಿಕ್ರಿ' },
];

const HIGH_SCHOOL_EVENTS: EventRowDef[] = [
  { code: '1a', name: 'ಕಂಠಪಾಠ ಕನ್ನಡ' },
  { code: '1b', name: 'ಕಂಠಪಾಠ ಆಂಗ್ಲ' },
  { code: '1c', name: 'ಕಂಠಪಾಠ ಹಿಂದಿ' },
  { code: '1d', name: 'ಕಂಠಪಾಠ ಉರ್ದು' },
  { code: '1e', name: 'ಕಂಠಪಾಠ ಮರಾಠಿ' },
  { code: '1f', name: 'ಕಂಠಪಾಠ ತುಳು' },
  { code: '1g', name: 'ಕಂಠಪಾಠ ತಮಿಳು' },
  { code: '1h', name: 'ಕಂಠಪಾಠ ತೆಲುಗು' },
  { code: '2a', name: 'ಧಾರ್ಮಿಕ ಪಠಣ ಸಂಸ್ಕೃತ' },
  { code: '2b', name: 'ಧಾರ್ಮಿಕ ಪಠಣ ಅರೇಬಿಕ್' },
  { code: '3', name: 'ದೇಶಭಕ್ತಿಗೀತೆ' },
  { code: '4', name: 'ಪ್ರಬಂಧ ರಚನೆ' },
  { code: '5', name: 'ಚರ್ಚಾ ಸ್ಪರ್ಧೆ' },
  { code: '6', name: 'ಚಿತ್ರಕಲೆ' },
  { code: '7', name: 'ಶಾಸ್ತ್ರೀಯ ಸಂಗೀತ' },
  { code: '8', name: 'ಕ್ಲೇ ಮಾಡೆಲಿಂಗ್' },
  { code: '9', name: 'ಭಕ್ತಿಗೀತೆ' },
  { code: '10', name: 'ಆಶುಭಾಷಣ' },
  { code: '11', name: 'ಭಾವಗೀತೆ' },
  { code: '12', name: 'ಜಾನಪದ ಗೀತೆ' },
  { code: '13', name: 'ಗಝಲ್' },
  { code: '14', name: 'ಮಿಮಿಕ್ರಿ' },
  { code: '15', name: 'ಕವ್ವಾಲಿ', isGroup: true },
  { code: '16', name: 'ಜಾನಪದ ನೃತ್ಯ', isGroup: true },
  { code: '17', name: 'ಕ್ವಿಜ್', isGroup: true },
];

// Helper to accurately match event names with language variants without cross-matching
const matchEventNames = (rowEventName: string, candidateEventName: string): boolean => {
  const norm1 = rowEventName.replace(/[\s\(\)\-_]/g, '');
  const norm2 = candidateEventName.replace(/[\s\(\)\-_]/g, '');
  if (norm1 === norm2) return true;

  const languages = ['ಕನ್ನಡ', 'ಆಂಗ್ಲ', 'ಇಂಗ್ಲಿಷ್', 'ಇಂಗ್ಲೀಷ', 'ಹಿಂದಿ', 'ಉರ್ದು', 'ಮರಾಠಿ', 'ತುಳು', 'ತಮಿಳು', 'ತೆಲುಗು', 'ಸಂಸ್ಕೃತ', 'ಅರೇಬಿಕ್'];
  const lang1 = languages.find(l => norm1.includes(l.replace(/[\s\(\)\-_]/g, '')));
  const lang2 = languages.find(l => norm2.includes(l.replace(/[\s\(\)\-_]/g, '')));

  if (lang1 || lang2) {
    if (!lang1 || !lang2) return false;
    const isEnglish1 = lang1 === 'ಆಂಗ್ಲ' || lang1.startsWith('ಇಂಗ್ಲಿ');
    const isEnglish2 = lang2 === 'ಆಂಗ್ಲ' || lang2.startsWith('ಇಂಗ್ಲಿ');
    if (isEnglish1 && isEnglish2) return true;
    return lang1 === lang2;
  }

  return norm1.includes(norm2) || norm2.includes(norm1);
};

export const OfficialConsolidationSheet: React.FC<OfficialConsolidationSheetProps> = ({
  initialClusterId,
  initialCategory = 'junior',
  initialMode = 'cluster_winners',
  readOnly = false,
}) => {
  const { officialInfo, visibleStudents, scoreEntries, currentUser } = useApp();

  const [selectedClusterId, setSelectedClusterId] = useState<string>(
    initialClusterId || currentUser?.clusterId || CLUSTERS[0].id
  );
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategory>(initialCategory);
  const [reportMode, setReportMode] = useState<'cluster_winners' | 'taluk_selection'>(initialMode);
  const [showShareToast, setShowShareToast] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState('');

  const activeCluster = CLUSTERS.find(c => c.id === selectedClusterId) || CLUSTERS[0];

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Pick events based on selected division
  const currentEventDefs =
    selectedCategory === 'junior'
      ? JUNIOR_EVENTS
      : selectedCategory === 'senior'
      ? SENIOR_EVENTS
      : HIGH_SCHOOL_EVENTS;

  const categoryTitle =
    selectedCategory === 'junior'
      ? 'ಕಿರಿಯ ವಿಭಾಗ (1 ರಿಂದ 4ನೇ ತರಗತಿ)'
      : selectedCategory === 'senior'
      ? 'ಹಿರಿಯ ವಿಭಾಗ (5 ರಿಂದ 7ನೇ ತರಗತಿ)'
      : 'ಪ್ರೌಢ ವಿಭಾಗ (8 ರಿಂದ 12ನೇ ತರಗತಿ)';

  const categorySubTitle =
    selectedCategory === 'junior'
      ? '1. ವೈಯಕ್ತಿಕ ವಿಭಾಗ - ಕಿರಿಯ'
      : selectedCategory === 'senior'
      ? '1. ವೈಯಕ್ತಿಕ ವಿಭಾಗ - ಹಿರಿಯ'
      : '1. ವೈಯಕ್ತಿಕ ಹಾಗೂ ಸಾಮೂಹಿಕ ವಿಭಾಗ - ಪ್ರೌಢ';

  // Find winner student for a given competition name and rank (1, 2, or 3)
  const getWinnerForEvent = (eventName: string, rank: number) => {
    // 1. Look in score entries
    const scoreMatch = scoreEntries.find(s => {
      const matchCluster = !s.clusterId || s.clusterId === selectedClusterId || s.clusterNameKannada === activeCluster.nameKannada;
      const matchEvent = matchEventNames(eventName, s.eventNameKannada);
      return matchCluster && matchEvent && s.rank === rank;
    });

    if (scoreMatch) {
      const studentObj = visibleStudents.find(st => st.chestNumber === scoreMatch.chestNumber);
      return {
        studentName: scoreMatch.studentNameKannada,
        schoolName: scoreMatch.schoolNameKannada,
        grade: studentObj ? studentObj.grade : (selectedCategory === 'junior' ? '4ನೇ ತರಗತಿ' : selectedCategory === 'senior' ? '7ನೇ ತರಗತಿ' : '10ನೇ ತರಗತಿ'),
        score: scoreMatch.consolidatedAverage,
      };
    }

    // 2. Fallback to registered students of this cluster for demonstration if no score entry exists yet
    const matchingStudents = visibleStudents.filter(st => {
      const matchCl = st.clusterId === selectedClusterId;
      const matchCat = st.categoryId === selectedCategory;
      const matchEv = matchEventNames(eventName, st.eventNameKannada);
      return matchCl && matchCat && matchEv;
    });

    if (matchingStudents[rank - 1]) {
      const st = matchingStudents[rank - 1];
      return {
        studentName: st.nameKannada,
        schoolName: st.schoolNameKannada,
        grade: st.grade,
        score: rank === 1 ? 9.8 : rank === 2 ? 9.4 : 9.0,
      };
    }

    return null;
  };

  // Direct PDF Download (Client-Side jsPDF + html2canvas engine)
  const handleDownloadPDF = async () => {
    setIsProcessing(true);
    setProcessStatus('PDF ಸಿದ್ಧವಾಗುತ್ತಿದೆ...');
    const filename = reportMode === 'taluk_selection'
      ? `Taluk_Selection_${selectedCategory}_${activeCluster.nameKannada}_2026_27.pdf`
      : `Cluster_Winners_${selectedCategory}_${activeCluster.nameKannada}_2026_27.pdf`;

    const success = await exportConsolidationPdf('official-consolidation-paper', filename, (msg) => {
      setProcessStatus(msg);
    });

    setIsProcessing(false);
    if (success) {
      triggerNotification('PDF ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ!');
    } else {
      triggerNotification('PDF ಡೌನ್‌ಲೋಡ್‌ನಲ್ಲಿ ವ್ಯತ್ಯಾಸ, ಪ್ರಿಂಟ್ ಬಟನ್ ಬಳಸಿ Save as PDF ಮಾಡಬಹುದು.');
    }
  };

  // Direct PNG Image Download
  const handleDownloadImage = async () => {
    setIsProcessing(true);
    setProcessStatus('ಇಮೇಜ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...');
    const filename = reportMode === 'taluk_selection'
      ? `Taluk_Selection_${selectedCategory}_${activeCluster.nameKannada}_2026_27.png`
      : `Cluster_Winners_${selectedCategory}_${activeCluster.nameKannada}_2026_27.png`;

    const blob = await exportConsolidationImage('official-consolidation-paper', filename, (msg) => {
      setProcessStatus(msg);
    });

    setIsProcessing(false);
    if (blob) {
      triggerNotification('ವರದಿಯ ಇಮೇಜ್ (PNG) ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ!');
    }
  };

  // Construct text summary and share with image for WhatsApp
  const handleWhatsAppShare = async () => {
    const title = reportMode === 'taluk_selection'
      ? `🌟 *ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದಿಂದ ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಆಯ್ಕೆಯಾದ ವಿಜೇತರ ಪಟ್ಟಿ 2026-27*`
      : `🏆 *ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ವಿಜೇತರ ಪಟ್ಟಿ 2026-27 (1, 2 & 3ನೇ ಸ್ಥಾನ)*`;

    let message = `${title}\n`;
    message += `🏛️ ${officialInfo.departmentSubKannada} - ${officialInfo.officeKannada}\n`;
    message += `📍 ಕ್ಲಸ್ಟರ್: *${activeCluster.nameKannada}* | ತಾಲೂಕು: *${officialInfo.talukKannada}*\n`;
    message += `📚 ವಿಭಾಗ: *${categoryTitle}*\n`;
    message += `===============================\n\n`;

    currentEventDefs.slice(0, 12).forEach(ev => {
      const first = getWinnerForEvent(ev.name, 1);
      message += `🔹 *${ev.code}. ${ev.name}*\n`;
      if (first) {
        message += `   🥇 ಪ್ರಥಮ: ${first.studentName} (${first.schoolName}, ${first.grade})\n`;
      }
      if (reportMode === 'cluster_winners') {
        const second = getWinnerForEvent(ev.name, 2);
        const third = getWinnerForEvent(ev.name, 3);
        if (second) message += `   🥈 ದ್ವಿತೀಯ: ${second.studentName} (${second.schoolName})\n`;
        if (third) message += `   🥉 ತೃತೀಯ: ${third.studentName} (${third.schoolName})\n`;
      }
      message += `\n`;
    });

    message += `===============================\n`;
    message += `✅ ಸಿ.ಆರ್.ಪಿ (ಸಮೂಹ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ): ${activeCluster.crpName}\n`;
    message += `📞 ಸಹಾಯವಾಣಿ: ${officialInfo.helpline}\n`;
    message += `🌐 ಅಧಿಕೃತ ಪೋರ್ಟಲ್: ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026–27`;

    await shareConsolidationWhatsApp(
      'official-consolidation-paper',
      message,
      `Taluk_Selection_${activeCluster.nameKannada}.png`,
      (msg) => triggerNotification(msg)
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Toolbar (Hidden during print) */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            <button
              onClick={() => setReportMode('cluster_winners')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                reportMode === 'cluster_winners'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              ವಿಜೇತರ ಪಟ್ಟಿ (1, 2 & 3ನೇ ಸ್ಥಾನ)
            </button>
            <button
              onClick={() => setReportMode('taluk_selection')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                reportMode === 'taluk_selection'
                  ? 'bg-indigo-700 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಆಯ್ಕೆ (ಪ್ರಥಮ ಮಾತ್ರ)
            </button>
          </div>

          {/* Division Selector */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
            {[
              { id: 'junior', label: 'ಕಿರಿಯ (1-4)' },
              { id: 'senior', label: 'ಹಿರಿಯ (5-7)' },
              { id: 'high_school', label: 'ಪ್ರೌಢ (8-12)' },
            ].map(div => (
              <button
                key={div.id}
                onClick={() => setSelectedCategory(div.id as CompetitionCategory)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  selectedCategory === div.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {div.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cluster Selector & Actions */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
          <select
            value={selectedClusterId}
            onChange={(e) => setSelectedClusterId(e.target.value)}
            className="py-1.5 px-3 text-xs font-bold bg-white border border-slate-300 rounded-xl text-slate-800 focus:ring-2 focus:ring-amber-500"
          >
            {CLUSTERS.map(c => (
              <option key={c.id} value={c.id}>
                {c.nameKannada} ಕ್ಲಸ್ಟರ್
              </option>
            ))}
          </select>

          {/* WhatsApp Share with Image */}
          <button
            onClick={handleWhatsAppShare}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            title="ಇಮೇಜ್ ಸಹಿತ ವಾಟ್ಸಾಪ್ ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>ವಾಟ್ಸಾಪ್ ಶೇರ್</span>
          </button>

          {/* Direct PDF Download */}
          <button
            onClick={handleDownloadPDF}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            title="ನೇರ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
          >
            {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>PDF ಡೌನ್‌ಲೋಡ್</span>
          </button>

          {/* Download Image (PNG) */}
          <button
            onClick={handleDownloadImage}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            title="ಇಮೇಜ್ (PNG) ಡೌನ್‌ಲೋಡ್"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
            <span>PNG</span>
          </button>

          {/* Print / Export PDF Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>ಪ್ರಿಂಟ್</span>
          </button>
        </div>
      </div>

      {/* Processing Status */}
      {isProcessing && (
        <div className="p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xl flex items-center gap-2 font-bold no-print shadow-xs">
          <Loader2 className="w-4 h-4 text-amber-700 animate-spin" />
          <span>{processStatus || 'ಪ್ರಕ್ರಿಯೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ... ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ'}</span>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-bold no-print shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{notification}</span>
        </div>
      )}

      {/* Official Government Form Paper Sheet (Prints in high-contrast exact replica) */}
      <div 
        id="official-consolidation-paper"
        className="bg-white p-6 sm:p-10 rounded-2xl border-2 border-slate-900 shadow-md print:shadow-none print:border-2 print:border-black print:p-4 text-slate-900 font-sans mx-auto max-w-5xl"
        style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}
      >
        
        {/* Double Top Outer Border Frame */}
        <div className="border border-slate-800 p-4 sm:p-6 print:border-black print:p-2">
          
          {/* 1. Header Section */}
          <div className="text-center space-y-1 pb-2">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 px-2">
              <span className="font-extrabold">ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ</span>
              <span>ತಾಲೂಕು: <strong className="underline decoration-dotted underline-offset-4">{officialInfo.talukKannada}</strong></span>
              <span>ಜಿಲ್ಲೆ: <strong className="underline decoration-dotted underline-offset-4">{officialInfo.districtKannada}</strong></span>
            </div>

            <div className="pt-2">
              <h2 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-900 tracking-wide">
                <span className="border-b-2 border-slate-900 font-bold px-4">{activeCluster.nameKannada}</span> ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ {selectedCategory === 'high_school' ? 'ಪ್ರೌಢ ಶಾಲೆಗಳ' : 'ಕಿರಿಯ ಮತ್ತು ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆಗಳ'}
              </h2>
              <h3 className="text-base sm:text-lg font-black text-slate-950 mt-1">
                ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026-27
              </h3>
            </div>

            {/* Official Double Line Separator as shown in government template */}
            <div className="py-2">
              <div className="border-t-2 border-b border-slate-900 h-1 w-full" />
            </div>

            {/* Form Subtitle */}
            <div className="text-center pt-1">
              <h4 className="text-sm sm:text-base font-extrabold text-slate-900 uppercase">
                {reportMode === 'taluk_selection'
                  ? 'ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದಿಂದ ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಆಯ್ಕೆಯಾದ ವಿಜೇತರ ಪಟ್ಟಿ 2026-27'
                  : 'ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ವಿಜೇತರ ಪಟ್ಟಿ 2026-27'}
              </h4>
              <p className="text-xs sm:text-sm font-bold text-slate-800 mt-1 text-left px-1">
                {categorySubTitle}
              </p>
            </div>
          </div>

          {/* 2. Official Table Section */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse border border-slate-900 text-xs sm:text-[13px] text-slate-900">
              <thead>
                <tr className="bg-slate-100 text-center font-extrabold border-b-2 border-slate-900">
                  <th className="border border-slate-900 py-2 px-1.5 w-12 text-center">ಕ್ರ.ಸಂ</th>
                  <th className="border border-slate-900 py-2 px-3 text-left">ಸ್ಪರ್ಧೆಯ ಹೆಸರು</th>
                  <th className="border border-slate-900 py-2 px-2 w-20 text-center">ಸ್ಥಾನ</th>
                  <th className="border border-slate-900 py-2 px-3 text-left">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
                  <th className="border border-slate-900 py-2 px-3 text-left">ಶಾಲೆಯ ಹೆಸರು</th>
                  <th className="border border-slate-900 py-2 px-2 w-24 text-center">ತರಗತಿ</th>
                  <th className="border border-slate-900 py-2 px-2 w-20 text-center">ಸಹಿ</th>
                </tr>
              </thead>
              <tbody>
                {currentEventDefs.map((ev) => {
                  if (reportMode === 'taluk_selection') {
                    // Only 1st Rank
                    const firstWinner = getWinnerForEvent(ev.name, 1);
                    return (
                      <tr key={ev.code} className="border-b border-slate-800 hover:bg-slate-50">
                        <td className="border border-slate-800 py-2 px-1.5 text-center font-mono font-bold">
                          {ev.code}
                        </td>
                        <td className="border border-slate-800 py-2 px-3 font-bold">
                          {ev.name} {ev.isGroup ? '(ಸಾಮೂಹಿಕ)' : ''}
                        </td>
                        <td className="border border-slate-800 py-2 px-2 text-center font-extrabold text-amber-950 bg-amber-50/40">
                          ಪ್ರಥಮ
                        </td>
                        <td className="border border-slate-800 py-2 px-3 font-semibold">
                          {firstWinner?.studentName || '—'}
                        </td>
                        <td className="border border-slate-800 py-2 px-3">
                          {firstWinner?.schoolName || '—'}
                        </td>
                        <td className="border border-slate-800 py-2 px-2 text-center font-medium">
                          {firstWinner?.grade || '—'}
                        </td>
                        <td className="border border-slate-800 py-2 px-2 text-center font-serif text-[11px] text-slate-400">
                          {firstWinner ? 'ಸಹಿ' : ''}
                        </td>
                      </tr>
                    );
                  }

                  // Cluster Winners Mode: 3 Rows (ಪ್ರಥಮ, ದ್ವಿತೀಯ, ತೃತೀಯ)
                  const w1 = getWinnerForEvent(ev.name, 1);
                  const w2 = getWinnerForEvent(ev.name, 2);
                  const w3 = getWinnerForEvent(ev.name, 3);

                  return (
                    <React.Fragment key={ev.code}>
                      {/* Rank 1: Prathama */}
                      <tr className="border-t border-slate-900 hover:bg-slate-50/50">
                        <td rowSpan={3} className="border border-slate-900 py-2 px-1.5 text-center font-mono font-bold align-middle bg-slate-50/60">
                          {ev.code}
                        </td>
                        <td rowSpan={3} className="border border-slate-900 py-2 px-3 font-bold align-middle bg-slate-50/30">
                          {ev.name} {ev.isGroup ? '(ಸಾಮೂಹಿಕ)' : ''}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-2 text-center font-bold text-amber-950 bg-amber-100/40">
                          ಪ್ರಥಮ
                        </td>
                        <td className="border border-slate-800 py-1.5 px-3 font-bold text-slate-900">
                          {w1?.studentName || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-3 text-slate-800">
                          {w1?.schoolName || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-2 text-center font-medium">
                          {w1?.grade || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-2 text-center text-[10px] text-slate-400">
                          {w1 ? 'ಸಹಿ' : ''}
                        </td>
                      </tr>

                      {/* Rank 2: Dviteeya */}
                      <tr className="hover:bg-slate-50/50">
                        <td className="border border-slate-800 py-1.5 px-2 text-center font-medium text-slate-700 bg-slate-100/50">
                          ದ್ವಿತೀಯ
                        </td>
                        <td className="border border-slate-800 py-1.5 px-3 text-slate-800">
                          {w2?.studentName || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-3 text-slate-700">
                          {w2?.schoolName || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-2 text-center font-medium text-slate-700">
                          {w2?.grade || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-2 text-center text-[10px] text-slate-400">
                          {w2 ? 'ಸಹಿ' : ''}
                        </td>
                      </tr>

                      {/* Rank 3: Triteeya */}
                      <tr className="border-b border-slate-900 hover:bg-slate-50/50">
                        <td className="border border-slate-800 py-1.5 px-2 text-center font-medium text-slate-700 bg-amber-50/20">
                          ತೃತೀಯ
                        </td>
                        <td className="border border-slate-800 py-1.5 px-3 text-slate-800">
                          {w3?.studentName || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-3 text-slate-700">
                          {w3?.schoolName || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-2 text-center font-medium text-slate-700">
                          {w3?.grade || '—'}
                        </td>
                        <td className="border border-slate-800 py-1.5 px-2 text-center text-[10px] text-slate-400">
                          {w3 ? 'ಸಹಿ' : ''}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 3. Official Signatures Section */}
          <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs sm:text-sm font-bold">
            <div className="space-y-1 text-slate-700">
              <p>ದಿನಾಂಕ: <span className="font-mono underline decoration-dotted">{new Date().toLocaleDateString('kn-IN')}</span></p>
              <p>ಸ್ಥಳ: <span className="underline decoration-dotted">{activeCluster.nameKannada}</span></p>
              <p className="text-[11px] text-slate-500 font-normal pt-1">
                * ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಕೇವಲ ಪ್ರಥಮ ಸ್ಥಾನ ಪಡೆದ ಮಕ್ಕಳು ಮಾತ್ರ ಅರ್ಹರಾಗಿರುತ್ತಾರೆ.
              </p>
            </div>

            <div className="text-right space-y-1 pr-4">
              <div className="h-8 border-b border-dashed border-slate-400 w-48 mb-1" />
              <p className="font-extrabold text-slate-900">ಸಮೂಹ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ</p>
              <p className="text-xs text-slate-600 font-normal">
                {activeCluster.crpName} • {activeCluster.nameKannada} ಕ್ಲಸ್ಟರ್
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                ಮೊಬೈಲ್: {activeCluster.crpPhone}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
