/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { Candidate, MatchResult, JobDescription } from "../types";
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  FileText, 
  Printer, 
  CheckCircle, 
  XCircle, 
  BookOpen, 
  Sparkles,
  Award,
  Clock,
  Briefcase,
  GraduationCap
} from "lucide-react";

interface CandidateModalProps {
  candidate: Candidate;
  jobs: JobDescription[];
  activeJobId: string | null;
  onClose: () => void;
}

export default function CandidateModal({ candidate, jobs, activeJobId, onClose }: CandidateModalProps) {
  const activeJob = jobs.find(j => j.id === activeJobId) || jobs[0];
  const matchResult: MatchResult | undefined = candidate.matchResults?.[activeJobId || ""];

  // Reference for printable layout
  const printIframeRef = useRef<HTMLIFrameElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6" id="candidate-modal-overlay">
      
      {/* Printable Sheet Wrapper */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col h-[90vh]" id="printable-area">
        
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between print:hidden">
          <div className="flex items-center space-x-1 pr-4 truncate">
            <span className="p-1 px-2.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold rounded-lg truncate">
              Evaluating vs: {activeJob?.title}
            </span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handlePrint}
              id="btn-print-candidate-report"
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Audit Sheet</span>
            </button>
            <button
              onClick={onClose}
              id="btn-close-candidate-modal"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Sheet body */}
        <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-8 text-left">
          {/* Header information */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                {candidate.name}
              </h1>
              <p className="text-sm text-slate-500 font-medium font-mono">
                {candidate.yearsOfExperience} Years of Professional Industry Experience
              </p>

              {/* Coordinates */}
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                {candidate.address && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{candidate.address}</span>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="flex items-center space-x-4 pt-1">
                {candidate.github && (
                  <a href={`https://${candidate.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-350 hover:text-indigo-600">
                    <Github className="w-4 h-4 text-slate-400" />
                    <span className="font-mono">{candidate.github}</span>
                  </a>
                )}
                {candidate.linkedIn && (
                  <a href={`https://${candidate.linkedIn}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center space-x-1 text-xs text-slate-600 dark:text-slate-350 hover:text-indigo-600">
                    <Linkedin className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono">{candidate.linkedIn}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Overall Matching Circle Card */}
            {matchResult ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-2xl flex items-center space-x-4 justify-between w-full md:w-auto md:min-w-[220px]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Match verdict</span>
                  {matchResult.passOrFail === "Pass" ? (
                    <div className="text-emerald-500 font-bold text-sm flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>PASSING SCORE</span>
                    </div>
                  ) : (
                    <div className="text-red-500 font-bold text-sm flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>FAILED STATUS</span>
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400">(Pass Threshold: {matchResult.overallScore}%)</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-slate-900 border-4 border-indigo-600/30 flex items-center justify-center text-lg font-black text-white font-mono">
                  {matchResult.overallScore}%
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl md:min-w-[200px]" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left Col: Career details */}
            <div className="md:col-span-8 space-y-6">
              {/* Experiences list */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-500" />
                  <span>Professional Work History</span>
                </h3>
                <div className="border-l border-slate-100 dark:border-slate-800 pl-4 space-y-6 text-xs" id="modal-experience-timeline">
                  {candidate.experience.map((exp, idx) => (
                    <div key={idx} className="relative space-y-1 text-left">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white" />
                      <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase tracking-wider font-semibold">
                        <span>{exp.duration}</span>
                        <span>{exp.company}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-800 dark:text-white font-display">
                        {exp.role}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-xs">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects List */}
              {candidate.projects && candidate.projects.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span>Personal Projects / Portfolio</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs" id="modal-projects-list">
                    {candidate.projects.map((proj, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-800 dark:text-white">{proj.title}</h4>
                          <p className="text-slate-500 leading-relaxed text-[11px]">{proj.description}</p>
                        </div>
                        {proj.url && (
                          <span className="text-[10px] text-indigo-600 hover:underline dark:text-indigo-400 truncate mt-2 font-mono pt-1">
                            Link: {proj.url}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Index of Technical Skills declared */}
            <div className="md:col-span-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-400">
                  Categorized Skills Index
                </h3>
                
                <div className="p-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-4 text-xs" id="modal-skills-categorized">
                  {candidate.skills.programmingLanguages.length > 0 && (
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 block mb-1">PROGRAMMING LANGUAGES</span>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.programmingLanguages.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200/40 text-slate-600 dark:text-slate-350 text-[10px] rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.skills.frameworks.length > 0 && (
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 block mb-1">FRAMEWORKS & LIBRARIES</span>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.frameworks.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200/40 text-slate-600 dark:text-slate-350 text-[10px] rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.skills.databases.length > 0 && (
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 block mb-1">DATABASES</span>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.databases.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200/40 text-slate-600 dark:text-slate-350 text-[10px] rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.skills.cloud.length > 0 && (
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 block mb-1">CLOUD SERVICES</span>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.cloud.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200/40 text-slate-600 dark:text-slate-350 text-[10px] rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {candidate.skills.softSkills.length > 0 && (
                    <div>
                      <span className="font-bold text-[10px] text-slate-400 block mb-1">SOFT SKILLS</span>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.softSkills.map((s, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200/40 text-slate-600 dark:text-slate-350 text-[10px] rounded">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Education list */}
              {candidate.education && candidate.education.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    <span>Academic Degrees</span>
                  </h3>
                  <div className="space-y-1 pl-1 text-xs">
                    {candidate.education.map((edu, idx) => (
                      <p key={idx} className="font-semibold text-slate-700 dark:text-slate-300">
                        {edu}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates */}
              {candidate.certificates && candidate.certificates.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <span>Professional Certificates</span>
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 dark:text-slate-350">
                    {candidate.certificates.map((cert, idx) => (
                      <li key={idx}>{cert}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Explanation and Suggestions detailed print map */}
          {matchResult && (
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>AI Auditor Screen Report Findings</span>
              </h3>
              
              <div className="p-5 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl text-xs space-y-3">
                <p className="leading-relaxed text-slate-700 dark:text-slate-200">
                  {matchResult.evaluationExplanation}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Printable Sheet styling only visible during media query printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-area, #printable-area * {
            visibility: visible;
          }
          #printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            border: none;
            box-shadow: none;
            overflow: visible;
          }
        }
      `}</style>
    </div>
  );
}
