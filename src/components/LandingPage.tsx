/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  FileText, 
  Cpu, 
  TrendingUp, 
  Zap, 
  Map, 
  FileDown, 
  ArrowRight,
  ShieldAlert, 
  Terminal 
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
  onAdminLogin: () => void;
}

export default function LandingPage({ onGetStarted, onAdminLogin }: LandingPageProps) {
  const features = [
    {
      icon: <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: "Resume Parsing",
      description: "Instantly convert unstructured PDF, DOCX, and TXT files into highly structured JSON data.",
      id: "feat-parsing"
    },
    {
      icon: <Cpu className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: "Skill Extraction",
      description: "Classify hard skills, programming languages, databases, cloud, and vital soft skills.",
      id: "feat-nlp"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      title: "AI Resume Scoring",
      description: "Calibrated evaluations combining weight configurations, experience, projects, and certificates.",
      id: "feat-score"
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      title: "Candidate Ranking",
      description: "Instantly rank candidates relative to specific job specifications using intelligent sorting.",
      id: "feat-ranks"
    },
    {
      icon: <Map className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      title: "Skill Gap Analysis",
      description: "Identify exact missing skillsets and present custom courses with concrete learning resource advice.",
      id: "feat-gaps"
    },
    {
      icon: <FileDown className="w-6 h-6 text-pink-600 dark:text-pink-400" />,
      title: "PDF Report Generation",
      description: "Generate highly professional audit summaries with clear indicators for hiring leaders.",
      id: "feat-report"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-5 flex items-center justify-between" id="landing-header">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20" id="brand-logo-container">
            <Cpu className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            ScreenATS
          </span>
        </div>
        <button
          onClick={onAdminLogin}
          id="btn-goto-login"
          className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 Transition-colors"
        >
          Go to Dashboard
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 md:py-24 flex flex-col justify-center" id="landing-main">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero text */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Next Generation ATS Screening Engine</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-extrabold font-display leading-[1.1] text-slate-900 dark:text-white tracking-tight"
              id="landing-hero-title"
            >
              AI Resume Candidate <br className="hidden md:inline" />
              <span className="text-indigo-600 dark:text-indigo-400">Screening System</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed"
            >
              Automatically analyze, score, and rank resumes using advanced Artificial Intelligence. 
              Eliminate hours of manual triage with sub-second parsers and local vector models.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4"
              id="landing-cta-buttons"
            >
              <button
                onClick={onGetStarted}
                id="landing-btn-start"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-md shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all text-center flex items-center justify-center space-x-3 group"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <div className="lg:col-span-5 relative" id="landing-hero-graphics">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="p-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-3xl shadow-2xl relative"
            >
              <div className="bg-slate-950 rounded-[22px] p-6 text-left text-xs font-mono text-indigo-300 space-y-4">
                <div className="flex items-center space-x-1.5 border-b border-slate-800 pb-3 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-slate-500 pl-2">resume_evaluator_nlp.py</span>
                </div>
                <p className="text-indigo-400"># Model: TF-IDF Vectorizer + Cosine Correlation</p>
                <p className="text-slate-400">$ loading pipeline model checkpoints...</p>
                <p className="text-emerald-400">✓ TF-IDF similarity model loaded successfully</p>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-indigo-200">
                  <span className="text-slate-500 text-[10px]">PARSED DATA OBJECT:</span>
                  <p className="text-purple-400">{`{`}</p>
                  <p className="pl-4 text-emerald-400">"candidate_name": "Sarah Jenkins",</p>
                  <p className="pl-4 text-amber-400">"years_experience": 5.2,</p>
                  <p className="pl-4 text-indigo-400">"skills_categorized": [</p>
                  <p className="pl-8 text-blue-400">"PyTorch", "scikit-learn", "spaCy", "Transformers"</p>
                  <p className="pl-4 text-indigo-400">],</p>
                  <p className="pl-4 text-pink-400">"final_eval_score": 92.5</p>
                  <p className="text-purple-400">{`}`}</p>
                </div>
                <p className="text-slate-400">[SYSTEM] Analysing skill overlaps...</p>
                <p className="text-emerald-400">STATUS: MATCH PASSED (92.5%)</p>
              </div>

              {/* Float Card */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-xl flex items-center space-x-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Candidate Pass Rate</p>
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-200">92% Average</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Feature section */}
        <section className="mt-28 space-y-12" id="landing-features">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
              End-to-End Autonomous ATS Screening
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              An all-in-one suite built for HR leaders, system developers, and technical recruiters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="features-grid">
            {features.map((feat, index) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                id={feat.id}
                className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow dark:shadow-slate-950 flex flex-col justify-between"
              >
                <div className="space-y-4 text-left">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl inline-block">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white font-display">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-900/30 bg-white dark:bg-slate-950 py-10" id="landing-footer">
        <div className="max-w-7xl w-full mx-auto px-6 flex flex-col sm:flex-row items-center justify-between text-slate-400 text-xs">
          <p>© 2026 AdminATS Inc. All rights reserved. Built with Gemini AI.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Security Policy</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Privacy Management</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer">Contact Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
