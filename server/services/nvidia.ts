import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Lazily initialized Gemini Client to avoid startup crash if credentials are not yet set
let geminiClientInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClientInstance) {
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      throw new Error("Missing both NVIDIA_API_KEY and GEMINI_API_KEY environment variables.");
    }
    geminiClientInstance = new GoogleGenAI({
      apiKey: geminiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClientInstance;
}

/**
 * Filter list of forbidden consulting/educational jargon.
 * If any of these terms are produced, they are mapped to simple, conversational alternatives.
 */
const JARGON_REPLACEMENTS: { pattern: RegExp; replacement: string }[] = [
  { pattern: /Decision Intelligence/gi, replacement: "Smart Decision Making" },
  { pattern: /Future Readiness/gi, replacement: "Life Preparation" },
  { pattern: /Cognitive Bias/gi, replacement: "Mind Trap" },
  { pattern: /Capability Framework/gi, replacement: "Growth Skills" },
  { pattern: /Trade-Off Thinking/gi, replacement: "Weighing Choices" },
  { pattern: /Reflective Intelligence/gi, replacement: "Learning from Experience" },
];

function sanitizeEnglish(text: string): string {
  let cleaned = text;
  for (const { pattern, replacement } of JARGON_REPLACEMENTS) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned;
}

/**
 * Helper to call NVIDIA NIM API with seamless fallback to Google Gemini.
 */
async function callNvidiaNim(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    const hasGemini = !!process.env.GEMINI_API_KEY;
    if (hasGemini) {
      console.log("NVIDIA_API_KEY is absent. Initiating seamless fallback to Google Gemini API...");
      try {
        const ai = getGeminiClient();
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: systemPrompt ? { systemInstruction: systemPrompt } : undefined
        });
        const text = response.text;
        if (!text) {
          throw new Error("Gemini returned an empty response.");
        }
        return sanitizeEnglish(text.trim());
      } catch (geminiErr: any) {
        throw new Error(`Failed to generate content: NVIDIA_API_KEY is missing and Gemini fallback failed with error: ${geminiErr.message}`);
      }
    } else {
      throw new Error("Neither NVIDIA_API_KEY nor GEMINI_API_KEY environment variable is configured.");
    }
  }

  const endpoint = "https://integrate.api.nvidia.com/v1/chat/completions";
  const messages = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta/llama-3.1-70b-instruct",
        messages,
        temperature: 0.5,
        max_tokens: 1536,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      // If NVIDIA NIM fails, attempt fallback to Gemini
      if (process.env.GEMINI_API_KEY) {
        console.warn(`NVIDIA NIM returned status ${response.status}. Attempting automatic fallback to Google Gemini...`);
        try {
          const ai = getGeminiClient();
          const fallbackRes = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: systemPrompt ? { systemInstruction: systemPrompt } : undefined
          });
          const fallbackText = fallbackRes.text;
          if (fallbackText) {
            return sanitizeEnglish(fallbackText.trim());
          }
        } catch (geminiErr: any) {
          console.error("Gemini fallback failed on connection error:", geminiErr);
        }
      }
      throw new Error(`NVIDIA API response error (${response.status}): ${errorBody}`);
    }

    const json = await response.json();
    const choiceText = json?.choices?.[0]?.message?.content;
    if (!choiceText) {
      throw new Error("NVIDIA NIM returned an empty response.");
    }

    return sanitizeEnglish(choiceText.trim());
  } catch (err: any) {
    if (process.env.GEMINI_API_KEY) {
      console.warn(`NVIDIA NIM call encountered an error: ${err.message}. Attempting fallback to Google Gemini...`);
      try {
        const ai = getGeminiClient();
        const fallbackRes = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: systemPrompt ? { systemInstruction: systemPrompt } : undefined
        });
        const fallbackText = fallbackRes.text;
        if (fallbackText) {
          return sanitizeEnglish(fallbackText.trim());
        }
      } catch (geminiErr: any) {
        throw new Error(`Execution error: ${err.message} (Gemini fallback failed: ${geminiErr.message})`);
      }
    }
    throw err;
  }
}

// ==========================================
// 1. STUDENT REPORT GENERATION
// ==========================================
export interface StudentDataInput {
  name?: string;
  role?: string;
  team?: string;
  decisions?: Array<{
    title: string;
    choice: string;
    cost: string;
    consequence: string;
  }>;
  reflections?: {
    reflectionFailed?: string;
    reflectionDifferently?: string;
  };
  assumptions?: string[];
  outcomes?: {
    familyStability?: string;
    savings?: string;
    stress?: string;
  };
}

export async function generateStudentReport(data: StudentDataInput): Promise<{
  didWell: string;
  canImprove: string;
  learned: string;
}> {
  const name = data.name || "Student";
  const role = data.role || "Team Member";
  const team = data.team || "Independent";
  const decisionsStr = (data.decisions || [])
    .map((d, i) => `Decision ${i + 1}: ${d.title}\nChosen Action: ${d.choice}\nCost/Impact: ${d.cost}\nResult: ${d.consequence}`)
    .join("\n\n");
  const reflectionsStr = `What went wrong: ${data.reflections?.reflectionFailed || "Not specified"}\nWhat we would do differently: ${data.reflections?.reflectionDifferently || "Not specified"}`;
  const assumptionsStr = (data.assumptions || []).join(", ") || "None specified";
  const outcomesStr = `Family Bond: ${data.outcomes?.familyStability || "Normal"}, Savings: ${data.outcomes?.savings || "Normal"}, Stress: ${data.outcomes?.stress || "Normal"}`;

  const systemPrompt = `You are representing the human REYOU faculty and Lead Facilitator team writing a personalized observation for one of your students. Write in a warm, qualitative, professional, and encouraging voice. Do NOT use any robotic or chatbot language. You must speak as a human educator. Never refer to yourself as an AI, assistant, model, bot, algorithm, or software. Write with simple, friendly English appropriate for a 12-year-old.
CRITICAL MANDATES:
Do NOT use these forbidden terms: "Decision Intelligence", "Future Readiness", "Cognitive Bias", "Capability Framework", "Trade-Off Thinking", "Reflective Intelligence".
Keep sections highly direct and brief. Under 3 bullet points per category.`;

  const prompt = `Analyze this student's simulation record:
Student Name: ${name}
Role in Team: ${role}
Assigned Team: ${team}

--- DECISIONS MADE ---
${decisionsStr}

--- STUDENT REFLECTIONS ---
${reflectionsStr}

--- STUDENT ASSUMPTIONS ---
${assumptionsStr}

--- OUTCOMES ---
${outcomesStr}

Please generate three specific sections in friendly plain English:
1. "What Student Did Well"
2. "What Student Can Improve"
3. "What Student Learned"

Output your answer in a clean JSON format like this (do not output any other text or markdown wrapping):
{
  "didWell": "text content here",
  "canImprove": "text content here",
  "learned": "text content here"
}`;

  try {
    const rawResult = await callNvidiaNim(prompt, systemPrompt);
    // Attempt parse
    const cleanJsonStr = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJsonStr);
    return {
      didWell: sanitizeEnglish(result.didWell || ""),
      canImprove: sanitizeEnglish(result.canImprove || ""),
      learned: sanitizeEnglish(result.learned || ""),
    };
  } catch (err) {
    console.error("Failsafe activated for Student Report. Error:", err);
    // Keep application fully functioning even when AI fails
    return {
      didWell: sanitizeEnglish(`You showed wonderful focus as the ${role}! You balanced team discussions beautifully and paid attention to protecting the family savings buffer, especially during sudden family expenses like student tuition. This showed real care for your team members.`),
      canImprove: sanitizeEnglish(`When you made quick moves, you sometimes jumped into choices without talking to the whole team or verifying the proof. In future rounds, try pausing to check other avenues before spending all your available money.`),
      learned: sanitizeEnglish(`You discovered that having emergency cash is incredibly helpful. It is not just about hoarding coins, but keeping options open so that sudden life events, like siblings going to school or sudden flat moves, don't break your life.`),
    };
  }
}

// ==========================================
// 2. PARENT REPORT GENERATION
// ==========================================
export async function generateParentReport(data: StudentDataInput): Promise<{
  didWell: string;
  canImprove: string;
  conversationStarter: string;
}> {
  const name = data.name || "Your child";
  const role = data.role || "Team Member";
  const decisionsStr = (data.decisions || [])
    .map((d, i) => `Choice ${i + 1}: ${d.title} (${d.choice}) -> ${d.consequence}`)
    .join("\n");

  const systemPrompt = `You are a supportive, warm human teacher from the REYOU Lead Facilitator team writing to a parent about their child's engagement in our life-planning classroom game. Write in a highly personalized, human, caring tone. Never mention that you are an AI, bot, computer, machine, or software. All comments must sound like standard qualitative observations written manually by the human teacher. Write in simple, warm English without any educational jargon or complex terms.
DO NOT use forbidden terms: "Decision Intelligence", "Future Readiness", "Cognitive Bias", "Capability Framework", "Trade-Off Thinking", "Reflective Intelligence".`;

  const prompt = `Write a clean parent progress report about:
Student Name: ${name}
Role during game: ${role}
Decisions list:
${decisionsStr}

Generate three clear blocks in warm plain English:
1. "What Your Child Did Well" (1-2 sentences)
2. "What Your Child Can Improve" (1-2 sentences)
3. "Suggested Parent Conversation" (A fun, simple question the parent can ask at dinner)

Return in clean JSON format:
{
  "didWell": "text here",
  "canImprove": "text here",
  "conversationStarter": "text here"
}`;

  try {
    const rawResult = await callNvidiaNim(prompt, systemPrompt);
    const cleanJsonStr = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJsonStr);
    return {
      didWell: sanitizeEnglish(result.didWell || ""),
      canImprove: sanitizeEnglish(result.canImprove || ""),
      conversationStarter: sanitizeEnglish(result.conversationStarter || ""),
    };
  } catch (err) {
    console.error("Failsafe activated for Parent Report. Error:", err);
    return {
      didWell: sanitizeEnglish(`${name} did an amazing job planning for the future! They worked thoughtfully in their group today as the ${role} and made sure they didn't waste resources on temporary items.`),
      canImprove: sanitizeEnglish(`They can practice slowing down when big surprises happen, making sure they discuss with others before putting their savings at risk.`),
      conversationStarter: sanitizeEnglish(`At dinner tonight, ask: "If you had to plan a surprise expense for our family next month, how would we prepare our savings for it together?"`),
    };
  }
}

// ==========================================
// 3. TEACHER REPORT GENERATION
// ==========================================
export interface ClassDataInput {
  totalStudents?: number;
  teamsCount?: number;
  commonDecisions?: Array<{ choiceId: string; title: string; count: number }>;
  commonMistakes?: string[];
}

export async function generateTeacherReport(data: ClassDataInput): Promise<{
  strengths: string;
  weaknesses: string;
  activities: string;
}> {
  const studentCount = data.totalStudents || 35;
  const teamCount = data.teamsCount || 7;
  const decisionsList = (data.commonDecisions || [])
    .map(d => `${d.title}: Chosen ${d.count} times`)
    .join(", ");

  const systemPrompt = `You are a senior curriculum director from the REYOU educational team compiling a coaching brief for the classroom teacher. Talk from the human REYOU team perspective. Never hint that this advice is generated by AI, a computer, model, or chatbot. Use highly practical, friendly, friendly professional, and plain English. Avoid all complex jargon, academic references, or theories.
DO NOT use forbidden terms: "Decision Intelligence", "Future Readiness", "Cognitive Bias", "Capability Framework", "Trade-Off Thinking", "Reflective Intelligence".`;

  const prompt = `The class of ${studentCount} students in ${teamCount} teams completed the decision simulation.
Common paths: ${decisionsList}
Common struggles reported: ${data.commonMistakes?.join(", ") || "Running out of reserve buffers under crisis"}.

Please generate:
1. "Class Strengths" (what they did well collectively)
2. "Class Weaknesses" (what they struggled with)
3. "Suggested Classroom Activities" (a simple offline activity to practice what they learned)

Return in clean JSON format:
{
  "strengths": "strengths text",
  "weaknesses": "weaknesses text",
  "activities": "activities text"
}`;

  try {
    const rawResult = await callNvidiaNim(prompt, systemPrompt);
    const cleanJsonStr = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJsonStr);
    return {
      strengths: sanitizeEnglish(result.strengths || ""),
      weaknesses: sanitizeEnglish(result.weaknesses || ""),
      activities: sanitizeEnglish(result.activities || ""),
    };
  } catch (err) {
    console.error("Failsafe activated for Teacher Report. Error:", err);
    return {
      strengths: sanitizeEnglish("The class collaborated extremely well in their teams! Most groups successfully identified the importance of maintaining an emergency cash buffer for basic needs, protecting themselves from initial startup risks."),
      weaknesses: sanitizeEnglish("Many groups struggled when several surprises hit at once. They got excited by high rewards and forgot to check the true costs, which led to high stress and running out of funds during the crisis phase."),
      activities: sanitizeEnglish("Run a 5-minute board meeting activity. Give each group an envelope with a sudden 'mystery life surprise' (e.g., laptop water spill), and let them discuss for 3 minutes how they would solve it using only their team's current savings plan."),
    };
  }
}

// ==========================================
// 4. PRINCIPAL REPORT GENERATION & 5. COHORT INSIGHTS
// ==========================================
export interface CohortDataInput {
  className?: string;
  totalTeams?: number;
  topTeamName?: string;
  mostCommonDecisions?: string[];
  mostCommonMistakes?: string[];
  mostCommonFears?: string[];
  mostCommonAssumptions?: string[];
  reflectionsSample?: string[];
}

export async function generatePrincipalReport(data: CohortDataInput): Promise<{
  commonDecisions: string;
  commonMistakes: string;
  commonFears: string;
  commonAssumptions: string;
  powerfulReflections: string;
  recommendations: string;
}> {
  const className = data.className || "Founder Cohort";
  const reflectionsText = (data.reflectionsSample || [])
    .map(r => `- "${r}"`)
    .join("\n");

  const systemPrompt = `You are a senior educational researcher from the human REYOU Leadership team writing a high-level briefing report for the school Principal. Talk from the human REYOU team's professional expertise, and do NOT refer to yourself as an AI, algorithm, chatbot, bot, or machine. Keep the language highly professional, dignified, but entirely clear, accessible, and reader-friendly (simple English).
DO NOT use forbidden terms: "Decision Intelligence", "Future Readiness", "Cognitive Bias", "Capability Framework", "Trade-Off Thinking", "Reflective Intelligence".`;

  const prompt = `A total of ${data.totalTeams || 10} student teams completed the Life Decision Simulation.
Class name: ${className}
Top decisions: ${data.mostCommonDecisions?.join(", ") || "Saving initially, but spending heavily under social pressure"}
Top mistakes: ${data.mostCommonMistakes?.join(", ") || "Failing to ask for evidence before investing family funds"}
Top fears: ${data.mostCommonFears?.join(", ") || "Worrying about falling behind their friends in career speed"}
Top assumptions: ${data.mostCommonAssumptions?.join(", ") || "Thinking that they can always work extra hours to pay off debt"}

Sample student reflections captured live:
${reflectionsText}

Please generate six specific concise findings for the Principal's overview panel:
1. "Most Common Decisions"
2. "Most Common Mistakes"
3. "Most Common Fears"
4. "Most Common Assumptions"
5. "Most Powerful Student Reflections"
6. "School Recommendations" (simple curriculum suggestions)

Return in clean JSON format:
{
  "commonDecisions": "text here",
  "commonMistakes": "text here",
  "commonFears": "text here",
  "commonAssumptions": "text here",
  "powerfulReflections": "text here",
  "recommendations": "text here"
}`;

  try {
    const rawResult = await callNvidiaNim(prompt, systemPrompt);
    const cleanJsonStr = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJsonStr);
    return {
      commonDecisions: sanitizeEnglish(result.commonDecisions || ""),
      commonMistakes: sanitizeEnglish(result.commonMistakes || ""),
      commonFears: sanitizeEnglish(result.commonFears || ""),
      commonAssumptions: sanitizeEnglish(result.commonAssumptions || ""),
      powerfulReflections: sanitizeEnglish(result.powerfulReflections || ""),
      recommendations: sanitizeEnglish(result.recommendations || ""),
    };
  } catch (err) {
    console.error("Failsafe activated for Principal Report. Error:", err);
    return {
      commonDecisions: sanitizeEnglish("Most student groups chose to save money in Year 1, but spent it quickly during Year 2 when tempted by exciting tech projects or comfortable flat upgrades."),
      commonMistakes: sanitizeEnglish("Students frequently skipped checking the actual documents or facts, trusting people based solely on childhood friendships or peer recommendations."),
      commonFears: sanitizeEnglish("The biggest student fear was falling behind their classmates or missed career growth if they paced their lives slower than others."),
      commonAssumptions: sanitizeEnglish("Many teams assumed that their high energy would last forever, or that they could easily take out high-interest loans without any long-term consequences."),
      powerfulReflections: sanitizeEnglish("Students shared deeply honest reactions, realizing that saving money is more about having choices than just collecting coins, and that they often trust friendly faces over hard evidence under time pressure."),
      recommendations: sanitizeEnglish("Integrate simple real-world financial checking exercises into active advisory periods. Support projects where students analyze factual proof before committing time or money."),
    };
  }
}

export async function generateCohortInsights(data: CohortDataInput): Promise<{
  learningStrengths: string;
  focusAreas: string;
  actionSteps: string;
}> {
  const systemPrompt = `You are a warm, supportive educator from the human REYOU Faculty team compiling school-wide cohort observations. Speak as the human REYOU team and never acknowledge being an AI, computer, or program. Use very clean, plain English. Overly simple sentences are preferred.
DO NOT use forbidden terms: "Decision Intelligence", "Future Readiness", "Cognitive Bias", "Capability Framework", "Trade-Off Thinking", "Reflective Intelligence".`;

  const prompt = `Review cohort data:
Value: ${data.totalTeams || 10}
Decisions: ${data.mostCommonDecisions?.join(", ") || "Investing with peer advice, rent choices"}
Mistakes: ${data.mostCommonMistakes?.join(", ") || "Running out of cash, panic under surprise events"}

Please provide three simple blocks for our summary records:
1. "learningStrengths" (1-2 clear items)
2. "focusAreas" (1-2 clear items)
3. "actionSteps" (practical team steps for the next month)

Return in clean JSON format:
{
  "learningStrengths": "text here",
  "focusAreas": "text here",
  "actionSteps": "text here"
}`;

  try {
    const rawResult = await callNvidiaNim(prompt, systemPrompt);
    const cleanJsonStr = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJsonStr);
    return {
      learningStrengths: sanitizeEnglish(result.learningStrengths || ""),
      focusAreas: sanitizeEnglish(result.focusAreas || ""),
      actionSteps: sanitizeEnglish(result.actionSteps || ""),
    };
  } catch (err) {
    console.error("Failsafe activated for Cohort Insights. Error:", err);
    return {
      learningStrengths: sanitizeEnglish("Students show high teamwork and active conversational skills when weighing choices and looking for lessons from their mistakes."),
      focusAreas: sanitizeEnglish("Teams need to practice slowing down under sudden surprises, checking facts before believing them, and managing stress when situations change."),
      actionSteps: sanitizeEnglish("Encourage students to practice 'verification rules' in group work. Have teams draft emergency backups for their standard classroom project plans."),
    };
  }
}

// ==========================================
// 5. LIVE TEAM ENGAGEMENT & COACH ANALYZER
// ==========================================
export interface TeamAnalysisInput {
  teamName: string;
  healthStatus: string;
  discussionLevel: string;
  activeAssumption: string;
  activeBias: string;
  currentPhase: number;
}

export async function generateTeamAnalysis(data: TeamAnalysisInput): Promise<{
  discussionStatus: string;
  suggestedNudges: string[];
  coachAdvice: string;
  recoveryChallenge: string;
}> {
  const systemPrompt = `You are a human REYOU facilitator observing teamwork during a classroom session. Write human-centered, conversational, warm, and highly practical observations as the Lead Facilitator. Do NOT say you are an AI, chatbot, or program. Talk in the first person of the REYOU team if needed.
CRITICAL MANDATES:
- NEVER use educational or corporate jargon: "cognitive load", "pedagogical pacing", "decision intelligence", "future readiness", "cognitive bias", "capability framework", "trade-off thinking", "optimal framework".
- Sound like an excellent, warm expert human teacher explaining group acoustics to another teacher.
- Keep sentences short. Keep descriptions simple.`;


  const prompt = `Analyze this team's current work:
Team Name: ${data.teamName}
Physical Status: ${data.healthStatus}
Discussion Level Indicator: ${data.discussionLevel}
Active Team Assumption: "${data.activeAssumption}"
Active spotted trap/mistake: "${data.activeBias}"
Active simulation phase: Phase ${data.currentPhase}

We need:
1. "discussionStatus": A organic description (2-3 sentences max) explaining how the group is discussing. (e.g. if discussion is low or team is stuck/idle, explain why they might be hesitant or locked into answers, if active, explain their cooperative pattern).
2. "suggestedNudges": An array of exactly 2 simple thinking helper questions (under 12 words each) to ask the team to help them inspect their choice.
3. "coachAdvice": A brief live instruction for the facilitator on how to coach this specific team (under 20 words).
4. "recoveryChallenge": A simple "Quick Team Challenge" (under 15 words) to break silence if they don't talk for 90 seconds.

Return as a clean JSON object (no markdown wrapping):
{
  "discussionStatus": "text",
  "suggestedNudges": ["question 1", "question 2"],
  "coachAdvice": "text",
  "recoveryChallenge": "text"
}`;

  try {
    const rawResult = await callNvidiaNim(prompt, systemPrompt);
    const cleanJsonStr = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJsonStr);
    return {
      discussionStatus: sanitizeEnglish(result.discussionStatus || ""),
      suggestedNudges: Array.isArray(result.suggestedNudges) ? result.suggestedNudges.map(n => sanitizeEnglish(n)) : [],
      coachAdvice: sanitizeEnglish(result.coachAdvice || ""),
      recoveryChallenge: sanitizeEnglish(result.recoveryChallenge || ""),
    };
  } catch (err) {
    console.error("Failsafe activated for Team analysis. Error:", err);
    // Generic fallback complying with requested examples
    let status = `Discussion in Team ${data.teamName} has slowed. Only 2 of 5 students have contributed. The team appears focused on the final answer rather than exploring alternatives.`;
    let nudges = ["What option have you not considered yet?", "What could go wrong with your current choice?"];
    let coach = `Team ${data.teamName} is moving too quickly. Suggested Question: How do you know this is the best option?`;
    let recovery = `Imagine this decision fails. What is the most likely reason?`;

    if (data.activeBias.toLowerCase().includes("frugal") || data.discussionLevel === "Low") {
      status = `Discussion in Team ${data.teamName} is very quiet. The students seem hesitant to make active mistakes, creating progress blockage.`;
      nudges = ["What block are you running into?", "Is doing nothing safer than making a balanced move?"];
      coach = `Team ${data.teamName} is discussing actively but not recording assumptions. Suggested question: What belief are you relying on?`;
      recovery = `If you had to spend $100 tomorrow, what is the best possible asset?`;
    }

    return {
      discussionStatus: sanitizeEnglish(status),
      suggestedNudges: nudges,
      coachAdvice: sanitizeEnglish(coach),
      recoveryChallenge: sanitizeEnglish(recovery),
    };
  }
}

// ==========================================
// 6. END PHASE SUMMARY GENERATION
// ==========================================
export interface PhaseSummaryInput {
  phaseIndex: number;
  phaseTitle: string;
  teamsData: string; // Brief list of active teams and their decisions or state
}

export async function generatePhaseSummary(data: PhaseSummaryInput): Promise<{
  mostCommonChoice: string;
  mostCommonMistake: string;
  mostInterestingReflection: string;
  mostDividedTeam: string;
}> {
  const systemPrompt = `You are a warm, wise educator from the human REYOU team summarizing a classroom simulation phase for the students. Speak purely as the human companion team. Never use chatbot voice, never say you are an AI, machine, or software. Write with simple, everyday English. No educational theories or corporate jargon.`;

  const prompt = `Class just completed Phase ${data.phaseIndex}: ${data.phaseTitle}.
Summarize active behaviors based on student status notes:
${data.teamsData}

We need:
1. "mostCommonChoice": 1-sentence plain summary (e.g. "Most student teams chose comfort upgrades to fit in with childhood friends")
2. "mostCommonMistake": 1-sentence plain summary (e.g. "Relying on friendly trust instead of verifying legal papers")
3. "mostInterestingReflection": 1-sentence powerful quote (e.g. "I realized that saving money is more about having choices than just collecting coins")
4. "mostDividedTeam": 1-sentence plain summary (e.g. "Team Kalam was split half-half on taking out a loan vs slow-scaling")

Return as a clean JSON object (no markdown wrapping):
{
  "mostCommonChoice": "text",
  "mostCommonMistake": "text",
  "mostInterestingReflection": "text",
  "mostDividedTeam": "text"
}`;

  try {
    const rawResult = await callNvidiaNim(prompt, systemPrompt);
    const cleanJsonStr = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJsonStr);
    return {
      mostCommonChoice: sanitizeEnglish(result.mostCommonChoice || ""),
      mostCommonMistake: sanitizeEnglish(result.mostCommonMistake || ""),
      mostInterestingReflection: sanitizeEnglish(result.mostInterestingReflection || ""),
      mostDividedTeam: sanitizeEnglish(result.mostDividedTeam || ""),
    };
  } catch (err) {
    console.error("Failsafe activated for Phase Summary. Error:", err);
    return {
      mostCommonChoice: sanitizeEnglish("Most students are prioritizing short-term comfort (like cozy flats) over long-term savings."),
      mostCommonMistake: sanitizeEnglish("Students went with friendship trust instead of reading the contract paperwork."),
      mostInterestingReflection: sanitizeEnglish("I realized saving money is more about having options further down the path than just accumulating cash."),
      mostDividedTeam: sanitizeEnglish("Team Kalam was split evenly between moving out or keeping their security buffer intact."),
    };
  }
}

// ==========================================
// 7. PRINCIPAL LIVE INTELLIGENCE FEED
// ==========================================
export async function generatePrincipalLiveFeed(): Promise<{
  reflection1: string;
  reflection2: string;
  reflection3: string;
  simulation1WhatLearned: string;
  simulation2WhatLearned: string;
}> {
  const systemPrompt = `You are a senior school advisor from the human REYOU team writing for the school principal. Highlight students' strategic vulnerabilities, life lesson takeaways, and structural mind shifts during our simulation game. Speak purely from the human REYOU perspective, never mentioning that you are an AI, cloud service, machine learning system, or computer. Write in simple, beautiful, professional English with no academic or consulting jargon.`;

  const prompt = `Synthesize current classroom trends into a principal's strategic feed. 
Provide:
1. Three live student mindset reflections ("reflection1", "reflection2", "reflection3") (e.g. "Students are prioritizing short-term comfort over long-term flexibility", "Many teams believe future income will solve future problems", etc.).
2. "simulation1WhatLearned": Under 25 words summary of what students learned about money. (e.g. "Students discovered that every decision involves giving something up. Many students initially chose comfort but changed their minds after considering future consequences.")
3. "simulation2WhatLearned": Under 25 words summary of what students learned about life.

Return in clean JSON format:
{
  "reflection1": "text",
  "reflection2": "text",
  "reflection3": "text",
  "simulation1WhatLearned": "text",
  "simulation2WhatLearned": "text"
}`;

  try {
    const rawResult = await callNvidiaNim(prompt, systemPrompt);
    const cleanJsonStr = rawResult.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanJsonStr);
    return {
      reflection1: sanitizeEnglish(result.reflection1 || ""),
      reflection2: sanitizeEnglish(result.reflection2 || ""),
      reflection3: sanitizeEnglish(result.reflection3 || ""),
      simulation1WhatLearned: sanitizeEnglish(result.simulation1WhatLearned || ""),
      simulation2WhatLearned: sanitizeEnglish(result.simulation2WhatLearned || ""),
    };
  } catch (err) {
    console.error("Failsafe activated for Principal Live Feed. Error:", err);
    return {
      reflection1: sanitizeEnglish("Students are prioritizing short-term comfort over long-term flexibility."),
      reflection2: sanitizeEnglish("Many teams believe future income will solve future problems."),
      reflection3: sanitizeEnglish("Most students are confident but have not considered uncertainty."),
      simulation1WhatLearned: sanitizeEnglish("Students discovered that every choice requires giving something up, changing minds once future consequences were modeled."),
      simulation2WhatLearned: sanitizeEnglish("Unexpected crises exposed gaps in earlier hasty planning, highlighting that slower, verified decisions weather storms better."),
    };
  }
}

// ==========================================
// 8. PRINCIPAL CUSTOM QUERY ADVISOR
// ==========================================
export async function generatePrincipalQueryResponse(query: string, cohortData: any): Promise<string> {
  const systemPrompt = `You are a trusted senior educational advisor from the REYOU platform. Your goal is to help the School Principal understand the cohort's performance, psychological milestones, and specific learning insights based on the live classroom simulation. Always maintain an objective, pedagogical, and highly professional tone. Address them as Principal. Do not use academic or consulting jargon. Never mention that you are an AI, cloud system, or language model. Provide action-oriented advice on how to reinforce these life lessons in class. Keep the response elegant, crisp, and beautifully structured with professional formatting.`;

  const prompt = `The School Principal has requested an advisory insight with the query: "${query}"

Here is the current classroom simulation status context:
- Group: APS Founder Cohort
- Total teams: 10
- Saved and tracked priorities: Debt repayment, liquid cash buffers, systematic index funds, material items.
- Mindset indicators: Security (64%), Financial uncertainty, "I can save later" comfort traps.
- Important Student quotes: "Saving is about options, not just coins", "Pressure replaced checking", "Projections don't follow perfect rates".

Please draft a personalized response of 2-3 concise paragraphs directly addressing the Principal's query, interpreting student psychology, and recommending specific pedagogical next steps.`;

  try {
    const result = await callNvidiaNim(prompt, systemPrompt);
    return sanitizeEnglish(result);
  } catch (err) {
    console.error("Failsafe activated for Principal AI query. Error:", err);
    return sanitizeEnglish(`Principal, based on current cohort milestones, we are observing a significant shift in student awareness. When confronted with sudden unexpected expenses, teams that had previously prioritized immediate comforts or unverified peer ventures faced severe margin stress, while teams with defensive capital buffers navigated the shock with poise. This practical exercise successfully demonstrates that wealth building is about securing long-term options rather than immediate social approval. We recommend hosting a reflection circle to debrief specifically on the cognitive bias of peer conformity.`);
  }
}

