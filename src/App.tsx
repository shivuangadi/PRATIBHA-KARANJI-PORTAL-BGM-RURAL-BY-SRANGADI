/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, NavItemKey } from './types';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePortal } from './components/HomePortal';
import { DashboardLayout } from './components/DashboardLayout';
import { AuthModal } from './components/auth/AuthModal';

// Modular Views
import { OverviewView } from './components/views/OverviewView';
import { CrpRegistrationView } from './components/views/CrpRegistrationView';
import { SchoolRegistrationView } from './components/views/SchoolRegistrationView';
import { StudentRegistrationView } from './components/views/StudentRegistrationView';
import { JudgeAppointmentView } from './components/views/JudgeAppointmentView';
import { JudgePortalView } from './components/views/JudgePortalView';
import { MarksEntryView } from './components/views/MarksEntryView';
import { MarksConsolidationView } from './components/views/MarksConsolidationView';
import { ClusterResultsView } from './components/views/ClusterResultsView';
import { TalukSelectionListView } from './components/views/TalukSelectionListView';
import { ReportsPrintingView } from './components/views/ReportsPrintingView';
import { AdminSettingsView } from './components/views/AdminSettingsView';

function MainApp() {
  const { currentUser, logout } = useApp();
  const [currentRole, setCurrentRole] = useState<UserRole>('home');
  const [activeNav, setActiveNav] = useState<NavItemKey>('overview');
  const [selectedClusterId, setSelectedClusterId] = useState<string>('c01');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole | null>(null);

  // Sync role and cluster if currentUser is already logged in
  useEffect(() => {
    if (currentUser) {
      setCurrentRole(currentUser.role);
      if (currentUser.clusterId) {
        setSelectedClusterId(currentUser.clusterId);
      }
    }
  }, [currentUser]);

  // Scroll to top whenever navigation changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentRole, activeNav]);

  const handleRoleSelect = (role: UserRole, initialNav?: NavItemKey) => {
    if (role === 'home') {
      setCurrentRole('home');
      setMobileMenuOpen(false);
      return;
    }

    // If already authenticated in this exact role, enter directly
    if (currentUser && currentUser.role === role) {
      setCurrentRole(role);
      if (initialNav) setActiveNav(initialNav);
      setMobileMenuOpen(false);
      return;
    }

    // Open AuthModal for this specific role
    setAuthModalRole(role);
    if (initialNav) setActiveNav(initialNav);
    setMobileMenuOpen(false);
  };

  const handleAuthSuccess = (authenticatedRole: UserRole) => {
    setCurrentRole(authenticatedRole);
    setAuthModalRole(null);
    if (authenticatedRole === 'judge') {
      setActiveNav('judge-login');
    } else if (authenticatedRole === 'school') {
      setActiveNav('student-registration');
    } else if (authenticatedRole === 'crp') {
      setActiveNav('overview');
    } else {
      setActiveNav('overview');
    }
  };

  const handleNavSelect = (nav: NavItemKey) => {
    setActiveNav(nav);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setCurrentRole('home');
    setActiveNav('overview');
    setMobileMenuOpen(false);
  };

  // Render view inside the role dashboard
  const renderActiveView = () => {
    switch (activeNav) {
      case 'overview':
        return (
          <OverviewView
            currentRole={currentRole}
            onNavigate={handleNavSelect}
            selectedClusterId={selectedClusterId}
          />
        );
      case 'crp-registration':
        return <CrpRegistrationView />;
      case 'school-registration':
        return <SchoolRegistrationView />;
      case 'student-registration':
        return <StudentRegistrationView />;
      case 'judge-appointment':
        return <JudgeAppointmentView />;
      case 'judge-login':
        return <JudgePortalView onNavigateToMarks={handleNavSelect} />;
      case 'marks-entry':
        return <MarksEntryView />;
      case 'marks-consolidation':
        return <MarksConsolidationView />;
      case 'cluster-results':
        return <ClusterResultsView />;
      case 'taluk-selection':
        return <TalukSelectionListView />;
      case 'reports-printing':
        return <ReportsPrintingView />;
      case 'admin-settings':
        return <AdminSettingsView />;
      default:
        return (
          <OverviewView
            currentRole={currentRole}
            onNavigate={handleNavSelect}
            selectedClusterId={selectedClusterId}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-500 selection:text-white">
      {/* Official Government Header */}
      <Header
        currentRole={currentRole}
        onRoleSelect={handleRoleSelect}
        activeNav={activeNav}
        onNavSelect={handleNavSelect}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Body: Home Portal OR Role-Based Dashboard */}
      {currentRole === 'home' ? (
        <main className="flex-1">
          <HomePortal
            onSelectRole={handleRoleSelect}
            onDirectNav={handleNavSelect}
          />
        </main>
      ) : (
        <DashboardLayout
          currentRole={currentRole}
          onRoleSelect={handleRoleSelect}
          activeNav={activeNav}
          onNavSelect={handleNavSelect}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          selectedClusterId={selectedClusterId}
          onSelectClusterId={setSelectedClusterId}
        >
          {renderActiveView()}
        </DashboardLayout>
      )}

      {/* Official Government Footer */}
      <Footer />

      {/* Role-Based Authentication & Registration Modal */}
      <AuthModal
        isOpen={authModalRole !== null}
        role={authModalRole}
        onClose={() => setAuthModalRole(null)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
