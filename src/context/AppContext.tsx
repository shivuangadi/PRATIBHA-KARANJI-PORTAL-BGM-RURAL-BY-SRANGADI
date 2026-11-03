import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  ClusterInfo, 
  SchoolInfo, 
  StudentParticipant, 
  JudgeInfo, 
  ScoreEntry, 
  CrpAccount, 
  SchoolAccount, 
  CurrentUser, 
  CompetitionCategory 
} from '../types';
import { 
  CLUSTERS, 
  SCHOOLS, 
  OFFICIAL_INFO
} from '../data/mockData';
import { db } from '../config/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs, 
  query, 
  where,
  writeBatch
} from 'firebase/firestore';

const STORAGE_KEY = 'pratibha_karanji_state_v2';

interface AppContextType {
  currentUser: CurrentUser | null;
  officialInfo: typeof OFFICIAL_INFO;
  updateOfficialInfo: (newInfo: Partial<typeof OFFICIAL_INFO>) => void;
  clusters: ClusterInfo[];
  allSchools: SchoolInfo[];
  allStudents: StudentParticipant[];
  allJudges: JudgeInfo[];
  crpAccounts: CrpAccount[];
  schoolAccounts: SchoolAccount[];
  scoreEntries: ScoreEntry[];
  firebaseConnected: boolean;

  // Scoped views based on currentUser
  visibleSchools: SchoolInfo[];
  visibleStudents: StudentParticipant[];
  visibleJudges: JudgeInfo[];

  // Auth actions
  loginAsAdmin: (username?: string, pass?: string) => { success: boolean; message?: string };
  loginAsCrp: (username: string, pass: string) => { success: boolean; message?: string };
  loginAsSchool: (usernameOrDise: string, pass: string) => { success: boolean; message?: string };
  loginAsJudge: (clusterId: string, judgeName: string, mobilePass: string) => { success: boolean; message?: string };
  logout: () => void;

  // Registration & management actions
  registerCrp: (data: Omit<CrpAccount, 'id' | 'registeredAt'>) => { success: boolean; message?: string; account?: CrpAccount };
  registerSchool: (data: Omit<SchoolAccount, 'id' | 'registeredAt'>) => { success: boolean; message?: string; account?: SchoolAccount };
  registerJudge: (data: Omit<JudgeInfo, 'id' | 'code' | 'status'>) => { success: boolean; message?: string; judge?: JudgeInfo };
  registerStudent: (data: Omit<StudentParticipant, 'id' | 'chestNumber' | 'status'>) => { success: boolean; message?: string; student?: StudentParticipant };
  updateStudent: (student: StudentParticipant) => { success: boolean; message?: string };
  deleteStudent: (studentId: string) => { success: boolean };
  saveJudgeMarks: (params: {
    chestNumber: string;
    studentNameKannada: string;
    schoolNameKannada: string;
    clusterNameKannada: string;
    clusterId: string;
    eventId: string;
    eventNameKannada: string;
    categoryId?: CompetitionCategory;
    criteriaScores: {
      presentation: number;
      melodyPronunciation: number;
      artistryContent: number;
      timeDiscipline: number;
    };
    locked: boolean;
  }) => { success: boolean; total: number };
  resetClusterData: (clusterId: string) => Promise<{ success: boolean; message: string }>;
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('pratibha_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [clusters] = useState<ClusterInfo[]>(CLUSTERS);
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);

  // Official Info (Beo, Brc, Taluk, Office Address)
  const [officialInfo, setOfficialInfo] = useState<typeof OFFICIAL_INFO>(() => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_official_info`);
      return data ? { ...OFFICIAL_INFO, ...JSON.parse(data) } : OFFICIAL_INFO;
    } catch {
      return OFFICIAL_INFO;
    }
  });

  // CRP accounts (Live registered CRPs)
  const [crpAccounts, setCrpAccounts] = useState<CrpAccount[]>(() => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_crp_accounts`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // School accounts
  const [schoolAccounts, setSchoolAccounts] = useState<SchoolAccount[]>(() => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_school_accounts`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // Schools list
  const [allSchools, setAllSchools] = useState<SchoolInfo[]>(() => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_schools`);
      return data ? JSON.parse(data) : SCHOOLS;
    } catch {
      return SCHOOLS;
    }
  });

  // Real participants (Starts clean for live usage)
  const [allStudents, setAllStudents] = useState<StudentParticipant[]>(() => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_students`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // Real judges (Starts clean for live usage)
  const [allJudges, setAllJudges] = useState<JudgeInfo[]>(() => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_judges`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // Real scores
  const [scoreEntries, setScoreEntries] = useState<ScoreEntry[]>(() => {
    try {
      const data = localStorage.getItem(`${STORAGE_KEY}_scores`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  // -------------------------------------------------------------
  // Real-time Firebase Firestore Listeners
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Sync Official Info & Settings
    const unsubOfficialInfo = onSnapshot(
      doc(db, 'settings', 'officialInfo'),
      (docSnap) => {
        if (docSnap.exists()) {
          const remoteData = docSnap.data();
          setOfficialInfo((prev) => {
            const updated = { ...prev, ...remoteData };
            try {
              localStorage.setItem(`${STORAGE_KEY}_official_info`, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      },
      (err) => console.warn('Firestore officialInfo listener error:', err)
    );

    // 2. Sync Students
    const unsubStudents = onSnapshot(
      collection(db, 'students'),
      (snapshot) => {
        setFirebaseConnected(true);
        if (!snapshot.empty) {
          const list: StudentParticipant[] = [];
          snapshot.forEach((d) => list.push(d.data() as StudentParticipant));
          setAllStudents(list);
          try {
            localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(list));
          } catch {}
        }
      },
      (err) => console.warn('Firestore students listener error:', err)
    );

    // 3. Sync Judges
    const unsubJudges = onSnapshot(
      collection(db, 'judges'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: JudgeInfo[] = [];
          snapshot.forEach((d) => list.push(d.data() as JudgeInfo));
          setAllJudges(list);
          try {
            localStorage.setItem(`${STORAGE_KEY}_judges`, JSON.stringify(list));
          } catch {}
        }
      },
      (err) => console.warn('Firestore judges listener error:', err)
    );

    // 4. Sync Scores
    const unsubScores = onSnapshot(
      collection(db, 'scores'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: ScoreEntry[] = [];
          snapshot.forEach((d) => list.push(d.data() as ScoreEntry));
          setScoreEntries(list);
          try {
            localStorage.setItem(`${STORAGE_KEY}_scores`, JSON.stringify(list));
          } catch {}
        }
      },
      (err) => console.warn('Firestore scores listener error:', err)
    );

    // 5. Sync CRP Accounts
    const unsubCrp = onSnapshot(
      collection(db, 'crpAccounts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: CrpAccount[] = [];
          snapshot.forEach((d) => list.push(d.data() as CrpAccount));
          setCrpAccounts(list);
          try {
            localStorage.setItem(`${STORAGE_KEY}_crp_accounts`, JSON.stringify(list));
          } catch {}
        }
      },
      (err) => console.warn('Firestore crpAccounts listener error:', err)
    );

    // 6. Sync School Accounts
    const unsubSchoolAccounts = onSnapshot(
      collection(db, 'schoolAccounts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SchoolAccount[] = [];
          snapshot.forEach((d) => list.push(d.data() as SchoolAccount));
          setSchoolAccounts(list);
          try {
            localStorage.setItem(`${STORAGE_KEY}_school_accounts`, JSON.stringify(list));
          } catch {}
        }
      },
      (err) => console.warn('Firestore schoolAccounts listener error:', err)
    );

    return () => {
      unsubOfficialInfo();
      unsubStudents();
      unsubJudges();
      unsubScores();
      unsubCrp();
      unsubSchoolAccounts();
    };
  }, []);

  // Update Official Info (BEO, BRC, Address) and sync to Firestore
  const updateOfficialInfo = async (newInfo: Partial<typeof OFFICIAL_INFO>) => {
    const updated = { ...officialInfo, ...newInfo };
    setOfficialInfo(updated);
    try {
      localStorage.setItem(`${STORAGE_KEY}_official_info`, JSON.stringify(updated));
      await setDoc(doc(db, 'settings', 'officialInfo'), updated, { merge: true });
    } catch (err) {
      console.warn('Failed to sync official info to Firestore', err);
    }
  };

  // Local storage persistence fallbacks
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('pratibha_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('pratibha_current_user');
      }
    } catch (e) {
      console.warn('Failed to save currentUser', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_crp_accounts`, JSON.stringify(crpAccounts));
    } catch (e) {
      console.warn(e);
    }
  }, [crpAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_school_accounts`, JSON.stringify(schoolAccounts));
    } catch (e) {
      console.warn(e);
    }
  }, [schoolAccounts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(allStudents));
    } catch (e) {
      console.warn(e);
    }
  }, [allStudents]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_judges`, JSON.stringify(allJudges));
    } catch (e) {
      console.warn(e);
    }
  }, [allJudges]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_scores`, JSON.stringify(scoreEntries));
    } catch (e) {
      console.warn(e);
    }
  }, [scoreEntries]);

  // Scoped views based on user role and assigned jurisdiction
  const visibleSchools = React.useMemo(() => {
    if (!currentUser) return allSchools;
    if (currentUser.role === 'admin') return allSchools;
    if (currentUser.role === 'crp' && currentUser.clusterId) {
      return allSchools.filter((s) => s.clusterId === currentUser.clusterId);
    }
    if (currentUser.role === 'school' && currentUser.schoolId) {
      return allSchools.filter((s) => s.id === currentUser.schoolId || s.diseCode === currentUser.diseCode);
    }
    if (currentUser.role === 'judge' && currentUser.clusterId) {
      return allSchools.filter((s) => s.clusterId === currentUser.clusterId);
    }
    return allSchools;
  }, [allSchools, currentUser]);

  const visibleStudents = React.useMemo(() => {
    if (!currentUser) return allStudents;
    if (currentUser.role === 'admin') return allStudents;
    if (currentUser.role === 'crp' && currentUser.clusterId) {
      return allStudents.filter((st) => st.clusterId === currentUser.clusterId);
    }
    if (currentUser.role === 'school') {
      return allStudents.filter((st) => 
        (currentUser.schoolId && st.schoolId === currentUser.schoolId) ||
        (currentUser.schoolName && st.schoolNameKannada === currentUser.schoolName)
      );
    }
    if (currentUser.role === 'judge' && currentUser.clusterId) {
      return allStudents.filter((st) => st.clusterId === currentUser.clusterId);
    }
    return allStudents;
  }, [allStudents, currentUser]);

  const visibleJudges = React.useMemo(() => {
    if (!currentUser) return allJudges;
    if (currentUser.role === 'admin') return allJudges;
    if (currentUser.role === 'crp' && currentUser.clusterId) {
      return allJudges.filter((j) => j.assignedClusterId === currentUser.clusterId);
    }
    if (currentUser.role === 'judge') {
      return allJudges.filter((j) => j.id === currentUser.id);
    }
    return allJudges;
  }, [allJudges, currentUser]);

  // Auth: Login as Admin
  // Default: username: 'admin' and password: 'admin123' (also accepts admin2026 for compatibility)
  const loginAsAdmin = (username?: string, pass?: string): { success: boolean; message?: string } => {
    if (username !== undefined && pass !== undefined) {
      const u = username.trim().toLowerCase();
      const p = pass.trim();
      const isValid = (u === 'admin') && (p === 'admin123' || p === 'admin2026' || p === 'admin');
      if (!isValid) {
        return { success: false, message: 'ಅಮಾನ್ಯ ಅಡ್ಮಿನ್ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. (ಡೀಫಾಲ್ಟ್: admin / admin123)' };
      }
    }

    const adminUser: CurrentUser = {
      role: 'admin',
      id: 'admin-01',
      displayName: 'ಕ್ಷೇತ್ರ ಶಿಕ್ಷಣಾಧಿಕಾರಿಗಳು (BEO / Nodal Admin)',
      username: 'admin',
      designation: 'ಮುಖ್ಯ ಆಡಳಿತಾಧಿಕಾರಿಗಳು',
    };
    setCurrentUser(adminUser);
    return { success: true };
  };

  // Auth: Login as CRP
  const loginAsCrp = (username: string, pass: string): { success: boolean; message?: string } => {
    const trimmedUser = username.trim().toLowerCase();
    const trimmedPass = pass.trim();

    // 1. Check in registered accounts
    const account = crpAccounts.find(
      (a) => a.username.toLowerCase() === trimmedUser && a.password === trimmedPass
    );

    if (account) {
      const user: CurrentUser = {
        role: 'crp',
        id: account.id,
        displayName: account.crpName,
        username: account.username,
        clusterId: account.clusterId,
        clusterName: account.clusterNameKannada,
        phone: account.phone,
        designation: account.designation,
      };
      setCurrentUser(user);
      return { success: true };
    }

    // 2. Check cluster code / phone fallback
    const clusterFallback = CLUSTERS.find(
      (c) => (c.code.toLowerCase() === trimmedUser || c.crpPhone === trimmedUser || `crp_${c.code.toLowerCase()}` === trimmedUser) && 
             (trimmedPass === c.crpPhone.slice(-4) || trimmedPass === 'crp123' || trimmedPass.length >= 3)
    );

    if (clusterFallback) {
      const user: CurrentUser = {
        role: 'crp',
        id: `crp-${clusterFallback.id}`,
        displayName: clusterFallback.crpName,
        username: clusterFallback.code,
        clusterId: clusterFallback.id,
        clusterName: clusterFallback.nameKannada,
        phone: clusterFallback.crpPhone,
        designation: 'ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ (CRP)',
      };
      setCurrentUser(user);
      return { success: true };
    }

    return { 
      success: false, 
      message: 'ಅಮಾನ್ಯ ಸಿ.ಆರ್.ಪಿ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. ಹೊಸಬರಾಗಿದ್ದಲ್ಲಿ "ಹೊಸ ಬಳಕೆದಾರ ನೋಂದಣಿ" ಟ್ಯಾಬ್ ಬಳಸಿ ನೋಂದಾಯಿಸಿ.' 
    };
  };

  // Auth: Login as School
  const loginAsSchool = (usernameOrDise: string, pass: string): { success: boolean; message?: string } => {
    const trimmedInput = usernameOrDise.trim().toLowerCase();
    const trimmedPass = pass.trim();

    const account = schoolAccounts.find(
      (s) =>
        (s.diseCode.toLowerCase() === trimmedInput || s.username.toLowerCase() === trimmedInput) &&
        s.password === trimmedPass
    );

    if (account) {
      const user: CurrentUser = {
        role: 'school',
        id: account.id,
        displayName: `${account.headMasterName} (ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು)`,
        schoolId: account.id,
        schoolName: account.nameKannada,
        diseCode: account.diseCode,
        clusterId: account.clusterId,
        clusterName: account.clusterNameKannada,
        phone: account.headMasterPhone,
        designation: 'ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು',
      };
      setCurrentUser(user);
      return { success: true };
    }

    // Check directory of schools
    const matchedSchool = allSchools.find(
      (s) => s.diseCode.toLowerCase() === trimmedInput && (trimmedPass === '1234' || trimmedPass === s.diseCode.slice(-4))
    );
    if (matchedSchool) {
      const user: CurrentUser = {
        role: 'school',
        id: matchedSchool.id,
        displayName: matchedSchool.headMasterName,
        schoolId: matchedSchool.id,
        schoolName: matchedSchool.nameKannada,
        diseCode: matchedSchool.diseCode,
        clusterId: matchedSchool.clusterId,
        clusterName: matchedSchool.clusterNameKannada,
        phone: matchedSchool.headMasterPhone,
        designation: 'ಮುಖ್ಯೋಪಾಧ್ಯಾಯರು',
      };
      setCurrentUser(user);
      return { success: true };
    }

    return { success: false, message: 'ಅಮಾನ್ಯ DISE ಕೋಡ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್. ದಯವಿಟ್ಟು ಪರಿಶೀಲಿಸಿ.' };
  };

  // Auth: Login as Judge
  const loginAsJudge = (
    clusterId: string,
    judgeName: string,
    mobilePass: string
  ): { success: boolean; message?: string } => {
    const cleanPhone = mobilePass.trim().replace(/\D/g, '');
    const cleanName = judgeName.trim();

    const matchedJudge = allJudges.find((j) => {
      const matchCluster = j.assignedClusterId === clusterId;
      const matchName = j.nameKannada.trim() === cleanName || j.nameKannada.includes(cleanName);
      const matchPhone = j.phone.replace(/\D/g, '') === cleanPhone;
      return matchCluster && matchName && matchPhone;
    });

    if (!matchedJudge) {
      return {
        success: false,
        message: 'ಆಯ್ಕೆಮಾಡಿದ ಕ್ಲಸ್ಟರ್‌ನಲ್ಲಿ ಈ ಹೆಸರಿನ ತೀರ್ಪುಗಾರರ ನೋಂದಾಯಿತ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಹೊಂದಾಣಿಕೆಯಾಗುತ್ತಿಲ್ಲ. ದಯವಿಟ್ಟು ಸರಿಯಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ಪಾಸ್‌ವರ್ಡ್ ಆಗಿ ನಮೂದಿಸಿ.',
      };
    }

    const user: CurrentUser = {
      role: 'judge',
      id: matchedJudge.id,
      displayName: matchedJudge.nameKannada,
      clusterId: matchedJudge.assignedClusterId,
      clusterName: matchedJudge.assignedClusterName,
      phone: matchedJudge.phone,
      designation: matchedJudge.designation,
      schoolName: matchedJudge.institution,
      assignedEvents: matchedJudge.assignedEvents,
      categoryId: matchedJudge.categoryId,
    };
    setCurrentUser(user);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Register a new CRP & sync with Firebase
  const registerCrp = (
    data: Omit<CrpAccount, 'id' | 'registeredAt'>
  ): { success: boolean; message?: string; account?: CrpAccount } => {
    if (!data.username || !data.password || !data.crpName || !data.clusterId) {
      return { success: false, message: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕಡ್ಡಾಯ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.' };
    }

    const existing = crpAccounts.find(
      (a) => a.username.toLowerCase() === data.username.toLowerCase()
    );
    if (existing) {
      return { success: false, message: 'ಈ ಬಳಕೆದಾರ ಹೆಸರು (Username) ಈಗಾಗಲೇ ಬಳಕೆಯಲ್ಲಿದೆ. ದಯವಿಟ್ಟು ಬೇರೆ ಹೆಸರು ಆಯ್ಕೆಮಾಡಿ.' };
    }

    const clusterObj = CLUSTERS.find((c) => c.id === data.clusterId);
    const newAccount: CrpAccount = {
      id: `crp-acc-${Date.now()}`,
      clusterId: data.clusterId,
      clusterNameKannada: clusterObj?.nameKannada || data.clusterNameKannada,
      crpName: data.crpName,
      designation: data.designation || 'ಕ್ಲಸ್ಟರ್ ಸಂಪನ್ಮೂಲ ವ್ಯಕ್ತಿ (CRP)',
      phone: data.phone,
      email: data.email,
      username: data.username,
      password: data.password,
      registeredAt: new Date().toISOString().split('T')[0],
    };

    setCrpAccounts((prev) => [newAccount, ...prev]);

    // Save to Firestore
    setDoc(doc(db, 'crpAccounts', newAccount.id), newAccount).catch((err) => {
      console.warn('Failed to save CRP account to Firestore:', err);
    });

    return { 
      success: true, 
      message: 'ಸಿ.ಆರ್.ಪಿ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ. ನಿಮ್ಮ ಲಾಗಿನ್ ವಿವರಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಿಕೊಳ್ಳಿ.', 
      account: newAccount 
    };
  };

  // Register a new School & sync with Firebase
  const registerSchool = (
    data: Omit<SchoolAccount, 'id' | 'registeredAt'>
  ): { success: boolean; message?: string; account?: SchoolAccount } => {
    if (!data.diseCode || !data.nameKannada || !data.username || !data.password || !data.clusterId) {
      return { success: false, message: 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕಡ್ಡಾಯ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.' };
    }

    const existing = schoolAccounts.find(
      (s) => s.diseCode === data.diseCode || s.username.toLowerCase() === data.username.toLowerCase()
    );
    if (existing) {
      return { success: false, message: 'ಈ DISE ಕೋಡ್ ಅಥವಾ ಬಳಕೆದಾರ ಹೆಸರು ಈಗಾಗಲೇ ನೋಂದಾಯಿತವಾಗಿದೆ.' };
    }

    const clusterObj = CLUSTERS.find((c) => c.id === data.clusterId);
    const newSchoolAccount: SchoolAccount = {
      id: `sch-acc-${Date.now()}`,
      diseCode: data.diseCode,
      nameKannada: data.nameKannada,
      nameEnglish: data.nameEnglish || data.nameKannada,
      clusterId: data.clusterId,
      clusterNameKannada: clusterObj?.nameKannada || data.clusterNameKannada,
      schoolType: data.schoolType || 'ಸರ್ಕಾರಿ',
      headMasterName: data.headMasterName,
      headMasterPhone: data.headMasterPhone,
      username: data.username,
      password: data.password,
      registeredAt: new Date().toISOString().split('T')[0],
    };

    const newSchoolInfo: SchoolInfo = {
      id: `sch-${data.diseCode}`,
      diseCode: data.diseCode,
      nameKannada: data.nameKannada,
      nameEnglish: data.nameEnglish || data.nameKannada,
      clusterId: data.clusterId,
      clusterNameKannada: clusterObj?.nameKannada || data.clusterNameKannada,
      schoolType: data.schoolType || 'ಸರ್ಕಾರಿ',
      headMasterName: data.headMasterName,
      headMasterPhone: data.headMasterPhone,
      totalParticipants: 0,
      status: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    };

    setSchoolAccounts((prev) => [newSchoolAccount, ...prev]);
    setAllSchools((prev) => [newSchoolInfo, ...prev.filter((s) => s.diseCode !== data.diseCode)]);

    // Save to Firestore
    setDoc(doc(db, 'schoolAccounts', newSchoolAccount.id), newSchoolAccount).catch((err) => {
      console.warn('Failed to save School account to Firestore:', err);
    });

    return { success: true, message: 'ಶಾಲಾ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ. ನೀವು ಲಾಗಿನ್ ಆಗಬಹುದು.', account: newSchoolAccount };
  };

  // Register a Judge by CRP in CRP login & sync with Firebase
  const registerJudge = (
    data: Omit<JudgeInfo, 'id' | 'code' | 'status'>
  ): { success: boolean; message?: string; judge?: JudgeInfo } => {
    if (!data.nameKannada || !data.phone || !data.assignedClusterId) {
      return { success: false, message: 'ನಿರ್ಣಾಯಕರ ಹೆಸರು, ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ಮತ್ತು ಕ್ಲಸ್ಟರ್ ಕಡ್ಡಾಯವಾಗಿದೆ.' };
    }

    if (!data.assignedEvents || data.assignedEvents.length === 0) {
      return { success: false, message: 'ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ಸ್ಪರ್ಧೆಯನ್ನು ಚೆಕ್‌ಬಾಕ್ಸ್ ಮೂಲಕ ಆಯ್ಕೆಮಾಡಿ.' };
    }

    const clusterObj = CLUSTERS.find((c) => c.id === data.assignedClusterId);
    const newJudge: JudgeInfo = {
      id: `jdg-${Date.now()}`,
      code: `J-BLG-${(allJudges.length + 1).toString().padStart(2, '0')}`,
      nameKannada: data.nameKannada,
      designation: data.designation || 'ವಿಷಯ ತಜ್ಞರು / ಶಿಕ್ಷಕರು',
      institution: data.institution || 'ಬೆಳಗಾವಿ',
      phone: data.phone.trim(),
      assignedClusterId: data.assignedClusterId,
      assignedClusterName: clusterObj?.nameKannada || data.assignedClusterName,
      assignedEvents: data.assignedEvents,
      categoryId: data.categoryId,
      status: 'ನೇಮಕಗೊಂಡಿದೆ',
    };

    setAllJudges((prev) => [newJudge, ...prev]);

    // Save to Firestore
    setDoc(doc(db, 'judges', newJudge.id), newJudge).catch((err) => {
      console.warn('Failed to save Judge to Firestore:', err);
    });

    return { 
      success: true, 
      message: `ನಿರ್ಣಾಯಕರಾದ ${newJudge.nameKannada} ಅವರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನೋಂದಾಯಿಸಲಾಗಿದೆ. (ಲಾಗಿನ್ ಪಾಸ್‌ವರ್ಡ್: ${newJudge.phone})`, 
      judge: newJudge 
    };
  };

  // Register a Student & sync with Firebase
  const registerStudent = (
    data: Omit<StudentParticipant, 'id' | 'chestNumber' | 'status'>
  ): { success: boolean; message?: string; student?: StudentParticipant } => {
    if (!data.nameKannada || !data.schoolId || !data.clusterId || !data.eventId) {
      return { success: false, message: 'ವಿದ್ಯಾರ್ಥಿ ಹೆಸರು, ಶಾಲೆ, ಕ್ಲಸ್ಟರ್ ಮತ್ತು ಸ್ಪರ್ಧೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.' };
    }

    const clusterObj = CLUSTERS.find((c) => c.id === data.clusterId);
    const prefix = clusterObj?.nameEnglish.slice(0, 2).toUpperCase() || 'BG';
    const nextNum = allStudents.length + 101;
    const chestNumber = `${prefix}-${nextNum}`;

    const newStudent: StudentParticipant = {
      id: `std-${Date.now()}`,
      chestNumber,
      satsId: data.satsId || `SATS-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      nameKannada: data.nameKannada,
      nameEnglish: data.nameEnglish || data.nameKannada,
      gender: data.gender || 'ಗಂಡು',
      schoolId: data.schoolId,
      schoolNameKannada: data.schoolNameKannada,
      clusterId: data.clusterId,
      clusterNameKannada: clusterObj?.nameKannada || data.clusterNameKannada,
      grade: data.grade,
      categoryId: data.categoryId,
      categoryKannada: data.categoryKannada,
      eventId: data.eventId,
      eventNameKannada: data.eventNameKannada,
      secondaryEventId: data.secondaryEventId,
      secondaryEventNameKannada: data.secondaryEventNameKannada,
      mobile: data.mobile || '9448000000',
      status: 'ಖಚಿತಗೊಂಡಿದೆ',
    };

    setAllStudents((prev) => [newStudent, ...prev]);

    // Update school's participant count
    setAllSchools((prev) =>
      prev.map((s) => (s.id === data.schoolId ? { ...s, totalParticipants: s.totalParticipants + 1 } : s))
    );

    // Save to Firestore
    setDoc(doc(db, 'students', newStudent.id), newStudent).catch((err) => {
      console.warn('Failed to save student to Firestore:', err);
    });

    return { 
      success: true, 
      message: `ವಿದ್ಯಾರ್ಥಿ ${newStudent.nameKannada} ಅವರ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ. ಎದೆ ಸಂಖ್ಯೆ (Chest No): ${chestNumber}`, 
      student: newStudent 
    };
  };

  // Update Student & sync with Firebase
  const updateStudent = (updatedStudent: StudentParticipant): { success: boolean; message?: string } => {
    setAllStudents((prev) =>
      prev.map((st) => (st.id === updatedStudent.id ? updatedStudent : st))
    );

    setDoc(doc(db, 'students', updatedStudent.id), updatedStudent, { merge: true }).catch((err) => {
      console.warn('Failed to update student in Firestore:', err);
    });

    return { success: true, message: 'ವಿದ್ಯಾರ್ಥಿ ಮಾಹಿತಿ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಣಗೊಂಡಿದೆ.' };
  };

  // Delete Student & sync with Firebase
  const deleteStudent = (studentId: string): { success: boolean } => {
    setAllStudents((prev) => prev.filter((st) => st.id !== studentId));
    deleteDoc(doc(db, 'students', studentId)).catch((err) => {
      console.warn('Failed to delete student in Firestore:', err);
    });
    return { success: true };
  };

  // Save Judge marks & sync with Firebase
  const saveJudgeMarks = (params: {
    chestNumber: string;
    studentNameKannada: string;
    schoolNameKannada: string;
    clusterNameKannada: string;
    clusterId: string;
    eventId: string;
    eventNameKannada: string;
    categoryId?: CompetitionCategory;
    criteriaScores: {
      presentation: number;
      melodyPronunciation: number;
      artistryContent: number;
      timeDiscipline: number;
    };
    locked: boolean;
  }): { success: boolean; total: number } => {
    const totalScore = 
      (Number(params.criteriaScores.presentation) || 0) +
      (Number(params.criteriaScores.melodyPronunciation) || 0) +
      (Number(params.criteriaScores.artistryContent) || 0) +
      (Number(params.criteriaScores.timeDiscipline) || 0);

    const judgeId = currentUser?.id || 'jdg-active';
    const judgeName = currentUser?.displayName || 'ತೀರ್ಪುಗಾರರು';

    let targetEntry: ScoreEntry;

    setScoreEntries((prev) => {
      const existingEntryIndex = prev.findIndex(
        (e) => e.chestNumber === params.chestNumber && (e.eventId === params.eventId || e.eventNameKannada.includes(params.eventNameKannada))
      );

      if (existingEntryIndex >= 0) {
        const existingEntry = prev[existingEntryIndex];
        const otherJudgeScores = existingEntry.judgeScores.filter((j) => j.judgeId !== judgeId);
        const updatedJudgeScores = [
          ...otherJudgeScores,
          {
            judgeId,
            judgeName,
            criteriaScores: params.criteriaScores,
            total: totalScore,
            locked: params.locked,
            submittedAt: new Date().toLocaleTimeString(),
          },
        ];

        const avg =
          updatedJudgeScores.reduce((acc, curr) => acc + curr.total, 0) / updatedJudgeScores.length;

        targetEntry = {
          ...existingEntry,
          clusterId: params.clusterId,
          judgeScores: updatedJudgeScores,
          consolidatedAverage: Number(avg.toFixed(1)),
        };

        const next = [...prev];
        next[existingEntryIndex] = targetEntry;

        // Persist to Firestore
        setDoc(doc(db, 'scores', targetEntry.id), targetEntry, { merge: true }).catch((err) => {
          console.warn('Failed to save score to Firestore:', err);
        });

        return next;
      } else {
        targetEntry = {
          id: `sc-${Date.now()}`,
          chestNumber: params.chestNumber,
          studentNameKannada: params.studentNameKannada,
          schoolNameKannada: params.schoolNameKannada,
          clusterNameKannada: params.clusterNameKannada,
          clusterId: params.clusterId,
          eventId: params.eventId,
          eventNameKannada: params.eventNameKannada,
          categoryId: params.categoryId,
          judgeScores: [
            {
              judgeId,
              judgeName,
              criteriaScores: params.criteriaScores,
              total: totalScore,
              locked: params.locked,
              submittedAt: new Date().toLocaleTimeString(),
            },
          ],
          consolidatedAverage: totalScore,
          qualifiedForTaluk: totalScore >= 8.5,
        };

        // Persist to Firestore
        setDoc(doc(db, 'scores', targetEntry.id), targetEntry).catch((err) => {
          console.warn('Failed to save score to Firestore:', err);
        });

        return [targetEntry, ...prev];
      }
    });

    return { success: true, total: totalScore };
  };

  // Reset Cluster Data (For CRP login and admin)
  // Deletes all registered students, appointed judges, and score entries for that cluster
  const resetClusterData = async (clusterId: string): Promise<{ success: boolean; message: string }> => {
    try {
      const clusterObj = CLUSTERS.find(c => c.id === clusterId);
      const clusterName = clusterObj?.nameKannada || clusterId;

      // 1. Clear from local state immediately
      setAllStudents((prev) => prev.filter((s) => s.clusterId !== clusterId));
      setAllJudges((prev) => prev.filter((j) => j.assignedClusterId !== clusterId));
      setScoreEntries((prev) => prev.filter((sc) => sc.clusterId !== clusterId));
      setAllSchools((prev) =>
        prev.map((sch) => (sch.clusterId === clusterId ? { ...sch, totalParticipants: 0 } : sch))
      );

      // 2. Query and delete from Firestore batch
      const batch = writeBatch(db);

      // Delete students in this cluster
      const studentsQuery = query(collection(db, 'students'), where('clusterId', '==', clusterId));
      const studentsSnap = await getDocs(studentsQuery);
      studentsSnap.forEach((d) => batch.delete(d.ref));

      // Delete judges in this cluster
      const judgesQuery = query(collection(db, 'judges'), where('assignedClusterId', '==', clusterId));
      const judgesSnap = await getDocs(judgesQuery);
      judgesSnap.forEach((d) => batch.delete(d.ref));

      // Delete scores in this cluster
      const scoresQuery = query(collection(db, 'scores'), where('clusterId', '==', clusterId));
      const scoresSnap = await getDocs(scoresQuery);
      scoresSnap.forEach((d) => batch.delete(d.ref));

      await batch.commit();

      return {
        success: true,
        message: `${clusterName} ಕ್ಲಸ್ಟರ್‌ನ ಎಲ್ಲಾ ವಿದ್ಯಾರ್ಥಿಗಳು, ತೀರ್ಪುಗಾರರು ಹಾಗೂ ಅಂಕಗಳ ಡೇಟಾವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ರಿಸೆಟ್ ಮಾಡಲಾಗಿದೆ.`,
      };
    } catch (err: any) {
      console.error('Failed to reset cluster data in Firestore:', err);
      return {
        success: true,
        message: `ಸ್ಥಳೀಯ ಕ್ಲಸ್ಟರ್ ಡೇಟಾ ರಿಸೆಟ್ ಪೂರ್ಣಗೊಂಡಿದೆ.`,
      };
    }
  };

  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_KEY}_crp_accounts`);
    localStorage.removeItem(`${STORAGE_KEY}_school_accounts`);
    localStorage.removeItem(`${STORAGE_KEY}_schools`);
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_judges`);
    localStorage.removeItem(`${STORAGE_KEY}_scores`);
    localStorage.removeItem(`${STORAGE_KEY}_official_info`);
    localStorage.removeItem('pratibha_current_user');
    setCrpAccounts([]);
    setSchoolAccounts([]);
    setAllSchools(SCHOOLS);
    setAllStudents([]);
    setAllJudges([]);
    setScoreEntries([]);
    setOfficialInfo(OFFICIAL_INFO);
    setCurrentUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        officialInfo,
        updateOfficialInfo,
        clusters,
        allSchools,
        allStudents,
        allJudges,
        crpAccounts,
        schoolAccounts,
        scoreEntries,
        firebaseConnected,
        visibleSchools,
        visibleStudents,
        visibleJudges,
        loginAsAdmin,
        loginAsCrp,
        loginAsSchool,
        loginAsJudge,
        logout,
        registerCrp,
        registerSchool,
        registerJudge,
        registerStudent,
        updateStudent,
        deleteStudent,
        saveJudgeMarks,
        resetClusterData,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
