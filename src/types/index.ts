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
  mobile: string;
  status: 'ಖಚಿತಗೊಂಡಿದೆ' | 'ಅರ್ಜಿ ಸಲ್ಲಿಕೆ';
}

export interface JudgeInfo {
  id: string;
  code: string;
  nameKannada: string;
  designation: string;
  institution: string;
  phone: string;
  assignedClusterId: string;
  assignedClusterName: string;
  assignedEvents: string[];
  status: 'ನೇಮಕಗೊಂಡಿದೆ' | 'ದೃಢೀಕರಣ ಬಾಕಿ';
}

export interface ScoreEntry {
  id: string;
  chestNumber: string;
  studentNameKannada: string;
  schoolNameKannada: string;
  clusterNameKannada: string;
  eventId: string;
  eventNameKannada: string;
  judgeScores: {
    judgeId: string;
    judgeName: string;
    criteriaScores: {
      presentation: number; // ಪ್ರಸ್ತುತಿ / ಹಾವಭಾವ (25)
      melodyPronunciation: number; // ಶ್ರುತಿ / ಉಚ್ಚಾರಣೆ (30)
      artistryContent: number; // ಕಲಾತ್ಮಕತೆ / ವಿಷಯ (25)
      timeDiscipline: number; // ಸಮಯಪಾಲನೆ / ಶಿಸ್ತು (20)
    };
    total: number;
  }[];
  consolidatedAverage: number;
  rank?: number; // 1, 2, 3
  qualifiedForTaluk?: boolean;
}
