/**
 * Small server for hosting the ACMV app on Render (or AI Studio).
 * It serves the built site and answers the Ask AI Tutor through Gemini,
 * so the GEMINI_API_KEY stays on the server and never reaches the browser.
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT) || 3000;
const MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

app.use(express.json({ limit: '20kb' }));

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey && apiKey !== 'MY_GEMINI_API_KEY' ? new GoogleGenAI({ apiKey }) : null;

const tutorPrompt = (q: string) => `You are an expert Socratic engineering tutor for Singapore Ngee Ann Polytechnic's course "Air-Conditioning & Mechanical Ventilation" (Lecturer David Teo).
Course Scope:
- SS 553 Singapore ACMV standard (23-25°C, RH <=65%, air speed 0.15-0.3m/s, pump limits 349/301 kW/(m³/s)).
- Singapore BCA Green Mark (water-cooled chiller <= 0.58 kW/RT, ETTV <= 50 W/m²).
- Lessons 1-15: Refrigeration cycle, equipment (split/VRF/chiller), equal friction duct sizing (0.8-1.0 Pa/m, max 7.5 m/s), chilled water pipe sizing (100-400 Pa/m, Le/D method), cooling load estimation, psychrometrics (ADP, contact factor, mixing).

CRITICAL PEDAGOGY:
1. DO NOT give away the final calculation answer immediately.
2. Provide a Socratic Hint with 2 guiding questions, the key formula without numbers, and advice on which values to identify from the tutorial question.
3. At the very end, include the token "---FULL_SOLUTION---" followed by the complete worked numerical solution.

Question: ${q}`;

app.post('/api/tutor', async (req: Request, res: Response) => {
  const question = String(req.body?.question || '').trim().slice(0, 2000);
  if (!question) return res.status(400).json({ error: 'question is required' });
  if (!ai) return res.status(503).json({ error: 'AI tutor is not configured' });

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: 'user', parts: [{ text: tutorPrompt(question) }] }],
    });
    return res.json({ text: response.text || '' });
  } catch (error) {
    console.error('Error in /api/tutor:', error);
    // The browser falls back to the built-in hints when this fails.
    return res.status(502).json({ error: 'AI tutor is unavailable right now' });
  }
});

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const dist = path.join(__dirname, 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }
  app.listen(PORT, () => console.log(`ACMV app running on http://localhost:${PORT}`));
}

start();
