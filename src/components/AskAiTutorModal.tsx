import React, { useState } from 'react';
import { X, Sparkles, Send, HelpCircle, ChevronRight, Eye, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface AskAiTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  hint?: string;
  showFullAnswer?: boolean;
}

const KNOWLEDGE_BASE_HINTS: Record<string, { hint: string; answer: string }> = {
  'chiller': {
    hint: "Think about the definition of kW/RT. The numerator is the total electrical power consumed by the chiller compressor in kW. The denominator is the cooling capacity delivered in Refrigeration Tons (RT). Remember: 1 RT = 3.517 kW. How would you calculate cooling capacity if you have water flow rate and temperature difference (ΔT)?",
    answer: "Chiller Efficiency Formula:\nkW/RT = Compressor Electrical Power (kW) / Cooling Output (RT)\n\nWhere:\nCooling Output (kW) = m_dot × Cp × (T_chwr - T_chws)\nCooling Output (RT) = Cooling Output (kW) / 3.517\nCOP = 3.517 / (kW/RT)\n\nSingapore Green Mark standard for water-cooled chillers is ≤ 0.58 kW/RT."
  },
  'duct': {
    hint: "Recall the Equal Friction Method from Lesson 3 & 4. The standard design friction loss is 0.8 to 1.0 Pa/m. What is the continuity equation relating airflow Q, cross-sectional area A, and air velocity V? And what formula converts an equivalent circular duct diameter to a rectangular aspect ratio?",
    answer: "Duct Sizing Socratic Breakdown:\n1. Continuity equation: Q = A × V (where Q is m³/s, A is m², V is m/s).\n2. Maximum recommended main duct velocity in commercial buildings is 7.5 m/s to control NC noise below NC 35.\n3. Huebscher's formula converts circular diameter D to rectangular dimensions a and b:\n   D = 1.30 × [ (a × b)^0.625 / (a + b)^0.25 ]\n4. Typical equal friction gradient: 0.8 to 1.0 Pa/m."
  },
  'pipe': {
    hint: "For closed-loop chilled water piping (Lesson 6), what is the allowable friction loss range in Pa/m? How do you account for pressure drops across valves and fittings using the Le/D method?",
    answer: "Chilled Water Pipe Sizing (Lesson 6):\n1. Standard friction gradient band: 100 to 400 Pa/m (design target ~250 Pa/m).\n2. Maximum water velocity: 1.2 m/s for small pipes (≤ 50 mm) up to 2.4 m/s for large headers.\n3. Equivalent Length method:\n   L_equivalent = L_straight + Sum( (Le/D) × (D_internal / 1000) )\n4. Total Friction Drop: ΔP = Friction_rate (Pa/m) × L_equivalent\n5. Pump Head (m) = ΔP (Pa) / (9.81 × 1000)."
  },
  'ettv': {
    hint: "What are the three distinct heat transfer mechanisms in the BCA ETTV formula? How do WWR (Window-to-Wall Ratio), Uw (Wall U-value), Uf (Fenestration U-value), CF (Orientation Correction Factor), and SC (Shading Coefficient) fit into the equation?",
    answer: "Singapore BCA ETTV Formula (Lesson 10):\nETTV = 12(1 - WWR)·Uw + 3.4(WWR)·Uf + 211(WWR)·CF·SC\n\nWhere:\n- 12(1 - WWR)·Uw = Opaque Wall Conduction Heat Gain\n- 3.4(WWR)·Uf = Glazing Conduction Heat Gain\n- 211(WWR)·CF·SC = Solar Radiation Heat Gain through Glazing\n\nStatutory requirement: Maximum permissible ETTV is ≤ 50 W/m²."
  },
  'ss553': {
    hint: "Check SS 553 (Code of Practice for Air-conditioning and mechanical ventilation in buildings). What are the comfort criteria for dry-bulb temperature, relative humidity, and air velocity in an air-conditioned room?",
    answer: "SS 553 Indoor Environmental Quality Standards:\n- Dry-Bulb Temperature: 23.0°C to 25.0°C (Design target 24.0°C)\n- Relative Humidity: ≤ 65% (Recommended 50% - 60%)\n- Air Velocity: 0.15 m/s to 0.30 m/s (avoids draft while preventing stagnant zones)\n- Outdoor Fresh Air: 5.5 to 10 L/s per person for offices\n- Max pump power: 349 kW/(m³/s) chilled water, 301 kW/(m³/s) condenser water."
  }
};

export const AskAiTutorModal: React.FC<AskAiTutorModalProps> = ({
  isOpen,
  onClose,
  initialTopic,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I am your ACMV Socratic Engineering Tutor. Ask me any conceptual or tutorial question from Lessons 1–15, SS 553, or BCA Green Mark. I will first guide you with step-by-step thinking hints so you can solve it yourself!",
    },
  ]);

  if (!isOpen) return null;

  const handleAsk = async (questionText: string) => {
    const q = questionText.trim();
    if (!q) return;

    const userMsg: Message = { role: 'user', content: q };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Check if user has client-accessible GEMINI_API_KEY or use fallback
      const apiKey =
        (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
        (import.meta as any).env?.VITE_GEMINI_API_KEY;

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `You are an expert Socratic engineering tutor for Singapore Ngee Ann Polytechnic's course "Air-Conditioning & Mechanical Ventilation" (Lecturer David Teo).
Course Scope:
- SS 553 Singapore ACMV standard (23-25°C, RH <=65%, air speed 0.15-0.3m/s, pump limits 349/301 kW/(m³/s)).
- Singapore BCA Green Mark (water-cooled chiller <= 0.58 kW/RT, ETTV <= 50 W/m²).
- Lessons 1-15: Refrigeration cycle, equipment (split/VRF/chiller), equal friction duct sizing (0.8-1.0 Pa/m, max 7.5 m/s), chilled water pipe sizing (100-400 Pa/m, Le/D method), cooling load estimation, psychrometrics (ADP, contact factor, mixing).

CRITICAL PEDAGOGY:
1. DO NOT give away the final calculation answer immediately.
2. Provide a Socratic Hint with 2 guiding questions, the key formula without numbers, and advice on which values to identify from the tutorial question.
3. At the very end, include the token "---FULL_SOLUTION---" followed by the complete worked numerical solution.

Question: ${q}`,
                },
              ],
            },
          ],
        });

        const fullText = response.text || '';
        const parts = fullText.split('---FULL_SOLUTION---');
        const hintPart = parts[0]?.trim() || fullText;
        const answerPart = parts[1]?.trim() || '';

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: hintPart,
            hint: hintPart,
            showFullAnswer: false,
            ...(answerPart ? { fullAnswer: answerPart } as any : {}),
          },
        ]);
      } else {
        // Fallback intelligent offline knowledge match
        const lower = q.toLowerCase();
        let matched = KNOWLEDGE_BASE_HINTS['ss553'];

        if (lower.includes('chiller') || lower.includes('cop') || lower.includes('kw/rt')) {
          matched = KNOWLEDGE_BASE_HINTS['chiller'];
        } else if (lower.includes('duct') || lower.includes('air') || lower.includes('friction') || lower.includes('velocity')) {
          matched = KNOWLEDGE_BASE_HINTS['duct'];
        } else if (lower.includes('pipe') || lower.includes('le/d') || lower.includes('pump') || lower.includes('head')) {
          matched = KNOWLEDGE_BASE_HINTS['pipe'];
        } else if (lower.includes('ettv') || lower.includes('u-value') || lower.includes('facade') || lower.includes('wwr')) {
          matched = KNOWLEDGE_BASE_HINTS['ettv'];
        }

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: matched.hint,
              hint: matched.hint,
              fullAnswer: matched.answer,
              showFullAnswer: false,
            } as any,
          ]);
          setLoading(false);
        }, 500);
        return;
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Here is a Socratic hint: Review the governing equations in your lecture notes. Identify your knowns (mass flow rate m, temperature difference ΔT, specific heat Cp) and unknowns. What equation connects them?",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (idx: number) => {
    setMessages((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, showFullAnswer: !m.showFullAnswer } : m))
    );
  };

  const sampleQuestions = [
    'How do I calculate chiller kW/RT and COP?',
    'What is the Singapore BCA ETTV formula and limit?',
    'How do I size a duct using the equal friction method?',
    'What are the SS 553 indoor comfort and pump power limits?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-slate-100">
        {/* Header */}
        <div className="p-4 px-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">ACMV Socratic AI Tutor</h3>
              <p className="text-xs text-slate-400">Hint-first engineering guidance · SS 553 & BCA Green Mark</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {messages.map((m, i) => {
            const hasFullAnswer = (m as any).fullAnswer;
            const isShowing = m.showFullAnswer;

            return (
              <div
                key={i}
                className={`flex flex-col ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-rose-600 text-white font-medium rounded-br-xs'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.content}</p>

                  {/* Socratic Hint & Reveal Answer button */}
                  {hasFullAnswer && (
                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <button
                        onClick={() => toggleAnswer(i)}
                        className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isShowing ? 'Hide complete answer' : 'Reveal worked step-by-step answer'}
                      </button>

                      {isShowing && (
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 border border-emerald-900/40 whitespace-pre-wrap">
                          {(m as any).fullAnswer}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-rose-400" />
              Thinking through Socratic hints...
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-t border-slate-800/60 overflow-x-auto flex gap-2 no-scrollbar">
          {sampleQuestions.map((sq, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(sq)}
              className="text-xs text-slate-300 bg-slate-800/60 hover:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 whitespace-nowrap transition flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3 text-rose-400" /> {sq}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk(input)}
            placeholder="Ask a question about duct sizing, pipe Le/D, chiller COP, ETTV..."
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
          />
          <button
            onClick={() => handleAsk(input)}
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 font-medium text-sm flex items-center gap-1.5 transition"
          >
            <Send className="w-4 h-4" /> Ask
          </button>
        </div>
      </div>
    </div>
  );
};
