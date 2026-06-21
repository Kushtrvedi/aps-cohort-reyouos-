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
  generatePrincipalQueryResponse
} from "./server/services/nvidia";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parsers
  app.use(express.json());

  // API Routes
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
