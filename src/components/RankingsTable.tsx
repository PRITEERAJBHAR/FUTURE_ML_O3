/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Trash2, 
  Eye, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  ArrowUpDown,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
  Award
} from "lucide-react";
import { Candidate, JobDescription } from "../types";

interface RankingsTableProps {
  candidates: Candidate[];
  jobs: JobDescription[];
  activeJobId: string | null;
  onSelectJob: (jobId: string) => void;
  onViewCandidate: (cand: Candidate) => void;
  onDeleteCandidate: (candId: string) => void;
  onRefreshAllMatches: () => void;
}

export default function RankingsTable({
  candidates,
  jobs,
  activeJobId,
  onSelectJob,
  onViewCandidate,
  onDeleteCandidate,
  onRefreshAllMatches
}: RankingsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expYearsFilter, setExpYearsFilter] = useState<string>("All");
  const [sortField, setSortField] = useState<"score" | "name" | "experience">("score");
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];

  // Helper sorting and ranking logic for selected job
  const getCandidateScoreDetails = (cand: Candidate) => {
    if (!activeJobId || !cand.matchResults || !cand.matchResults[activeJobId]) {
      return { score: 0, status: "Fail" as const, matchPercent: 0, expPercent: 0 };
    }
    const match = cand.matchResults[activeJobId];
    return {
      score: match.overallScore,
      status: match.passOrFail,
      matchPercent: match.skillMatchPercent,
      expPercent: match.experienceMatchPercent
    };
  };

  const handleSort = (field: "score" | "name" | "experience") => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Convert candidates matching search & filters
  const filteredCandidates = candidates.filter(cand => {
    const details = getCandidateScoreDetails(cand);
    
    // Search keyword match in Name, email, experience list, skills
    const textToSearch = `${cand.name} ${cand.email} ${cand.education.join(" ")} ${
      cand.skills.programmingLanguages.join(" ")
    } ${cand.skills.frameworks.join(" ")}`.toLowerCase();
    
    const matchesSearch = textToSearch.includes(searchTerm.toLowerCase());
    const matchesMinScore = details.score >= minScoreFilter;
    const matchesStatus = statusFilter === "All" || details.status === statusFilter;
    
    let matchesExp = true;
    if (expYearsFilter !== "All") {
      if (expYearsFilter === "0-2") matchesExp = cand.yearsOfExperience <= 2;
      else if (expYearsFilter === "3-5") matchesExp = cand.yearsOfExperience >= 3 && cand.yearsOfExperience <= 5;
      else if (expYearsFilter === "6-9") matchesExp = cand.yearsOfExperience >= 6 && cand.yearsOfExperience <= 9;
      else if (expYearsFilter === "10+") matchesExp = cand.yearsOfExperience >= 10;
    }

    return matchesSearch && matchesMinScore && matchesStatus && matchesExp;
  });

  // Apply sorting
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    let orderA: any = 0;
    let orderB: any = 0;

    if (sortField === "score") {
      orderA = getCandidateScoreDetails(a).score;
      orderB = getCandidateScoreDetails(b).score;
    } else if (sortField === "name") {
      orderA = a.name.toLowerCase();
      orderB = b.name.toLowerCase();
    } else if (sortField === "experience") {
      orderA = a.yearsOfExperience;
      orderB = b.yearsOfExperience;
    }

    if (orderA < orderB) return sortAsc ? -1 : 1;
    if (orderA > orderB) return sortAsc ? 1 : -1;
    return 0;
  });

  // Paginate list
  const totalItems = sortedCandidates.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = sortedCandidates.slice(startIndex, startIndex + itemsPerPage);

  // Robust export utility to download complete candidate ranking CSV
  const handleExportCSV = () => {
    let csvContent = "";
    
    // Header Row matching RFC 4180
    const headers = [
      "Rank",
      "Candidate Name",
      "Email Address",
      "Phone Number",
      "Address",
      "GitHub profile",
      "LinkedIn profile",
      "Years of Experience",
      "ATS Match Score (%)",
      "Match Status",
      "Candidate Skills",
      "Education Credentials"
    ];
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(",") + "\n";
    
    sortedCandidates.forEach((cand, idx) => {
      const details = getCandidateScoreDetails(cand);
      
      const allSkills = [
        ...(cand.skills?.programmingLanguages || []),
        ...(cand.skills?.frameworks || []),
        ...(cand.skills?.databases || []),
        ...(cand.skills?.cloud || []),
        ...(cand.skills?.softSkills || []),
        ...(cand.skills?.tools || []),
        ...(cand.skills?.libraries || [])
      ].join("; ");

      const row = [
        (idx + 1).toString(),
        cand.name || "",
        cand.email || "",
        cand.phone || "",
        cand.address || "",
        cand.github || "",
        cand.linkedIn || "",
        cand.yearsOfExperience?.toString() || "0",
        `${details.score}%`,
        details.status === "Pass" ? "Passed" : "Under Threshold",
        allSkills,
        cand.education?.join("; ") || "None"
      ];
      
      csvContent += row.map(val => `"${val.replace(/"/g, '""')}"`).join(",") + "\n";
    });

    // Generate blob to handle custom formatting, commas, and unicode perfectly
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Candidate_ATS_Rankings_${(activeJob?.title || "Match").replace(/\s+/g, "_")}.csv`);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-left" id="rankings-table-view">
      {/* Top Banner Control Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-500" />
            <span>AI Resume Candidate Rankings</span>
          </h1>
          <p className="text-xs text-slate-500">
            Compare and sort applicant scores dynamically against criteria mappings of the target job description.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={activeJobId || ""}
            onChange={(e) => {
              onSelectJob(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white focus:outline-none"
            id="job-select-rankings"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                Targeting: {job.title}
              </option>
            ))}
          </select>
          
          <button
            onClick={onRefreshAllMatches}
            className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-200 rounded-xl transition-colors"
            title="Refresh Matrices"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-950 text-xs font-semibold rounded-xl hover:scale-[1.01] transition-transform shadow-sm"
            id="btn-export-csv"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search & Filtering Strip */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search candidates by name, specific skill keywords, or text..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white focus:outline-none"
            id="candidate-search-input"
          />
        </div>

        {/* Min Score Filter */}
        <div className="md:col-span-2 space-y-1">
          <select
            value={minScoreFilter}
            onChange={(e) => {
              setMinScoreFilter(parseInt(e.target.value) || 0);
              setCurrentPage(1);
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white focus:outline-none"
            id="filter-min-score"
          >
            <option value="0">Min Score: All</option>
            <option value="50">Score ≥ 50</option>
            <option value="70">Score ≥ 70</option>
            <option value="85">Score ≥ 85</option>
          </select>
        </div>

        {/* Status Pass/Fail Filter */}
        <div className="md:col-span-2 space-y-1">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white focus:outline-none"
            id="filter-pass-status"
          >
            <option value="All">Status: All</option>
            <option value="Pass">Pass Threshold</option>
            <option value="Fail">Draft Failures</option>
          </select>
        </div>

        {/* Exp Level Filter */}
        <div className="md:col-span-3 space-y-1">
          <select
            value={expYearsFilter}
            onChange={(e) => {
              setExpYearsFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white focus:outline-none"
            id="filter-exp-demography"
          >
            <option value="All">Experience: All Years</option>
            <option value="0-2">Junior (0 - 2 yrs)</option>
            <option value="3-5">Mid-level (3 - 5 yrs)</option>
            <option value="6-9">Senior (6 - 9 yrs)</option>
            <option value="10+">Principal (10+ yrs)</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden" id="rankings-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort("name")}>
                  <div className="flex items-center space-x-1">
                    <span>Candidate Name / Email</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort("score")}>
                  <div className="flex items-center space-x-1">
                    <span>ATS Match Score</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-6 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => handleSort("experience")}>
                  <div className="flex items-center space-x-1">
                    <span>Exp</span>
                    <ArrowUpDown className="w-3.5 h-3.5" />
                  </div>
                </th>
                <th className="py-4 px-6">Identified Key Skills</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {paginatedCandidates.map((cand, index) => {
                const details = getCandidateScoreDetails(cand);
                const actualRank = startIndex + index + 1;

                return (
                  <tr key={cand.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-400">#{actualRank}</td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800 dark:text-white">{cand.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cand.email}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-md text-slate-800 dark:text-slate-150">
                          {details.score}%
                        </span>
                        <span className="text-[9px] text-slate-400">({details.matchPercent}% Skills)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-650 dark:text-slate-300">
                      {cand.yearsOfExperience} yrs
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {[
                          ...cand.skills.programmingLanguages.slice(0, 2),
                          ...cand.skills.frameworks.slice(0, 2),
                          ...cand.skills.cloud.slice(0, 1)
                        ].map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-slate-50 dark:bg-slate-950 text-slate-500 text-[9px] font-semibold rounded-md border border-slate-100 dark:border-slate-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {details.status === "Pass" ? (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                          <CheckCircle className="w-3 h-3 text-emerald-500" />
                          <span>Passed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-full">
                          <XCircle className="w-3 h-3 text-red-500" />
                          <span>Under Threshold</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewCandidate(cand)}
                          className="px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:border-indigo-500 rounded-lg text-[10px] font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Report</span>
                        </button>
                        <button
                          onClick={() => onDeleteCandidate(cand.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-lg transition-colors"
                          title="Delete Candidate"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedCandidates.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    No matching applicants fit the filters. Change criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} candidates
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-[11px] bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-slate-500 hover:bg-slate-50 rounded-lg disabled:opacity-40"
            >
              Previous
            </button>
            <div className="px-3 text-[11px] text-slate-600 dark:text-slate-300 font-bold">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-[11px] bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 text-slate-500 hover:bg-slate-50 rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
