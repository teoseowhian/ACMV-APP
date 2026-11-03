import React, { useState, useMemo } from 'react';
import { PDF_CATALOGUE } from '../data/courseData';
import { FileText, Download, ExternalLink, Search, Eye } from 'lucide-react';

interface PdfLibrarySectionProps {
  onOpenPdf: (pdfPath: string) => void;
}

export const PdfLibrarySection: React.FC<PdfLibrarySectionProps> = ({ onOpenPdf }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Engineering Charts', 'Worksheets', 'Tutorials', 'Lesson Slides'];

  const filteredPdfs = useMemo(() => {
    return PDF_CATALOGUE.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider block">
              Digital Courseware Repository
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Official ACMV Course Materials & References
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Direct access to all 21 official course slide decks, psychrometric charts, Schedule 40 friction tables, and tutorial sheets.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search PDF documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 mt-5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PDF Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPdfs.map((pdf, idx) => {
          const fullPath = `${import.meta.env.BASE_URL}assets/aistudio/${pdf.fileName}`;

          return (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between space-y-4 hover:border-sky-300 dark:hover:border-sky-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold uppercase text-sky-600 dark:text-sky-400">
                    {pdf.category}
                  </span>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {pdf.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {pdf.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenPdf(fullPath)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View In-App</span>
                </button>
                <a
                  href={fullPath}
                  download={pdf.fileName}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
