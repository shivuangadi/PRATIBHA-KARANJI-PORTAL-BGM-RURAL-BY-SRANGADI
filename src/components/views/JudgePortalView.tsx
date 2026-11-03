import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OFFICIAL_INFO, COMPETITION_EVENTS, CLUSTERS, getCompetitionCriteria } from '../../data/mockData';
import { NavItemKey, CompetitionCategory } from '../../types';
import { OfficialConsolidationSheet } from '../common/OfficialConsolidationSheet';
import { SeniorWinnersReport } from '../reports/SeniorWinnersReport';
import { JuniorWinnersReport } from '../reports/JuniorWinnersReport';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  ShieldAlert, 
  Sparkles,
  ClipboardCheck,
  UserCheck,
  Save,
  Lock,
  Building,
  Phone,
  Check,
  Printer,
  ChevronRight,
  AlertCircle,
  Share2,
  FileText,
  Trophy,
  Layers
} from 'lucide-react';

interface JudgePortalViewProps {
  onNavigateToMarks?: (nav: NavItemKey) => void;
  onOpenAuthModal?: (role: 'judge') => void;
}

export const JudgePortalView: React.FC<JudgePortalViewProps> = ({ onNavigateToMarks, onOpenAuthModal }) => {
  const { 
    currentUser, 
    allJudges, 
    visibleStudents, 
    saveJudgeMarks, 
    scoreEntries,
    officialInfo,
    logout 
  } = useApp();

  // Active view tab: scoring vs junior report vs senior report vs official consolidation report vs taluk selection
  const [activeTab, setActiveTab] = useState<'scoring' | 'junior_report' | 'senior_report' | 'consolidation' | 'taluk_selection'>('scoring');
  
  // Active division filter: Junior (1-4), Senior (5-7), High School (8-12)
  const [selectedCategory, setSelectedCategory] = useState<CompetitionCategory>('junior');

  // Find the active judge details
  const activeJudge = allJudges.find((j) => j.id === currentUser?.id) || 
    (currentUser?.role === 'judge' ? {
      id: currentUser.id,
      code: 'J-BLG-01',
      nameKannada: currentUser.displayName,
      designation: currentUser.designation || 'ವಿಷಯ ತಜ್ಞರು',
      institution: currentUser.schoolName || 'ಬೆಳಗಾವಿ',
      phone: currentUser.phone || '9448000000',
      assignedClusterId: currentUser.clusterId || 'c01',
      assignedClusterName: currentUser.clusterName || 'ಅರಳಿಕಟ್ಟಿ',
      assignedEvents: currentUser.assignedEvents && currentUser.assignedEvents.length > 0
        ? currentUser.assignedEvents
        : ['ಕಂಠಪಾಠ', 'ದೇಶಭಕ್ತಿ ಗೀತೆ', 'ಭಕ್ತಿ ಗೀತೆ'],
      status: 'ನೇಮಕಗೊಂಡಿದೆ' as const,
    } : allJudges[0]);

  // Events filtered for the selected division
  const eventsForSelectedCategory = COMPETITION_EVENTS.filter(e => e.categoryId === selectedCategory);
  const assignedEventsList = activeJudge.assignedEvents || [];

  // Filter events matching both the judge's assignments AND the selected category
  const categoryEventNames = eventsForSelectedCategory.map(e => e.nameKannada);
  const matchedAssignedEvents = assignedEventsList.filter(evName =>
    categoryEventNames.some(catEv => catEv.includes(evName) || evName.includes(catEv))
  );

  const displayedEvents = matchedAssignedEvents.length > 0 
    ? matchedAssignedEvents 
    : categoryEventNames.slice(0, 10);

  // Selected event
  const [selectedEventName, setSelectedEventName] = useState<string>(
    displayedEvents[0] || 'ಕಂಠಪಾಠ'
  );

  // When category changes, update selected event to match the category
  const handleCategoryChange = (newCat: CompetitionCategory) => {
    setSelectedCategory(newCat);
    const catEvents = COMPETITION_EVENTS.filter(e => e.categoryId === newCat);
    const catNames = catEvents.map(e => e.nameKannada);
    const matched = assignedEventsList.filter(evName =>
      catNames.some(catEv => catEv.includes(evName) || evName.includes(catEv))
    );
    setSelectedEventName(matched[0] || catNames[0] || 'ಕಂಠಪಾಠ');
  };

  // Active competition criteria matching JSON config (total = 10)
  const activeCriteria = getCompetitionCriteria(selectedEventName);

  // Dynamic criteria scoring state per participant chest number: stores criteria values array
  const [scoresByChest, setScoresByChest] = useState<Record<string, {
    values: number[];
    saved?: boolean;
    locked?: boolean;
  }>>({});

  const [notification, setNotification] = useState<string | null>(null);

  // Helper to obtain or initialize criteria values for a student
  const getStudentScoreValues = (chestNumber: string): number[] => {
    const existing = scoresByChest[chestNumber]?.values;
    if (existing && existing.length === activeCriteria.length) {
      return existing;
    }
    // Proportional default scores based on each criterion's maxMarks (~85%)
    return activeCriteria.map((c) => Number((c.maxMarks * 0.85).toFixed(1)));
  };

  // Students in this judge's cluster and selected division competing in the selected event
  const clusterStudents = visibleStudents.filter((st) => {
    const matchCluster = st.clusterId === activeJudge.assignedClusterId;
    const matchCategory = !st.categoryId || st.categoryId === selectedCategory;
    const matchEvent1 =
      st.eventNameKannada === selectedEventName ||
      selectedEventName.includes(st.eventNameKannada) ||
      st.eventNameKannada.includes(selectedEventName);
    const matchEvent2 =
      !!st.secondaryEventNameKannada &&
      (st.secondaryEventNameKannada === selectedEventName ||
        selectedEventName.includes(st.secondaryEventNameKannada) ||
        st.secondaryEventNameKannada.includes(selectedEventName));
    return matchCluster && matchCategory && (matchEvent1 || matchEvent2);
  });

  // If no exact match found, provide students from this cluster and category for evaluation
  const evaluationStudents = clusterStudents.length > 0 
    ? clusterStudents 
    : visibleStudents.filter((st) => st.clusterId === activeJudge.assignedClusterId && st.categoryId === selectedCategory).slice(0, 5);

  // Handle score change for a specific criterion
  const handleScoreChange = (chestNumber: string, critIndex: number, val: number) => {
    const maxVal = activeCriteria[critIndex]?.maxMarks || 2.5;
    const cleanVal = Number(Math.min(maxVal, Math.max(0, val)).toFixed(1));
    setScoresByChest((prev) => {
      const currentValues = getStudentScoreValues(chestNumber);
      const updated = [...currentValues];
      updated[critIndex] = cleanVal;
      return {
        ...prev,
        [chestNumber]: {
          values: updated,
          saved: prev[chestNumber]?.saved,
          locked: prev[chestNumber]?.locked,
        },
      };
    });
  };

  // WhatsApp share for current scored evaluation sheet
  const handleWhatsAppShareScoring = () => {
    const divLabel =
      selectedCategory === 'junior'
        ? 'ಕಿರಿಯ ವಿಭಾಗ (1 ರಿಂದ 4ನೇ ತರಗತಿ)'
        : selectedCategory === 'senior'
        ? 'ಹಿರಿಯ ವಿಭಾಗ (5 ರಿಂದ 7ನೇ ತರಗತಿ)'
        : 'ಪ್ರೌಢ ವಿಭಾಗ (8 ರಿಂದ 12ನೇ ತರಗತಿ)';

    let text = `📋 *ಪ್ರತಿಭಾ ಕಾರಂಜಿ 2026–27 - ನಿರ್ಣಾಯಕರ ಅಧಿಕೃತ ಅಂಕಪಟ್ಟಿ*\n`;
    text += `🏛️ ${officialInfo.officeKannada}\n`;
    text += `📍 ಕ್ಲಸ್ಟರ್: *${activeJudge.assignedClusterName}* | ನಿರ್ಣಾಯಕರು: *${activeJudge.nameKannada}* (${activeJudge.code})\n`;
    text += `🎭 ವಿಭಾಗ: *${divLabel}*\n`;
    text += `🎯 ಸ್ಪರ್ಧೆ: *${selectedEventName}*\n`;
    text += `------------------------------------\n`;
    evaluationStudents.forEach((st, idx) => {
      const vals = getStudentScoreValues(st.chestNumber);
      const total = Number(vals.reduce((s, v) => s + (Number(v) || 0), 0).toFixed(1));
      text += `${idx + 1}. [${st.chestNumber}] ${st.nameKannada} (${st.schoolNameKannada}) - ಅಂಕ: *${total} / 10*\n`;
    });
    text += `------------------------------------\n`;
    text += `✍️ ಮೌಲ್ಯಮಾಪನ ಅಂಕಗಳು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿವೆ.\n`;
    text += `📞 ಸಹಾಯವಾಣಿ: ${officialInfo.helpline}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    setNotification('ಅಂಕಪಟ್ಟಿಯ ವಿವರಗಳನ್ನು ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಹಂಚಿಕೊಳ್ಳಲು ಸಿದ್ಧಗೊಳಿಸಲಾಗಿದೆ.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Save marks for a single student (Max 10 marks total)
  const handleSaveStudentScore = (student: any, lock: boolean = false) => {
    const values = getStudentScoreValues(student.chestNumber);
    const total = Number(values.reduce((sum, v) => sum + (Number(v) || 0), 0).toFixed(1));

    const res = saveJudgeMarks({
      chestNumber: student.chestNumber,
      studentNameKannada: student.nameKannada,
      schoolNameKannada: student.schoolNameKannada,
      clusterNameKannada: activeJudge.assignedClusterName,
      clusterId: activeJudge.assignedClusterId,
      eventId: student.eventId || `ev-${selectedEventName}`,
      eventNameKannada: selectedEventName,
      criteriaScores: {
        presentation: values[0] || 0,
        melodyPronunciation: values[1] || 0,
        artistryContent: values[2] || 0,
        timeDiscipline: values[3] || 0,
        ...Object.fromEntries(activeCriteria.map((c, i) => [c.name, values[i] || 0])),
      },
      locked: lock,
    });

    setScoresByChest((prev) => ({
      ...prev,
      [student.chestNumber]: {
        values,
        saved: true,
        locked: lock,
      },
    }));

    setNotification(`ಎದೆ ಸಂಖ್ಯೆ ${student.chestNumber} (${student.nameKannada}) ಅವರ ಅಂಕಗಳು (${total}/10) ಯಶಸ್ವಿಯಾಗಿ ಸೇವ್ ಆಗಿವೆ.`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Save all students
  const handleSaveAll = () => {
    evaluationStudents.forEach((st) => {
      handleSaveStudentScore(st, false);
    });
    setNotification('ಎಲ್ಲಾ ಸ್ಪರ್ಧಿಗಳ ಅಂಕಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ (ಗರಿಷ್ಠ 10 ಅಂಕಗಳು).');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>ಅಧಿಕೃತ ತೀರ್ಪುಗಾರರ ಮಂಡಳಿ • {officialInfo.academicYear}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
            ನಿರ್ಣಾಯಕರ ಮೌಲ್ಯಮಾಪನ ಕೋಶ (Judge Evaluation Portal)
          </h2>
          <p className="text-xs text-amber-100 mt-1 max-w-2xl">
            ವಿಭಾಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ, ನಿಗದಿಪಡಿಸಿದ ಸ್ಪರ್ಧೆ ಹಾಗೂ ಎದೆ ಸಂಖ್ಯೆ ಆಧಾರದಲ್ಲಿ 4 ಮಾನದಂಡಗಳ ಅಂಕಗಳನ್ನು ನಮೂದಿಸಿ ಸೇವ್ ಮಾಡಿ, ಪ್ರಿಂಟ್/ಪಿಡಿಎಫ್ ಹಾಗೂ ವಾಟ್ಸಾಪ್ ಶೇರ್ ಮಾಡಿ.
          </p>
        </div>

        {/* Status / Role Tag */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-xs w-full md:w-auto">
          <span className="text-amber-200 block text-[11px] font-semibold">ಲಾಗಿನ್ ಆಗಿರುವ ನಿರ್ಣಾಯಕರು:</span>
          <p className="text-white font-bold text-sm mt-0.5">{activeJudge.nameKannada}</p>
          <p className="text-amber-200 text-[11px]">{activeJudge.assignedClusterName} ಕ್ಲಸ್ಟರ್ • ಮೊಬೈಲ್: {activeJudge.phone}</p>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* View Mode Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs no-print">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setActiveTab('scoring')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'scoring'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>ಅಂಕಗಳ ನಮೂದು (Live Scoring)</span>
          </button>

          <button
            onClick={() => setActiveTab('junior_report')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'junior_report'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-emerald-500" />
            <span>ಕಿರಿಯ ವಿಭಾಗದ ವಿಜೇತರು (ಚಿತ್ರದಂತೆ)</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded-full font-bold">1-4ನೇ</span>
          </button>

          <button
            onClick={() => setActiveTab('senior_report')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'senior_report'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>ಹಿರಿಯ ವಿಭಾಗದ ವಿಜೇತರು (ಚಿತ್ರದಂತೆ)</span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full font-bold">5-7ನೇ</span>
          </button>

          <button
            onClick={() => setActiveTab('consolidation')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'consolidation'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>ವಿಭಾಗವಾರು ಕ್ರೂಡೀಕರಣ ನಮೂನೆ (1, 2 & 3ನೇ ಸ್ಥಾನ)</span>
          </button>

          <button
            onClick={() => setActiveTab('taluk_selection')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'taluk_selection'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>ತಾಲೂಕು ಮಟ್ಟಕ್ಕೆ ಆಯ್ಕೆಯಾದ ವಿಜೇತರ ಪಟ್ಟಿ (ಪ್ರಥಮ ಮಾತ್ರ)</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 px-2">
          ಕ್ಲಸ್ಟರ್: <strong className="text-slate-800">{activeJudge.assignedClusterName}</strong>
        </span>
      </div>

      {/* Render Junior Winners Report (Exact official template from user image) */}
      {activeTab === 'junior_report' && (
        <JuniorWinnersReport 
          initialClusterId={activeJudge.assignedClusterId}
          onBack={() => setActiveTab('scoring')}
        />
      )}

      {/* Render Senior Winners Report (Exact official template from user image) */}
      {activeTab === 'senior_report' && (
        <SeniorWinnersReport 
          initialClusterId={activeJudge.assignedClusterId}
          onBack={() => setActiveTab('scoring')}
        />
      )}

      {/* Render Official Consolidation Form (1st, 2nd, 3rd) */}
      {activeTab === 'consolidation' && (
        <OfficialConsolidationSheet 
          initialClusterId={activeJudge.assignedClusterId}
          initialCategory={selectedCategory}
          initialMode="cluster_winners"
        />
      )}

      {/* Render Taluk Selection Form (1st Only) */}
      {activeTab === 'taluk_selection' && (
        <OfficialConsolidationSheet 
          initialClusterId={activeJudge.assignedClusterId}
          initialCategory={selectedCategory}
          initialMode="taluk_selection"
        />
      )}

      {/* Render Scoring Sheet Tab */}
      {activeTab === 'scoring' && (
        <>
          {/* 1. Logged in Judge Identity Card */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-extrabold text-xl ring-4 ring-amber-50">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{activeJudge.nameKannada}</h3>
                    <span className="text-[11px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
                      {activeJudge.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{activeJudge.designation}</p>
                  <p className="text-xs text-slate-500 font-normal">
                    {activeJudge.institution} • ಮೊಬೈಲ್: <strong className="font-mono text-slate-800">{activeJudge.phone}</strong>
                  </p>
                </div>
              </div>

              <div className="sm:text-right sm:border-l sm:border-slate-200 sm:pl-6 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">ನಿಯೋಜಿತ ಕೇಂದ್ರ</span>
                <span className="text-sm font-bold text-emerald-800 block">
                  {activeJudge.assignedClusterName} ಕ್ಲಸ್ಟರ್
                </span>
                <span className="text-[11px] text-slate-500 block">
                  ಒಟ್ಟು ನಿಗದಿಪಡಿಸಿದ ಸ್ಪರ್ಧೆಗಳು: <strong className="text-amber-800 font-bold">{assignedEventsList.length}</strong>
                </span>
              </div>
            </div>

            {/* Division Selection: ಕಿರಿಯ (1-4), ಹಿರಿಯ (5-7), ಪ್ರೌಢ (8-12) */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>ವಿಭಾಗ ಆಯ್ಕೆ (Select Division) - ಆಯಾ ವಿಭಾಗವಾರು ಮಕ್ಕಳ ಪಟ್ಟಿ:</span>
                </h4>
                <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {selectedCategory === 'junior' ? 'ವಿಭಾಗ 1: 1 ರಿಂದ 4ನೇ ತರಗತಿ' : selectedCategory === 'senior' ? 'ವಿಭಾಗ 2: 5 ರಿಂದ 7ನೇ ತರಗತಿ' : 'ವಿಭಾಗ 3: 8 ರಿಂದ 12ನೇ ತರಗತಿ'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: 'junior', title: 'ವಿಭಾಗ 1: ಕಿರಿಯ ವಿಭಾಗ', sub: '1 ರಿಂದ 4ನೇ ತರಗತಿ (ಕೇವಲ ವೈಯಕ್ತಿಕ)' },
                  { id: 'senior', title: 'ವಿಭಾಗ 2: ಹಿರಿಯ ವಿಭಾಗ', sub: '5 ರಿಂದ 7ನೇ ತರಗತಿ (ಕೇವಲ ವೈಯಕ್ತಿಕ)' },
                  { id: 'high_school', title: 'ವಿಭಾಗ 3: ಪ್ರೌಢ ವಿಭಾಗ', sub: '8 ರಿಂದ 12ನೇ ತರಗತಿ (ವೈಯಕ್ತಿಕ & ಸಾಮೂಹಿಕ)' },
                ].map((div) => {
                  const isSelected = selectedCategory === div.id;
                  return (
                    <button
                      key={div.id}
                      onClick={() => handleCategoryChange(div.id as CompetitionCategory)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-400/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`text-xs font-bold block ${isSelected ? 'text-amber-950 font-extrabold' : 'text-slate-800'}`}>
                        {div.title}
                      </span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">{div.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Assigned Competitions Selector */}
            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-amber-600" />
                  <span>ಸ್ಪರ್ಧೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ (Select Competition):</span>
                </h4>
                <span className="text-[11px] text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {displayedEvents.length} ಸ್ಪರ್ಧೆಗಳು ಲಭ್ಯ
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {displayedEvents.map((evName, idx) => {
                  const isSelected = selectedEventName === evName;
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedEventName(evName)}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-400/50 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-amber-300 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <span className="text-[10px] font-bold text-amber-700 block">ಸ್ಪರ್ಧೆ {idx + 1}</span>
                        <p className={`text-xs font-bold ${isSelected ? 'text-amber-950 font-extrabold' : 'text-slate-800'}`}>
                          {evName}
                        </p>
                      </div>
                      {isSelected ? (
                        <span className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. Live Scoring Evaluation Sheet for Selected Event */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Sheet Top Header */}
            <div className="p-5 bg-gradient-to-r from-slate-50 to-amber-50/40 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-amber-600 text-white rounded text-[11px] font-bold">
                    ಪ್ರಸ್ತುತ ಮೌಲ್ಯಮಾಪನ ಸ್ಪರ್ಧೆ
                  </span>
                  <span className="text-xs text-slate-500">
                    ಕ್ಲಸ್ಟರ್: <strong>{activeJudge.assignedClusterName}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedEventName}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  ಅಧಿಕೃತ ಮೌಲ್ಯಮಾಪನ ಮಾನದಂಡಗಳು: {activeCriteria.map(c => `${c.name} (${c.maxMarks})`).join(' • ')} = ಒಟ್ಟು ಗರಿಷ್ಠ 10 ಅಂಕಗಳು
                </p>
              </div>

              {/* Action Buttons: Save, WhatsApp Share, Print */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleWhatsAppShareScoring}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  title="ಅಂಕಪಟ್ಟಿಯನ್ನು ವಾಟ್ಸಾಪ್ ನಲ್ಲಿ ಹಂಚಿಕೊಳ್ಳಿ"
                >
                  <Share2 className="w-4 h-4" />
                  <span>ವಾಟ್ಸಾಪ್ ಶೇರ್</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  title="ಅಂಕಪಟ್ಟಿ ಮುದ್ರಿಸಿ ಅಥವಾ PDF ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ"
                >
                  <Printer className="w-4 h-4" />
                  <span>ಪ್ರಿಂಟ್ / PDF</span>
                </button>

                <button
                  onClick={handleSaveAll}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>ಎಲ್ಲಾ ಅಂಕಗಳನ್ನು ಸೇವ್ ಮಾಡಿ (ಗರಿಷ್ಠ 10)</span>
                </button>
              </div>
            </div>

        {/* Participants Scoring Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">ಎದೆ ಸಂಖ್ಯೆ</th>
                <th className="py-3 px-4">ವಿದ್ಯಾರ್ಥಿ & ಶಾಲೆ</th>
                {activeCriteria.map((c, i) => (
                  <th key={i} className="py-3 px-3 text-center">
                    <span className="block text-slate-900">{c.name}</span>
                    <span className="text-[10px] text-amber-700 font-medium">(ಗರಿಷ್ಠ {c.maxMarks})</span>
                  </th>
                ))}
                <th className="py-3 px-4 text-center font-extrabold text-slate-900">ಒಟ್ಟು ಅಂಕ (ಗರಿಷ್ಠ 10)</th>
                <th className="py-3 px-4 text-center">ಸ್ಥಿತಿ / ಕ್ರಿಯೆ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {evaluationStudents.map((st) => {
                const values = getStudentScoreValues(st.chestNumber);
                const total = Number(values.reduce((sum, v) => sum + (Number(v) || 0), 0).toFixed(1));
                const isLocked = scoresByChest[st.chestNumber]?.locked;

                return (
                  <tr key={st.id} className="hover:bg-amber-50/30 transition">
                    
                    {/* Chest Number */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-extrabold text-xs px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 inline-block shadow-2xs">
                        {st.chestNumber}
                      </span>
                    </td>

                    {/* Student Info */}
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{st.nameKannada}</p>
                      <p className="text-[11px] text-slate-500">{st.schoolNameKannada}</p>
                      <span className="text-[10px] text-slate-400 font-mono">SATS: {st.satsId}</span>
                    </td>

                    {/* Dynamic Criteria Inputs */}
                    {activeCriteria.map((c, cIdx) => (
                      <td key={cIdx} className="py-3 px-3 text-center">
                        <input
                          type="number"
                          min={0}
                          max={c.maxMarks}
                          step={0.1}
                          disabled={isLocked}
                          value={values[cIdx]}
                          onChange={(e) => handleScoreChange(st.chestNumber, cIdx, parseFloat(e.target.value) || 0)}
                          className="w-16 py-1.5 px-2 text-center text-xs font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        />
                        <span className="block text-[10px] text-slate-400 mt-0.5 font-medium">/{c.maxMarks}</span>
                      </td>
                    ))}

                    {/* Total Score */}
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-extrabold font-mono px-3 py-1 rounded-lg ${
                        total >= 9.0 ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                        total >= 7.5 ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {total} / 10
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleSaveStudentScore(st, false)}
                          className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>ಸೇವ್</span>
                        </button>
                        <button
                          onClick={() => handleSaveStudentScore(st, true)}
                          title="ಅಂತಿಮ ಅಂಕಪಟ್ಟಿ ಲಾಕ್ ಮಾಡಿ"
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1 border border-slate-300 transition cursor-pointer"
                        >
                          <Lock className="w-3 h-3 text-amber-700" />
                          <span>ಲಾಕ್</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
          <span>
            💡 ಅಂಕಗಳನ್ನು ಸೇವ್ ಮಾಡಿದ ತಕ್ಷಣವೇ ಕ್ಲಸ್ಟರ್ ಫಲಿತಾಂಶ ಕೋಶ ಹಾಗೂ ಕ್ರೋಢೀಕರಣ ಪಟ್ಟಿಗೆ ನಮೂದಾಗುತ್ತದೆ.
          </span>
          <span className="font-bold text-amber-900">
            ತೀರ್ಪುಗಾರರ ಸಹಿ: {activeJudge.nameKannada}
          </span>
        </div>
      </div>

        </>
      )}

    </div>
  );
};
