import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CLUSTERS } from '../../data/mockData';
import { 
  Printer, 
  Download, 
  FileCode, 
  RefreshCw, 
  ArrowLeft, 
  Eye, 
  Share2, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import { 
  exportJuniorReportPdf, 
  exportJuniorReportImage, 
  shareJuniorReportWhatsApp 
} from '../../utils/juniorReportPdfHelper';

export interface JuniorWinnersReportProps {
  initialClusterId?: string;
  onBack?: () => void;
}

export interface JuniorEventRowDef {
  code: string;
  name: string;
  matcher: string[];
}

// Exact 10 Junior Section events as shown in the official government template (IMG_20261102_144253.jpg)
export const JUNIOR_SECTION_EVENTS: JuniorEventRowDef[] = [
  // Page 1 (1a to 2b: 10 events)
  { code: '1a', name: 'ಕಂಠಪಾಠ ಕನ್ನಡ', matcher: ['ಕಂಠಪಾಠ ಕನ್ನಡ', 'ಕಂಠಪಾಠ (ಕನ್ನಡ)', 'ಕಂಠಪಾಠ-ಕನ್ನಡ'] },
  { code: '1b', name: 'ಕಂಠಪಾಠ ಆಂಗ್ಲ', matcher: ['ಕಂಠಪಾಠ ಆಂಗ್ಲ', 'ಕಂಠಪಾಠ (ಆಂಗ್ಲ)', 'ಕಂಠಪಾಠ (ಇಂಗ್ಲಿಷ್)', 'ಕಂಠಪಾಠ (ಇಂಗ್ಲೀಷ)'] },
  { code: '1c', name: 'ಕಂಠಪಾಠ ಹಿಂದಿ', matcher: ['ಕಂಠಪಾಠ ಹಿಂದಿ', 'ಕಂಠಪಾಠ (ಹಿಂದಿ)', 'ಕಂಠಪಾಠ-ಹಿಂದಿ'] },
  { code: '1d', name: 'ಕಂಠಪಾಠ ಉರ್ದು', matcher: ['ಕಂಠಪಾಠ ಉರ್ದು', 'ಕಂಠಪಾಠ (ಉರ್ದು)', 'ಕಂಠಪಾಠ-ಉರ್ದು'] },
  { code: '1e', name: 'ಕಂಠಪಾಠ ಮರಾಠಿ', matcher: ['ಕಂಠಪಾಠ ಮರಾಠಿ', 'ಕಂಠಪಾಠ (ಮರಾಠಿ)', 'ಕಂಠಪಾಠ-ಮರಾಠಿ'] },
  { code: '1f', name: 'ಕಂಠಪಾಠ ತುಳು', matcher: ['ಕಂಠಪಾಠ ತುಳು', 'ಕಂಠಪಾಠ (ತುಳು)', 'ಕಂಠಪಾಠ-ತುಳು'] },
  { code: '1g', name: 'ಕಂಠಪಾಠ ತಮಿಳು', matcher: ['ಕಂಠಪಾಠ ತಮಿಳು', 'ಕಂಠಪಾಠ (ತಮಿಳು)', 'ಕಂಠಪಾಠ-ತಮಿಳು'] },
  { code: '1h', name: 'ಕಂಠಪಾಠ ತೆಲುಗು', matcher: ['ಕಂಠಪಾಠ ತೆಲುಗು', 'ಕಂಠಪಾಠ (ತೆಲುಗು)', 'ಕಂಠಪಾಠ-ತೆಲುಗು'] },
  { code: '2a', name: 'ಧಾರ್ಮಿಕ ಪಠಣ ಸಂಸ್ಕೃತ', matcher: ['ಧಾರ್ಮಿಕ ಪಠಣ ಸಂಸ್ಕೃತ', 'ಧಾರ್ಮಿಕ ಪಠಣ (ಸಂಸ್ಕೃತ)', 'ಧಾರ್ಮಿಕ ಪಠಣ - ಸಂಸ್ಕೃತ'] },
  { code: '2b', name: 'ಧಾರ್ಮಿಕ ಪಠಣ ಅರೇಬಿಕ್', matcher: ['ಧಾರ್ಮಿಕ ಪಠಣ ಅರೇಬಿಕ್', 'ಧಾರ್ಮಿಕ ಪಠಣ (ಅರೇಬಿಕ್)', 'ಧಾರ್ಮಿಕ ಪಠಣ - ಅರೇಬಿಕ್'] },

  // Page 2 (3 to 10: 8 events)
  { code: '3', name: 'ದೇಶಭಕ್ತಿಗೀತೆ', matcher: ['ದೇಶಭಕ್ತಿಗೀತೆ', 'ದೇಶಭಕ್ತಿ ಗೀತೆ'] },
  { code: '4', name: 'ಛದ್ಮವೇಷ', matcher: ['ಛದ್ಮವೇಷ', 'ಛದ್ಮ ವೇಷ', 'ಭಾವ-ವೇಷ', 'ಭಾವ ವೇಷ', 'ಪ್ರಾರ್ಥನಾ'] },
  { code: '5', name: 'ಕಥೆಹೇಳುವುದು', matcher: ['ಕಥೆಹೇಳುವುದು', 'ಕಥೆ ಹೇಳುವುದು'] },
  { code: '6', name: 'ಚಿತ್ರಕಲೆ', matcher: ['ಚಿತ್ರಕಲೆ'] },
  { code: '7', name: 'ಅಭಿನಯಗೀತೆ', matcher: ['ಅಭಿನಯಗೀತೆ', 'ಅಭಿನಯ ಗೀತೆ'] },
  { code: '8', name: 'ಕ್ಲೇ ಮಾಡೆಲಿಂಗ್', matcher: ['ಕ್ಲೇ ಮಾಡೆಲಿಂಗ್', 'ಕ್ಲೇ ಮಾಡೆಲಿಂಗ'] },
  { code: '9', name: 'ಭಕ್ತಿಗೀತೆ', matcher: ['ಭಕ್ತಿಗೀತೆ', 'ಭಕ್ತಿ ಗೀತೆ'] },
  { code: '10', name: 'ಆಶುಭಾಷಣ', matcher: ['ಆಶುಭಾಷಣ', 'ಆಶು ಭಾಷಣ'] },
];

export const JuniorWinnersReport: React.FC<JuniorWinnersReportProps> = ({
  initialClusterId,
  onBack,
}) => {
  const { officialInfo, visibleStudents, scoreEntries, currentUser } = useApp();

  // User-configurable Header Parameters
  const [talukName, setTalukName] = useState<string>(officialInfo.talukKannada || 'ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ');
  const [districtName, setDistrictName] = useState<string>(officialInfo.districtKannada || 'ಬೆಳಗಾವಿ');
  const [selectedClusterId, setSelectedClusterId] = useState<string>(
    initialClusterId || currentUser?.clusterId || CLUSTERS[0].id
  );

  const [refreshCounter, setRefreshCounter] = useState<number>(0);
  const [notification, setNotification] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processStatus, setProcessStatus] = useState<string>('');

  const activeCluster = useMemo(() => {
    return CLUSTERS.find(c => c.id === selectedClusterId) || CLUSTERS[0];
  }, [selectedClusterId]);

  // Toast helper
  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper to resolve rank 1, 2, 3 winners dynamically from scores & students for Junior division
  const getWinner = (evDef: JuniorEventRowDef, rank: 1 | 2 | 3) => {
    // 1. Direct score entries match for this cluster and event
    const scoredList = scoreEntries.filter(s => {
      const isClMatch = !s.clusterId || s.clusterId === selectedClusterId || s.clusterNameKannada === activeCluster.nameKannada;
      const isEvMatch = evDef.matcher.some(m => s.eventNameKannada.includes(m) || m.includes(s.eventNameKannada));
      return isClMatch && isEvMatch;
    });

    if (scoredList.length > 0) {
      const rankedMatches = [...scoredList].sort((a, b) => {
        if (a.rank && b.rank) return a.rank - b.rank;
        return (b.consolidatedAverage || 0) - (a.consolidatedAverage || 0);
      });

      const matchedScore = rankedMatches.find(s => s.rank === rank) || rankedMatches[rank - 1];
      if (matchedScore) {
        const student = visibleStudents.find(st => st.chestNumber === matchedScore.chestNumber);
        return {
          studentName: matchedScore.studentNameKannada,
          schoolName: matchedScore.schoolNameKannada,
          grade: student?.grade || '4ನೇ ತರಗತಿ',
          score: matchedScore.consolidatedAverage,
        };
      }
    }

    // 2. Demo fallback from junior registered students of this cluster if scored list is empty
    const matchingRegistered = visibleStudents.filter(st => {
      const matchCl = st.clusterId === selectedClusterId;
      const matchCat = st.categoryId === 'junior';
      const matchEv = evDef.matcher.some(m => st.eventNameKannada.includes(m) || m.includes(st.eventNameKannada));
      return matchCl && matchCat && matchEv;
    });

    if (matchingRegistered[rank - 1]) {
      const st = matchingRegistered[rank - 1];
      return {
        studentName: st.nameKannada,
        schoolName: st.schoolNameKannada,
        grade: st.grade || '4ನೇ ತರಗತಿ',
        score: rank === 1 ? 9.7 : rank === 2 ? 9.3 : 8.9,
      };
    }

    // Blank if not entered
    return null;
  };

  // 1. Preview Report (Scroll down to preview paper)
  const handlePreviewReport = () => {
    const el = document.getElementById('junior-report-paper');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    triggerNotification('ಕಿರಿಯ ವಿಭಾಗದ ವರದಿ ಮುನ್ನೋಟ ಸಿದ್ಧವಾಗಿದೆ');
  };

  // 2. Print Report (Native Print dialog)
  const handlePrint = () => {
    window.print();
  };

  // 3. Direct PDF Download (Client-Side jsPDF + html2canvas engine)
  const handleDownloadPDF = async () => {
    setIsProcessing(true);
    setProcessStatus('PDF ಸಿದ್ಧವಾಗುತ್ತಿದೆ...');
    const filename = `Junior_Winners_List_${activeCluster.nameKannada}_2026_27.pdf`;
    
    const success = await exportJuniorReportPdf('junior-report-paper', filename, (msg) => {
      setProcessStatus(msg);
    });

    setIsProcessing(false);
    if (success) {
      triggerNotification('PDF ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ!');
    } else {
      triggerNotification('PDF ಡೌನ್‌ಲೋಡ್‌ನಲ್ಲಿ ವ್ಯತ್ಯಾಸ, ಪ್ರಿಂಟ್ ಬಟನ್ ಬಳಸಿ Save as PDF ಮಾಡಬಹುದು.');
    }
  };

  // 4. Download as PNG Image
  const handleDownloadImage = async () => {
    setIsProcessing(true);
    setProcessStatus('ಇಮೇಜ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...');
    const filename = `Junior_Winners_List_${activeCluster.nameKannada}_2026_27.png`;

    const blob = await exportJuniorReportImage('junior-report-paper', filename, (msg) => {
      setProcessStatus(msg);
    });

    setIsProcessing(false);
    if (blob) {
      triggerNotification('ವರದಿಯ ಇಮೇಜ್ (PNG) ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ!');
    }
  };

  // 5. Download HTML (Standalone portable file)
  const handleDownloadHTML = () => {
    const paperEl = document.getElementById('junior-report-paper');
    if (!paperEl) return;

    const htmlContent = `<!DOCTYPE html>
<html lang="kn">
<head>
  <meta charset="UTF-8">
  <title>ಕಿರಿಯ ವಿಭಾಗದ ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ವಿಜೇತರ ಪಟ್ಟಿ 2026-27 - ${activeCluster.nameKannada}</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 10mm; }
    body { font-family: 'Noto Sans Kannada', sans-serif; background: #fff; color: #000; margin: 0; padding: 20px; font-size: 13px; line-height: 1.35; }
    .report-outer { border: 4px double #000; padding: 16px; margin: 0 auto; max-width: 820px; }
    .header-top { display: flex; justify-content: space-between; font-weight: 800; font-size: 14px; margin-bottom: 8px; }
    .title-center { text-align: center; margin-bottom: 12px; }
    .title-center h2 { margin: 4px 0; font-size: 16px; font-weight: 800; }
    .title-center h1 { margin: 4px 0; font-size: 20px; font-weight: 900; }
    .double-divider { border-top: 3px double #000; margin: 8px 0 12px 0; }
    .sub-head { text-align: center; font-weight: 900; font-size: 15px; margin-bottom: 4px; }
    .sub-cat { font-weight: 800; font-size: 13px; margin: 6px 0; }
    table { width: 100%; border-collapse: collapse; border: 1.5px solid #000; margin-top: 8px; }
    th, td { border: 1px solid #000; padding: 5px 6px; text-align: left; vertical-align: middle; }
    th { text-align: center; font-weight: 800; font-size: 12px; background-color: #f2f2f2; }
    .text-center { text-align: center; }
    .font-bold { font-weight: 700; }
    .page-break { page-break-after: always; break-after: page; margin-bottom: 40px; }
    .sig-section { margin-top: 40px; text-align: right; font-weight: 800; font-size: 13px; padding-right: 20px; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  ${paperEl.outerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Junior_Winners_List_${activeCluster.nameKannada}_2026_27.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerNotification('HTML ಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಡೌನ್‌ಲೋಡ್ ಆಗಿದೆ');
  };

  // 6. Refresh Winners (Re-sync)
  const handleRefreshWinners = () => {
    setRefreshCounter(prev => prev + 1);
    triggerNotification('ಕಿರಿಯ ವಿಭಾಗದ ವಿಜೇತರ ಪಟ್ಟಿಯನ್ನು ನವೀಕರಿಸಲಾಗಿದೆ');
  };

  // 7. WhatsApp Share with Image and Formatted Text
  const handleWhatsAppShare = async () => {
    let msg = `🏆 *ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026–27 – ಕಿರಿಯ ವಿಭಾಗದ ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ವಿಜೇತರ ಪಟ್ಟಿ*\n`;
    msg += `🏛️ ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ | ತಾಲೂಕು: *${talukName}* | ಜಿಲ್ಲೆ: *${districtName}*\n`;
    msg += `📍 ಕ್ಲಸ್ಟರ್: *${activeCluster.nameKannada}*\n`;
    msg += `📜 *1. ವೈಯಕ್ತಿಕ ವಿಭಾಗ ಕಿರಿಯ ವಿಭಾಗ (1 ರಿಂದ 4ನೇ ತರಗತಿ)*\n`;
    msg += `===============================\n\n`;

    JUNIOR_SECTION_EVENTS.forEach(ev => {
      const w1 = getWinner(ev, 1);
      const w2 = getWinner(ev, 2);
      const w3 = getWinner(ev, 3);
      msg += `🔹 *${ev.code}. ${ev.name}*\n`;
      if (w1) msg += `   🥇 ಪ್ರಥಮ: ${w1.studentName} (${w1.schoolName}, ${w1.grade})\n`;
      if (w2) msg += `   🥈 ದ್ವಿತೀಯ: ${w2.studentName} (${w2.schoolName})\n`;
      if (w3) msg += `   🥉 ತೃತೀಯ: ${w3.studentName} (${w3.schoolName})\n`;
      msg += `\n`;
    });

    msg += `===============================\n`;
    msg += `✍️ ಸಮೂಹ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ: ${activeCluster.crpName} (${activeCluster.nameKannada})\n`;
    msg += `🌐 ಅಧಿಕೃತ ಪೋರ್ಟಲ್: ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026-27`;

    await shareJuniorReportWhatsApp(
      'junior-report-paper',
      msg,
      `Junior_Winners_${activeCluster.nameKannada}.png`,
      (nMsg) => triggerNotification(nMsg)
    );
  };

  const page1Events = JUNIOR_SECTION_EVENTS.slice(0, 10); // 1a through 2b (10 events)
  const page2Events = JUNIOR_SECTION_EVENTS.slice(10);    // 3 through 10 (8 events)

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="no-print bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold border border-emerald-300 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವರದಿ ಮಾಡ್ಯೂಲ್ • ಕಿರಿಯ ವಿಭಾಗ (Junior Section)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            ಕಿರಿಯ ವಿಭಾಗದ ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ವಿಜೇತರ ಪಟ್ಟಿ 2026–27
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            ಮಾದರಿ ಚಿತ್ರದ ವಿನ್ಯಾಸದಲ್ಲೇ ರೂಪಿಸಲಾದ 7 ಕಾಲಮ್‌ಗಳ (ಪ್ರಥಮ, ದ್ವಿತೀಯ, ತೃತೀಯ) ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವರದಿ. ಕಿರಿಯ ವಿಭಾಗಕ್ಕೆ ಸಂಬಂಧಿಸಿದ 10 ಸ್ಪರ್ಧೆಗಳನ್ನು ಮಾತ್ರ ಒಳಗೊಂಡಿದೆ.
          </p>
        </div>

        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ಹಿಂದಕ್ಕೆ (Back)</span>
          </button>
        )}
      </div>

      {/* 2. Parameters Configuration Toolbar (Taluk, District, Cluster Selection) */}
      <div className="no-print bg-slate-50 border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-emerald-700" />
          <span>ವರದಿಯ ಶೀರ್ಷಿಕೆ ನಿಯಂತ್ರಣ (Report Header & Cluster Selection):</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Cluster Selection */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              ಕ್ಲಸ್ಟರ್ ಕೇಂದ್ರ (25 ಅಧಿಕೃತ ಕ್ಲಸ್ಟರ್‌ಗಳು):
            </label>
            <select
              value={selectedClusterId}
              onChange={(e) => setSelectedClusterId(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            >
              {CLUSTERS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nameKannada} ಕ್ಲಸ್ಟರ್ ({c.code})
                </option>
              ))}
            </select>
          </div>

          {/* Taluk Name Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              ತಾಲ್ಲೂಕು ಹೆಸರು:
            </label>
            <input
              type="text"
              value={talukName}
              onChange={(e) => setTalukName(e.target.value)}
              placeholder="ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ"
              className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* District Name Input */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              ಜಿಲ್ಲೆ ಹೆಸರು:
            </label>
            <input
              type="text"
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              placeholder="ಬೆಳಗಾವಿ"
              className="w-full py-2 px-3 text-xs bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Action Toolbar (Preview, Print, Direct PDF, Image, HTML, Refresh, WhatsApp) */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Preview Report */}
          <button
            onClick={handlePreviewReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>Preview Report</span>
          </button>

          {/* 2. Print Report */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Print Report</span>
          </button>

          {/* 3. Download PDF (Direct Client-Side Download) */}
          <button
            onClick={handleDownloadPDF}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Download PDF</span>
          </button>

          {/* 4. Download Image (PNG) */}
          <button
            onClick={handleDownloadImage}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            title="ಇಮೇಜ್ (PNG) ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
          >
            <ImageIcon className="w-4 h-4 text-emerald-300" />
            <span>Download Image</span>
          </button>

          {/* 5. Download HTML */}
          <button
            onClick={handleDownloadHTML}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <FileCode className="w-4 h-4" />
            <span>Download HTML</span>
          </button>

          {/* 6. Refresh Winners */}
          <button
            onClick={handleRefreshWinners}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh Winners</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* WhatsApp Share with Image */}
          <button
            onClick={handleWhatsAppShare}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
            title="ಇಮೇಜ್ ಸಹಿತ ವಾಟ್ಸಾಪ್ ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ"
          >
            <Share2 className="w-4 h-4" />
            <span>ವಾಟ್ಸಾಪ್ ಶೇರ್ (ಇಮೇಜ್ ಸಹಿತ)</span>
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="no-print p-3 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xl flex items-center gap-2 font-bold shadow-xs">
          <Loader2 className="w-4 h-4 text-amber-700 animate-spin" />
          <span>{processStatus || 'ಪ್ರಕ್ರಿಯೆ ಪ್ರಗತಿಯಲ್ಲಿದೆ... ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ'}</span>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs rounded-xl flex items-center gap-2 font-bold shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* 4. Exact Official Paper Document for Junior Section (IMG_20261102_144253.jpg) */}
      <div 
        id="junior-report-paper"
        className="bg-white text-black font-sans mx-auto max-w-[840px] shadow-lg print:shadow-none print:w-full"
        style={{ fontFamily: "'Noto Sans Kannada', sans-serif" }}
      >

        {/* ============================================================== */}
        {/* PAGE 1: Header, Subhead, Events 1a through 6                  */}
        {/* ============================================================== */}
        <div className="p-6 sm:p-10 border-4 border-double border-black print:border-4 print:border-double print:border-black print:p-6 mb-8 print:mb-0 print:break-after-page print:min-h-[1050px] flex flex-col justify-between">
          <div>
            {/* Header: ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ, ತಾಲ್ಲೂಕು, ಜಿಲ್ಲೆ */}
            <div className="flex items-center justify-between font-extrabold text-sm sm:text-base border-b border-transparent pb-1">
              <span className="font-extrabold text-base sm:text-lg">ಶಾಲಾ ಶಿಕ್ಷಣ ಇಲಾಖೆ</span>
              <span className="font-bold">
                <span className="underline decoration-dotted font-extrabold">{talukName}</span> ತಾಲ್ಲೂಕು
              </span>
              <span className="font-bold">
                <span className="underline decoration-dotted font-extrabold">{districtName}</span> ಜಿಲ್ಲೆ
              </span>
            </div>

            {/* Cluster and Event Heading */}
            <div className="text-center pt-2 pb-1">
              <h2 className="text-base sm:text-lg font-extrabold tracking-wide">
                <span className="underline decoration-dotted font-black px-2">{activeCluster.nameKannada}</span> ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ಕಿರಿಯ ಮತ್ತು ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆಗಳ
              </h2>
              <h1 className="text-xl sm:text-2xl font-black mt-0.5">
                ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026-27
              </h1>
            </div>

            {/* Double Horizontal Line Divider */}
            <div className="py-1">
              <div className="border-t-2 border-b-2 border-black h-1.5 w-full" />
            </div>

            {/* List Subhead */}
            <div className="text-center pt-1 pb-2">
              <h3 className="text-base sm:text-lg font-black tracking-wide">
                ಕ್ಲಸ್ಟರ್ ಮಟ್ಟದ ವಿಜೇತರ ಪಟ್ಟಿ 2026–27
              </h3>
              <p className="text-xs sm:text-sm font-extrabold text-left pt-1 px-1">
                1. ವೈಯಕ್ತಿಕ ವಿಭಾಗ ಕಿರಿಯ ವಿಭಾಗ
              </p>
            </div>

            {/* Page 1 Official 7-Column Table (1a to 6) */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-xs sm:text-[13px] text-black">
                <thead>
                  <tr className="bg-slate-100 print:bg-white text-center font-extrabold border-b-2 border-black">
                    <th className="border border-black py-2 px-1.5 w-12 text-center font-extrabold">ಕ್ರ.ಸಂ</th>
                    <th className="border border-black py-2 px-3 text-left font-extrabold">ಸ್ಪರ್ಧೆಯ ಹೆಸರು</th>
                    <th className="border border-black py-2 px-2 w-16 text-center font-extrabold">ಸ್ಥಾನ</th>
                    <th className="border border-black py-2 px-3 text-left font-extrabold">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
                    <th className="border border-black py-2 px-3 text-left font-extrabold">ಶಾಲೆಯ ಹೆಸರು</th>
                    <th className="border border-black py-2 px-2 w-20 text-center font-extrabold">ತರಗತಿ</th>
                    <th className="border border-black py-2 px-2 w-16 text-center font-extrabold">ಸಹಿ</th>
                  </tr>
                </thead>
                <tbody>
                  {page1Events.map((ev) => {
                    const w1 = getWinner(ev, 1);
                    const w2 = getWinner(ev, 2);
                    const w3 = getWinner(ev, 3);

                    return (
                      <React.Fragment key={ev.code}>
                        {/* 1st Row: Prathama */}
                        <tr className="border-t border-black">
                          <td rowSpan={3} className="border border-black py-2 px-1 text-center font-mono font-bold align-middle bg-slate-50 print:bg-white">
                            {ev.code}
                          </td>
                          <td rowSpan={3} className="border border-black py-2 px-3 font-bold align-middle bg-slate-50 print:bg-white">
                            {ev.name}
                          </td>
                          <td className="border border-black py-1 px-2 text-center font-extrabold">
                            ಪ್ರಥಮ
                          </td>
                          <td className="border border-black py-1 px-3 font-bold">
                            {w1?.studentName || ''}
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w1?.schoolName || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {w1?.grade || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {/* Blank for physical signature */}
                          </td>
                        </tr>

                        {/* 2nd Row: Dviteeya */}
                        <tr>
                          <td className="border border-black py-1 px-2 text-center font-bold">
                            ದ್ವಿತೀಯ
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w2?.studentName || ''}
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w2?.schoolName || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {w2?.grade || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {/* Blank for physical signature */}
                          </td>
                        </tr>

                        {/* 3rd Row: Triteeya */}
                        <tr className="border-b border-black">
                          <td className="border border-black py-1 px-2 text-center font-bold">
                            ತೃತೀಯ
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w3?.studentName || ''}
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w3?.schoolName || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {w3?.grade || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {/* Blank for physical signature */}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 print:text-black font-mono text-right pt-2">
            ಪುಟ ೧ (Page 1 of 2)
          </div>
        </div>

        {/* ============================================================== */}
        {/* PAGE 2: Events 7 through 10 + CRP Signature at Bottom Right   */}
        {/* ============================================================== */}
        <div className="p-6 sm:p-10 border-4 border-double border-black print:border-4 print:border-double print:border-black print:p-6 print:min-h-[1050px] flex flex-col justify-between">
          <div>
            {/* Page 2 Continuation Table (Events 7 to 10) */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-black text-xs sm:text-[13px] text-black">
                <thead>
                  <tr className="bg-slate-100 print:bg-white text-center font-extrabold border-b-2 border-black">
                    <th className="border border-black py-2 px-1.5 w-12 text-center font-extrabold">ಕ್ರ.ಸಂ</th>
                    <th className="border border-black py-2 px-3 text-left font-extrabold">ಸ್ಪರ್ಧೆಯ ಹೆಸರು</th>
                    <th className="border border-black py-2 px-2 w-16 text-center font-extrabold">ಸ್ಥಾನ</th>
                    <th className="border border-black py-2 px-3 text-left font-extrabold">ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು</th>
                    <th className="border border-black py-2 px-3 text-left font-extrabold">ಶಾಲೆಯ ಹೆಸರು</th>
                    <th className="border border-black py-2 px-2 w-20 text-center font-extrabold">ತರಗತಿ</th>
                    <th className="border border-black py-2 px-2 w-16 text-center font-extrabold">ಸಹಿ</th>
                  </tr>
                </thead>
                <tbody>
                  {page2Events.map((ev) => {
                    const w1 = getWinner(ev, 1);
                    const w2 = getWinner(ev, 2);
                    const w3 = getWinner(ev, 3);

                    return (
                      <React.Fragment key={ev.code}>
                        {/* 1st Row: Prathama */}
                        <tr className="border-t border-black">
                          <td rowSpan={3} className="border border-black py-2 px-1 text-center font-mono font-bold align-middle bg-slate-50 print:bg-white">
                            {ev.code}
                          </td>
                          <td rowSpan={3} className="border border-black py-2 px-3 font-bold align-middle bg-slate-50 print:bg-white">
                            {ev.name}
                          </td>
                          <td className="border border-black py-1 px-2 text-center font-extrabold">
                            ಪ್ರಥಮ
                          </td>
                          <td className="border border-black py-1 px-3 font-bold">
                            {w1?.studentName || ''}
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w1?.schoolName || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {w1?.grade || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {/* Blank for physical signature */}
                          </td>
                        </tr>

                        {/* 2nd Row: Dviteeya */}
                        <tr>
                          <td className="border border-black py-1 px-2 text-center font-bold">
                            ದ್ವಿತೀಯ
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w2?.studentName || ''}
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w2?.schoolName || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {w2?.grade || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {/* Blank for physical signature */}
                          </td>
                        </tr>

                        {/* 3rd Row: Triteeya */}
                        <tr className="border-b border-black">
                          <td className="border border-black py-1 px-2 text-center font-bold">
                            ತೃತೀಯ
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w3?.studentName || ''}
                          </td>
                          <td className="border border-black py-1 px-3">
                            {w3?.schoolName || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {w3?.grade || ''}
                          </td>
                          <td className="border border-black py-1 px-2 text-center">
                            {/* Blank for physical signature */}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Right Signature: ಸಮೂಹ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ (Only on Last Page as Pictured) */}
          <div className="pt-16 pb-4 flex flex-col sm:flex-row items-end justify-between">
            <div className="text-[11px] text-slate-500 print:text-black font-normal space-y-0.5">
              <p>ದಿನಾಂಕ: <span className="font-mono">{new Date().toLocaleDateString('kn-IN')}</span></p>
              <p>ಸ್ಥಳ: {activeCluster.nameKannada}</p>
            </div>

            <div className="text-right space-y-1">
              <div className="h-10 border-b border-dotted border-black w-48 ml-auto" />
              <p className="text-sm font-black text-black">
                ಸಮೂಹ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ
              </p>
              <p className="text-xs text-slate-700 print:text-black font-semibold">
                {activeCluster.crpName} • {activeCluster.nameKannada} ಕ್ಲಸ್ಟರ್
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 print:text-black font-mono text-right pt-2 border-t border-slate-200 print:border-black">
            ಪುಟ ೨ (Page 2 of 2)
          </div>
        </div>

      </div>

    </div>
  );
};
