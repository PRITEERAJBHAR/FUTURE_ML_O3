/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Cpu, 
  LayoutDashboard, 
  Briefcase, 
  UploadCloud, 
  Award, 
  Map, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Menu,
  X,
  User,
  Shield,
  HelpCircle,
  RefreshCw,
  Sparkles
} from "lucide-react";

import { JobDescription, Candidate, SystemSettings } from "./types";
import LandingPage from "./components/LandingPage";
import DashboardHome from "./components/DashboardHome";
import JobManager from "./components/JobManager";
import ResumeUploader from "./components/ResumeUploader";
import RankingsTable from "./components/RankingsTable";
import SkillGapView from "./components/SkillGapView";
import SettingsView from "./components/SettingsView";
import CandidateModal from "./components/CandidateModal";

type ActiveTab = "dashboard" | "jobs" | "upload_resume" | "candidate_ranking" | "skill_gap" | "settings";

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab | "landing">("landing");
  
  // Entities State
  const [jobs, setJobs] = useState<JobDescription[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  
  // Branding & theme State
  const [settings, setSettings] = useState<SystemSettings>({
    companyName: "Google Cloud",
    companyLogoUrl: "",
    theme: "light",
    passThreshold: 70,
    scoringWeights: {
      skills: 40,
      experience: 20,
      projects: 15,
      education: 10,
      certificates: 5,
      keywords: 10
    }
  });

  const [darkMode, setDarkMode] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load system state on start
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch settings
      const setRes = await fetch("/api/settings");
      if (setRes.ok) {
        const setData = await setRes.json();
        setSettings(setData);
        setDarkMode(setData.theme === "dark");
      }

      // Fetch active jobs
      const jobsRes = await fetch("/api/jobs");
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData);
        if (jobsData.length > 0) {
          setActiveJobId(jobsData[0].id);
        }
      }

      // Fetch candidates
      const candRes = await fetch("/api/candidates");
      if (candRes.ok) {
        const candData = await candRes.json();
        setCandidates(candData);
      }
    } catch (e) {
      console.error("Failed to boot full-stack system database matrices", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Sync index.html body classes for Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAdminLoginSuccess = (email: string) => {
    setCurrentTab("dashboard");
  };

  const handleUpdateBranding = async (newS: SystemSettings) => {
    setSettings(newS);
    setDarkMode(newS.theme === "dark");
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newS)
      });
    } catch (err) {
      console.error("Save system settings failed on API endpoint", err);
    }
  };

  const handleUpdatePassword = async (oldP: string, newP: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "recruiter@company.com", password: oldP })
      });
      if (!response.ok) {
        return { success: false, error: "Current admin password was incorrect." };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: "Server communication timeout." };
    }
  };

  const handleRefreshAllMatches = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/candidates");
      if (response.ok) {
        const candData = await response.json();
        setCandidates(candData);
      }
    } catch (err) {
      console.error("Refresh candidates list failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (candId: string) => {
    if (confirm("Are you sure you want to delete this candidate application?")) {
      try {
        const response = await fetch(`/api/candidates/${candId}`, { method: "DELETE" });
        if (response.ok) {
          setCandidates((prev) => prev.filter((c) => c.id !== candId));
        }
      } catch (err) {
        console.error("Delete candidate endpoint triggered error", err);
      }
    }
  };

  const toggleDarkMode = () => {
    const updatedTheme = darkMode ? "light" : "dark";
    setDarkMode(!darkMode);
    handleUpdateBranding({
      ...settings,
      theme: updatedTheme as "light" | "dark"
    });
  };

  // Nav items descriptor
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "jobs", label: "Upload Job Description", icon: <Briefcase className="w-4 h-4" /> },
    { id: "upload_resume", label: "Upload Resume", icon: <UploadCloud className="w-4 h-4" /> },
    { id: "candidate_ranking", label: "Candidate Ranking", icon: <Award className="w-4 h-4" /> },
    { id: "skill_gap", label: "Skill Gap Analysis", icon: <Map className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> }
  ];

  if (loading && currentTab !== "landing") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 text-center">
        <div className="space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-500 animate-pulse">Syncing ATS database records...</p>
        </div>
      </div>
    );
  }

  // Base landing screen routing
  if (currentTab === "landing") {
    return (
      <LandingPage 
        onGetStarted={() => setCurrentTab("dashboard")} 
        onAdminLogin={() => setCurrentTab("dashboard")} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-300">
      
      {/* Visual Sidebar Layout desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 shrink-0 select-none">
        <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center space-x-2.5">
          <div className="p-2 bg-indigo-600 rounded-xl text-yellow-300">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-md font-bold text-slate-800 dark:text-white font-display">ScreenATS</h2>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">AI Core v2.5</p>
          </div>
        </div>

        {/* Dynamic Nav Menu */}
        <nav className="flex-grow p-4 space-y-1.5 text-left">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id as ActiveTab)}
              id={`nav-${item.id}`}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                currentTab === item.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950/40 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Footer User Details */}
        <div className="p-4 border-t border-slate-50 dark:border-slate-800 space-y-3">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">Administrator</p>
              <p className="text-[10px] text-slate-400 truncate">recruiter@company.com</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab("landing")}
            id="btn-sidebar-logout"
            className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
          
          {/* Mobile responsive toggle */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold tracking-tight bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-150/40 dark:border-slate-850">
                Logged: {settings.companyName}
              </span>
            </div>
          </div>

          {/* Quick theme togglers */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Toggle Dark Slate Theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Active Target Job:</span>
            <select
              value={activeJobId || ""}
              onChange={(e) => setActiveJobId(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl px-3 py-1.5 text-xs font-semibold dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              id="top-bar-active-job-select"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Mobile menu navigation drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-100 p-4 space-y-1.5 transition-all animate-in fade-in slide-in-from-top-4 duration-300 text-left">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id as ActiveTab);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-xs font-bold ${
                  currentTab === item.id
                    ? "bg-indigo-600 text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center px-4">
              <span className="text-xs text-slate-400">recruiter@company.com</span>
              <button
                onClick={() => setCurrentTab("landing")}
                className="text-xs font-semibold text-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* Active Tab rendering router panel */}
        <main className="flex-grow p-6 md:p-8 overflow-y-auto">
          {currentTab === "dashboard" && (
            <DashboardHome 
              jobs={jobs} 
              activeJobId={activeJobId} 
              onSelectJob={setActiveJobId} 
              onNavigateTab={(tab) => setCurrentTab(tab as ActiveTab)}
            />
          )}

          {currentTab === "jobs" && (
            <JobManager 
              jobs={jobs} 
              onJobAdded={(job) => {
                setJobs((prev) => [...prev, job]);
                setActiveJobId(job.id);
              }}
              onJobDeleted={(id) => {
                setJobs((prev) => prev.filter((j) => j.id !== id));
                if (activeJobId === id) {
                  setActiveJobId(jobs[0]?.id || null);
                }
              }}
            />
          )}

          {currentTab === "upload_resume" && (
            <ResumeUploader 
              onCandidateAdded={(cand) => {
                setCandidates((prev) => [...prev, cand]);
                setCurrentTab("candidate_ranking");
              }}
            />
          )}

          {currentTab === "candidate_ranking" && (
            <RankingsTable 
              candidates={candidates} 
              jobs={jobs} 
              activeJobId={activeJobId} 
              onSelectJob={setActiveJobId}
              onViewCandidate={setSelectedCandidate} 
              onDeleteCandidate={handleDeleteCandidate}
              onRefreshAllMatches={handleRefreshAllMatches}
            />
          )}

          {currentTab === "skill_gap" && (
            <SkillGapView 
              candidates={candidates} 
              jobs={jobs} 
              activeJobId={activeJobId} 
              onSelectJob={setActiveJobId}
            />
          )}

          {currentTab === "settings" && (
            <SettingsView 
              initialSettings={settings} 
              onSaveSettings={handleUpdateBranding} 
              onUpdatePassword={handleUpdatePassword} 
            />
          )}
        </main>
      </div>

      {/* Visually stunning Scorecard inspect modal */}
      {selectedCandidate && (
        <CandidateModal 
          candidate={selectedCandidate} 
          jobs={jobs} 
          activeJobId={activeJobId} 
          onClose={() => setSelectedCandidate(null)} 
        />
      )}
    </div>
  );
}
