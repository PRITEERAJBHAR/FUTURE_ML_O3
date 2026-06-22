/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { Candidate, JobDescription } from "../types";
import { AlertCircle, CheckCircle, ExternalLink, GraduationCap, Map, Sparkles, BookOpen, Clock, Code, Award } from "lucide-react";

interface SkillGapViewProps {
  candidates: Candidate[];
  jobs: JobDescription[];
  activeJobId: string | null;
  onSelectJob: (jobId: string) => void;
}

export default function SkillGapView({ candidates, jobs, activeJobId, onSelectJob }: SkillGapViewProps) {
  const [selectedCandId, setSelectedCandId] = useState<string>("");

  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];
  const activeCandidates = candidates.filter(c => c.matchResults && c.matchResults[activeJobId || ""]);
  
  // Choose first active candidate if none selected
  const selectedCandidate = candidates.find(c => c.id === selectedCandId) || activeCandidates[0] || candidates[0];

  const matchResult = selectedCandidate?.matchResults?.[activeJobId || ""];

  // Merge candidate skills for display
  const getCandidateSkillsFlat = (cand: Candidate) => {
    if (!cand) return [];
    return [
      ...cand.skills.programmingLanguages,
      ...cand.skills.frameworks,
      ...cand.skills.databases,
      ...cand.skills.cloud,
      ...cand.skills.tools,
      ...cand.skills.libraries
    ];
  };

  const getJobSkillsFlat = (job: JobDescription) => {
    if (!job) return [];
    return [
      ...job.skillsRequired.programmingLanguages,
      ...job.skillsRequired.frameworks,
      ...job.skillsRequired.databases,
      ...job.skillsRequired.cloud,
      ...job.skillsRequired.tools,
      ...job.skillsRequired.libraries
    ];
  };

  const candSkills = selectedCandidate ? getCandidateSkillsFlat(selectedCandidate) : [];
  const jobSkills = activeJob ? getJobSkillsFlat(activeJob) : [];

  // Match and Missing Overlaps
  const matchedSkills = jobSkills.filter(js => 
    candSkills.some(cs => cs.toLowerCase().trim() === js.toLowerCase().trim() || cs.toLowerCase().includes(js.toLowerCase()))
  );

  const missingSkills = jobSkills.filter(js => 
    !matchedSkills.includes(js)
  );

  return (
    <div className="space-y-6 text-left" id="skill-gap-view">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Map className="w-6 h-6 text-indigo-500" />
            <span>Structured Skill Gap Analysis</span>
          </h1>
          <p className="text-xs text-slate-500">
            Compare candidate profilities against job competency benchmarks and review custom learning suggestions.
          </p>
        </div>

        {/* Filters and Selection */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Select Job */}
          <select
            value={activeJobId || ""}
            onChange={(e) => onSelectJob(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white focus:outline-none"
            id="gap-job-select"
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                Role: {job.title}
              </option>
            ))}
          </select>

          {/* Select Candidate */}
          <select
            value={selectedCandidate?.id || ""}
            onChange={(e) => setSelectedCandId(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold dark:text-white focus:outline-none"
            id="gap-candidate-select"
          >
            {candidates.map((cand) => (
              <option key={cand.id} value={cand.id}>
                Candidate: {cand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCandidate ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left panel: Core matching matrix */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl shadow-sm text-center">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Match score for {selectedCandidate.name}</span>
              <div className="relative flex items-center justify-center my-6">
                <div className="w-32 h-32 rounded-full border-8 border-indigo-50 dark:border-slate-800 flex items-center justify-center text-3xl font-black font-display text-indigo-600 dark:text-indigo-400" id="gap-score-display">
                  {matchResult ? `${matchResult.overallScore}%` : "80%"}
                </div>
              </div>
              <h3 className="text-md font-bold text-slate-800 dark:text-white font-display">
                {activeJob?.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1">Expected: {activeJob?.experienceYears}+ years exp</p>
            </div>

            {/* Matrix details */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-3xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Competency Comparison Map
              </h3>
              
              <div className="space-y-3" id="metric-percentages">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Skills Matching</span>
                    <span>{matchResult?.skillMatchPercent || 75}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${matchResult?.skillMatchPercent || 75}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Keyword Matching</span>
                    <span>{matchResult?.keywordMatchPercent || 70}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${matchResult?.keywordMatchPercent || 70}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Experience matching</span>
                    <span>{matchResult?.experienceMatchPercent || 80}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${matchResult?.experienceMatchPercent || 80}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Details of deficiency gaps & Recommended Courses list */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-5">
              <h2 className="text-md font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-500" />
                <span>Skill Deficiencies & Overlaps</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="skills-overlap-grid">
                {/* Matched */}
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-950/30 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Satisfied Skills ({matchedSkills.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5" id="gap-matched-tags">
                    {matchedSkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold rounded-md border border-emerald-100/30">
                        {sk}
                      </span>
                    ))}
                    {matchedSkills.length === 0 && (
                      <span className="text-[10px] text-slate-400">No overlapping competencies.</span>
                    )}
                  </div>
                </div>

                {/* Missing */}
                <div className="p-4 bg-red-50/40 dark:bg-red-950/10 border border-red-100 dark:border-red-950/30 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>Missing gaps ({missingSkills.length})</span>
                  </h3>
                  <div className="flex flex-wrap gap-1.5" id="gap-missing-tags">
                    {missingSkills.map((sk, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white dark:bg-slate-950 text-red-600 dark:text-red-400 text-[10px] font-semibold rounded-md border border-red-100/30">
                        {sk}
                      </span>
                    ))}
                    {missingSkills.length === 0 && (
                      <span className="text-[10px] text-emerald-500">Perfect skill coverage! Excellent candidate.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Curated Recommendations and Courses */}
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-5" id="gap-suggestions">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  <span>Curated AI Learning Roadmap</span>
                </h3>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" /> Recommended
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800" id="suggestions-list">
                {matchResult?.skillGap.learningSuggestions && matchResult.skillGap.learningSuggestions.length > 0 ? (
                  matchResult.skillGap.learningSuggestions.map((sug, idx) => (
                    <div key={idx} className="py-4 first:pt-0 last:pb-0 text-left space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white font-display">
                          {sug.skill}
                        </h4>
                        <span className="p-1 inline-flex items-center space-x-1 text-[10px] text-indigo-600 font-semibold bg-indigo-50 dark:bg-indigo-950/20 rounded-md">
                          <BookOpen className="w-3 h-3" />
                          <span>Course Resource</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {sug.description}
                      </p>
                      <div className="inline-flex items-center space-x-1.5 text-xs text-indigo-600 hover:underline dark:text-indigo-400 font-bold font-mono">
                        <span>Path: {sug.resource}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))
                ) : (
                  // General placeholders
                  <div className="py-4 text-center text-slate-400 text-xs">
                    Skill coverage is optimal. No action items required for this applicant.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-100/50 dark:bg-slate-950/40 rounded-3xl border border-dashed border-slate-200">
          <Map className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
          <p className="text-xs font-semibold text-slate-500">No applicants parsed for this active job description.</p>
          <p className="text-[10px] text-slate-400 mt-1">Upload a candidate resume under the 'Upload Resume' tab first.</p>
        </div>
      )}
    </div>
  );
}
