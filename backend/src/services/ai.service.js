const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// Shared Resource Schema for Phase-Level Resources
const phaseResourceGeminiSchema = {
    type: "object",
    properties: {
        title: { type: "string", description: "Name of the resource or tutorial (e.g. 'Kubernetes Official Documentation - Core Concepts')" },
        type: { 
            type: "string", 
            enum: ["Documentation", "Course", "Book", "Video", "Practice", "Article", "Tool"],
            description: "Type of learning resource" 
        },
        platform: { type: "string", description: "Source/Platform (e.g. 'Official Docs', 'YouTube', 'Coursera', 'GitHub', 'LeetCode')" },
        url: { type: "string", description: "Representative URL or direct link (e.g. 'https://kubernetes.io/docs/concepts/')" },
        description: { type: "string", description: "Specific takeaways and what to study in this resource" }
    },
    required: ["title", "type", "platform", "description"]
}

// Top-Level Categorized Resource Schema
const categorizedResourceGeminiSchema = {
    type: "object",
    properties: {
        category: { 
            type: "string", 
            enum: [
                "Websites & Documentation", 
                "YouTube & Video Channels", 
                "Recommended Books", 
                "Interactive Practice & Platforms"
            ],
            description: "Resource category" 
        },
        title: { type: "string", description: "Title of the resource, channel, book, or website" },
        platform: { type: "string", description: "Platform or author/publisher (e.g. 'O'Reilly', 'Hussein Nasser', 'MDN', 'NeetCode', 'CodeWithHarry')" },
        url: { type: "string", description: "Representative URL or channel link" },
        description: { type: "string", description: "Why this resource is essential for mastering the role's competencies" }
    },
    required: ["category", "title", "platform", "description"]
}

// Detailed schema for Market Demand
const marketDemandGeminiSchema = {
    type: "object",
    properties: {
        overallDemand: { type: "string", enum: ["Very High", "High", "Moderate", "Low"] },
        trend: { type: "string", enum: ["Growing", "Stable", "Declining"] },
        marketOverview: { type: "string", description: "Brief explanation of current hiring demand and future outlook" }
    },
    required: ["overallDemand", "trend", "marketOverview"]
}

// Detailed schema for an Alternative Role
const alternativeRoleGeminiSchema = {
    type: "object",
    properties: {
        jobTitle: { type: "string" },
        fitPercentage: { type: "number", description: "Match percentage (0-100)" },
        whyCandidateCanTarget: { type: "string", description: "Why existing skills transfer well" },
        skillGaps: { type: "array", items: { type: "string" }, description: "Missing skills to bridge" },
        transitionDifficulty: { type: "string", enum: ["Easy", "Moderate", "Difficult"] }
    },
    required: ["jobTitle", "fitPercentage", "whyCandidateCanTarget", "skillGaps", "transitionDifficulty"]
}

// Job Analysis Schema (Role Overview, Responsibilities, and Requirements)
const jobAnalysisGeminiSchema = {
    type: "object",
    description: "Extracted role overview, core responsibilities, and required qualifications from the job description",
    properties: {
        roleSummary: { type: "string", description: "Executive summary of the role and its core objective" },
        seniorityLevel: { type: "string", description: "Target seniority level (e.g., 'Junior', 'Mid-Level', 'Senior', 'Lead', 'Staff / Principal')" },
        industryDomain: { type: "string", description: "Primary industry or technical domain (e.g., 'Cloud Infrastructure', 'FinTech', 'SaaS Platform')" },
        alternativeRoles: {
            type: "array",
            items: alternativeRoleGeminiSchema,
            description: "4-5 alternative job titles the candidate can target"
        },
        marketDemand: marketDemandGeminiSchema
    },
    required: ["roleSummary", "seniorityLevel", "industryDomain", "alternativeRoles", "marketDemand"]
}

// Gemini schema for standard Interview Preparation Plan
const interviewReportGeminiSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The job title / role for which the interview report is generated (e.g. 'Senior Full Stack Engineer')"
        },
        matchScore: {
            type: "number",
            description: "Skill alignment score between 0 and 100 indicating how well candidate's skills match the JD"
        },
        jobReadinessScore: {
            type: "number",
            description: "Job market readiness score (0 to 100) reflecting candidate's immediate readiness to pass hiring filters"
        },
        jobAnalysis: jobAnalysisGeminiSchema,
        technicalQuestions: {
            type: "array",
            description: "8-10 technical interview questions with interviewer intentions and comprehensive model answers",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The technical question" },
                    intention: { type: "string", description: "The interviewer's underlying intention / evaluation criteria" },
                    answer: { type: "string", description: "Structured model answer covering core concepts, tradeoffs, and best practices" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: "array",
            description: "4-6 behavioral questions with intentions and STAR-method model answers",
            items: {
                type: "object",
                properties: {
                    question: { type: "string", description: "The behavioral question" },
                    intention: { type: "string", description: "What competency or soft skill the interviewer is assessing" },
                    answer: { type: "string", description: "Structured model response using the STAR method" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: "array",
            description: "Identified competency and skill gaps relative to the job requirements",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "The specific skill or technology" },
                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "Severity of the gap"
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            description: "A 7 to 14 day structured preparation sprint",
            items: {
                type: "object",
                properties: {
                    day: { type: "number", description: "Day index starting from 1" },
                    focus: { type: "string", description: "Core thematic focus for this day" },
                    tasks: {
                        type: "array",
                        items: { type: "string" },
                        description: "Actionable study, coding, or review tasks"
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        resources: {
            type: "array",
            description: "Curated industry learning resources, documentation, YouTube channels, and books",
            items: categorizedResourceGeminiSchema
        }
    },
    required: ["title", "matchScore", "jobReadinessScore", "jobAnalysis", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan", "resources"]
}

// Gemini schema for In-Depth Skill Analysis & Career Roadmap
// NOTE: Technical and Behavioral questions are REMOVED to focus strictly on career transition roadmap & speed up generation!
const careerRoadmapGeminiSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The target job title or career transition role"
        },
        matchScore: {
            type: "number",
            description: "Skill alignment score between 0 and 100"
        },
        jobReadinessScore: {
            type: "number",
            description: "Realistic job market readiness score (0 to 100) based on current profile strength against role requirements"
        },
        jobAnalysis: jobAnalysisGeminiSchema,
        skillAnalysis: {
            type: "array",
            description: "Detailed proficiency gap matrix for 6-8 essential competencies required by the target role",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string", description: "Skill or technology name" },
                    currentLevel: { type: "string", description: "Candidate estimated level: 'None', 'Beginner', 'Intermediate', 'Advanced'" },
                    targetLevel: { type: "string", description: "Target level required: 'Intermediate', 'Proficient', 'Advanced', 'Expert'" },
                    gapDescription: { type: "string", description: "Analysis of the specific competency gap and its importance for this position" },
                    importance: { type: "string", enum: ["Critical", "High", "Medium", "Low"], description: "Strategic priority level" }
                },
                required: ["skill", "currentLevel", "targetLevel", "gapDescription", "importance"]
            }
        },
        careerRoadmap: {
            type: "array",
            description: "3 to 4 structured chronological phases for a multi-week transition roadmap",
            items: {
                type: "object",
                properties: {
                    phase: { type: "string", description: "Phase title (e.g., 'Phase 1: Advanced Backend Architecture & Concurrency')" },
                    duration: { type: "string", description: "Timeline (e.g., 'Weeks 1-3' or 'Month 1')" },
                    objective: { type: "string", description: "Primary goal, milestone, and mastery criteria for this phase" },
                    topics: {
                        type: "array",
                        items: { type: "string" },
                        description: "Core technical concepts, architectural patterns, and tools to master"
                    },
                    projectToBuild: {
                        type: "object",
                        properties: {
                            title: { type: "string", description: "Hands-on, portfolio-worthy project to demonstrate mastery" },
                            description: { type: "string", description: "Detailed project scope, architecture, core features, and real-world relevance" },
                            techStack: {
                                type: "array",
                                items: { type: "string" },
                                description: "Modern technologies, frameworks, and libraries to implement"
                            }
                        },
                        required: ["title", "description", "techStack"]
                    },
                    resources: {
                        type: "array",
                        description: "2-3 high-value curated learning resources specifically for this roadmap phase",
                        items: phaseResourceGeminiSchema
                    }
                },
                required: ["phase", "duration", "objective", "topics", "projectToBuild", "resources"]
            }
        },
        skillGaps: {
            type: "array",
            description: "Summary list of identified skill gaps and severities",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    severity: { type: "string", enum: ["low", "medium", "high"] }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: "array",
            description: "Quick-start 7-day orientation sprint to kick off the roadmap",
            items: {
                type: "object",
                properties: {
                    day: { type: "number" },
                    focus: { type: "string" },
                    tasks: { type: "array", items: { type: "string" } }
                },
                required: ["day", "focus", "tasks"]
            }
        },
        resources: {
            type: "array",
            description: "Curated comprehensive learning resources categorized across Documentation, YouTube, Books, and Interactive Practice",
            items: categorizedResourceGeminiSchema
        }
    },
    required: ["title", "matchScore", "jobReadinessScore", "jobAnalysis", "skillAnalysis", "careerRoadmap", "skillGaps", "preparationPlan", "resources"]
}


const MAX_RETRIES = 3;

async function callGeminiWithRetry(options, attempt = 0) {
    try {
        return await ai.models.generateContent(options);
    } catch (error) {
        const is503 = error.status === 503 || (error.message && error.message.includes("503"));
        if (is503 && attempt < MAX_RETRIES) {
            const delayMs = 1500 * Math.pow(2, attempt); // 1.5s, 3s, 6s
            console.warn(`Gemini API 503 Error. Retrying in ${delayMs}ms (Attempt ${attempt + 1}/${MAX_RETRIES})...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
            return callGeminiWithRetry(options, attempt + 1);
        }
        throw error;
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription, planType = "interview" }) {
    if (!process.env.GOOGLE_GENAI_API_KEY) {
        throw new Error("GOOGLE_GENAI_API_KEY is not configured in the environment.")
    }


    if (planType === "roadmap") {
        const prompt = `You are a Principal Technical Hiring Architect and Executive Career Coach.
Analyze the target job description against the candidate's profile to generate an in-depth Skill Gap Matrix, Role Deconstruction, & Multi-Week Career Transition Roadmap.
IMPORTANT: Do NOT generate technical or behavioral interview questions. Focus entirely on role deconstruction, skill audit, career roadmap phases, and curated learning resources.

Target Job Description:
"""
${jobDescription}
"""

Candidate Resume Profile:
"""
${resume || "(No resume uploaded. Base analysis strictly on self-description and standard industry entry points.)"}
"""

Candidate Experience Summary:
"""
${selfDescription || "(No additional summary provided.)"}
"""

Execution Guidelines:
1. **Title**: Target role title.
2. **Match Score**: Overall skill alignment score (0-100),( 0 if no knowledge available ).
3. **Job Readiness Score**: Realistic job market hiring probability (0-100) reflecting candidate's immediate ability to clear initial screening (0 if candiate have no knowledge).
4. **Job Analysis**: Deep role deconstruction containing:
   - roleSummary: Clear 2-3 sentence overview of the role and its mission.
   - seniorityLevel: Expected seniority (Junior, Mid-Level, Senior, Lead, Staff / Principal).
   - industryDomain: Target industry domain (e.g. Distributed Systems, FinTech, SaaS, Cloud Infrastructure).
   - alternativeRoles: 4-5 detailed objects containing jobTitle, fitPercentage, whyCandidateCanTarget, skillGaps, and transitionDifficulty.
   - marketDemand: Object with overallDemand, trend, and marketOverview.
5. **Skill Analysis**: 6-8 core competencies accurately benchmarking currentLevel against targetLevel with clear actionable gap descriptions.
6. **Career Roadmap**:
   - 4 to 5 sequential, multi-week phases (e.g. "Phase 1: Advanced Backend Architecture & Concurrency", "Phase 2: Microservices & Event-Driven Architecture").
   - Timeline durations, clear learning objectives, and specific modern topics.
   - A resume-worthy portfolio project for each phase with exact tech stack.
   - 2-3 high-value curated learning resources per phase with platform, URLs, and study guidance.
7. **Categorized Top-Level Resources**:
   -8-12 top-tier resources categorized across:
     * "Websites & Documentation" (e.g. MDN, Kubernetes Docs, System Design Primer, GeeksforGeeks, official docs)
     * "YouTube & Video Channels" (e.g. Hussein Nasser, ByteByteGo, Traversy Media, ArjanCodes, Apna College, Piyush Garg, CodeWithHarry, take U forward, CodeHelp by Babbar, Sheryians Coding School, freeCodeCamp.org, Chai aur Code)
     * "Recommended Books" (e.g. "Designing Data-Intensive Applications", "Clean Architecture", "Database Internals")
     * "Interactive Practice & Platforms" (e.g. LeetCode, Frontend Masters, Exercism, Roadmaps.sh)
8. **Kickoff Plan**: 7-day orientation sprint.
`

        const response = await callGeminiWithRetry({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                temperature: 0.2, // Faster, deterministic execution
                responseMimeType: "application/json",
                responseSchema: careerRoadmapGeminiSchema,
            }
        })

        const parsed = JSON.parse(response.text)
        if (!parsed.title) {
            parsed.title = jobDescription.split('\n')[0].substring(0, 80).trim() || "Career & Skill Roadmap"
        }
        return parsed
    }

    // Standard Interview Plan
    const prompt = `You are a Senior Technical Interviewer and Engineering Manager.
Construct a high-impact, comprehensive Interview Preparation Plan tailored to this specific job description and candidate profile.

Target Job Description:
"""
${jobDescription}
"""

Candidate Resume Profile:
"""
${resume || "(No resume uploaded. Base interview preparation on target role requirements.)"}
"""

Candidate Self-Description:
"""
${selfDescription || "(No self-description provided.)"}
"""

Execution Guidelines:
1. **Title**: The target job role title.
2. **Match Score**: Accurate role readiness score (0-100).
3. **Job Readiness Score**: Calculated hiring probability (0-100).
4. **Job Analysis**: Executive summary, seniority level, domain, 4-5 structured alternative roles (with fit and gap details), and structured market demand.
5. **Technical Questions**: 8-10 targeted technical questions with interviewer intentions and thorough model answers.
6. **Behavioral Questions**: 4-6 leadership/situational questions with interviewer intentions and STAR model responses.
7. **Skill Gaps**: Itemized skill gaps with severity ratings (low, medium, high).
8. **7 to 14-Day Preparation Plan**: Day-by-day sprint plan with concrete daily goals.
9. **Curated Resources**: 6-8 categorized learning resources (Official Docs, YouTube Channels, Books, Practice Platforms).
`

    const response = await callGeminiWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: interviewReportGeminiSchema,
        }
    })

    const parsed = JSON.parse(response.text)

    if (!parsed.title) {
        parsed.title = jobDescription.split('\n')[0].substring(0, 80).trim() || "Interview Report"
    }

    return parsed
}

// Curriculum Gap Report Gemini Schema
const curriculumGapGeminiSchema = {
    type: "object",
    properties: {
        courseTitle: { type: "string", description: "Name of the course or curriculum" },
        targetRole: { type: "string", description: "Job role being compared against" },
        overallGapScore: { type: "number", description: "0-100 score: how well curriculum covers market needs (100 = perfect coverage)" },
        verdict: { type: "string", description: "2-3 sentence overall assessment" },
        skillsAnalysis: {
            type: "array",
            description: "8-12 skills from the job market perspective",
            items: {
                type: "object",
                properties: {
                    skill: { type: "string" },
                    marketDemand: { type: "string", enum: ["Very High", "High", "Moderate", "Low"] },
                    curriculumCoverage: { type: "string", enum: ["None", "Basic", "Good", "Excellent"] },
                    gapNote: { type: "string", description: "Short actionable note about the gap" }
                },
                required: ["skill", "marketDemand", "curriculumCoverage", "gapNote"]
            }
        },
        recommendations: {
            type: "array",
            description: "5-8 specific recommendations",
            items: {
                type: "object",
                properties: {
                    topic: { type: "string" },
                    priority: { type: "string", enum: ["Critical", "High", "Medium"] },
                    action: { type: "string", enum: ["Add", "Expand", "Remove", "Update"] },
                    reason: { type: "string" }
                },
                required: ["topic", "priority", "action", "reason"]
            }
        },
        stronglyCovered: { type: "array", items: { type: "string" }, description: "Topics curriculum covers well" },
        missing: { type: "array", items: { type: "string" }, description: "Topics completely absent from curriculum" }
    },
    required: ["courseTitle", "targetRole", "overallGapScore", "verdict", "skillsAnalysis", "recommendations", "stronglyCovered", "missing"]
}

async function generateCurriculumGapReport({ syllabusText, targetRole }) {
    if (!process.env.GOOGLE_GENAI_API_KEY) throw new Error("GOOGLE_GENAI_API_KEY is not configured.")

    const prompt = `You are a curriculum design expert and job market analyst.
Analyze the provided course syllabus against current job market demands for the given target role.
Identify skill gaps, coverage strengths, and provide actionable recommendations for the training institute.

Target Job Role:
"""
${targetRole}
"""

Course Syllabus / Topics Covered:
"""
${syllabusText}
"""

Execution Guidelines:
1. courseTitle: Infer a clean course title from the syllabus content.
2. overallGapScore: 0-100 coverage score (100 = curriculum perfectly matches market needs).
3. verdict: Honest 2-3 sentence assessment for the institute head.
4. skillsAnalysis: 8-12 key market skills rated by marketDemand and curriculumCoverage.
5. recommendations: 5-8 specific, actionable recommendations (add/expand/remove/update topics).
6. stronglyCovered: List topics the curriculum covers well.
7. missing: List high-demand topics completely absent from the curriculum.
`

    const response = await callGeminiWithRetry({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            temperature: 0.2,
            responseMimeType: "application/json",
            responseSchema: curriculumGapGeminiSchema
        }
    })

    return JSON.parse(response.text)
}

module.exports = { generateInterviewReport, generateCurriculumGapReport }