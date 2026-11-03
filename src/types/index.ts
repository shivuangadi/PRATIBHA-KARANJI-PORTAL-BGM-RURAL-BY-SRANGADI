export type UserRole = 'home' | 'admin' | 'crp' | 'school' | 'judge';

export type NavItemKey =
  | 'overview'
  | 'crp-registration'
  | 'school-registration'
  | 'student-registration'
  | 'judge-appointment'
  | 'judge-login'
  | 'marks-entry'
  | 'marks-consolidation'
  | 'cluster-results'
  | 'taluk-selection'
  | 'reports-printing'
  | 'admin-settings';

export type CompetitionCategory =
  | 'junior' // ಕಿರಿಯ ವಿಭಾಗ (1 ರಿಂದ 4ನೇ ತರಗತಿ)
  | 'senior' // ಹಿರಿಯ ವಿಭಾಗ (5 ರಿಂದ 7ನೇ ತರಗತಿ)
  | 'high_school'; // ಪ್ರೌಢ ವಿಭಾಗ (8 ರಿಂದ 12ನೇ ತರಗತಿ)

export interface CompetitionEvent {
  id: string;
  nameKannada: string;
  nameEnglish: string;
  categoryId: CompetitionCategory;
  categoryKannada: string;
  maxParticipantsPerSchool: number;
  timeLimitMinutes: number;
  maxMarks: number;
  isGroupEvent: boolean;
  descriptionKannada?: string;
  rulesKannada: string[];
}

export interface ClusterInfo {
  id: string;
  code: string;
  nameKannada: string;
  nameEnglish: string;
  crpName: string;
  crpPhone: string;
  totalSchools: number;
  registeredStudents: number;
}

export interface SchoolInfo {
  id: string;
  diseCode: string;
  nameKannada: string;
  nameEnglish: string;
  clusterId: string;
  clusterNameKannada: string;
  schoolType: 'ಸರ್ಕಾರಿ' | 'ಅನುದಾನಿತ' | 'ಅನುದಾನರಹಿತ';
  headMasterName: string;
  headMasterPhone: string;
  totalParticipants: number;
  status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' | 'ಬಾಕಿ ಇದೆ';
}

export interface StudentParticipant {
  id: string;
  chestNumber: string;
  satsId: string;
  nameKannada: string;
  nameEnglish: string;
  gender: 'ಗಂಡು' | 'ಹೆಣ್ಣು';
  schoolId: string;
  schoolNameKannada: string;
  clusterId: string;
  clusterNameKannada: string;
  grade: string;
  categoryId: CompetitionCategory;
  categoryKannada: string;
  eventId: string;
  eventNameKannada: string;
  secondaryEventId?: string;
  secondaryEventNameKannada?: string;
  mobile: string;
  status: 'ಖಚಿತಗೊಂಡಿದೆ' | 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ';
}

export interface JudgeInfo {
  id: string;
  code: string;
  nameKannada: string;
  designation: string;
  institution: string; // ಶಾಲೆಯ ಹೆಸರು
  phone: string; // ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಪಾಸ್‌ವರ್ಡ್)
  assignedClusterId: string;
  assignedClusterName: string;
  categoryId?: CompetitionCategory;
  assignedEvents: string[]; // ಒಂದಕ್ಕಿಂತ ಹೆಚ್ಚು ಸ್ಪರ್ಧೆಗಳಿಗೆ ಚೆಕ್‌ಬಾಕ್ಸ್ ಮೂಲಕ ನಿಯೋಜನೆ
  status: 'ನೇಮಕಗೊಂಡಿದೆ' | 'ದೃಢೀಕರಣ ಬಾಕಿ';
}

export interface CrpAccount {
  id: string;
  clusterId: string;
  clusterNameKannada: string;
  crpName: string;
  designation: string;
  phone: string;
  email?: string;
  username: string;
  password: string;
  registeredAt: string;
}

export interface SchoolAccount {
  id: string;
  diseCode: string;
  nameKannada: string;
  nameEnglish?: string;
  clusterId: string;
  clusterNameKannada: string;
  schoolType: 'ಸರ್ಕಾರಿ' | 'ಅನುದಾನಿತ' | 'ಅನುದಾನರಹಿತ';
  headMasterName: string;
  headMasterPhone: string;
  username: string;
  password: string;
  registeredAt: string;
}

export interface CurrentUser {
  role: UserRole;
  id: string;
  displayName: string;
  username?: string;
  clusterId?: string;
  clusterName?: string;
  schoolId?: string;
  schoolName?: string;
  diseCode?: string;
  phone?: string;
  designation?: string;
  assignedEvents?: string[];
  categoryId?: CompetitionCategory;
}

export interface CompetitionCriterion {
  name: string;
  maxMarks: number;
}

export interface CompetitionCriteriaConfig {
  id: string;
  name: string;
  matchPatterns?: string[];
  criteria: CompetitionCriterion[];
  totalMarks: number;
}

export interface ScoreEntry {
  id: string;
  chestNumber: string;
  studentNameKannada: string;
  schoolNameKannada: string;
  clusterNameKannada: string;
  clusterId?: string;
  eventId: string;
  eventNameKannada: string;
  categoryId?: CompetitionCategory;
  judgeScores: {
    judgeId: string;
    judgeName: string;
    criteriaScores: {
      presentation?: number;
      melodyPronunciation?: number;
      artistryContent?: number;
      timeDiscipline?: number;
      [criterionKey: string]: number | undefined;
    };
    total: number;
    locked?: boolean;
    submittedAt?: string;
  }[];
  consolidatedAverage: number;
  rank?: number; // 1, 2, 3
  qualifiedForTaluk?: boolean;
}


