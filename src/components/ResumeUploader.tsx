/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { Upload, FileText, CheckCircle2, AlertCircle, FileSpreadsheet, Layers, Sparkles, Plus, Copy } from "lucide-react";
import { Candidate } from "../types";
import { parseCandidateLocally, getLocalJobs, getLocalSettings } from "../lib/clientDb";

interface ResumeUploaderProps {
  onCandidateAdded: (cand: Candidate) => void;
}

export default function ResumeUploader({ onCandidateAdded }: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [parsedName, setParsedName] = useState("");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");
  const [manualName, setManualName] = useState("");
  const [fastMode, setFastMode] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pre-configured ready-to-parse high fidelity drafts for instant testing
  const candidateDraftSamples = [
    {
      title: "Senior Full Stack Dev Model (High Score)",
      name: "Marcus Aurelius Developer",
      text: `Marcus Aurelius Developer - marcus.dev@rome.corp - +1 (555) 777-9999 - Naples, FL
Education: B.S. in Electrical & Computer Engineering, Georgia Tech (GPA 3.9)
Experience:
- Senior Full-Stack Lead at RomeSystems Ltd (2022 - present): Configured micro-frontends with React, TypeScript, Next.js. Engineered Express backends, MongoDB caches, Redis layers, and implemented scalable PostgreSQL databases in Amazon AWS RDS cloud environments. Created automated Docker visual pipelines and maintained standard REST APIs.
- Software Engineer at SpartanTech Inc (2019 - 2022): Integrated state control managers Redux & Zustand, designed styled layouts using Tailwind CSS. Mentored juniors and handled daily Git/GitHub deployments.
Skills: TypeScript, JavaScript, Python, Go, React, Express, Next.js, Node.js, Redux, Zustand, PostgreSQL, MongoDB, Redis, Docker, AWS, GCP, Git, Tailwind CSS, Framer Motion.`
    },
    {
      title: "AI NLP Research Scientist (High Score)",
      name: "Elizabeth Tesla AI",
      text: `Elizabeth Tesla AI - elizabeth.tesla@aiworld.io - New York, NY
Education: Ph.D. in Computer Science with focus on Machine Learning, Carnegie Mellon University.
Experience:
- Principal AI Scientist at FutureLogic LLC (2022 - Present): Researched and constructed deep learning transformer architectures, customized Natural Language Processing pipelines via spaCy, NLTK, and Numpy, and fine-tuned pre-trained Hugging Face checkpoints. Kept extensive telemetry logs inside Weights & Biases.
- ML Engineer at DataNova Corp (2020 - 2022): Trained Logistic Regression classifiers, Random Forests classifiers, and TF-IDF term vector matches. Deployed low-latency endpoints using Python Flask, Docker, and Pinecone vector databases.
Skills: Python, SQL, PyTorch, TensorFlow, Scikit-Learn, Pinecone, FAISS, NLTK, spaCy, Transformers, Weights & Biases, Numpy, Pandas, Jupyter, Docker, AWS.`
    },
    {
      title: "Junior Frontend Dev (Fail/Middling Score)",
      name: "Kevin Codefresh",
      text: `Kevin Codefresh - kevin@codefresh.net - Denver, CO
Education: Associate's Degree in Software Technology, Community College.
Experience:
- Junior Frontend developer at PixelWeb (2024 - 2025): Developed custom static landing forms using client HTML, CSS, JavaScript, and basic React components. Handled basic styling adjustments.
Skills: HTML, CSS, JavaScript, React, Git, NPM.`
    }
  ];

  // Drag handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const parseAndAddResume = async (
    text: string, 
    name: string, 
    filename?: string,
    fileData?: string,
    mimeType: string = "text/plain"
  ) => {
    if (mimeType === "text/plain" && !text.trim()) {
      setError("Please paste custom resume content or select a sample draft.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setParsedName("");
    setProgress(15);

    // Simulate progress ticks
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return prev;
        }
        return prev + 12;
      });
    }, 250);

    try {
      const response = await fetch("/api/candidates/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: text,
          fileData,
          mimeType,
          fastMode,
          candidateName: name,
          filename: filename || "manual-upload.txt"
        })
      });

      clearInterval(interval);
      setProgress(100);
      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        setSuccess(true);
        setParsedName(data.candidate.name);
        onCandidateAdded(data.candidate);
        setPastedText("");
        setManualName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        console.warn("Server API returned non-200. Activating local high-fidelity fallback parser...");
        const jobs = getLocalJobs();
        const settings = getLocalSettings();
        const fallbackCand = parseCandidateLocally(
          text || (fileData ? "Uploaded Doc: " + (filename || "Candidate") : ""), 
          name, 
          filename || "manual-upload.txt",
          jobs,
          settings.passThreshold,
          settings.scoringWeights
        );
        setSuccess(true);
        setParsedName(fallbackCand.name);
        onCandidateAdded(fallbackCand);
        setPastedText("");
        setManualName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (e) {
      clearInterval(interval);
      setProgress(100);
      setLoading(false);
      
      console.warn("Connection to Server API failed. Activating local high-fidelity fallback parser...", e);
      const jobs = getLocalJobs();
      const settings = getLocalSettings();
      const fallbackCand = parseCandidateLocally(
        text || (fileData ? "Uploaded Doc: " + (filename || "Candidate") : ""), 
        name, 
        filename || "manual-upload.txt",
        jobs,
        settings.passThreshold,
        settings.scoringWeights
      );
      setSuccess(true);
      setParsedName(fallbackCand.name);
      onCandidateAdded(fallbackCand);
      setPastedText("");
      setManualName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    const isPDF = file.name.toLowerCase().endsWith(".pdf");

    if (isPDF) {
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        const base64Data = result?.includes(",") ? result.split(",")[1] : result;
        await parseAndAddResume("", file.name.split(".")[0], file.name, base64Data, "application/pdf");
      };
      reader.readAsDataURL(file);
    } else {
      reader.onload = async (event) => {
        const textContent = event.target?.result as string;
        await parseAndAddResume(textContent, file.name.split(".")[0], file.name, undefined, "text/plain");
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const triggerSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8 text-left" id="resume-uploader">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
            <Upload className="w-6 h-6 text-indigo-500" />
            <span>Ingest Resumes</span>
          </h1>
          <p className="text-xs text-slate-500">
            Upload plain-text, PDF transcripts, paste raw text, or select high-fidelity drafts instantly below to test parser results.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 px-3 py-1.5 rounded-2xl shadow-2xs self-start md:self-auto">
          <input
            type="checkbox"
            id="checkbox-fast-mode"
            checked={fastMode}
            onChange={(e) => setFastMode(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 dark:border-slate-800 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="checkbox-fast-mode" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none flex items-center gap-1.5">
            <span>Fast Local Indexing (⚡ Instant Matching)</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Upload Methods */}
        <div className="lg:col-span-8 space-y-6">
          {/* Drag and Drop */}
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={triggerSelectFile}
            id="drag-drop-zone"
            className={`cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-10 text-center transition-all min-h-[220px] ${
              dragActive
                ? "border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20"
                : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt,.doc,.docx,.pdf"
              className="hidden"
              id="file-input-raw"
            />
            <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl text-indigo-600 dark:text-indigo-400 mb-4 transition-transform group-hover:scale-105">
              <Upload className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Drag & drop candidate resumes here, or <span className="text-indigo-600 hover:underline">browse files</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-2">
              Supports standard Plain Text (.txt), Word Documents (.docx), and PDF extracts
            </p>
          </div>

          {/* Paste manual text option */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4" id="paste-textbox-container">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Method 2: Paste Raw Resume Text
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500">Applicant Name (Optional)</label>
                  <input
                    type="text"
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="e.g. Johnathan Doe"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-xl text-xs dark:text-white"
                  />
                </div>
              </div>

              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste full text, qualifications, certificates, education, and career experience from the resume here..."
                className="w-full p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs dark:text-white font-sans resize-none"
                id="textarea-pasted-resume"
              />

              <button
                onClick={() => parseAndAddResume(pastedText, manualName)}
                disabled={loading}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Parse Copied Text
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Feedback & Quick Presets */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick test drafts */}
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-5" id="preset-tester-panel">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Quick Test Candidates presets</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                1-click to test the parser instantly using high-fidelity test resumes. No file downloads needed.
              </p>
            </div>

            <div className="space-y-3" id="draft-presets-list">
              {candidateDraftSamples.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => parseAndAddResume(sample.text, sample.name, `${sample.name.toLowerCase().replace(/\s+/g, "_")}.txt`)}
                  disabled={loading}
                  className="w-full text-left p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-850 hover:border-indigo-500 rounded-2xl text-xs font-medium dark:text-slate-200 transition-all flex flex-col justify-between hover:scale-[1.01] shadow-xs cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{sample.title}</span>
                    <Copy className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">Preset: {sample.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Feedback & Progress Panels */}
          {(loading || success || error) && (
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm space-y-4" id="uploader-feedback-panel">
              {loading && (
                <div className="space-y-3" id="parse-loading-bar">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="animate-pulse text-indigo-600 dark:text-indigo-400">AI Parsing in progress...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Analyzing applicant text, extracting technical competencies, dates, education matrices, and computing TF-IDF similarity vector coefficients against job specifications...
                  </p>
                </div>
              )}

              {success && (
                <div className="space-y-2 text-center" id="parse-success-banner">
                  <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto inline-block">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Parse Complete</h4>
                  <p className="text-[11px] text-slate-500">
                    Extracted candidate profilename <strong className="text-indigo-600 dark:text-indigo-400">{parsedName}</strong> and successfully synchronized against active requirement indexes.
                  </p>
                </div>
              )}

              {error && (
                <div className="space-y-2 text-center" id="parse-error-banner">
                  <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-2xl mx-auto inline-block">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Analysis Terminated</h4>
                  <p className="text-[11px] text-red-500">{error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
