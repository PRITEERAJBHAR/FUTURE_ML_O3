/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { SystemSettings, ScoringWeights } from "../types";
import { Sliders, Check, Settings, ShieldAlert, Award, FileText, Star, Briefcase } from "lucide-react";

interface SettingsViewProps {
  initialSettings: SystemSettings;
  onSaveSettings: (settings: SystemSettings) => void;
  onUpdatePassword: (oldP: string, newP: string) => Promise<{ success: boolean; error?: string }>;
}

export default function SettingsView({ initialSettings, onSaveSettings, onUpdatePassword }: SettingsViewProps) {
  const [companyName, setCompanyName] = useState(initialSettings.companyName);
  const [logoUrl, setLogoUrl] = useState(initialSettings.companyLogoUrl);
  const [theme, setTheme] = useState(initialSettings.theme);
  const [passThreshold, setPassThreshold] = useState(initialSettings.passThreshold);
  
  // Weights State
  const [weights, setWeights] = useState<ScoringWeights>(initialSettings.scoringWeights);

  // Administrative Passwords state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleWeightChange = (key: keyof ScoringWeights, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Ensure weights sum to exactly 100%
  const totalWeights = (Object.values(weights) as number[]).reduce((a, b) => a + b, 0);

  const handleSaveGeneral = () => {
    onSaveSettings({
      companyName,
      companyLogoUrl: logoUrl,
      theme,
      passThreshold,
      scoringWeights: weights
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(false);

    if (!newPassword) {
      setPassError("New password cannot be empty.");
      return;
    }

    const res = await onUpdatePassword(oldPassword, newPassword);
    if (res.success) {
      setPassSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setTimeout(() => setPassSuccess(false), 4000);
    } else {
      setPassError(res.error || "Failed to update admin credentials.");
    }
  };

  return (
    <div className="space-y-6 text-left" id="settings-view">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-500" />
          <span>ATS Calibration settings</span>
        </h1>
        <p className="text-xs text-slate-500">
          Configure matching thresholds, customize category evaluation weights, company branding parameters, and login security credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Parameters & Branding Slider Weights */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <span>ATS Score Weights & Thresholds Configuration</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              Customize how scoring aggregates categories. Ensure weights accumulate logically (e.g. totaling exactly 100).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" id="settings-weights-sliders">
            {/* Skills Weight (Max 40) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-indigo-500" />
                  Skills weight
                </span>
                <span>{weights.skills}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={weights.skills}
                onChange={(e) => handleWeightChange("skills", parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Exp Weight (Max 20) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
                  Experience weight
                </span>
                <span>{weights.experience}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={weights.experience}
                onChange={(e) => handleWeightChange("experience", parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Projects Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Projects weight</span>
                <span>{weights.projects}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                value={weights.projects}
                onChange={(e) => handleWeightChange("projects", parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Education Weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Education Degree weight</span>
                <span>{weights.education}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={weights.education}
                onChange={(e) => handleWeightChange("education", parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Certificates weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Certificates weight</span>
                <span>{weights.certificates}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={weights.certificates}
                onChange={(e) => handleWeightChange("certificates", parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Keywords weight */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>TF-IDF Vector Keywords score</span>
                <span>{weights.keywords}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={weights.keywords}
                onChange={(e) => handleWeightChange("keywords", parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-800 text-[11px] flex justify-between items-center">
            <span className="font-semibold text-slate-500">Weight aggregate total:</span>
            <span className={`font-mono font-bold ${totalWeights === 100 ? "text-emerald-500" : "text-amber-500 animate-pulse"}`}>
              {totalWeights}% {totalWeights === 100 ? "✓ Optimal (100%)" : "⚠ Must sum to 100% to calibrate scores correctly"}
            </span>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Core benchmarks pass/fail threshold */}
          <div className="space-y-5" id="settings-threshold-panel">
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center justify-between">
                <span>Pass/Fail Score Threshold Benchmark</span>
                <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{passThreshold}%</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                Minimum overall ATS score required for the applicant to be flagged with status "Passed".
              </p>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              value={passThreshold}
              onChange={(e) => setPassThreshold(parseInt(e.target.value) || 70)}
              className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow space-y-1">
                <label className="text-xs font-semibold text-slate-500">Company Profile Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs dark:text-white"
                />
              </div>

              <div className="flex-grow space-y-1">
                <label className="text-xs font-semibold text-slate-500">Custom Logo Url</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="e.g. https://domain.com/logo.png"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              {successMsg && (
                <span className="text-emerald-500 font-semibold text-xs animate-pulse">✓ General configurations saved</span>
              )}
              <button
                onClick={handleSaveGeneral}
                id="btn-save-general-settings"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl ml-auto transition-colors shadow-md shadow-indigo-600/10 cursor-pointer"
              >
                Save Calibration Configuration
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Admin login security update */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-4 h-4 text-indigo-500" />
              <span>Administrative Passwords</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              Replace the active system passphrase configuration.
            </p>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-4" id="form-security-update">
            {passError && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-[11px] flex items-start space-x-1.5">
                <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{passError}</span>
              </div>
            )}

            {passSuccess && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-[11px] flex items-start space-x-1.5">
                <Check className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Security password modified successfully</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">Active Passphrase</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Current password"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500">New Secure Passphrase</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Must be alphanumeric"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 dark:bg-slate-100 dark:text-slate-950 text-white rounded-xl text-xs font-semibold transition-transform"
              id="btn-update-credentials"
            >
              Update Security Credentials
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
