/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SkillsCategorized {
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
  softSkills: string[];
  tools: string[];
  libraries: string[];
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  url?: string;
}

export interface JobDescription {
  id: string;
  title: string;
  company?: string;
  descriptionText: string;
  skillsRequired: SkillsCategorized;
  experienceYears: number;
  education: string;
  keywords: string[];
  dateAdded: string;
}

export interface MatchResult {
  jobId: string;
  overallScore: number; // out of 100
  passOrFail: 'Pass' | 'Fail';
  categoryScores: {
    skills: number;       // out of 40 (or custom weight)
    experience: number;   // out of 20
    projects: number;     // out of 15
    education: number;    // out of 10
    certificates: number; // out of 5
    keywords: number;     // out of 10
  };
  skillMatchPercent: number;
  keywordMatchPercent: number;
  experienceMatchPercent: number;
  educationMatchPercent: number;
  projectMatchPercent: number;
  skillGap: {
    missingSkills: string[];
    recommendedSkills: string[];
    learningSuggestions: Array<{
      skill: string;
      resource: string;
      description: string;
    }>;
  };
  evaluationExplanation: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillsCategorized;
  certificates: string[];
  github: string;
  linkedIn: string;
  yearsOfExperience: number;
  matchResults?: Record<string, MatchResult>; // key is jobId
  dateAdded: string;
}

export interface ScoringWeights {
  skills: number;
  experience: number;
  projects: number;
  education: number;
  certificates: number;
  keywords: number;
}

export interface SystemSettings {
  companyName: string;
  companyLogoUrl: string;
  theme: 'light' | 'dark';
  passThreshold: number;
  scoringWeights: ScoringWeights;
}

export interface DashboardStats {
  totalResumes: number;
  totalJobs: number;
  averageScore: number;
  passRate: number;
  topSkills: Array<{ name: string; count: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  experienceDistribution: Array<{ range: string; count: number }>;
  statusDistribution: Array<{ name: string; value: number }>;
}
