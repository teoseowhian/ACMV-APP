import React, { useState } from 'react';
import { TIMETABLE_DATA, COURSE_INFO, TimetableEntry } from '../data/courseData';
import { Calendar, MapPin, Clock, User, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface TimetableSectionProps {
  onOpenPdf: (pdfPath: string) => void;
}

export const TimetableSection: React.FC<TimetableSectionProps> = ({ onOpenPdf }) => {
  const [filter, setFilter] = useState<'all' | 'lecture' | 'practical' | 'assessment'>('all');

  const filteredEntries = TIMETABLE_DATA.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'lecture') return item.topic.toLowerCase().includes('systems') || item.topic.toLowerCase().includes('equipment') || item.topic.toLowerCase().includes('design') || item.topic.toLowerCase().includes('psychrometrics') || item.topic.toLowerCase().includes('envelope') || item.topic.toLowerCase().includes('cooling load');
    if (filter === 'practical') return item.topic.toLowerCase().includes('practical');
    if (filter === 'assessment') return item.topic.toLowerCase().includes('test');
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Course Overview & Header */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              {COURSE_INFO.institution} · {COURSE_INFO.school}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {COURSE_INFO.moduleName}
            </h1>
            <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
              {COURSE_INFO.diploma} · Module ID: {COURSE_INFO.moduleCode} (Level {COURSE_INFO.level})
            </p>
          </div>

          {/* Module Lecturer Card */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1.5 shrink-0 min-w-[260px]">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>{COURSE_INFO.lecturer.name}</span>
            </div>
            <div className="text-slate-500 dark:text-slate-400">
              {COURSE_INFO.lecturer.role}
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1 font-mono text-[11px]">
              <div>
                Email:{' '}
                <a
                  href={`mailto:${COURSE_INFO.lecturer.email}`}
                  className="text-sky-600 dark:text-sky-400 hover:underline"
                >
                  {COURSE_INFO.lecturer.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Weightage Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Academic Assessment Breakdown
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {COURSE_INFO.assessment.map((asg, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30"
              >
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {asg.component}
                  </span>
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                    {asg.weight}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {asg.type} evaluation
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Semester Timetable & Lesson Schedule (Oct 2026 – Feb 2027 · Term 6650)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Thursdays 6:00 PM – 10:00 PM · LT 51B / MS Teams / Labs 34-03-02 & 34-02-06.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Weeks
          </button>
          <button
            onClick={() => setFilter('lecture')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'lecture'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Lectures
          </button>
          <button
            onClick={() => setFilter('practical')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'practical'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Practicals / Labs
          </button>
          <button
            onClick={() => setFilter('assessment')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filter === 'assessment'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tests
          </button>
        </div>
      </div>

      {/* Timetable List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-medium bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-3 px-4 w-16">Week</th>
                <th className="py-3 px-4 w-36">Date</th>
                <th className="py-3 px-4 w-28">Venue</th>
                <th className="py-3 px-4">Lecture / Lab Topic</th>
                <th className="py-3 px-4 w-32">Lecturer</th>
                <th className="py-3 px-4 w-28 text-right">Slide PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {filteredEntries.map((entry, idx) => {
                if (entry.isHoliday) {
                  return (
                    <tr
                      key={idx}
                      className="bg-amber-50/60 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold">Break</td>
                      <td className="py-3.5 px-4 font-mono font-semibold">{entry.date}</td>
                      <td className="py-3.5 px-4">-</td>
                      <td className="py-3.5 px-4 font-bold" colSpan={3}>
                        {entry.topic}
                      </td>
                    </tr>
                  );
                }

                const isExam = entry.topic.toLowerCase().includes('test');
                const isPractical = entry.topic.toLowerCase().includes('practical');

                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      isExam
                        ? 'bg-sky-50/40 dark:bg-sky-950/20'
                        : isPractical
                        ? 'bg-emerald-50/30 dark:bg-emerald-950/10'
                        : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {String(entry.lessonNumber).padStart(2, '0')}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      <div>{entry.date}</div>
                      <div className="text-[10px] text-slate-400">{entry.day} · {entry.time}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                          entry.venue.includes('LT')
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                            : entry.venue.includes('Teams')
                            ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {entry.venue}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white text-xs">
                        {entry.topic}
                      </div>
                      {entry.notes && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {entry.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {entry.lecturer}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {entry.pdfPath ? (
                        <button
                          onClick={() => onOpenPdf(entry.pdfPath!)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/50 rounded transition-colors whitespace-nowrap"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
