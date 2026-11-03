import { 
  ClusterInfo, 
  CompetitionCategory, 
  CompetitionEvent, 
  JudgeInfo, 
  SchoolInfo, 
  ScoreEntry, 
  StudentParticipant,
  CompetitionCriterion,
  CompetitionCriteriaConfig
} from '../types';
import competitionConfig from '../config/competitionConfig.json';
import criteriaConfigData from './criteriaConfig.json';

export const CRITERIA_METADATA = criteriaConfigData.metadata;
export const COMPETITION_CRITERIA_LIST: CompetitionCriteriaConfig[] = criteriaConfigData.competitions as CompetitionCriteriaConfig[];

/**
 * Returns the exact 10-mark evaluation criteria for a given competition name or event ID.
 * Matches specific Kannada names (including language-specific recitations, religious recitations, etc.)
 */
export function getCompetitionCriteria(eventNameOrId?: string): CompetitionCriterion[] {
  if (!eventNameOrId) {
    return [
      { name: 'ಪ್ರಸ್ತುತಿ', maxMarks: 2.5 },
      { name: 'ಶ್ರುತಿ / ಉಚ್ಚಾರಣೆ', maxMarks: 2.5 },
      { name: 'ಕಲಾತ್ಮಕತೆ', maxMarks: 2.5 },
      { name: 'ಸಮಯಪಾಲನೆ', maxMarks: 2.5 },
    ];
  }

  const query = eventNameOrId.trim().toLowerCase();

  // 1. Direct ID match
  const byId = COMPETITION_CRITERIA_LIST.find(c => c.id.toLowerCase() === query);
  if (byId) return byId.criteria;

  // 2. Exact or substring match in name or matchPatterns
  for (const comp of COMPETITION_CRITERIA_LIST) {
    if (query === comp.name.toLowerCase() || query.includes(comp.name.toLowerCase()) || comp.name.toLowerCase().includes(query)) {
      return comp.criteria;
    }
    if (comp.matchPatterns) {
      for (const pat of comp.matchPatterns) {
        const patLower = pat.toLowerCase();
        if (query === patLower || query.includes(patLower) || patLower.includes(query)) {
          return comp.criteria;
        }
      }
    }
  }

  // 3. Fallback standard 4 criteria totaling 10
  return [
    { name: 'ಪ್ರಸ್ತುತಿ / ಹಾವಭಾವ', maxMarks: 2.5 },
    { name: 'ಉಚ್ಚಾರಣೆ / ರಾಗ', maxMarks: 2.5 },
    { name: 'ಕಲಾತ್ಮಕತೆ / ವಿಷಯ', maxMarks: 2.5 },
    { name: 'ಸಮಯಪಾಲನೆ ಮತ್ತು ಶಿಸ್ತು', maxMarks: 2.5 },
  ];
}


export const OFFICIAL_INFO = {
  departmentKannada: 'ಶಾಲಾ ಶಿಕ್ಷಣ ಮತ್ತು ಸಾಕ್ಷರತಾ ಇಲಾಖೆ',
  departmentSubKannada: 'ಸಮಗ್ರ ಶಿಕ್ಷಣ ಕರ್ನಾಟಕ',
  officeKannada: 'ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳ ಹಾಗೂ ಕ್ಷೇತ್ರ ಸಮನ್ವಯ ಅಧಿಕಾರಿಗಳ ಕಾರ್ಯಾಲಯ, ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ',
  eventNameKannada: '2026 ಹಾಗೂ 27ನೇ ಸಾಲಿನ ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಹಾಗೂ ಕಲೋತ್ಸವ ಕಾರ್ಯಕ್ರಮಗಳು',
  titleKannada: 'ಪ್ರತಿಭಾ ಕಾರಂಜಿ ಮತ್ತು ಕಲೋತ್ಸವ 2026–27',
  academicYear: '2026–27',
  districtKannada: 'ಬೆಳಗಾವಿ',
  talukKannada: 'ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ',
  beoName: 'ಶ್ರೀ ಆರ್. ಜಿ. ಪಾಟೀಲ (ಕೆ.ಇ.ಎಸ್)',
  beoDesignation: 'ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳು, ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ',
  brcName: 'ಶ್ರೀಮತಿ ಶೈಲಜಾ ಕುಲಕರ್ಣಿ',
  brcDesignation: 'ಕ್ಷೇತ್ರ ಸಮನ್ವಯಾಧಿಕಾರಿಗಳು, ಬಿ.ಆರ್.ಸಿ. ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ',
  nodalOfficer: 'ಶ್ರೀ ಮಹೇಶ ಕಡೋಲಿ (ನೋಡಲ್ ಅಧಿಕಾರಿಗಳು)',
  helpline: '0831-2489201 / 9448123456',
  email: 'beo.belagavirural@karnataka.gov.in',
  address: 'ಬಿ.ಇ.ಒ ಕಚೇರಿ, ಮಿನಿ ವಿಧಾನ ಸೌಧ ಆವರಣ, ಬೆಳಗಾವಿ ಗ್ರಾಮೀಣ - 590016',
};

// Exactly the 25 Official Clusters of Belagavi Rural provided by user
export const CLUSTERS: ClusterInfo[] = [
  { id: 'c01', code: 'BLG-RUR-01', nameKannada: 'ಅರಳಿಕಟ್ಟಿ', nameEnglish: 'ARALIKATTI', crpName: 'ಶ್ರೀ ಎಸ್. ಕೆ. ಹಿರೇಮಠ', crpPhone: '9845112201', totalSchools: 18, registeredStudents: 145 },
  { id: 'c02', code: 'BLG-RUR-02', nameKannada: 'ಬಾಳೇಕುಂದ್ರಿ ಕೆ.ಎಚ್.', nameEnglish: 'BALEKUNDRI KH', crpName: 'ಶ್ರೀಮತಿ ಎಂ. ಬಿ. ದೇಸಾಯಿ', crpPhone: '9845112202', totalSchools: 20, registeredStudents: 160 },
  { id: 'c03', code: 'BLG-RUR-03', nameKannada: 'ಬೆಳಗುಂದಿ', nameEnglish: 'BELGUNDI', crpName: 'ಶ್ರೀ ಎ. ಬಿ. ಪಾಟೀಲ', crpPhone: '9845112203', totalSchools: 22, registeredStudents: 175 },
  { id: 'c04', code: 'BLG-RUR-04', nameKannada: 'ಬೆಂಡಿಗೇರಿ', nameEnglish: 'BHENDIGERI', crpName: 'ಶ್ರೀಮತಿ ವೀಣಾ ಬೆಂಡಿಗೇರಿ', crpPhone: '9845112204', totalSchools: 19, registeredStudents: 150 },
  { id: 'c05', code: 'BLG-RUR-05', nameKannada: 'ಭೂತರಾಮಟ್ಟಿ', nameEnglish: 'BHUTRAMATTI', crpName: 'ಶ್ರೀ ಪಿ. ಎನ್. ಜೋಶಿ', crpPhone: '9845112205', totalSchools: 17, registeredStudents: 135 },
  { id: 'c06', code: 'BLG-RUR-06', nameKannada: 'ದೇಶೂರ', nameEnglish: 'DESUR', crpName: 'ಶ್ರೀ ಸಿ. ಆರ್. ಕಂಬಾರ', crpPhone: '9845112206', totalSchools: 21, registeredStudents: 165 },
  { id: 'c07', code: 'BLG-RUR-07', nameKannada: 'ಧಾಮಣೆ', nameEnglish: 'DHAMNE', crpName: 'ಶ್ರೀಮತಿ ಸುಧಾ ಕುಲಕರ್ಣಿ', crpPhone: '9845112207', totalSchools: 18, registeredStudents: 140 },
  { id: 'c08', code: 'BLG-RUR-08', nameKannada: 'ಧರ್ನಾಟ್ಟಿ', nameEnglish: 'DHARNATTI', crpName: 'ಶ್ರೀ ಆರ್. ಎನ್. ಬಡಿಗೇರ', crpPhone: '9845112208', totalSchools: 16, registeredStudents: 130 },
  { id: 'c09', code: 'BLG-RUR-09', nameKannada: 'ಹಲಗಾ', nameEnglish: 'HALGA', crpName: 'ಶ್ರೀ ಬಿ. ಎಂ. ಚೌಗುಲೆ', crpPhone: '9845112209', totalSchools: 23, registeredStudents: 180 },
  { id: 'c10', code: 'BLG-RUR-10', nameKannada: 'ಹಂದಿಗನೂರ', nameEnglish: 'HANDIGNUR', crpName: 'ಶ್ರೀಮತಿ ಗೀತಾ ನಾಯ್ಕ', crpPhone: '9845112210', totalSchools: 19, registeredStudents: 152 },
  { id: 'c11', code: 'BLG-RUR-11', nameKannada: 'ಹಿಂಡಲಗಾ', nameEnglish: 'HINDALGA', crpName: 'ಶ್ರೀ ವಿ. ಎಸ್. ಕುಲಕರ್ಣಿ', crpPhone: '9845112211', totalSchools: 25, registeredStudents: 200 },
  { id: 'c12', code: 'BLG-RUR-12', nameKannada: 'ಹುದಲಿ', nameEnglish: 'HUDALI', crpName: 'ಶ್ರೀಮತಿ ರೇಖಾ ಪಾಟೀಲ', crpPhone: '9845112212', totalSchools: 22, registeredStudents: 172 },
  { id: 'c13', code: 'BLG-RUR-13', nameKannada: 'ಕಡೋಲಿ', nameEnglish: 'KADOLI', crpName: 'ಶ್ರೀ ಡಿ. ಕೆ. ಮುತಾಲಿಕ', crpPhone: '9845112213', totalSchools: 24, registeredStudents: 190 },
  { id: 'c14', code: 'BLG-RUR-14', nameKannada: 'ಕಾಕತಿ', nameEnglish: 'KAKTI', crpName: 'ಶ್ರೀಮತಿ ಲಕ್ಷ್ಮೀ ಹುಕ್ಕೇರಿ', crpPhone: '9845112214', totalSchools: 26, registeredStudents: 205 },
  { id: 'c15', code: 'BLG-RUR-15', nameKannada: 'ಕಂಗ್ರಾಳಿ ಬಿ.ಕೆ.', nameEnglish: 'KANGRALI BK', crpName: 'ಶ್ರೀ ಎಂ. ಎಸ್. ಬೆಲ್ಲದ', crpPhone: '9845112215', totalSchools: 21, registeredStudents: 168 },
  { id: 'c16', code: 'BLG-RUR-16', nameKannada: 'ಕಂಗ್ರಾಳಿ ಕೆ.ಎಚ್.', nameEnglish: 'KANGRALI KH', crpName: 'ಶ್ರೀ ಕೆ. ಎಚ್. ಶಿಂಧೆ', crpPhone: '9845112216', totalSchools: 20, registeredStudents: 158 },
  { id: 'c17', code: 'BLG-RUR-17', nameKannada: 'ಕೆ.ಕೆ. ಕೊಪ್ಪ', nameEnglish: 'KK KOPP', crpName: 'ಶ್ರೀಮತಿ ಶಾರದಾ ಗಾವಡೆ', crpPhone: '9845112217', totalSchools: 18, registeredStudents: 142 },
  { id: 'c18', code: 'BLG-RUR-18', nameKannada: 'ಮಣ್ಣೂರ', nameEnglish: 'MANNUR', crpName: 'ಶ್ರೀ ಎಸ್. ಬಿ. ಹೊಸಮನಿ', crpPhone: '9845112218', totalSchools: 19, registeredStudents: 148 },
  { id: 'c19', code: 'BLG-RUR-19', nameKannada: 'ಮಾರಿಹಾಳ', nameEnglish: 'MARIHAL', crpName: 'ಶ್ರೀ ಎನ್. ಜಿ. ಕುಂಬಾರ', crpPhone: '9845112219', totalSchools: 22, registeredStudents: 174 },
  { id: 'c20', code: 'BLG-RUR-20', nameKannada: 'ಮಾಚೆ', nameEnglish: 'MATCHE', crpName: 'ಶ್ರೀಮತಿ ಮಂಜುಳಾ ದೇಶಪಾಂಡೆ', crpPhone: '9845112220', totalSchools: 24, registeredStudents: 192 },
  { id: 'c21', code: 'BLG-RUR-21', nameKannada: 'ಮುಚಂಡಿ', nameEnglish: 'MUCHANDI', crpName: 'ಶ್ರೀ ಆರ್. ಜಿ. ಮಾನೆ', crpPhone: '9845112221', totalSchools: 18, registeredStudents: 144 },
  { id: 'c22', code: 'BLG-RUR-22', nameKannada: 'ಮುತಗಾ', nameEnglish: 'MUTAGA', crpName: 'ಶ್ರೀ ಬಿ. ಕೆ. ಗುಡದಪ್ಪನವರ', crpPhone: '9845112222', totalSchools: 21, registeredStudents: 166 },
  { id: 'c23', code: 'BLG-RUR-23', nameKannada: 'ಸಂತಿಬಸ್ತವಾಡ', nameEnglish: 'SANTIBASTWAD', crpName: 'ಶ್ರೀಮತಿ ರೇಣುಕಾ ತಳವಾರ', crpPhone: '9845112223', totalSchools: 19, registeredStudents: 150 },
  { id: 'c24', code: 'BLG-RUR-24', nameKannada: 'ಉಚಗಾಂವ', nameEnglish: 'UCHAGAON', crpName: 'ಶ್ರೀ ವಿ. ಎಂ. ಚವಾಣ್', crpPhone: '9845112224', totalSchools: 25, registeredStudents: 202 },
  { id: 'c25', code: 'BLG-RUR-25', nameKannada: 'ಯಳ್ಳೂರ', nameEnglish: 'YALLUR', crpName: 'ಶ್ರೀಮತಿ ಪಾರ್ವತಿ ಪಾಟೀಲ', crpPhone: '9845112225', totalSchools: 26, registeredStudents: 210 },
];

export const CATEGORIES_CONFIG = competitionConfig.categories;

// Map JSON configuration into fully typed CompetitionEvents
export const COMPETITION_EVENTS: CompetitionEvent[] = competitionConfig.events.map((ev) => {
  const categoryMeta = competitionConfig.categories.find(c => c.id === ev.categoryId);
  return {
    id: ev.id,
    nameKannada: ev.nameKannada,
    nameEnglish: ev.nameEnglish,
    categoryId: ev.categoryId as CompetitionCategory,
    categoryKannada: `${categoryMeta?.nameKannada || ''} (${categoryMeta?.gradeRangeKannada || ''})`,
    maxParticipantsPerSchool: ev.maxParticipants,
    timeLimitMinutes: ev.timeLimitMinutes,
    maxMarks: ev.maxMarks,
    isGroupEvent: ev.isGroupEvent,
    descriptionKannada: ev.description,
    rulesKannada: [
      ev.description,
      `ಗರಿಷ್ಠ ಸಮಯ: ${ev.timeLimitMinutes} ನಿಮಿಷ`,
      ev.isGroupEvent ? `ಸಾಮೂಹಿಕ ಸ್ಪರ್ಧೆ (ಗರಿಷ್ಠ ${ev.maxParticipants} ವಿದ್ಯಾರ್ಥಿಗಳು)` : 'ವೈಯಕ್ತಿಕ ಸ್ಪರ್ಧೆ (1 ವಿದ್ಯಾರ್ಥಿ)',
      'ಸಮಯಪಾಲನೆ ಹಾಗೂ ಸ್ಪಷ್ಟ ಉಚ್ಚಾರಣೆ ಕಡ್ಡಾಯ',
    ],
  };
});

// Central accessor helper: Get events strictly by Category ID
export const getEventsByCategory = (catId: CompetitionCategory): CompetitionEvent[] => {
  return COMPETITION_EVENTS.filter(e => e.categoryId === catId);
};

export const SCHOOLS: SchoolInfo[] = [
  {
    id: 'sch-01',
    diseCode: '29010200101',
    nameKannada: 'ಸರ್ಕಾರಿ ಮಾದರಿ ಪ್ರಾಥಮಿಕ ಶಾಲೆ, ಅರಳಿಕಟ್ಟಿ',
    nameEnglish: 'GMPS Aralikatti',
    clusterId: 'c01',
    clusterNameKannada: 'ಅರಳಿಕಟ್ಟಿ',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀ ಎಂ. ಬಿ. ಪಾಟೀಲ',
    headMasterPhone: '9448112201',
    totalParticipants: 18,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-02',
    diseCode: '29010200201',
    nameKannada: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ಬಾಳೇಕುಂದ್ರಿ ಕೆ.ಎಚ್.',
    nameEnglish: 'GHS Balekundri KH',
    clusterId: 'c02',
    clusterNameKannada: 'ಬಾಳೇಕುಂದ್ರಿ ಕೆ.ಎಚ್.',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀಮತಿ ಎಸ್. ಆರ್. ಬೆಂಡಿಗೇರಿ',
    headMasterPhone: '9448112202',
    totalParticipants: 16,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-03',
    diseCode: '29010200301',
    nameKannada: 'ಸರ್ಕಾರಿ ಹಿರಿಯ ಪ್ರಾಥಮಿಕ ಶಾಲೆ, ಬೆಳಗುಂದಿ',
    nameEnglish: 'GHPS Belgundi',
    clusterId: 'c03',
    clusterNameKannada: 'ಬೆಳಗುಂದಿ',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀ ಆರ್. ಕೆ. ಕುಲಕರ್ಣಿ',
    headMasterPhone: '9448112203',
    totalParticipants: 17,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-04',
    diseCode: '29010200401',
    nameKannada: 'ಶ್ರೀ ಬಸವೇಶ್ವರ ಗ್ರಾಮೀಣ ಪ್ರೌಢಶಾಲೆ, ಬೆಂಡಿಗೇರಿ (ಅನುದಾನಿತ)',
    nameEnglish: 'Shri Basaveshwara Rural HS Bhendigeri',
    clusterId: 'c04',
    clusterNameKannada: 'ಬೆಂಡಿಗೇರಿ',
    schoolType: 'ಅನುದಾನಿತ',
    headMasterName: 'ಶ್ರೀ ಬಿ. ಕೆ. ಮುರಗೋಡ',
    headMasterPhone: '9448112204',
    totalParticipants: 15,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-05',
    diseCode: '29010201101',
    nameKannada: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ಹಿಂಡಲಗಾ',
    nameEnglish: 'GHS Hindalga',
    clusterId: 'c11',
    clusterNameKannada: 'ಹಿಂಡಲಗಾ',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀ ಎನ್. ಎಸ್. ಜೋಶಿ',
    headMasterPhone: '9448112211',
    totalParticipants: 20,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-06',
    diseCode: '29010201301',
    nameKannada: 'ಕರ್ನಾಟಕ ಪಬ್ಲಿಕ್ ಶಾಲೆ (ಕೆ.ಪಿ.ಎಸ್), ಕಡೋಲಿ',
    nameEnglish: 'KPS Kadoli',
    clusterId: 'c13',
    clusterNameKannada: 'ಕಡೋಲಿ',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀ ಆರ್. ಜಿ. ಬೆಲ್ಲದ',
    headMasterPhone: '9448112213',
    totalParticipants: 22,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-07',
    diseCode: '29010201401',
    nameKannada: 'ಸರ್ಕಾರಿ ಮಾದರಿ ಪ್ರಾಥಮಿಕ ಶಾಲೆ, ಕಾಕತಿ',
    nameEnglish: 'GMPS Kakti',
    clusterId: 'c14',
    clusterNameKannada: 'ಕಾಕತಿ',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀಮತಿ ಪ್ರಭಾವತಿ ದೇಶಪಾಂಡೆ',
    headMasterPhone: '9448112214',
    totalParticipants: 19,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-08',
    diseCode: '29010201901',
    nameKannada: 'ಸರ್ಕಾರಿ ಸಂಯುಕ್ತ ಪ.ಪೂ ಕಾಲೇಜು, ಮಾರಿಹಾಳ',
    nameEnglish: 'GPUC Marihal',
    clusterId: 'c19',
    clusterNameKannada: 'ಮಾರಿಹಾಳ',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀ ಸಿ. ಎಂ. ದೇಸಾಯಿ',
    headMasterPhone: '9448112219',
    totalParticipants: 18,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-09',
    diseCode: '29010202001',
    nameKannada: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ಮಾಚೆ',
    nameEnglish: 'GHS Matche',
    clusterId: 'c20',
    clusterNameKannada: 'ಮಾಚೆ',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀಮತಿ ಮಂಜುಳಾ ದೇಶಪಾಂಡೆ',
    headMasterPhone: '9448112220',
    totalParticipants: 18,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
  {
    id: 'sch-10',
    diseCode: '29010202501',
    nameKannada: 'ಸರ್ಕಾರಿ ಪ್ರೌಢಶಾಲೆ, ಯಳ್ಳೂರ',
    nameEnglish: 'GHS Yallur',
    clusterId: 'c25',
    clusterNameKannada: 'ಯಳ್ಳೂರ',
    schoolType: 'ಸರ್ಕಾರಿ',
    headMasterName: 'ಶ್ರೀ ಆರ್. ಎಸ್. ಪಾಟೀಲ',
    headMasterPhone: '9448112225',
    totalParticipants: 24,
    status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
  },
];

// Real production data: starts clean for real student registrations
export const STUDENTS: StudentParticipant[] = [];

// Real production data: starts clean for real judges and evaluations
export const JUDGES: JudgeInfo[] = [];

// Real production data: starts clean for real scores and rankings
export const CONSOLIDATED_RESULTS: ScoreEntry[] = [];
