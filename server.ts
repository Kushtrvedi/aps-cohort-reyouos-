import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { 
  generateStudentReport, 
  generateParentReport, 
  generateTeacherReport, 
  generatePrincipalReport, 
  generateCohortInsights,
  generateTeamAnalysis,
  generatePhaseSummary,
  generatePrincipalLiveFeed,
  generatePrincipalQueryResponse,
  generateInactivityReflectionPrompt
} from "./server/services/nvidia";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parsers
  app.use(express.json());

  // In-Memory Database for dynamic Spotlight Exchange / Peer decisions
  const teamDecisions: Array<{
    decisionId: string;
    teamId: string;
    teamName: string;
    choice: string;
    reasoning: string;
  }> = [];

  // Seed data matching APS Bhopal Grade XII leaders of thought
  const seedDecisions = [
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_ALPHA",
      teamName: "TEAM JHANSI",
      choice: "PRACTICAL",
      reasoning: "Renting a high-end flat without deep emergency savings leaves no resilience factor. We prefer building solid base capital first to resolve debts."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_BRAVO",
      teamName: "TEAM BHAGAT",
      choice: "PRACTICAL",
      reasoning: "With serious outstanding student debt balances, locking ourselves into premium high-rent suites is financial suicide. Debt clearance always precedes lifestyle expansion."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_CHARLIE",
      teamName: "TEAM CHANAKYA",
      choice: "PRACTICAL",
      reasoning: "By choosing a practical budget flat, we allocate the 24% rental savings difference directly toward early mutual fund investments. Every rupee compounded early yields immense long-term protection."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_DELTA",
      teamName: "TEAM AZAD",
      choice: "PREMIUM",
      reasoning: "A premium flat nearby reduces commute times by 3 hours daily. Traveling in hot buses degrades focus and health. In the long run, our productivity and energy level is our most valuable asset to secure high-tier promotions."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_ECHO",
      teamName: "TEAM NETAJI",
      choice: "PRACTICAL",
      reasoning: "We prioritize establishing high-liquidity capital accounts over personal room luxury. In volatile corporate environments, a strong immediate emergency buffer provides absolute psychological leverage."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_FOXTROT",
      teamName: "TEAM PATEL",
      choice: "PRACTICAL",
      reasoning: "Avoiding monthly overhead stress ensures higher long-term safety. A practical flat means we are insulated against sudden salary cuts or black swan health events."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_GOLF",
      teamName: "TEAM KALAM",
      choice: "PRACTICAL",
      reasoning: "We prefer to trade temporary lifestyle luxury for continuous tech skill investments. The rent difference is redirected straight into cloud engineering and AI certifications that boost our long-term earning ceiling."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_HOTEL",
      teamName: "TEAM VIVEKANANDA",
      choice: "PREMIUM",
      reasoning: "A pristine environment with high ambient stability elevates sleep quality, physical wellness, and creative energy. Investing in our baseline safety is a form of self-directed value maximization."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_INDIA",
      teamName: "TEAM SHIVAJI",
      choice: "PREMIUM",
      reasoning: "High-end locations offer premium networking circles and proximity to corporate partner offices. We leverage our address and lifestyle to create faster relationship momentum."
    },
    {
      decisionId: "DECISION_2",
      teamId: "TEAM_JULIET",
      teamName: "TEAM BOSE",
      choice: "PREMIUM",
      reasoning: "Living in a prime tech corridor gives us immediate access to meetups and workspace hubs. We prioritize speed and professional density over conservative savings."
    }
  ];

  // API Routes
  app.get("/api/decisions", (req, res) => {
    try {
      const { decisionId } = req.query;
      if (!decisionId) {
        return res.status(400).json({ success: false, error: "Missing decisionId" });
      }

      // Filter submissions and seed data
      const actualList = teamDecisions.filter(d => d.decisionId === decisionId);
      const filteredSeeds = seedDecisions.filter(s => s.decisionId === (decisionId as string) && !actualList.some(a => a.teamId === s.teamId));

      res.json({
        success: true,
        decisions: [...actualList, ...filteredSeeds]
      });
    } catch (error: any) {
      console.error("Error fetching decisions:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/decisions", (req, res) => {
    try {
      const { decisionId, teamId, teamName, choice, reasoning } = req.body;
      if (!decisionId || !teamId || !choice || !reasoning) {
        return res.status(400).json({ success: false, error: "Missing required fields" });
      }

      // Remove existing for this team and decision to update
      const index = teamDecisions.findIndex(d => d.decisionId === decisionId && d.teamId === teamId);
      const entry = { decisionId, teamId, teamName: teamName || teamId, choice, reasoning };

      if (index !== -1) {
        teamDecisions[index] = entry;
      } else {
        teamDecisions.push(entry);
      }

      res.json({ success: true, message: "Decision registered successfully" });
    } catch (error: any) {
      console.error("Error creating decision:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/team-analysis", async (req, res) => {
    try {
      const data = req.body;
      const report = await generateTeamAnalysis(data);
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error in team analysis API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/phase-summary", async (req, res) => {
    try {
      const data = req.body;
      const report = await generatePhaseSummary(data);
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error in phase summary API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get("/api/reports/principal-live-feed", async (req, res) => {
    try {
      const report = await generatePrincipalLiveFeed();
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error in principal live feed API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/student", async (req, res) => {
    try {
      const data = req.body;
      const report = await generateStudentReport(data);
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error in student report API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/parent", async (req, res) => {
    try {
      const data = req.body;
      const report = await generateParentReport(data);
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error in parent report API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/teacher", async (req, res) => {
    try {
      const data = req.body;
      const report = await generateTeacherReport(data);
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error in teacher report API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/principal", async (req, res) => {
    try {
      const data = req.body;
      const report = await generatePrincipalReport(data);
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error in principal report API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/cohort", async (req, res) => {
    try {
      const data = req.body;
      const report = await generateCohortInsights(data);
      res.json({ success: true, report });
    } catch (error: any) {
      console.error("Error in cohort API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/query", async (req, res) => {
    try {
      const { query, cohortData } = req.body;
      const answer = await generatePrincipalQueryResponse(query, cohortData);
      res.json({ success: true, answer });
    } catch (error: any) {
      console.error("Error in principal custom query API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post("/api/reports/inactivity-reflection", async (req, res) => {
    try {
      const { teamName, stage } = req.body;
      const prompt = await generateInactivityReflectionPrompt(teamName, stage);
      res.json({ success: true, prompt });
    } catch (error: any) {
      console.error("Error in inactivity reflection API:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Vite middleware for development or fallback for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
