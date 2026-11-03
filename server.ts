import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Cloud Run injects PORT; dev server passes --port 3000
function getPort() {
  const portArgIndex = process.argv.findIndex((arg) => arg === '--port' || arg === '-p');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = Number(process.argv[portArgIndex + 1]);
    if (!isNaN(parsed) && parsed > 0) return parsed;
  }
  return Number(process.env.PORT) || 3000;
}

const PORT = getPort();

app.use(express.json());

// Standard container health check endpoints for Cloud Run / load balancers
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    port: PORT,
    nodeEnv: process.env.NODE_ENV || 'development',
    service: process.env.K_SERVICE || 'local',
    timestamp: new Date().toISOString(),
  });
});

// Initialize GoogleGenAI if key available (server-side, never exposed to the browser)
let aiClient: any = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const SYSTEM_INSTRUCTION = `You are an expert Socratic engineering tutor for Singapore Ngee Ann Polytechnic's course "Air-Conditioning & Mechanical Ventilation" (Lecturer David Teo).

Course Scope:
- SS 553 Singapore ACMV standard (23-25°C, RH <=65%, air speed 0.15-0.3m/s, pump limits 349/301 kW/(m³/s)).
- Singapore BCA Green Mark (water-cooled chiller <= 0.58 kW/RT, ETTV <= 50 W/m²).
- Lessons 1-15: Refrigeration cycle, equipment (split/VRF/chiller), equal friction duct sizing (0.8-1.0 Pa/m, max 7.5 m/s), chilled water pipe sizing (100-400 Pa/m, Le/D method), cooling load estimation, psychrometrics (ADP, contact factor, mixing).

CRITICAL PEDAGOGY:
1. DO NOT give away the final calculation answer immediately.
2. Provide a Socratic Hint with 2 guiding questions, the key formula without numbers, and advice on which values to identify from the tutorial question.
3. At the very end, include the token "---FULL_SOLUTION---" followed by the complete worked numerical solution.

Always keep responses concise, encouraging, and technically rigorous.`;

// AI Chatbot endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (aiClient) {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          ...history.map((h: any) => ({
            role: h.role === 'user' ? 'user' : 'model',
            parts: [{ text: h.content || h.text || '' }],
          })),
          { role: 'user', parts: [{ text: message }] },
        ],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });

      const replyText = response.text?.trim();
      return res.json({
        reply: replyText || 'The AI tutor got an empty response this time — please try asking again!',
      });
    }

    // Friendly fallback when no API key is configured yet
    return res.json({
      reply:
        '### ACMV AI Tutor 🤖\n\nThe AI tutor service is not fully configured yet — please let your lecturer know so the server-side API key can be enabled. Meanwhile, try the Lab Simulators, Calculators and Worksheets!',
      isFallback: true,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);

    // Friendly degradation: never surface raw errors to students
    const errText = String(error?.message || '');
    const isOverloaded =
      errText.includes('503') ||
      errText.includes('UNAVAILABLE') ||
      errText.includes('high demand') ||
      errText.includes('429') ||
      errText.includes('RESOURCE_EXHAUSTED') ||
      errText.includes('quota');

    const friendlyReply = isOverloaded
      ? `### ACMV AI Tutor is taking a short break 🤖\n\nThe AI tutor is a little too popular right now (Gemini is at peak traffic). Give it 1–2 minutes and ask again.\n\nMeanwhile, you can use the **Lab Simulators** or check the **Tutorial Questions**!`
      : `### ACMV AI Tutor is taking a short break 🤖\n\nSomething went wrong on the AI side. Please try again in a moment.\n\nIf it keeps happening, let your lecturer know — the calculators, simulators and worksheets still work fine!`;

    return res.json({ reply: friendlyReply, isFallback: true });
  }
});

// Start server: In production (Cloud Run) or when dist is pre-built, serve static assets.
// Only mount Vite dev server when explicitly running in local dev mode.
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');
  const distExists = fs.existsSync(indexHtmlPath);

  // In Cloud Run (K_SERVICE is set) or production (NODE_ENV=production) or whenever dist exists (unless explicitly npm run dev)
  const isDevCommand = process.env.npm_lifecycle_event === 'dev';
  const isCloudRun = Boolean(process.env.K_SERVICE);
  const isProduction = isCloudRun || process.env.NODE_ENV === 'production' || (!isDevCommand && distExists);

  if (isProduction && distExists) {
    console.log(`[ACMV Server] Serving production static bundle from ${distPath}`);
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(indexHtmlPath);
    });
  } else {
    console.log(`[ACMV Server] Mounting Vite development middleware`);
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ACMV Masterclass server running on http://0.0.0.0:${PORT} (PID: ${process.pid})`);
  });
}

startServer();

