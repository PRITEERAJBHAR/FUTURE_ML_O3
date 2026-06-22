/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  Briefcase, 
  CheckCircle2, 
  Activity, 
  Award, 
  Sparkles, 
  Zap, 
  Download,
  Database
} from "lucide-react";
import { DashboardStats, JobDescription } from "../types";

interface DashboardHomeProps {
  jobs: JobDescription[];
  activeJobId: string | null;
  onSelectJob: (jobId: string) => void;
  onNavigateTab: (tab: string) => void;
}

export default function DashboardHome({ jobs, activeJobId, onSelectJob, onNavigateTab }: DashboardHomeProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const queryParam = activeJobId ? `?jobId=${activeJobId}` : "";
        const response = await fetch(`/api/analytics${queryParam}`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to load dashboard analytics stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [activeJobId, jobs]);

  // Styling Cell Colors
  const COLORS = ["#10b981", "#ef4444"];
  const GRADIENT_COLORS = ["#6366f1", "#a855f7"];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" id="dashboard-loader">
        <div className="space-y-4 text-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 animate-pulse">Recalculating ATS Score Matrices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left" id="dashboard-home">
      {/* Header and job select */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-indigo-500" />
            <span>ATS Candidate Screening Insights</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Intelligent pipeline overview, correlation metrics, and NLP score distribution.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500">Filter Job Target:</span>
          <select
            value={activeJobId || ""}
            onChange={(e) => onSelectJob(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-medium dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            id="insights-job-select"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} ({job.company || "Default"})
              </option>
            ))}
          </select>
        </div>
      </div>

      {stats && (
        <>
          {/* Key Indicators Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="stats-indicators-grid">
            {/* Total candidates */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Processed Candidates</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {stats.totalResumes}
                </p>
                <p className="text-[10px] text-emerald-500 font-medium">100% cloud file parsed</p>
              </div>
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Users className="w-5 h-5" />
              </div>
            </div>

            {/* Total jobs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Job Postings</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {stats.totalJobs}
                </p>
                <p className="text-[10px] text-slate-400">Custom matching enabled</p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-xl text-purple-600 dark:text-purple-400">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            {/* Average Score */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Average ATS Score</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {stats.averageScore}%
                </p>
                <p className="text-[10px] text-amber-500 font-medium">Based on weighted rules</p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-600 dark:text-amber-400">
                <Activity className="w-5 h-5" />
              </div>
            </div>

            {/* Pass Rate */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Benchmark Pass Rate</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                  {stats.passRate}%
                </p>
                <p className="text-[10px] text-emerald-500 font-medium">Scores ≥ Pass Threshold</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Quick Action Banner */}
          <div className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-6" id="dashboard-cta">
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
                <span>Need immediate results?</span>
              </h3>
              <p className="text-xs text-indigo-100 max-w-xl">
                Upload raw resumes directly and let Gemini parsing models extract structured key credentials and matching scores in real-time.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("upload_resume")}
              id="cta-jump-uploader"
              className="px-5 py-3 bg-white text-indigo-600 hover:bg-slate-50 font-semibold rounded-xl text-xs shadow-md transition-all self-start md:self-auto shrink-0"
            >
              Parse More Resumes
            </button>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-charts-row1">
            {/* Top skills list bar chart */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center justify-between">
                <span>Programming Languages & Skills Distribution</span>
                <span className="text-[10px] text-slate-400 font-medium">Top categories in candidate pool</span>
              </h3>
              <div className="h-80" id="chart-top-skills">
                {stats.topSkills.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.topSkills} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#f8fafc", 
                          borderColor: "#e2e8f0",
                          borderRadius: "12px",
                          fontSize: "11px"
                        }} 
                      />
                      <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]}>
                        {stats.topSkills.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6366f1" : "#8b5cf6"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No skills parsed across candidate resumes.
                  </div>
                )}
              </div>
            </div>

            {/* Screen selection donut */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6">
                Passed vs. Rejected Ratio
              </h3>
              <div className="h-56 relative flex items-center justify-center" id="chart-pass-fail-pie">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <p className="text-3xl font-black font-display text-slate-800 dark:text-white">
                    {stats.passRate}%
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Pass Rate</p>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-6 text-xs font-semibold pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Passed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-slate-600 dark:text-slate-300">Below Threshold</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-charts-row2">
            {/* Score distribution area chart */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center justify-between">
                <span>ATS Resume Score Distribution Curve</span>
                <span className="text-[10px] text-slate-400 font-medium">Frequency of scores across ranges</span>
              </h3>
              <div className="h-64" id="chart-score-dist">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.scoreDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Experience Distribution */}
            <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-6 flex items-center justify-between">
                <span>Candidate Experience Demographic</span>
                <span className="text-[10px] text-slate-400 font-medium font-mono">Years of industry experience</span>
              </h3>
              <div className="h-64" id="chart-exp-dist">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.experienceDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
