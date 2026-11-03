import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  ExternalLink,
  Printer,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Play,
  Layers,
  Wind,
  Droplets,
  Building,
  Activity,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { WEEKS_DATA, WeekData } from '../data/weeksData';

interface HomePagePosterProps {
  onOpenLab: (labId?: string) => void;
  onOpenPdf: (pdfPath: string, title: string) => void;
  onOpenAiTutor: (topic?: string) => void;
}

export const HomePagePoster: React.FC<HomePagePosterProps> = ({
  onOpenLab,
  onOpenPdf,
  onOpenAiTutor,
}) => {
  // Week 3 is open by default since today (Tue 3 Nov 2026) leads into Week 3 (Thu 5 Nov 2026)
  const [expandedWeek, setExpandedWeek] = useState<number | null>(3);

  // Current upcoming lesson for Oct26 semester as of today (Tue 3 Nov 2026) is Week 3
  const currentWeek: WeekData = WEEKS_DATA.find((w) => w.weekNumber === 3) || WEEKS_DATA[2];

  const toggleExpand = (weekNum: number) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum);
  };

  const getWeekIcon = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('duct')) return <Wind className="w-5 h-5 text-rose-600" />;
    if (t.includes('chiller') || t.includes('refrigeration')) return <Activity className="w-5 h-5 text-rose-600" />;
    if (t.includes('pipe')) return <Droplets className="w-5 h-5 text-rose-600" />;
    if (t.includes('envelope') || t.includes('ettv')) return <Building className="w-5 h-5 text-rose-600" />;
    if (t.includes('psychrometric') || t.includes('cooling load')) return <Layers className="w-5 h-5 text-rose-600" />;
    return <BookOpen className="w-5 h-5 text-rose-600" />;
  };

  const getVenuePillStyle = (venue: string) => {
    if (venue.includes('Online') || venue.includes('Teams')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (venue.includes('Lab') || venue.includes('Computer')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (venue.includes('LT 51B')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans print:bg-white print:text-black">
      {/* Top Banner / Announcement */}
      <div className="bg-[#C8102E] text-white py-2 px-4 text-center text-xs font-semibold tracking-wide flex flex-wrap items-center justify-center gap-2 print:hidden shadow-xs">
        <span className="bg-white/20 px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider">
          OCTOBER 2026 SEMESTER · TERM 6650
        </span>
        <span>Diploma in Engineering (Building Services & Fire Safety) · Ngee Ann Polytechnic</span>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header Poster Section */}
        <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8102E]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
              Official Course Portal & Engineering Syllabus · Term 6650
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Air-Conditioning & Mechanical Ventilation
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
              Equipping engineers with governing principles, technical standards (SS 553, BCA Green Mark, ASHRAE), and design methods for sizing ducts, chilled water pipes, refrigeration plants, cooling load estimation, and building thermal envelopes (ETTV).
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-slate-700 leading-relaxed max-w-3xl">
              <span className="font-bold text-amber-900">In plain words:</span>{' '}
              This course is about keeping buildings cool without wasting energy — how air-con and ventilation systems work, how to size the pipes and ducts that carry the cooling, and the Singapore rules (SS 553, BCA Green Mark) buildings must follow. Each week: notes → a worked example → a tool to try.
            </div>
          </div>

          {/* Lecturer & Class Info Bar */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Thursdays 6:00 PM – 10:00 PM</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>LT 51B / MS Teams / Labs 34-03-02 & 34-02-06</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Mail className="w-4 h-4 text-slate-400" />
              <span>Lecturer: David Teo (<a href="mailto:TEO_Seow_Hian@np.edu.sg" className="text-[#C8102E] hover:underline font-mono">TEO_Seow_Hian@np.edu.sg</a>)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2 print:hidden">
            <button
              onClick={() => onOpenLab(currentWeek.labTabId)}
              className="bg-[#C8102E] hover:bg-[#a60d26] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-rose-900/10 flex items-center gap-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" /> Open Lab Simulators
            </button>

            <button
              onClick={() => onOpenAiTutor('Envelope Thermal Performance & ETTV')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> Ask AI Tutor
            </button>

            <button
              onClick={() => window.print()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 border border-slate-300 transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" /> Print / Save as poster
            </button>

            <a
              href="https://brightspace.np.edu.sg"
              target="_blank"
              rel="noreferrer"
              className="bg-white hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-sm flex items-center gap-1.5 border border-slate-300 transition"
            >
              <span>Go to LMS</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </header>

        {/* Plain-English Quick Guide */}
        <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-[#C8102E]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Plain-English Quick Guide
            </h2>
            <span className="text-xs text-slate-500">(no jargon panic — what the abbreviations mean)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              ["SS 553", "Singapore's official rules for air-con & ventilation in buildings"],
              ['ETTV', 'How much heat the building lets in — limit: ≤ 50 W/m²'],
              ['U-value', 'How fast heat passes through a wall or window (lower = better insulation)'],
              ['WWR', 'How much of a wall is glass (windows)'],
              ['RT / kW·RT', 'Unit of cooling power · how efficient a chiller is (lower = better)'],
              ['CF · SC', 'Sun-direction & shading factors for glass (how much sun gets in)'],
              ['Psychrometrics', 'The science of air moisture & temperature'],
              ['Le/D', 'A simple way to count pipe bend & fitting losses'],
            ].map(([term, plain]) => (
              <div key={term} className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2.5">
                <div className="font-bold text-[#C8102E] text-xs">{term}</div>
                <div className="text-[11px] text-slate-600 leading-snug mt-0.5">{plain}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Current Status Banner (Today: Tue 3 Nov 2026 -> Next lesson: Week 3 Thu 5 Nov 2026) */}
        <section className="bg-gradient-to-r from-rose-900 via-rose-950 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-rose-800/40">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-widest font-bold text-rose-300">
                CURRENT STATUS · NEXT UPCOMING LESSON
              </span>
              <span className="text-[11px] font-mono bg-white/10 px-2 py-0.5 rounded text-slate-300">
                Today: Tue 3 Nov 2026
              </span>
            </div>
            <div className="text-lg sm:text-2xl font-black text-white">
              Week {currentWeek.weekNumber} · {currentWeek.title}
            </div>
            <div className="text-xs text-rose-200/90 flex flex-wrap items-center gap-3">
              <span className="font-semibold text-white">{currentWeek.dateStr}</span>
              <span>•</span>
              <span className="bg-blue-900/60 text-blue-200 px-2 py-0.5 rounded border border-blue-700/60 font-mono">
                {currentWeek.venue}
              </span>
              <span>•</span>
              <span>6:00 PM – 10:00 PM</span>
              <span>•</span>
              <span className="font-semibold text-amber-200">{currentWeek.plainTitle || currentWeek.keyFormulaOrCode}</span>
            </div>
          </div>

          <button
            onClick={() => onOpenLab(currentWeek.labTabId)}
            className="self-start sm:self-center bg-white hover:bg-rose-50 text-[#C8102E] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition whitespace-nowrap cursor-pointer"
          >
            Launch This Week's Lab (ETTV / U-Value) <ArrowRight className="w-4 h-4" />
          </button>
        </section>

        {/* Week-by-Week Course Cards List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C8102E]" /> 15-Week Oct26 Semester Curriculum
            </h2>
            <span className="text-xs text-slate-500 font-medium">Click any week to inspect questions & resources</span>
          </div>

          <div className="space-y-3">
            {WEEKS_DATA.map((week) => {
              const isExpanded = expandedWeek === week.weekNumber;
              const isRecess = week.isSpecial === 'recess';
              const isTest = week.isSpecial === 'test';
              const isPractical = week.isSpecial === 'practical' || week.venue.includes('Lab') || week.venue.includes('Computer');

              if (isRecess) {
                return (
                  <div
                    key={week.dateStr}
                    className="bg-slate-200/90 border border-slate-300 rounded-2xl p-4 text-center text-slate-700 font-bold text-sm tracking-wide flex items-center justify-center gap-2"
                  >
                    <span>☕ VACATION BREAK · {week.dateStr}</span>
                    <span className="text-xs font-normal text-slate-500">(No Classes Scheduled)</span>
                  </div>
                );
              }

              return (
                <div
                  key={week.weekNumber}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-[#C8102E]/40 shadow-md ring-1 ring-[#C8102E]/20'
                      : 'border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Card Header row */}
                  <div
                    onClick={() => toggleExpand(week.weekNumber)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    {/* Left Thumbnail Tile + Title */}
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Thumbnail tile with icon, week, and key formula */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center text-center p-1 shadow-2xs">
                        {getWeekIcon(week.title)}
                        <span className="text-[11px] font-bold text-slate-800 mt-1">Week {week.weekNumber}</span>
                      </div>

                      {/* Main Title & Description */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-slate-500">Week {week.weekNumber} · {week.dateStr}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getVenuePillStyle(
                              week.venue
                            )}`}
                          >
                            {week.venue}
                          </span>
                          {isTest && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                              Assessment
                            </span>
                          )}
                          {isPractical && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                              Hands-on Lab
                            </span>
                          )}
                          {week.weekNumber === 3 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300 animate-pulse">
                              Next Lesson
                            </span>
                          )}
                        </div>

                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {week.plainTitle || week.title}
                        </h3>

                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mt-0.5">
                          {week.title}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                          {week.summary}
                        </p>
                      </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {week.labTabId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenLab(week.labTabId);
                          }}
                          className="bg-slate-900 hover:bg-[#C8102E] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Open Lab
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(week.weekNumber);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded in-place section */}
                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-6">
                      {/* Key Formula Chip */}
                      {week.keyFormulaOrCode && (
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Key formula this week:
                          </span>
                          <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100/70 border border-amber-200 px-2.5 py-1 rounded-lg">
                            {week.keyFormulaOrCode}
                          </span>
                        </div>
                      )}

                      {/* Key Technical Concepts */}
                      {week.keyConcepts.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#C8102E]" /> Key Technical Concepts
                          </h4>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-200/80">
                            {week.keyConcepts.map((kc, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-[#C8102E] font-bold">•</span>
                                <span>{kc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Tutorial Questions & Worked Solutions */}
                      {week.tutorialQuestions.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-slate-500" /> Tutorial Questions & Worked Solutions
                          </h4>
                          <div className="space-y-3">
                            {week.tutorialQuestions.map((tq) => (
                              <div
                                key={tq.questionNumber}
                                className="bg-white p-4 rounded-xl border border-slate-200/80 space-y-2 text-xs"
                              >
                                <div className="font-bold text-slate-900 flex items-center justify-between">
                                  <span>{tq.questionNumber}</span>
                                  <span className="font-mono text-slate-500 font-normal">Worked Example</span>
                                </div>
                                <p className="text-slate-700 italic">{tq.prompt}</p>
                                <div className="bg-slate-900 text-emerald-300 p-3 rounded-lg font-mono text-[11px] leading-relaxed overflow-x-auto space-y-1.5">
                                  <div className="text-slate-400 text-[10px] uppercase font-bold">
                                    Solution Working Steps:
                                  </div>
                                  <ul className="space-y-1 list-disc list-inside">
                                    {tq.solutionSteps.map((s, sIdx) => (
                                      <li key={sIdx} className="text-slate-300">{s}</li>
                                    ))}
                                  </ul>
                                  <div className="pt-1.5 border-t border-slate-800 text-emerald-400 font-semibold">
                                    Final Answer: {tq.finalAnswer}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Module Resources (Lecture PDF, Tutorial PDF, Solutions) */}
                      {week.resources.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-slate-500" /> Module Resources & Official PDFs
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {week.resources.map((res, rIdx) => (
                              <button
                                key={rIdx}
                                onClick={() => {
                                  if (res.pdfPath) {
                                    onOpenPdf(res.pdfPath, res.label);
                                  }
                                }}
                                disabled={!res.pdfPath}
                                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border transition ${
                                  res.pdfPath
                                    ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 cursor-pointer shadow-2xs'
                                    : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                }`}
                              >
                                <FileText className="w-3.5 h-3.5 text-rose-600" />
                                <span>{res.label}</span>
                                {!res.pdfPath && (
                                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                                    Coming soon
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Course Standards & Grading Criteria */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C8102E]" /> Governing Standards & Assessment Weightage
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">SS 553 : 2016</div>
              <p className="text-slate-600 leading-relaxed">
                Code of practice for air-conditioning and mechanical ventilation in buildings. Sets indoor comfort targets (23–25°C, RH ≤65%, air velocity ≤0.30 m/s), outdoor air rates, and pump power limits (349 / 301 kW/(m³/s)).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">BCA Green Mark</div>
              <p className="text-slate-600 leading-relaxed">
                Prescribes mandatory Envelope Thermal Transfer Value (ETTV ≤ 50 W/m² for air-conditioned buildings) and minimum central water-cooled chiller plant efficiency (≤ 0.58 kW/RT).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm">Course Assessment</div>
              <ul className="text-slate-600 space-y-1">
                <li>• Common Test (Week 7): <strong>20%</strong></li>
                <li>• Written Test (Week 15): <strong>20%</strong></li>
                <li>• Group Assignment: <strong>40%</strong></li>
                <li>• Regular Class Work & Labs: <strong>20%</strong></li>
              </ul>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-6 pb-12 text-center text-xs text-slate-500 border-t border-slate-200 space-y-1">
          <div>Air-Conditioning & Mechanical Ventilation (ACMV, NP-DACMV / NP-012406)</div>
          <div>Diploma in Engineering (Building Services & Fire Safety) · Ngee Ann Polytechnic</div>
          <div>Module Leader: David Teo · Email: <a href="mailto:TEO_Seow_Hian@np.edu.sg" className="underline hover:text-slate-800">TEO_Seow_Hian@np.edu.sg</a></div>
          <div className="text-[11px] text-slate-400">Singapore Standards SS 553 & BCA Building Control Regulations</div>
        </footer>
      </div>
    </div>
  );
};
