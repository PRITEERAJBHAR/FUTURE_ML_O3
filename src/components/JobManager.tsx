/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Briefcase, Plus, FileText, Check, AlertCircle, Trash2, Calendar, Target, Clock, GraduationCap } from "lucide-react";
import { JobDescription } from "../types";

interface JobManagerProps {
  jobs: JobDescription[];
  onJobAdded: (job: JobDescription) => void;
  onJobDeleted: (jobId: string) => void;
}

export default function JobManager({ jobs, onJobAdded, onJobDeleted }: JobManagerProps) {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [experienceYears, setExperienceYears] = useState(3);
  const [education, setEducation] = useState("Bachelor's Degree in Computer Science");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          company,
          descriptionText,
          experienceYears,
          education
        })
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok && data.success) {
        onJobAdded(data.job);
        setTitle("");
        setCompany("");
        setDescriptionText("");
        setExperienceYears(3);
        setEducation("Bachelor's Degree in Computer Science");
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
      } else {
        setError(data.error || "Failed to process and index the Job Description.");
      }
    } catch (e) {
      setLoading(false);
      setError("Server communications failure. Please verify backend state.");
    }
  };

  const handleDelete = async (jobId: string) => {
    if (confirm("Are you sure you want to delete this job description? It will clear associated match results.")) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
        if (response.ok) {
          onJobDeleted(jobId);
        }
      } catch (err) {
        console.error("Failed to delete job description", err);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left" id="job-manager">
      {/* Upload Form */}
      <div className="lg:col-span-5 space-y-6">
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              <span>Define Job Description</span>
            </h2>
            <p className="text-xs text-slate-500">
              Input new role specifications. Gemini AI will automatically index requirements, required technical categories, and key descriptors.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="form-job-add">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-xs flex items-start space-x-2">
                <Check className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Role parsed and indexed successfully. Checked keywords!</span>
              </div>
            )}

            <div className="space-y-1" id="group-job-title">
              <label className="text-xs font-semibold text-slate-500">Role Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Full-Stack Developer"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 dark:text-white transition-colors"
                id="input-job-title"
              />
            </div>

            <div className="space-y-1" id="group-job-company">
              <label className="text-xs font-semibold text-slate-500">Company / Department Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google Cloud Platform"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 dark:text-white transition-colors"
                id="input-job-company"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1" id="group-job-exp">
                <label className="text-xs font-semibold text-slate-500">Target Experience (Years)</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 dark:text-white transition-colors"
                  id="input-job-exp"
                />
              </div>

              <div className="space-y-1" id="group-job-education">
                <label className="text-xs font-semibold text-slate-500">Minimum Degree</label>
                <select
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 dark:text-white transition-colors"
                  id="input-job-edu"
                >
                  <option value="Bachelor's Degree in Computer Science">Bachelor's Degree</option>
                  <option value="Master's in Computer Science / AI">Master's Degree</option>
                  <option value="Ph.D. in Computer Science or Math">Ph.D. Degree</option>
                  <option value="Secondary High School equivalent">Certifications Only</option>
                </select>
              </div>
            </div>

            <div className="space-y-1" id="group-job-description">
              <label className="text-xs font-semibold text-slate-500">Job Description details (Paste Text or Markdown) *</label>
              <textarea
                required
                rows={7}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                placeholder="Include key requirements, frameworks, databases, and desired clouds (Docker, React, PostgreSQL etc.)."
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 dark:text-white font-sans transition-colors resize-none"
                id="input-job-desc"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="job-submit-btn"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-indigo-600/10"
            >
              <span>{loading ? "Screener Extracting NLP keys..." : "Analyze & Index Role"}</span>
              <Plus className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Active Jobs List */}
      <div className="lg:col-span-7 space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Active Requirement Models</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            List of configured jobs against which incoming resumes are parsed and matches computed.
          </p>
        </div>

        <div className="space-y-4" id="jobs-list-container">
          <AnimatePresence mode="popLayout">
            {jobs.map((job) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md">
                      ID: {job.id}
                    </span>
                    <h3 className="text-md font-bold text-slate-800 dark:text-white font-display mt-1">
                      {job.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">{job.company || "Google Cloud Partner"}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    title="Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {job.descriptionText}
                </p>

                {/* Requirements Badges */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-3 border-t border-slate-50 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Exp: {job.experienceYears}+ years</span>
                  </div>
                  <div className="flex items-center space-x-1.5 col-span-1 md:col-span-2">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="truncate">{job.education}</span>
                  </div>
                </div>

                {/* Keyword Tag Pill Container */}
                {job.keywords && job.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {job.keywords.slice(0, 6).map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 text-slate-500 text-[9px] font-semibold rounded-full border border-slate-200/50 dark:border-slate-800">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {jobs.length === 0 && (
            <div className="p-8 text-center bg-slate-100/50 dark:bg-slate-950/40 rounded-3xl border border-dashed border-slate-200">
              <Plus className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
              <p className="text-xs font-semibold text-slate-500">No active job templates seeded.</p>
              <p className="text-[10px] text-slate-400 mt-1">Fill out the left form to add your very first role.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
