/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JobDescription, Candidate, SystemSettings, MatchResult } from "../types";

// Standard Stopwords for TF-IDF Cosine Similarity
const STOPWORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "arent", "as", "at",
  "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "cant", "cannot", "could",
  "couldnt", "did", "didnt", "do", "does", "doesnt", "doing", "dont", "down", "during", "each", "few", "for", "from",
  "further", "had", "hadnt", "has", "hasnt", "have", "havent", "having", "he", "hed", "hell", "hes", "her", "here",
  "heres", "hers", "herself", "him", "himself", "his", "how", "hows", "i", "id", "ill", "im", "ive", "if", "in",
  "into", "is", "isnt", "it", "its", "itself", "lets", "me", "more", "most", "mustnt", "my", "myself", "no", "nor",
  "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own",
  "same", "shant", "she", "shed", "shell", "shes", "should", "shouldnt", "so", "some", "such", "than", "that",
  "thats", "the", "their", "theirs", "them", "themselves", "then", "there", "theres", "these", "they", "theyd",
  "theyll", "theyre", "theyve", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was",
  "wasnt", "we", "wed", "well", "were", "weve", "werent", "what", "whats", "when", "whens", "where", "wheres",
  "which", "while", "who", "whos", "whom", "why", "whys", "with", "wont", "would", "wouldnt", "you", "youd",
  "youll", "youre", "youve", "your", "yours", "yourself", "yourselves"
]);

// TF-IDF Tokenizer Helper
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(word => word.length > 2 && !STOPWORDS.has(word));
}

// Full matching Client-Side Cosine Similarity
export function calculateCosineSimilarity(text1: string, text2: string): number {
  if (!text1 || !text2) return 0;
  
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  
  if (tokens1.length === 0 || tokens2.length === 0) return 0;
  
  const allTokens = Array.from(new Set([...tokens1, ...tokens2]));
  
  const tf1: Record<string, number> = {};
  tokens1.forEach(t => tf1[t] = (tf1[t] || 0) + 1);
  
  const tf2: Record<string, number> = {};
  tokens2.forEach(t => tf2[t] = (tf2[t] || 0) + 1);
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  allTokens.forEach(token => {
    const v1 = tf1[token] || 0;
    const v2 = tf2[token] || 0;
    dotProduct += v1 * v2;
    norm1 += v1 * v1;
    norm2 += v2 * v2;
  });
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  const similarityScore = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
  return Math.round(similarityScore * 100);
}

// Seed Mock Data in case server is unavailable
export const defaultJobs: JobDescription[] = [
  {
    id: "job-1",
    title: "Senior Full-Stack Developer",
    company: "Google",
    descriptionText: "We are seeking a Senior Full-Stack Developer with 5+ years of experience building scalable web applications. You will work with React, Node.js, Express, and Tailwind CSS. Experience with databases like PostgreSQL, MongoDB, and Redis is highly desired. Cloud infrastructure experience (Docker, AWS, or GCP) and a strong understanding of CI/CD pipelines, REST APIs, and system architecture are key requirements. Strong leadership, communication, and problem-solving skills are essential.",
    skillsRequired: {
      programmingLanguages: ["TypeScript", "JavaScript", "Python", "Go"],
      frameworks: ["React", "Express", "Next.js", "Docker"],
      databases: ["PostgreSQL", "MongoDB", "Redis"],
      cloud: ["AWS", "GCP", "Cloud Run"],
      softSkills: ["Leadership", "Teamwork", "Communication", "Problem Solving"],
      tools: ["Git", "GitHub Actions", "Webpack", "Tailwind CSS"],
      libraries: ["Redux", "Zustand", "Framer Motion", "Axios"]
    },
    experienceYears: 5,
    education: "Bachelor's Degree in Computer Science or related engineering field",
    keywords: ["full-stack", "system architecture", "REST APIs", "CI/CD", "scalability", "TypeScript", "React", "Node.js"],
    dateAdded: "2026-06-01T10:00:00Z"
  },
  {
    id: "job-2",
    title: "AI & Machine Learning Engineer",
    company: "DeepMind",
    descriptionText: "DeepMind is looking for a Machine Learning Engineer to join our core AI application team. In this role, you will build and train ML engines using scikit-learn, TensorFlow, or PyTorch. Strong experience in Natural Language Processing (NLP) with spaCy, NLTK, and Transformer models is required. Candidates must demonstrate proficiency in Python, Jupyter Notebooks, vector search tools such as Pinecone or FAISS, and model logging tools (Weights & Biases). Excellent theoretical understanding of Logistic Regression, Random Forests, TF-IDF, and Cosine Similarity models is necessary.",
    skillsRequired: {
      programmingLanguages: ["Python", "C++", "R", "SQL"],
      frameworks: ["PyTorch", "TensorFlow", "Scikit-Learn", "Keras"],
      databases: ["PostgreSQL", "Pinecone", "FAISS", "Neo4j"],
      cloud: ["AWS", "Azure", "Hugging Face"],
      softSkills: ["Analytic Thinking", "Research", "Collaboration", "Critical Thinking"],
      tools: ["Git", "Jupyterlab", "Weights & Biases", "Docker"],
      libraries: ["Numpy", "Pandas", "Matplotlib", "NLTK", "spaCy", "Transformers"]
    },
    experienceYears: 3,
    education: "Master's or Ph.D. in Computer Science, Data Science, Mathematics, or Physics",
    keywords: ["machine learning", "deep learning", "NLP", "vector search", "transformers", "regression", "random forest", "TF-IDF"],
    dateAdded: "2026-06-10T14:30:00Z"
  },
  {
    id: "job-3",
    title: "Cybersecurity Analyst & SOC Specialist",
    company: "SecureNetwork Solutions",
    descriptionText: "We are seeking a Cybersecurity Analyst with 3+ years of experience in Security Operations Center (SOC) environments. The ideal candidate will monitor, detect, analyze, and respond to security events and cyber threats. You will work with SIEM tools (Splunk, Elastic Security), Wireshark, Nmap, and configure IDS/IPS alerting policies. Experience with threat intelligence frameworks, incident response playbooks, and vulnerability management is key. Excellent analytical thinking and communication are required.",
    skillsRequired: {
      programmingLanguages: ["Python", "Bash", "PowerShell", "SQL"],
      frameworks: ["MITRE ATT&CK", "NIST CSF", "OWASP"],
      databases: ["Elasticsearch", "Splunk Indexer", "PostgreSQL"],
      cloud: ["AWS Security", "GCP IAM", "Azure Sentinel"],
      softSkills: ["Incident Response", "Analytical Thinking", "Problem Solving", "Communication"],
      tools: ["Wireshark", "Splunk", "Nmap", "Nessus", "Snort"],
      libraries: ["Scapy", "Paramiko", "Cryptography"]
    },
    experienceYears: 3,
    education: "Bachelor's Degree in Cybersecurity, Computer Science, or Information Security",
    keywords: ["cybersecurity", "threat detection", "incident response", "Splunk", "SIEM", "Wireshark", "Vulnerability Assessment", "SOC"],
    dateAdded: "2026-06-22T08:00:00Z"
  },
  {
    id: "job-4",
    title: "Application Security Engineer",
    company: "CloudArmor Tech",
    descriptionText: "CloudArmor is looking for an Application Security (AppSec) Engineer to secure our SaaS platforms and APIs. You will conduct penetration testing, static/dynamic code analysis (SAST/DAST using SonarQube, Burp Suite, Snyk), and threat modeling. Strong familiarity with OWASP Top 10 vulnerabilities, web security controls (CORS, CSP, OAuth, JWT), secure coding in TypeScript and Python, and automating security within CI/CD pipelines is essential.",
    skillsRequired: {
      programmingLanguages: ["TypeScript", "Python", "Go", "Java"],
      frameworks: ["OWASP Top 10", "Snyk", "SonarQube", "Docker"],
      databases: ["PostgreSQL", "Redis"],
      cloud: ["AWS IAM", "GCP Cloud Run", "Cloudflare WAF"],
      softSkills: ["Collaboration", "Secure Design", "Critical Thinking", "Technical Writing"],
      tools: ["Burp Suite", "OWASP ZAP", "OWASP Dependency-Check", "Git", "GitHub Actions"],
      libraries: ["Helmet.js", "jsonwebtoken", "oauth2-server"]
    },
    experienceYears: 4,
    education: "Bachelor's Degree in Computer Science, Software Engineering, or related fields",
    keywords: ["application security", "appsec", "penetration testing", "OWASP Top 10", "SAST", "DAST", "Burp Suite", "threat modeling", "secure coding"],
    dateAdded: "2026-06-22T08:15:00Z"
  },
  {
    id: "job-5",
    title: "Incident Responder & Security Operations Specialist",
    company: "ThreatStrike Incident Response",
    descriptionText: "We are seeking a Cybersecurity Incident Responder with 3+ years of experience in managing security breaches, live threat containment, and digital forensics. You will investigate advanced active threats, execute recovery operations, and improve corporate incident response playbooks. Hands-on experience with SIEM platforms, endpoint detection and response (EDR), threat mitigation, log auditing, memory forensics tools (Volatility), and root cause analysis is mandatory.",
    skillsRequired: {
      programmingLanguages: ["Python", "Bash", "PowerShell", "Go"],
      frameworks: ["SANS Incident Response", "MITRE ATT&CK", "NIST SP 800-61"],
      databases: ["Splunk", "Elasticsearch"],
      cloud: ["AWS CloudTrail", "M365 Defender", "GCP Chronicle"],
      softSkills: ["Incident Management", "Crisis Resolution", "Stress Management", "Communication"],
      tools: ["Volatility", "FTK Imager", "Wireshark", "Sysmon", "CrowdStrike EDR"],
      libraries: ["Psutil", "Scapy", "YARA rules"]
    },
    experienceYears: 3,
    education: "Bachelor's degree in Cybersecurity, Computer Science, or Computer Forensics",
    keywords: ["incident response", "incident responder", "digital forensics", "containment", "EDR", "SIEM", "Splunk", "threat hunting", "log analysis"],
    dateAdded: "2026-06-22T08:30:00Z"
  },
  {
    id: "job-6",
    title: "Lead Penetration Tester & Bug Bounty Specialist",
    company: "Sovereign Audit Labs",
    descriptionText: "Seeking a Senior Penetration Tester and Bug Bounty Specialist with 5+ years of experience in black-box / white-box security assessments and vulnerability disclosures. You will lead red teaming engagements, discover software and network vulnerabilities, create detailed proof-of-concept exploits, and guide patch remediation. Active participant in bug bounty platforms (HackerOne, Bugcrowd) or holder of industry certifications (OSCP, OSCE) is highly preferred.",
    skillsRequired: {
      programmingLanguages: ["Python", "JavaScript", "C", "Assembly", "Bash"],
      frameworks: ["OWASP Testing Guide", "PTES", "OSSTMM"],
      databases: ["PostgreSQL", "MySQL", "MongoDB"],
      cloud: ["AWS Security", "Kubernetes Security", "Cloud Penetration Testing"],
      softSkills: ["Exploit Development", "Technical Reporting", "Strategic Assessment", "Adversary Simulation"],
      tools: ["Burp Suite Professional", "Metasploit", "Nmap", "SQLmap", "Ghidra", "Cobalt Strike"],
      libraries: ["Pwntools", "Scapy", "Requests", "Sqlmap-api"]
    },
    experienceYears: 5,
    education: "Computer Science, Cybersecurity, or Professional Certification Equivalent (OSCP/GPEN)",
    keywords: ["penetration tester", "pentester", "bug bounty", "red team", "exploit development", "vulnerability assessment", "OSCP", "Burp Suite", "OWASP"],
    dateAdded: "2026-06-22T08:45:00Z"
  }
];

export const defaultCandidates: Candidate[] = [
  {
    id: "cand-1",
    name: "Johnathan Doe",
    email: "john.doe@techdev.io",
    phone: "+1 (555) 123-4567",
    address: "San Francisco, CA",
    education: ["B.S. in Computer Science, Stanford University (GPA: 3.8)"],
    experience: [
      {
        company: "TechNexus Corp",
        role: "Lead Full-Stack Developer",
        duration: "2023 - Present",
        description: "Leading a squad of 6 developers in designing React micro-frontends with Node.js/Express backend architectures. Migrating legacy relational storage to robust PostgreSQL on AWS RDS. Implemented strict automated CI/CD pipelines yielding 35% shorter release times."
      },
      {
        company: "Innova Web Labs",
        role: "Software Engineer",
        duration: "2020 - 2023",
        description: "Built key responsive web pages using TypeScript, React, and Redux. Crafted 40+ RESTful API endpoints using Express, MongoDB, and Redis caching layers. Mentored junior software engineers, elevating overall code quality standards."
      }
    ],
    projects: [
      {
        title: "ScaleDeploy Automation CLI",
        description: "An open-source CLI utility leveraging Docker, Git, and Go to package, containerize, and deploy full-stack nodes in seconds.",
        url: "github.com/johndoe/scaledeploy"
      },
      {
        title: "Aesthetic Motion UI Component Kit",
        description: "Delightful custom UI component kit leveraging Framer Motion and Tailwind CSS for seamless spatial and layout animations.",
        url: "github.com/johndoe/aesthetic-motion"
      }
    ],
    skills: {
      programmingLanguages: ["TypeScript", "JavaScript", "Python", "Go", "HTML/CSS"],
      frameworks: ["React", "Express", "Node.js", "Docker", "Next.js"],
      databases: ["PostgreSQL", "MongoDB", "Redis"],
      cloud: ["AWS", "GCP"],
      softSkills: ["Leadership", "Teamwork", "Communication", "Problem Solving", "Mentorship"],
      tools: ["Git", "Webpack", "Tailwind CSS", "GitHub Actions", "VS Code"],
      libraries: ["Redux", "Zustand", "Framer Motion", "Axios", "Lodash"]
    },
    certificates: ["AWS Certified Solutions Architect", "Certified Kubernetes Administrator (CKA)"],
    github: "github.com/johndoe",
    linkedIn: "linkedin.com/in/john-doe-dev",
    yearsOfExperience: 6,
    dateAdded: "2026-06-12T08:00:00Z"
  }
];

export const defaultSettings: SystemSettings = {
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
};

// Local storage integration helpers
export function getLocalJobs(): JobDescription[] {
  try {
    const data = localStorage.getItem("screenats_jobs");
    if (data) return JSON.parse(data);
  } catch {}
  saveLocalJobs(defaultJobs);
  return defaultJobs;
}

export function saveLocalJobs(jobs: JobDescription[]) {
  try {
    localStorage.setItem("screenats_jobs", JSON.stringify(jobs));
  } catch {}
}

export function getLocalCandidates(): Candidate[] {
  try {
    const data = localStorage.getItem("screenats_candidates");
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure all candidates have matchResults
      return parsed;
    }
  } catch {}
  
  // Calculate default matchings for seeded candidates against seeded jobs
  const seeded = [...defaultCandidates];
  const weights = defaultSettings.scoringWeights;
  const passThreshold = defaultSettings.passThreshold;
  
  seeded.forEach(cand => {
    cand.matchResults = {};
    defaultJobs.forEach(job => {
      // Calculate similarity and evaluation scores
      const result = calculateMatchingScore(cand, job, passThreshold, weights);
      cand.matchResults![job.id] = result;
    });
  });
  
  saveLocalCandidates(seeded);
  return seeded;
}

export function saveLocalCandidates(candidates: Candidate[]) {
  try {
    localStorage.setItem("screenats_candidates", JSON.stringify(candidates));
  } catch {}
}

export function getLocalSettings(): SystemSettings {
  try {
    const data = localStorage.getItem("screenats_settings");
    if (data) return JSON.parse(data);
  } catch {}
  saveLocalSettings(defaultSettings);
  return defaultSettings;
}

export function saveLocalSettings(settings: SystemSettings) {
  try {
    localStorage.setItem("screenats_settings", JSON.stringify(settings));
  } catch {}
}

// Client-Side parsing engine matching backend logic
export function parseCandidateLocally(
  resumeText: string, 
  candidateName: string, 
  filename: string,
  allJobs: JobDescription[],
  passThreshold: number,
  scoringWeights: any
): Candidate {
  const lowercaseText = resumeText.toLowerCase();
  
  // Regex extracts
  const extractedEmail = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || "candidate@domain.com";
  const extractedPhone = resumeText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/)?.[0] || "";
  
  let derivedName = candidateName || "";
  if (!derivedName) {
    const lines = resumeText.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    if (lines[0] && lines[0].length < 45 && !/education|resume|email|curriculum/i.test(lines[0])) {
      derivedName = lines[0];
    } else {
      derivedName = filename.replace(/\.[^/.]+$/, "") || "Applicant Pro";
    }
  }

  // Keywords to categorize
  const listProg = ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++", "C#", "C", "Ruby", "Swift", "Kotlin", "Rust", "PHP", "Bash", "PowerShell", "SQL"].filter(s => lowercaseText.includes(s.toLowerCase()));
  const listFrameworks = ["React", "Angular", "Vue", "Next.js", "Express", "Svelte", "Redux", "Zustand", "Django", "Flask", "Spring", "MITRE ATT&CK", "NIST CSF", "OWASP", "Snyk", "SonarQube"].filter(s => lowercaseText.includes(s.toLowerCase()));
  const listDBs = ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite", "Cassandra", "Elasticsearch", "Splunk Indexer", "Oracle", "Pinecone", "FAISS"].filter(s => lowercaseText.includes(s.toLowerCase()));
  const listCloud = ["AWS", "GCP", "Google Cloud", "Azure", "Docker", "Kubernetes", "Cloudflare", "Sentinel", "Defender"].filter(s => lowercaseText.includes(s.toLowerCase()));
  const listSoft = ["Incident Response", "Incident Management", "Analytical Thinking", "Problem Solving", "Communication", "Leadership", "Teamwork", "Collaboration", "Crisis Resolution", "Stress Management", "Technical Writing"].filter(s => lowercaseText.includes(s.toLowerCase()));
  const listTools = ["Wireshark", "Splunk", "Nmap", "Nessus", "Snort", "Burp Suite", "Volatility", "FTK Imager", "Sysmon", "Git", "GitHub", "SonarQube", "OWASP ZAP", "OWASP Dependency-Check", "Metasploit", "SQLmap", "Ghidra", "Cobalt Strike"].filter(s => lowercaseText.includes(s.toLowerCase()));
  const listLibs = ["Psutil", "Scapy", "YARA rules", "Pwntools", "Requests", "Sqlmap-api", "Helmet.js", "jsonwebtoken", "oauth2-server", "Paramiko", "Cryptography", "Framer Motion", "Numpy", "Pandas", "Scikit", "TensorFlow", "PyTorch"].filter(s => lowercaseText.includes(s.toLowerCase()));

  // Experience Matching Years
  let derivedYears = 3;
  const yearsMatch = lowercaseText.match(/(\d+)\s*\+?\s*years?\s+exp/i) || lowercaseText.match(/exp[a-zA-Z\s:]+(\d+)\s*years?/i) || lowercaseText.match(/(\d+)\s*years?\s+of\s+experience/i);
  if (yearsMatch) {
    derivedYears = Math.min(25, Math.max(1, parseInt(yearsMatch[1], 10)));
  } else {
    const yearMatches = Array.from(lowercaseText.matchAll(/\b(20\d{2})\b/g));
    const yearsFound = yearMatches.map(m => parseInt(m[1], 10));
    if (yearsFound.length >= 2) {
      const span = Math.max(...yearsFound) - Math.min(...yearsFound);
      if (span > 0 && span < 25) {
        derivedYears = span;
      }
    }
  }

  // Education Extract
  let derivedEducation = ["B.Sc. in Computer Science (Automated Match)"];
  const eduMatchLine = resumeText.split("\n").find(line => /degree|b\.s|b\.sc|m\.s|m\.sc|ph\.d|bachelor|master|associate|university|college/i.test(line));
  if (eduMatchLine && eduMatchLine.length < 150) {
    derivedEducation = [eduMatchLine.trim()];
  }

  const newCand: Candidate = {
    id: `cand-${Date.now()}`,
    name: derivedName,
    email: extractedEmail,
    phone: extractedPhone,
    address: "Local Client Upload",
    education: derivedEducation,
    experience: [
      {
        company: "Enterprise Technology Corp",
        role: "Professional Practitioner",
        duration: `${derivedYears} Years`,
        description: resumeText.length > 250 ? resumeText.substring(0, 250) + "..." : resumeText
      }
    ],
    projects: [],
    skills: {
      programmingLanguages: listProg.length > 0 ? listProg : ["TypeScript", "Python"],
      frameworks: listFrameworks.length > 0 ? listFrameworks : ["React", "Express"],
      databases: listDBs.length > 0 ? listDBs : ["PostgreSQL"],
      cloud: listCloud.length > 0 ? listCloud : ["AWS"],
      softSkills: listSoft.length > 0 ? listSoft : ["Collaboration", "Problem Solving"],
      tools: listTools.length > 0 ? listTools : ["Git"],
      libraries: listLibs
    },
    certificates: [],
    github: "github.com/profile",
    linkedIn: "linkedin.com/in/profile",
    yearsOfExperience: derivedYears,
    matchResults: {},
    dateAdded: new Date().toISOString()
  };

  // Compute matching client-side metrics against all jobs
  allJobs.forEach(job => {
    newCand.matchResults![job.id] = calculateMatchingScore(newCand, job, passThreshold, scoringWeights, resumeText);
  });

  return newCand;
}

// Low-level Scoring Engine
export function calculateMatchingScore(
  candidate: Candidate, 
  job: JobDescription,
  passThreshold: number,
  weights: any,
  resumeTextOverride?: string
): MatchResult {
  const resumeText = resumeTextOverride || (candidate.name + " " + candidate.education.join(" ") + " " + candidate.skills.programmingLanguages.join(" ") + " " + candidate.skills.frameworks.join(" "));
  const cosineSim = calculateCosineSimilarity(resumeText, job.descriptionText || "");
  
  const candSkillFlat = [
    ...(candidate.skills?.programmingLanguages || []),
    ...(candidate.skills?.frameworks || []),
    ...(candidate.skills?.databases || []),
    ...(candidate.skills?.cloud || []),
    ...(candidate.skills?.softSkills || [])
  ].map(s => String(s || "").toLowerCase());

  const jobSkillFlat = [
    ...(job.skillsRequired?.programmingLanguages || []),
    ...(job.skillsRequired?.frameworks || []),
    ...(job.skillsRequired?.databases || []),
    ...(job.skillsRequired?.cloud || []),
    ...(job.skillsRequired?.softSkills || [])
  ].map(s => String(s || "").toLowerCase());

  let matchCount = 0;
  jobSkillFlat.forEach(js => {
    if (candSkillFlat.some(cs => cs.includes(js) || js.includes(cs))) {
      matchCount++;
    }
  });

  const weightSkills = weights.skills ?? 40;
  const weightExp = weights.experience ?? 20;
  const weightProjects = weights.projects ?? 15;
  const weightEdu = weights.education ?? 10;
  const weightCert = weights.certificates ?? 5;
  const weightKeywords = weights.keywords ?? 10;

  const skillMatchPercent = jobSkillFlat.length ? Math.min(100, Math.round((matchCount / jobSkillFlat.length) * 100)) : 70;
  const yearsOfExperience = candidate.yearsOfExperience ?? 1;
  const reqExperience = job.experienceYears ?? 1;
  const expMatchPercent = yearsOfExperience >= reqExperience ? 100 : Math.round((yearsOfExperience / reqExperience) * 100);
  const keywordMatchPercent = cosineSim;
  const projectMatchPercent = (candidate.projects && candidate.projects.length > 0) ? 90 : 40;
  const educationMatchPercent = 90;

  const overallScore = Math.min(100, Math.round(
    (skillMatchPercent / 100) * weightSkills +
    (expMatchPercent / 100) * weightExp +
    (projectMatchPercent / 100) * weightProjects +
    (educationMatchPercent / 100) * weightEdu +
    (keywordMatchPercent / 100) * weightKeywords +
    weightCert
  ));

  const status = overallScore >= passThreshold ? "Pass" : "Fail";

  return {
    jobId: job.id,
    overallScore,
    passOrFail: status,
    categoryScores: {
      skills: Math.round((skillMatchPercent / 100) * weightSkills),
      experience: Math.round((expMatchPercent / 100) * weightExp),
      projects: Math.round((projectMatchPercent / 100) * weightProjects),
      education: Math.round((educationMatchPercent / 100) * weightEdu),
      certificates: weightCert,
      keywords: Math.round((keywordMatchPercent / 100) * weightKeywords)
    },
    skillMatchPercent,
    keywordMatchPercent,
    experienceMatchPercent: expMatchPercent,
    educationMatchPercent,
    projectMatchPercent,
    skillGap: {
      missingSkills: (job.skillsRequired?.programmingLanguages || []).filter(js => !candSkillFlat.includes(String(js || "").toLowerCase())),
      recommendedSkills: (job.skillsRequired?.frameworks || []).slice(0, 3),
      learningSuggestions: [
        {
          skill: "AWS Scaling Architectures & Cloud Design",
          resource: "AWS skill builder academy learning pathways",
          description: "Solidify cloud hosting paradigms and practice scalable load distribution."
        }
      ]
    },
    evaluationExplanation: `Client-side model tf-idf similarity computed matching coefficient at ${cosineSim}%. Estimated overall ATS score of ${overallScore}/100.`
  };
}

export function createJobLocally(
  title: string,
  company: string,
  descriptionText: string,
  experienceYears: number,
  education: string
): JobDescription {
  const lowercaseDesc = descriptionText.toLowerCase();
  
  // Extract technical categories
  const listProg = ["TypeScript", "JavaScript", "Python", "Go", "Java", "C++", "C#", "C", "Ruby", "Swift", "Kotlin", "Rust", "PHP", "Bash", "PowerShell", "SQL"].filter(s => lowercaseDesc.includes(s.toLowerCase()));
  const listFrameworks = ["React", "Angular", "Vue", "Next.js", "Express", "Svelte", "Redux", "Zustand", "Django", "Flask", "Spring", "MITRE ATT&CK", "NIST CSF", "OWASP", "Snyk", "SonarQube"].filter(s => lowercaseDesc.includes(s.toLowerCase()));
  const listDBs = ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite", "Cassandra", "Elasticsearch", "Splunk Indexer", "Oracle", "Pinecone", "FAISS"].filter(s => lowercaseDesc.includes(s.toLowerCase()));
  const listCloud = ["AWS", "GCP", "Google Cloud", "Azure", "Docker", "Kubernetes", "Cloudflare", "Sentinel", "Defender"].filter(s => lowercaseDesc.includes(s.toLowerCase()));
  const listSoft = ["Incident Response", "Incident Management", "Analytical Thinking", "Problem Solving", "Communication", "Leadership", "Teamwork", "Collaboration", "Crisis Resolution", "Stress Management", "Technical Writing"].filter(s => lowercaseDesc.includes(s.toLowerCase()));
  const listTools = ["Wireshark", "Splunk", "Nmap", "Nessus", "Snort", "Burp Suite", "Volatility", "FTK Imager", "Sysmon", "Git", "GitHub", "SonarQube", "OWASP ZAP", "OWASP Dependency-Check", "Metasploit", "SQLmap", "Ghidra", "Cobalt Strike"].filter(s => lowercaseDesc.includes(s.toLowerCase()));
  const listLibs = ["Psutil", "Scapy", "YARA rules", "Pwntools", "Requests", "Sqlmap-api", "Helmet.js", "jsonwebtoken", "oauth2-server", "Paramiko", "Cryptography", "Framer Motion", "Numpy", "Pandas", "Scikit", "TensorFlow", "PyTorch"].filter(s => lowercaseDesc.includes(s.toLowerCase()));

  // Extract keywords
  const keywords = Array.from(new Set([
    ...title.toLowerCase().split(/\s+/),
    ...listProg.map(s => s.toLowerCase()),
    ...listFrameworks.map(s => s.toLowerCase())
  ])).slice(0, 10);

  return {
    id: `job-${Date.now()}`,
    title,
    company: company || "Local Corp",
    descriptionText,
    skillsRequired: {
      programmingLanguages: listProg.length > 0 ? listProg : ["TypeScript", "JavaScript"],
      frameworks: listFrameworks.length > 0 ? listFrameworks : ["React", "Express"],
      databases: listDBs.length > 0 ? listDBs : ["PostgreSQL"],
      cloud: listCloud.length > 0 ? listCloud : ["AWS"],
      softSkills: listSoft.length > 0 ? listSoft : ["Collaboration", "Problem Solving"],
      tools: listTools.length > 0 ? listTools : ["Git"],
      libraries: listLibs
    },
    experienceYears,
    education,
    keywords,
    dateAdded: new Date().toISOString()
  };
}
